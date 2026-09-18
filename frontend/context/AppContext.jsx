import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true while verifying session on load

  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Session Restore on App Load ────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('rd_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res?.user) {
          setCurrentUser(res.user);
        }
      } catch {
        localStorage.removeItem('rd_token');
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Login ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res?.token && res?.user) {
      localStorage.setItem('rd_token', res.token);
      setCurrentUser(res.user);
      return res.user;
    }
    throw new Error('Login failed: no token returned');
  };

  // ── Register ────────────────────────────────────────────────────────────
  const register = async (userData) => {
    const res = await api.register(userData);
    if (res?.token && res?.user) {
      localStorage.setItem('rd_token', res.token);
      setCurrentUser(res.user);
      return res.user;
    }
    throw new Error('Registration failed');
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('rd_token');
    setCurrentUser(null);
    setTickets([]);
    setNotifications([]);
    setAuditLogs([]);
    setFeedbackList([]);
    setUsers([]);
  };

  // ── Load All Data from Backend ──────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const promises = [
        api.getTickets(),
        api.getNotifications(),
      ];
      if (currentUser.role === 'admin') {
        promises.push(api.getUsers());
        promises.push(api.getAuditLogs());
        promises.push(api.getFeedback());
      }

      const results = await Promise.allSettled(promises);

      if (results[0]?.status === 'fulfilled' && results[0].value?.data) {
        setTickets(results[0].value.data);
      }
      if (results[1]?.status === 'fulfilled' && results[1].value?.data) {
        setNotifications(results[1].value.data);
      }
      if (currentUser.role === 'admin') {
        if (results[2]?.status === 'fulfilled' && results[2].value?.data) {
          setUsers(results[2].value.data);
        }
        if (results[3]?.status === 'fulfilled' && results[3].value?.data) {
          setAuditLogs(results[3].value.data);
        }
        if (results[4]?.status === 'fulfilled' && results[4].value?.data) {
          setFeedbackList(results[4].value.data);
        }
      }
    } catch (err) {
      console.warn('Backend sync warning:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      refreshAll();
    }
  }, [currentUser, refreshAll]);

  // ── Create Ticket ────────────────────────────────────────────────────────
  const createTicket = async (ticketData) => {
    const res = await api.createTicket({
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority || 'Medium',
      attachments: ticketData.attachments || []
    });
    if (res?.data) {
      setTickets(prev => [res.data, ...prev]);
      addNotificationLocal('Ticket Created', `Ticket ${res.data.ticketId} created successfully.`, res.data.ticketId);
      showToast(`Ticket ${res.data.ticketId} created successfully!`, 'success');
      return res.data.ticketId;
    }
    throw new Error('Failed to create ticket');
  };

  // ── Update Ticket Status ─────────────────────────────────────────────────
  const updateTicketStatus = async (ticketId, newStatus, assignedTo = null, priority = null) => {
    // Optimistic UI update
    setTickets(prev => prev.map(t => {
      if (t.ticketId !== ticketId) return t;
      const updatedTimeline = (t.timeline || []).map(item =>
        item.step === newStatus ? { ...item, completed: true, date: 'Just now' } : item
      );
      return {
        ...t, status: newStatus,
        assignedTo: assignedTo !== null ? assignedTo : t.assignedTo,
        priority: priority || t.priority,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString(),
        resolvedAt: newStatus === 'Resolved' ? new Date().toISOString() : t.resolvedAt,
        closedAt: newStatus === 'Closed' ? new Date().toISOString() : t.closedAt
      };
    }));

    await api.updateTicketStatus(ticketId, { status: newStatus, priority, assignedTo });
    addNotificationLocal('Ticket Status Updated', `Ticket ${ticketId} is now ${newStatus}.`, ticketId);
    showToast(`Status updated to ${newStatus}`);
  };

  // ── Add Comment ──────────────────────────────────────────────────────────
  const addComment = async (ticketId, text, isInternal = false) => {
    const res = await api.addComment(ticketId, { text, isInternal });
    if (res?.data) {
      if (isInternal) {
        setTickets(prev => prev.map(t => t.ticketId === ticketId
          ? { ...t, internalNotes: [...(t.internalNotes || []), { id: res.data.id, author: res.data.sender, text: res.data.text, timestamp: res.data.timestamp }] }
          : t));
        showToast('Internal note added');
      } else {
        setTickets(prev => prev.map(t => t.ticketId === ticketId
          ? { ...t, comments: [...(t.comments || []), { id: res.data.id, sender: res.data.sender, role: res.data.role, text: res.data.text, timestamp: res.data.timestamp }] }
          : t));
        addNotificationLocal('New Reply', `${currentUser.name} replied on ticket ${ticketId}`, ticketId);
        showToast('Reply sent successfully');
      }
    }
  };

  // ── Request Ticket Deletion (Admin only) ─────────────────────────────────
  const requestTicketDeletion = async (ticketId) => {
    const res = await api.requestDeletion(ticketId);
    showToast('Deletion consent request sent to customer. Awaiting approval.', 'info');
    await refreshAll();
    return res;
  };

  // ── Handle Deletion Response (Customer only) ─────────────────────────────
  const handleDeletionResponse = async (ticketId, approved) => {
    const res = await api.respondDeletion(ticketId, approved);
    if (approved) {
      showToast(`You approved deletion of ${ticketId}. The admin may now permanently delete it.`, 'info');
    } else {
      showToast(`Deletion request for ${ticketId} rejected. Ticket remains active.`, 'info');
    }
    await refreshAll();
    return res;
  };

  // ── Permanently Delete Ticket (Admin only, requires approved deletion request) ─
  const permanentlyDeleteTicket = async (ticketId) => {
    const res = await api.permanentlyDeleteTicket(ticketId);
    setTickets(prev => prev.filter(t => t.ticketId !== ticketId));
    showToast(`Ticket ${ticketId} has been permanently deleted with customer consent.`, 'success');
    await refreshAll();
    return res;
  };

  // ── Submit Feedback ──────────────────────────────────────────────────────
  const submitFeedback = async (ticketId, rating, comment) => {
    await api.submitFeedback({ ticketId, rating, comment });
    showToast('Thank you for your feedback!', 'success');
  };

  // ── Local Notification Helper ────────────────────────────────────────────
  const addNotificationLocal = (title, message, ticketId) => {
    const newNotif = {
      id: `n_${Date.now()}`,
      title, message, ticketId,
      time: 'Just now', read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try { await api.markNotificationRead(id); } catch {}
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await api.markAllNotificationsRead(); } catch {}
    showToast('All notifications marked as read');
  };

  return (
    <AppContext.Provider
      value={{
        // Auth
        currentUser, setCurrentUser,
        login, register, logout,
        authLoading,

        // Data
        tickets,
        users,
        notifications,
        auditLogs,
        feedbackList,

        // Ticket actions
        createTicket,
        updateTicketStatus,
        addComment,
        requestTicketDeletion,
        handleDeletionResponse,
        permanentlyDeleteTicket,
        submitFeedback,

        // Notification actions
        markNotificationRead,
        markAllNotificationsRead,

        // UI
        toast, showToast,
        isLoading,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
