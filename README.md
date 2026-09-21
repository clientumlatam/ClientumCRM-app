# ClientumOS — Enterprise CRM & Intelligence Suite

ClientumOS is a comprehensive, open-source CRM, ERP, and Sales Automation platform powered by Artificial Intelligence. Designed for modern businesses, it centralizes sales operations, fiscal management, and omni-channel communication.

## 🚀 Key Features

- **Omni-channel CRM**: Unified management of Leads, Contacts, and Corporate Accounts.
- **Sales Pipeline**: Dynamic Kanban-style pipeline with scoring and revenue forecasting.
- **AI-Powered Assistants**: Voice note transcription, automatic task summarization, and sales copilot.
- **ERP Integration**: Native AFIP (Argentina) fiscal billing integration and multi-currency support.
- **WhatsApp Hub**: Centralized WhatsApp messaging for sales teams.
- **BI & Analytics**: Advanced reporting and business intelligence dashboards.

## 🛠️ Tech Stack

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS v4.
- **Backend**: Node.js (Express), esbuild for server-side bundling.
- **Persistence**: Firebase Firestore (Real-time) + PostgreSQL (optional).
- **AI**: Google Gemini API via `@google/genai`.

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clientum-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📖 Documentation

Detailed documentation can be found in the [docs](./docs) directory:

- [Architecture & Overview](./docs/01-introduccion-y-arquitectura.md)
- [Project Structure](./docs/02-estructura-del-proyecto.md)
- [Environment Variables & Deployment](./docs/07-variables-de-entorno-y-despliegue.md)
- [Integrations (AFIP, WhatsApp, etc.)](./docs/05-integraciones-y-salud.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/10-guia-de-contribucion.md) for details.

---
*ClientumOS — Less manual work. More control. More growth.*
