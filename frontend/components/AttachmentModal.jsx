import React from 'react';
import { X, Download, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

export const AttachmentModal = ({ attachment, onClose }) => {
  if (!attachment) return null;

  const isImage = attachment.name && (
    attachment.name.endsWith('.png') ||
    attachment.name.endsWith('.jpg') ||
    attachment.name.endsWith('.jpeg') ||
    attachment.name.endsWith('.webp') ||
    attachment.url?.startsWith('data:image') ||
    attachment.type?.startsWith('image/')
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="attachment-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            {isImage ? <ImageIcon size={20} className="modal-icon-accent" /> : <FileText size={20} className="modal-icon-accent" />}
            <div>
              <h3 className="modal-title">{attachment.name}</h3>
              <p className="modal-subtitle">{attachment.size || 'Attachment'}</p>
            </div>
          </div>
          <button className="icon-btn-ghost" onClick={onClose} title="Close Preview">
            <X size={18} />
          </button>
        </div>

        <div className="attachment-modal-body">
          {isImage ? (
            <div className="attachment-image-preview">
              <img 
                src={attachment.url && attachment.url !== '#' ? attachment.url : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'} 
                alt={attachment.name} 
                className="preview-img"
              />
            </div>
          ) : (
            <div className="attachment-doc-preview">
              <FileText size={64} className="doc-icon-large" />
              <h4>{attachment.name}</h4>
              <p>Document preview generated. You can download or view raw content below.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <a 
            href={attachment.url || '#'} 
            download={attachment.name}
            className="btn btn-primary"
            onClick={(e) => {
              if (attachment.url === '#') {
                e.preventDefault();
                alert(`Downloaded mock file: ${attachment.name}`);
              }
            }}
          >
            <Download size={16} /> Download File
          </a>
        </div>
      </div>
    </div>
  );
};
