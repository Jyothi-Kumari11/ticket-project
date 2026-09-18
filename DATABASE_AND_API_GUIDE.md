# ResolveDesk — Database Modeling, Backend Architecture & API Guide

## 1. Database Modeling & Relational Schema

ResolveDesk uses a relational database architecture implemented on **SQLite** (using Node.js native `node:sqlite`), which provides instant zero-configuration setup, local persistence (`server/db/resolvedesk.db`), and full relational integrity with foreign keys enabled.

### 1.1 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ TICKETS : "creates (user_id)"
    USERS ||--o{ COMMENTS : "posts (sender_id)"
    USERS ||--o{ NOTIFICATIONS : "receives (user_id)"
    USERS ||--o{ FEEDBACK : "submits (user_id)"
    
    TICKETS ||--o{ COMMENTS : "contains (ticket_id)"
    TICKETS ||--o{ AUDIT_LOGS : "tracks (ticket_id)"
    TICKETS ||--o{ NOTIFICATIONS : "references (ticket_id)"
    TICKETS ||--o| FEEDBACK : "rated by (ticket_id)"
    TICKETS ||--o| DELETION_REQUESTS : "governed by (ticket_id)"

    USERS {
        TEXT id PK "USR-XXXX or ADM-XXXX"
        TEXT name "Full Name"
        TEXT email UK "Unique Email Address"
        TEXT password "Hashed Password"
        TEXT phone "Contact Number"
        TEXT role "'user' | 'admin'"
        TEXT department "Customer Organization or Support Tier"
        TEXT avatar "Image URL"
        TEXT created_at "ISO 8601 Timestamp"
        TEXT updated_at "ISO 8601 Timestamp"
    }

    TICKETS {
        TEXT ticket_id PK "e.g. TKT-2026-0018"
        TEXT user_id FK "References USERS.id"
        TEXT user_name "Denormalized for high read performance"
        TEXT user_email "Contact Email"
        TEXT user_phone "Contact Phone"
        TEXT subject "Issue Title"
        TEXT description "Detailed Issue Description"
        TEXT category "Account & Login, Payment & Billing, etc."
        TEXT priority "'Low' | 'Medium' | 'High' | 'Critical'"
        TEXT status "'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed'"
        TEXT assigned_to "Support Team or Agent Name"
        TEXT attachments "JSON Array of attachment metadata"
        TEXT timeline "JSON Array of progression milestones"
        TEXT created_at "ISO 8601"
        TEXT updated_at "ISO 8601"
        TEXT resolved_at "Nullable ISO 8601"
        TEXT closed_at "Nullable ISO 8601"
    }

    COMMENTS {
        TEXT id PK "c_XXXX or n_XXXX"
        TEXT ticket_id FK "References TICKETS.ticket_id ON DELETE CASCADE"
        TEXT sender_id "User ID of poster"
        TEXT sender_name "Name of poster"
        TEXT role "'user' | 'admin'"
        TEXT text "Message body"
        INTEGER is_internal "0 for public customer comment, 1 for internal admin note"
        TEXT created_at "ISO 8601"
    }

    NOTIFICATIONS {
        TEXT id PK "n_XXXX"
        TEXT user_id "Recipient User ID"
        TEXT title "Notification Headline"
        TEXT message "Body copy"
        TEXT ticket_id "Associated Ticket"
        INTEGER read "0 for unread, 1 for read"
        TEXT time "Relative or timestamp display"
        TEXT created_at "ISO 8601"
    }

    AUDIT_LOGS {
        TEXT id PK "a_XXXX"
        TEXT actor "User or Admin Name"
        TEXT role "'User' | 'Admin'"
        TEXT action "Description of event"
        TEXT ticket_id "Target Ticket"
        TEXT timestamp "Formatted timestamp"
        TEXT created_at "ISO 8601"
    }

    DELETION_REQUESTS {
        TEXT id PK "del_XXXX"
        TEXT ticket_id FK "References TICKETS.ticket_id ON DELETE CASCADE"
        TEXT requested_by "Admin Name"
        TEXT status "'pending' | 'approved' | 'rejected'"
        TEXT timestamp "Formatted Date"
        TEXT created_at "ISO 8601"
    }

    FEEDBACK {
        TEXT id PK "fb_XXXX"
        TEXT ticket_id FK "References TICKETS.ticket_id"
        TEXT user_id "Submitter User ID"
        TEXT user_name "Customer Name"
        INTEGER rating "1 to 5 Stars"
        TEXT comment "Customer Feedback Review"
        TEXT created_at "ISO 8601"
    }

    SYSTEM_SETTINGS {
        TEXT key PK "Configuration Key"
        TEXT value "Configuration Value"
        TEXT updated_at "ISO 8601"
    }
```

---

## 2. Backend REST API Reference

The backend runs on **port 5001** (or proxied seamlessly through Vite on **port 3000** under `/api`).

### 2.1 Tickets Endpoints

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/tickets` | List tickets with filters | `?userId=&status=&priority=&category=&search=` |
| `GET` | `/api/tickets/:id` | Get single ticket with comments & internal notes | `:id` (e.g. `TKT-2026-0018`) |
| `POST` | `/api/tickets` | Create a new ticket | `{ subject, description, category, priority, attachments, userId, userName, userEmail }` |
| `PATCH` | `/api/tickets/:id/status` | Update status, priority, or assigned agent | `{ status, priority, assignedTo, actorName, role }` |
| `POST` | `/api/tickets/:id/comments` | Post a public reply or internal staff note | `{ senderId, senderName, role, text, isInternal }` |
| `POST` | `/api/tickets/:id/deletion-request` | Initiate customer deletion consent workflow | `{ requestedBy }` |
| `PATCH` | `/api/tickets/:id/deletion-response` | Approve (purge) or reject deletion request | `{ approved: boolean, userName }` |

### 2.2 Users & Analytics Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users with aggregated ticket counts |
| `GET` | `/api/users/:id` | Get user details |
| `GET` | `/api/stats/summary` | Get aggregated KPI metrics, SLA stats, and category distribution |
| `GET` | `/api/audit-logs` | Get activity logs (supports `?ticketId=`) |
| `GET` | `/api/notifications` | Get notifications (supports `?userId=`) |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification as read |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read |
| `GET` | `/api/feedback` | List all customer feedback ratings |
| `POST` | `/api/feedback` | Submit CSAT rating (`ticketId`, `rating`, `comment`) |
| `GET` | `/api/settings` | Get system SLA thresholds and auto-assignment rules |
| `POST` | `/api/settings` | Update system configuration parameters |

---

## 3. How to Run

### Development Mode (Runs Frontend + Backend simultaneously)
```bash
npm run dev
```
- Frontend UI: `http://localhost:3000`
- Backend REST API: `http://localhost:5001` (also proxied via `http://localhost:3000/api`)

### Run Backend Standalone
```bash
npm run server
```

### Run Frontend Standalone
```bash
npm run client
```

### Production Build
```bash
npm run build
```
