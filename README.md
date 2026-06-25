# 📊 FinTrack — Your Personal Money OS

Hey there! Welcome to **FinTrack**, a sleek and modern personal finance tracker built to help you take control of your money without the headache. 

If you are tired of messy spreadsheets and clunky banking interfaces, this is for you. FinTrack is designed to be clean, fast, and beautiful—featuring a premium dark-mode interface with glassmorphic cards and real-time interactive charts.

---

## ✨ What does it do?

*   **🔒 Login Your Way**: Sign in securely using your email (we'll send a one-time OTP to verify it's you) or simply click "Continue with Google" via Auth0.
*   **📈 Visual Analytics**: Beautiful, interactive charts (pie, line, and bar graphs) that show you exactly where your money goes.
*   **💸 Simple Ledger**: Log your daily expenses, tag them with categories (like food, bills, shopping), and filter through them easily.
*   **🤝 Debt Tracker**: Keep a clear record of your active loans—both what you owe others and what your friends owe you.
*   **🎯 Budgets & Goals**: Set a monthly budget and track your savings goals in real-time.

---

## 🛠️ The Tech Stack

We went with a modern JavaScript/TypeScript stack to keep the app snappy and maintainable:

### Frontend (Client)
*   **React + TypeScript** (built with Vite for lightning-fast loads)
*   **Recharts** for the interactive data visualizations
*   **Vanilla CSS** (custom variables, radial glows, and smooth transitions)
*   **Auth0** for seamless Google OAuth integration

### Backend (Server)
*   **Node.js & Express** for the REST API
*   **MongoDB + Mongoose** for storing transaction and debt logs
*   **JSON Web Tokens (JWT)** for session cookie security
*   **Nodemailer** to dispatch OTP verification codes to your inbox

---

## 📂 Project Layout

Here's how the repository is structured:

```text
FinTrack/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Assets, Favicon, and custom SVGs
│   ├── src/
│   │   ├── components/     # UI layouts, forms, and route protection guards
│   │   ├── pages/          # Dashboard, Analytics, Transactions, Debts
│   │   └── App.tsx         # Routing hub
│   └── package.json
└── server/                 # Express Backend
    ├── src/
    │   ├── config/         # DB connection & environment setup
    │   ├── controller/     # Business logic for auth, transactions, debts
    │   ├── services/       # Email delivery setup
    │   └── server.ts       # Backend entrypoint (forces IPv4)
    └── package.json
```

---

## ⚙️ Setting Up Environment Variables

To get the project running locally, you'll need to set up a couple of `.env` files.

### 1. Server Environment (`server/.env`)
Create a file named `.env` in the `server/` folder:
```env
PORT = 5000
MONGODB_URL = your_mongodb_atlas_connection_string
JWT_SECRET = your_random_secret_string
JWT_EXPIRES = 7d
COOKIE_EXPIRES = 7
CLIENT_URL = http://localhost:5173  # Change to your Vercel URL in production
NODE_ENV = development              # Change to 'production' in production

# Gmail SMTP/OAuth Details
GOOGLE_USER = your_gmail_address
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
GOOGLE_REFRESH_TOKEN = your_google_refresh_token
```

### 2. Client Environment (`client/.env`)
Create a file named `.env` in the `client/` folder:
```env
VITE_API_URL = http://localhost:5000 # Change to your Render URL in production
VITE_AUTH0_DOMAIN = your_auth0_domain
VITE_AUTH0_CLIENT_ID = your_auth0_client_id
```

---

## 💻 Running it Locally

### Step 1: Install Dependencies
Run this in both folders to install the required packages:
```bash
# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### Step 2: Spin up the Servers
Open two terminal windows:

In **Terminal 1** (starts the backend):
```bash
cd server
npm run dev
```

In **Terminal 2** (starts the frontend):
```bash
cd client
npm run dev
```

Open your browser to `http://localhost:5173` and you are good to go!

---

## 🚀 Deployed Services
*   **Live App**: Deployed on [Vercel](https://fintrack-money-os.vercel.app)
*   **API Server**: Deployed on [Render](https://fintrack-mkwo.onrender.com)
