// AI Helper for Ticket Analysis, Reply Generation, and Natural Language Support

export const analyzeTicketWithAI = (subject, description) => {
  const combined = `${subject} ${description}`.toLowerCase();
  
  // Sentiment Analysis
  let sentiment = 'Neutral';
  let sentimentScore = 50;
  if (combined.includes('urgent') || combined.includes('broken') || combined.includes('deducted') || combined.includes('down') || combined.includes('fail') || combined.includes('immediately') || combined.includes('unacceptable')) {
    sentiment = 'Frustrated / Urgent';
    sentimentScore = 85;
  } else if (combined.includes('help') || combined.includes('please') || combined.includes('question') || combined.includes('how to')) {
    sentiment = 'Inquisitive / Calm';
    sentimentScore = 30;
  }

  // Auto Category & Priority Prediction
  let suggestedCategory = 'General Inquiry';
  let suggestedPriority = 'Medium';
  let suggestedTags = ['support'];

  if (combined.includes('login') || combined.includes('password') || combined.includes('auth') || combined.includes('account') || combined.includes('2fa') || combined.includes('access')) {
    suggestedCategory = 'Account & Login';
    suggestedPriority = combined.includes('urgent') || combined.includes('cannot') ? 'High' : 'Medium';
    suggestedTags = ['auth', 'account-access', 'security'];
  } else if (combined.includes('pay') || combined.includes('charge') || combined.includes('bill') || combined.includes('refund') || combined.includes('deducted') || combined.includes('invoice') || combined.includes('$')) {
    suggestedCategory = 'Payment & Billing';
    suggestedPriority = 'Critical';
    suggestedTags = ['billing', 'transaction', 'finance-triage'];
  } else if (combined.includes('api') || combined.includes('ssl') || combined.includes('error') || combined.includes('500') || combined.includes('latency') || combined.includes('crash') || combined.includes('slow')) {
    suggestedCategory = 'Technical Issue';
    suggestedPriority = combined.includes('down') || combined.includes('crash') ? 'Critical' : 'High';
    suggestedTags = ['infrastructure', 'bug-report', 'engineering'];
  } else if (combined.includes('service') || combined.includes('subscription') || combined.includes('upgrade') || combined.includes('plan')) {
    suggestedCategory = 'Service Issue';
    suggestedPriority = 'Medium';
    suggestedTags = ['service-config', 'onboarding'];
  }

  // Recommended self-help KB articles
  let recommendedArticles = [];
  if (suggestedCategory === 'Account & Login') {
    recommendedArticles = [
      { id: 'kb1', title: 'How to Reset Your Account Password and 2FA', match: '96% match' },
      { id: 'kb2', title: 'Troubleshooting Login & Authorization Code Errors', match: '92% match' }
    ];
  } else if (suggestedCategory === 'Payment & Billing') {
    recommendedArticles = [
      { id: 'kb3', title: 'Understanding Failed Charges and Pre-Authorization Holds', match: '98% match' },
      { id: 'kb4', title: 'How to Request a Subscription Refund', match: '89% match' }
    ];
  } else {
    recommendedArticles = [
      { id: 'kb5', title: 'Standard Service Level Agreements (SLA) & Incident Escalations', match: '85% match' }
    ];
  }

  return {
    sentiment,
    sentimentScore,
    suggestedCategory,
    suggestedPriority,
    suggestedTags,
    recommendedArticles
  };
};

export const generateAIReply = (ticket, promptType) => {
  const userName = ticket.userName || 'Customer';
  const ticketId = ticket.ticketId || 'TKT';
  const category = ticket.category || 'Issue';

  switch (promptType) {
    case 'empathetic_greeting':
      return `Dear ${userName},\n\nThank you for reaching out to us regarding ${ticket.subject}. We sincerely apologize for the inconvenience this has caused you.\n\nOur specialized ${category} team has received your ticket and is actively reviewing the diagnostics. We are committed to resolving this promptly and will provide an update within the hour.\n\nWarm regards,\nResolveDesk Support Team`;

    case 'request_logs':
      return `Hi ${userName},\n\nTo help us accelerate our investigation for ticket ${ticketId}, could you please provide a few additional details:\n1. The exact browser / OS version you are currently using.\n2. A screenshot or copy of any error codes appearing in your browser console (Press F12 -> Console).\n3. The approximate timestamp when the issue last occurred.\n\nOnce received, our engineering team will reproduce and patch the root cause immediately.\n\nBest regards,\nResolveDesk Tier-2 Support`;

    case 'resolution_notice':
      return `Hello ${userName},\n\nWe are pleased to inform you that the issue reported in ticket ${ticketId} has been successfully resolved on our end.\n\nOur team has verified that services are operating normally. Please perform a quick refresh or log out and log back in to confirm that everything is working as expected.\n\nIf you experience any lingering difficulties, simply reply to this ticket to reopen it. Thank you for your patience!\n\nBest regards,\nResolveDesk Technical Team`;

    case 'internal_summary':
      return `[AI Incident Summary]\n- Customer: ${userName} (${ticket.userEmail})\n- Primary Symptom: ${ticket.subject}\n- Category: ${category} | Priority: ${ticket.priority}\n- Action Items: Verify customer authentication tokens in Redis session cache, cross-check latency logs, and notify customer when cleared.`;

    default:
      return `Hello ${userName},\n\nThank you for contacting ResolveDesk support. We have updated your ticket status and are actively working on the resolution.`;
  }
};

export const queryAIBot = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('reset') || q.includes('password') || q.includes('login') || q.includes('locked')) {
    return {
      answer: "To reset your password:\n1. Click 'Forgot Password' on the login screen.\n2. Enter your registered email address.\n3. Open the secure reset link sent to your inbox within 15 minutes.\n\nIf you have 2-Factor Authentication (2FA) enabled and lost access to your authenticator device, please request a temporary recovery code through an Admin ticket.",
      relatedArticles: ['How to Reset Your Account Password and 2FA', 'Troubleshooting Login Errors']
    };
  } else if (q.includes('refund') || q.includes('payment') || q.includes('billing') || q.includes('charge') || q.includes('deducted')) {
    return {
      answer: "Failed transactions with bank deductions are usually temporary pre-authorization holds placed by banking networks. These are automatically released within 3-5 business days. If you require an immediate manual refund, please create a ticket under the 'Payment & Billing' category with your invoice receipt attached.",
      relatedArticles: ['Understanding Failed Charges & Pre-Authorization Holds', 'Billing & Invoice FAQs']
    };
  } else if (q.includes('sla') || q.includes('response time') || q.includes('how long')) {
    return {
      answer: "Our standard SLA response times are:\n- Critical (Severity 1): Under 2 Hours (24/7 dedicated triage)\n- High (Severity 2): Under 6 Hours\n- Medium: Under 24 Hours\n- Low / General Inquiries: Under 48 Hours",
      relatedArticles: ['Standard Service Level Agreements (SLA)']
    };
  } else if (q.includes('delete') || q.includes('gdpr') || q.includes('privacy') || q.includes('data')) {
    return {
      answer: "In compliance with GDPR and data privacy rights, support staff cannot delete your tickets without your explicit authorization. When an admin requests ticket purging, you will receive an interactive consent notification in your User Dashboard to approve or reject.",
      relatedArticles: ['Privacy & GDPR Compliance Policy']
    };
  } else {
    return {
      answer: `Here are helpful insights regarding "${query}":\nYou can monitor ticket statuses directly from the 'My Tickets' dashboard. If you need dedicated human assistance, submit a new ticket and our team will be notified instantly!`,
      relatedArticles: ['Getting Started with ResolveDesk', 'Submitting Your First Support Ticket']
    };
  }
};
