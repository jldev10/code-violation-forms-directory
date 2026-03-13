# Code Violation Forms Directory

A modern web application for managing property leads, with a focus on code violation tracking and automated deduplication.

## 🚀 Features

- **Lead Management**: Efficiently store, track, and manage property leads.
- **Automated Deduplication**: Intelligent address processing to prevent duplicate entries during CSV uploads.
- **Secure Authentication**: Complete user lifecycle including:
  - Secure Login/Registration
  - Password Reset Flow (integrated with Brevo)
  - Admin/User account roles
- **Admin Dashboard**: Comprehensive management interface for users and data.
- **Premium UI**: Responsive design built with React and Tailwind CSS, featuring subtle animations and a dark-mode-first aesthetic.

## 🛠 Tech Stack

- **Core**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Icons**: Lucide React
- **Backend/API**: Vercel Serverless Functions (Node.js)
- **Database**: Neon (PostgreSQL)
- **Emails**: Brevo (Sendinblue)

## ⚙️ Development Setup

### Prerequisites

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following:

```env
# Database (Neon)
PGHOST=your_neon_host
PGDATABASE=your_db_name
PGUSER=your_user
PGPASSWORD=your_password

# Authentication (JWT)
JWT_SECRET=your_secret_key

# Brevo (Email)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email

# Backend URL (Base URL for API)
VITE_BASE44_APP_BASE_URL=your_backend_url
```

### Running Locally

```bash
npm run dev
```

## 📄 License

This project is private and intended for use by the Code Violation Forms Directory team.
