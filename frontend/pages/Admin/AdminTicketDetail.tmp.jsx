import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  MessageSquare,
  Lock,
  Send,
  User,
  Shield,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  FileText,
  Tag,
  UserCheck,
  Sparkles,
  Printer,
  Eye,
  Zap,
  ChevronDown
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Timeline from '../../components/Timeline';
import { SlaProgressCard } from '../../components/SlaTimer';
import { AttachmentModal } from '../../components/AttachmentModal';
import { IncidentReportModal } from '../../components/IncidentReportModal';
import { generateAIReply } from '../../utils/aiHelper';
import { api } from '../../services/api';

const AdminTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    tickets,
    updateTicketStatus,
    addComment,
    requestTicketDeletion,
    permanentlyDeleteTicket,
    currentUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('public'); // 'public' or 'internal'
  const [replyText, setReplyText] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);

  // Deletion workflow state
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [loadingDeletion, setLoadingDeletion] = useState(false);
  const [showDeleteRequestModal, setShowDeleteRequestModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const ticket = tickets.find((t) => t.ticketId === id);

  // Fetch deletion status for this ticket
  useEffect(() => {
    if (!ticket?.ticketId) return;
    let isMounted = true;
    const fetchDeletionStatus = async () => {
      try {
        const res = await api.getDeletionStatus(ticket.ticketId);
        if (isMounted && res?.data) {
          setDeletionStatus(res.data);
        } else if (isMounted) {
          setDeletionStatus(null);
        }
      } catch (err) {
        console.warn('Error fetching deletion status:', err.message);
      }
    };
    fetchDeletionStatus();
    return () => { isMounted = false; };
  }, [ticket?.ticketId]);

  if (!ticket) {
    return (
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <h2>Ticket Record Not Found</h2>
        <p style={{ color: '#64748B', margin: '1rem 0 2rem' }}>
          The requested ticket <strong>{id}</strong> is not available or was deleted with user consent.
        </p>
        <Link to="/app/admin/tickets" className="btn btn-primary btn-md">
          Return to All Tickets
        </Link>
      </div>
    );
  }

  const agents = ['Support Team', 'Sarah Connor', 'Marcus Vance', 'Finance Ops', 'DevOps Team'];
  const statuses = ['Open', 'In Progress', 'Waiting for User', 'Resolved', 'Closed'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const isPending = deletionStatus?.status === 'pending';
  const isApproved = deletionStatus?.status === 'approved';
  const isRejected = deletionStatus?.status === 'rejected';

  const handleStatusChange = (newStatus) => {
    updateTicketStatus(ticket.ticketId, newStatus);
  };

  const handleSendNoteOrReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const isInternal = activeTab === 'internal';
    addComment(ticket.ticketId, replyText.trim(), isInternal);
    setReplyText('');
  };

  const handleConfirmRequestDeletion = async () => {
    try {
      setLoadingDeletion(true);
      await requestTicketDeletion(ticket.ticketId);
      setShowDeleteRequestModal(false);
      // Refresh status
      const res = await api.getDeletionStatus(ticket.ticketId);
      if (res?.data) setDeletionStatus(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to send deletion request', 'error');
    } finally {
      setLoadingDeletion(false);
    }
  };

  const handleExecutePermanentDelete = async () => {
    try {
      setIsDeleting(true);
      await permanentlyDeleteTicket(ticket.ticketId);
      setShowPermanentDeleteModal(false);
      navigate('/app/admin/tickets');
    } catch (err) {
      showToast(err.message || 'Deletion failed: Backend security rejected request', 'error');
      setIsDeleting(false);
    }
  };

  const handleAiDraft = (promptType) => {
    const draft = generateAIReply(ticket, promptType);
    if (promptType === 'internal_summary') {
      setActiveTab('internal');
      setReplyText(draft);
    } else {
      setActiveTab('public');
      setReplyText(draft);
    }
    setShowAiMenu(false);
    showToast('AI Draft generated! Review and edit before sending.', 'info');
  };

