# 🚀 ThinkNode — Enterprise Freelancer Suite

ThinkNode is a professional-grade, high-performance management dashboard designed for freelancers, solopreneurs, and small creative agencies. It provides a unified interface to manage the entire project lifecycle—from client onboarding and kanban-style project tracking to automated invoices and real-time financial reporting.

![ThinkNode Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)

---

## ✨ Key Features

### 🔐 Secure Authentication & Onboarding
- **Identity Management**: Robust login and registration system with secure session persistence.
- **Role-Based Views**: Context-aware UI that adapts to user permissions (Admin/Standard).
- **Graceful Onboarding**: Intelligent signup-to-login redirection with informative feedback loops.

### 👥 Client & Project Management (CRM)
- **Kanban Workflow**: Drag-and-drop project boards (Lead → Planning → Design → Development → Delivered).
- **Client Records**: Centralized database for client details, service history, and specific project links.
- **Live Sync**: Integrated socket-based notifications for real-time updates across the dashboard.

### 💰 Financial Intelligence
- **Invoice Engine**: Professional invoice generator with live HTML/Print preview.
- **Payment Tracking**: Granular status management (Paid, Delayed, Pending) with per-invoice received amounts.
- **Real-time Analytics**: Monthly revenue trends and service-based income distribution powered by Recharts.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) powered by [Vite](https://vitejs.dev/) for ultra-fast HMR.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a sleek, responsive, and high-performance UI.
- **State Management**: [Context API](https://react.dev/reference/react/useContext) + [Zustand](https://zustand-demo.pmnd.rs/) for unified data flow.
- **Data Visualization**: [Recharts](https://recharts.org/) for beautiful, responsive financial graphs.
- **Interactions**: [@dnd-kit](https://dndkit.com/) for smooth drag-and-drop project kanban.
- **Icons**: [Lucide React](https://lucide.dev/) for clean, consistent iconography.

---

## 🏁 Getting Started

### 📋 Prerequisites
- **Node.js**: `v18.x` or higher (tested on `v20`)
- **npm**: `v9.x` or higher

### ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dineshyr29-04/Thinknode.git
   cd Thinknode
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following (use the deployed backend URL in production):
   ```env
   VITE_API_URL=https://thinknode-backend.onrender.com/
   VITE_API_VERSION=/api
   VITE_SOCKET_URL=https://thinknode-backend.onrender.com/
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── src/
│   ├── components/     # Reusable UI components (Navbar, Sidebar, etc.)
│   ├── context/        # AppContext for global state & auth
│   ├── config/         # API endpoints and app configuration
│   ├── data/           # Static assets and dummy data for staging
│   ├── pages/          # Full page views (Dashboard, Login, Clients, etc.)
│   ├── services/       # API abstraction layer (AuthService, etc.)
│   ├── utils/          # Helper utilities and the core API Client
│   └── App.jsx         # Main application routing and layout
├── public/             # Static public assets
└── .env                # Local environment configuration
```

---

## 🚀 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Dev** | `npm run dev` | Runs the app in development mode with HMR. |
| **Build** | `npm run build` | Compiles the production-ready bundle. |
| **Lint** | `npm run lint` | Runs ESLint to check for code quality issues. |
| **Preview** | `npm run preview` | Previews the local production build. |

---

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these steps:
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>Built with ❤️ by the ThinkNode Team</b><br>
  <i>Empowering freelancers to work smarter, not harder.</i>
</p>