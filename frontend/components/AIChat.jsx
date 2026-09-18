import React, { useState, useRef, useEffect } from 'react';

// ── AI Bot Icon ────────────────────────────────────────────────────────────
export const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <line x1="12" y1="7" x2="12" y2="11"/>
    <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" strokeLinecap="round"/>
    <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const AIChat = ({ userName, context = 'default' }) => {
  const firstName = userName?.split(' ')[0] || 'there';
  const bottomRef = useRef(null);

  // Initial intro message changes based on context
  const getInitialMessages = () => {
    if (context === 'dashboard') {
      return [
        {
          id: 1,
          from: 'bot',
          time: '08:15 PM',
          text: null,
          intro: true,
          introText: `Hi ${firstName}! 👋\nI'm your AI support assistant. I can help you:`,
          introList: [
            'Check ticket status',
            'Find solutions (articles)',
            'Create a new ticket',
            'Answer general questions'
          ],
          introEnd: 'How can I help you today?'
        }
      ];
    }
    return [
      {
        id: 1,
        from: 'bot',
        time: '10:24 AM',
        text: null,
        intro: true,
        introText: `Hi ${firstName}! 👋\nI'm your AI support assistant. I can help you:`,
        introList: [
          'Describe your issue',
          'Choose the right category',
          'Set priority',
          'Provide helpful suggestions'
        ],
        introEnd: 'What would you like to do today?'
      }
    ];
  };

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState('');

  const FAQ = [
    {
      q: /password|reset|forgot/i,
      a: `To reset your password, please follow these steps:\n1. Go to the login page\n2. Click on "Forgot Password?"\n3. Enter your registered email address\n4. Check your inbox for the reset link\n\nLet me know if you need help with anything else!`,
      actions: ['Create a ticket', 'View my tickets', 'Password reset guide'],
    },
    {
      q: /login|sign in|access/i,
      a: `If you're having trouble logging in:\n1. Make sure you're using your registered email\n2. Check if Caps Lock is on\n3. Try resetting your password\n4. Clear your browser cache and try again\n\nStill having issues? I can help you create a support ticket.`,
      actions: ['Create a ticket', 'Reset password'],
    },
    {
      q: /status.*(TKT-\d+-\d+)/i,
      a: (match) => `Your ticket **${match[1]}** is currently **Awaiting Reply** from our team. It was last updated on 2026-09-15T14:20:00Z.\n\nWould you like me to:`,
      actions: ['View Ticket', 'Track Similar', 'Create New'],
    },
    {
      q: /ticket|complaint|issue|problem/i,
      a: `I can help you with that! You can:\n- Fill out the form on the left to create a new ticket\n- I'll help make sure you provide all the details needed for a fast resolution.\n\nWhat's the nature of your issue?`,
      actions: ['Account issue', 'Billing issue', 'Technical issue'],
    },
    {
      q: /payment|billing|charge|invoice/i,
      a: `For billing and payment issues:\n1. Check your payment method is up to date\n2. Verify the transaction in your bank statement\n3. If charged incorrectly, please create a ticket with the invoice number\n\nOur billing team responds within 24 hours.`,
      actions: ['Create a billing ticket', 'View my tickets'],
    },
  ];

  const getReply = (text) => {
    for (const f of FAQ) {
      const match = text.match(f.q);
      if (match) {
        return {
          a: typeof f.a === 'function' ? f.a(match) : f.a,
          actions: f.actions
        };
      }
    }
    return {
      a: `Thanks for reaching out! I'm not sure I have a specific answer for that, but our support team will be happy to help. Would you like to create a support ticket?`,
      actions: ['Create a ticket', 'View my tickets'],
    };
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = getReply(text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: reply.a,
        actions: reply.actions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 800);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="ai-chat-panel">
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-avatar">
          <BotIcon />
        </div>
        <div className="ai-chat-header-info">
          <span className="ai-chat-name">AI Support Assistant</span>
          <span className="ai-chat-status"><span className="ai-chat-dot" />Online</span>
        </div>
        <button className="ai-chat-more">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="ai-chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`ai-msg-row ${msg.from === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}>
            {msg.from === 'bot' && (
              <div className="ai-msg-avatar"><BotIcon /></div>
            )}
            <div className="ai-msg-bubble-wrap">
              {msg.intro ? (
                <div className="ai-msg-bubble ai-bubble-bot">
                  {msg.introText.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  <ul>
                    {msg.introList.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p style={{ marginTop: '8px' }}>{msg.introEnd}</p>
                </div>
              ) : (
                <div className={`ai-msg-bubble ${msg.from === 'bot' ? 'ai-bubble-bot' : 'ai-bubble-user'}`}>
                  {msg.text?.split('\n').map((line, i) => {
                    // Simple bold markdown parsing for UI mock
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i}>
                          {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part)}
                        </p>
                      );
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              )}
              {msg.actions && (
                <div className="ai-msg-actions">
                  {msg.actions.map(a => (
                    <button key={a} className="ai-action-btn" onClick={() => sendMessage(a)}>{a}</button>
                  ))}
                </div>
              )}
              <span className="ai-msg-time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="ai-chat-input-row">
        <input
          className="ai-chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
        />
        <button className="ai-send-btn" onClick={() => sendMessage(input)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <p className="ai-chat-disclaimer">💡 Ask me anything about your tickets!</p>
    </div>
  );
};

export default AIChat;
