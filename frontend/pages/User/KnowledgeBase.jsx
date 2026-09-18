import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Zap 
} from 'lucide-react';
import { queryAIBot } from '../../utils/aiHelper';

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);
  
  // AI Assistant Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your ResolveDesk AI Assistant. How can I assist you with your account, billing, or technical queries today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const navigate = useNavigate();

  const categories = ['All', 'Account & Security', 'Billing & Refunds', 'Technical Troubleshooting', 'Tickets & SLAs'];

  const faqs = [
    {
      id: 1,
      category: 'Account & Security',
      question: 'How do I reset my account password if the reset link expires?',
      answer: 'Password reset links expire after 15 minutes for your security. To request a new link, visit the Sign In page, click "Forgot Password", and enter your registered email. Check your spam folder if you do not see it within 2 minutes.'
    },
    {
      id: 2,
      category: 'Billing & Refunds',
      question: 'What happens if I am charged but my subscription does not activate?',
      answer: 'Occasionally payment gateway webhooks experience brief delays. If your subscription does not reflect within 10 minutes, submit a ticket with your transaction ID and bank confirmation screenshot. Our Finance team resolves charge discrepancies within 4 hours.'
    },
    {
      id: 3,
      category: 'Technical Troubleshooting',
      question: 'What does error code ERR_AUTH_502 mean?',
      answer: 'ERR_AUTH_502 indicates a temporary gateway authentication timeout between your browser and our OAuth verification server. Clearing your browser cache or opening an incognito session usually resolves this instantly.'
    },
    {
      id: 4,
      category: 'Tickets & SLAs',
      question: 'What are the response time guarantees for different priority levels?',
      answer: 'Critical priority tickets (system outages or payment loss) have an SLA response under 2 hours. High priority is within 6 hours, and standard inquiries are answered within 24 hours during business days.'
    },
    {
      id: 5,
      category: 'Account & Security',
      question: 'Why does an admin need my permission to delete a ticket?',
      answer: 'In compliance with GDPR and international data protection standards, ticket logs belong to the customer account holder. Admins can archive or close tickets, but permanent deletion requires explicit consent from you.'
    },
    {
      id: 6,
      category: 'Technical Troubleshooting',
      question: 'What file formats are supported for ticket attachments?',
      answer: 'We support PNG, JPG/JPEG, PDF, TXT, and LOG files up to 10MB each. If you need to share larger diagnostic logs or screen recordings, you can paste cloud storage links into the ticket description.'
    }
  ];

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const response = queryAIBot(userText);
      const botMsg = {
        sender: 'bot',
        text: response.answer,
        relatedArticles: response.relatedArticles,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 600);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="knowledge-base-layout">
      {/* Hero Search Section */}
      <div className="kb-hero-banner">
        <div className="kb-hero-content">
          <span className="kb-pill">HELP & DOCUMENTATION</span>
          <h1 className="kb-title">How can we help you today?</h1>
          <p className="kb-subtext">Search our self-help guides, resolution tutorials, or chat directly with our AI assistant.</p>

          <div className="kb-search-bar">
            <Search size={18} className="kb-search-icon" />
            <input
              type="text"
              placeholder="Search by keywords (e.g., payment refund, password reset, ERR_AUTH_502)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: FAQs + AI Chat Assistant */}
      <div className="kb-layout-split">
        {/* Left Column: Categorized FAQ Articles */}
        <div className="kb-faq-main-col">
          {/* Category Tabs */}
          <div className="kb-categories-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`kb-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="faq-header-row">
            <BookOpen size={18} color="#4F46E5" />
            <h3>Help Articles & Guides ({filteredFaqs.length})</h3>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <p>No articles matched your query. Try a different search term or ask the AI Support Bot on the right.</p>
            </div>
          ) : (
            <div className="faq-accordion-list">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`faq-card ${isOpen ? 'open' : ''}`}
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  >
                    <div className="faq-question-row">
                      <div className="faq-title-group">
                        <span className="faq-cat-tag">{faq.category}</span>
                        <h4 className="faq-question-text">{faq.question}</h4>
                      </div>
                      <div className="faq-toggle-icon">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive AI Support Assistant & Ticket CTA */}
        <div className="kb-side-col">
          {/* AI Virtual Assistant Card */}
          <div className="card ai-bot-card">
            <div className="ai-bot-header">
              <div className="ai-bot-avatar">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="ai-bot-title">AI Support Assistant</h4>
                <span className="ai-bot-status">● Live & Ready</span>
              </div>
            </div>

            <div className="ai-bot-chat-window">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`ai-chat-bubble-row ${msg.sender}`}>
                  <div className="ai-chat-bubble">
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                    {msg.relatedArticles && (
                      <div className="ai-related-docs">
                        <span className="docs-label">Related Guides:</span>
                        {msg.relatedArticles.map((art, aIdx) => (
                          <div key={aIdx} className="doc-link-item">
                            <BookOpen size={12} />
                            <span>{art}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="ai-chat-time">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="ai-chat-bubble-row bot">
                  <div className="ai-chat-bubble typing">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="ai-bot-input-form">
              <input
                type="text"
                placeholder="Ask anything (e.g. How do I get a refund?)..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="ai-send-btn">
                <Send size={15} />
              </button>
            </form>
          </div>

          {/* Fallback Ticket Escalation Card */}
          <div className="card cta-support-card">
            <div className="cta-icon-box">
              <HelpCircle size={24} color="#4F46E5" />
            </div>
            <h4>Need Dedicated Human Help?</h4>
            <p>
              Our Tier-2 engineering and finance support teams are on standby 24/7.
            </p>
            <Link to="/app/user/create-ticket" className="btn btn-primary btn-block btn-md">
              <PlusCircle size={16} />
              <span>Submit Support Ticket</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
