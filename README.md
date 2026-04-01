# ⚡ Nexus.ai — Enterprise AI Orchestration Platform

![Version](https://img.shields.io/badge/version-2.5_Stable-06B6D4?style=for-the-badge)
![React](https://img.shields.io/badge/react-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/tailwindcss-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-auth-039BE5?style=for-the-badge&logo=firebase)

> A high-performance platform to design, test, and monitor AI workflows — all in one unified interface.

---

## 📌 Overview

**Nexus.ai** is a modern Single Page Application (SPA) built for developers working with Large Language Models (LLMs). It provides a centralized interface for prompt engineering, code auditing, and usage analytics.

---

## 🚀 Key Features

### 🧠 Neural Sandbox (Prompt Playground)
- Adjust **temperature** for creativity vs determinism  
- Control **max tokens** to simulate API limits  
- Real-time prompt experimentation  

---

### 🔍 Code Analyzer (Security Auditing)
- Detects exposed API keys and unsafe patterns  
- Regex-based parsing simulating AST checks  
- Export reports using Blob API  

---

### 📊 Analytics Dashboard
- Tracks token usage and request logs  
- Local persistence using `localStorage`  

---

### 🔐 Authentication
- Firebase Google OAuth  
- Protected routes with middleware  

---

### 🎨 UI/UX
- Tailwind CSS + Framer Motion  
- Responsive design with smooth animations  
- Typography: Inter + Space Grotesk  

---

## 🏗 Architecture

- React Router v6 with persistent layout (`<Outlet />`)  
- Component-based scalable structure  
- Local telemetry system via `logger.js`  

---

## 🧰 Tech Stack

- **Frontend:** React 18 (Vite)  
- **Routing:** React Router DOM v6  
- **Styling:** Tailwind CSS  
- **Animation:** Framer Motion  
- **Auth:** Firebase  
- **Icons:** Lucide React  

---

## 📂 Project Structure

```text
nexus-ai/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatArea.jsx
│   │   ├── CodeAnalyzer.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Landing.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Settings.jsx
│   │   └── Sidebar.jsx
│   ├── utils/
│   │   └── logger.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18  
- npm or yarn  
- Firebase project  

---

### Installation

```bash
git clone https://github.com/anubhav-kayal/GenAi-Prompt-Playgroud.git
cd GenAi-Prompt-Playgroud
npm install
```

---

### Environment Variables

Create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

### Run the App

```bash
npm run dev
```

App runs at: http://localhost:5173  

---

## 🛣 Roadmap

- [ ] WebSocket streaming  
- [ ] Cloud database (Firestore)  
- [ ] Custom system prompts  
- [ ] Prompt versioning  
- [ ] Multi-model support  

---

## 🤝 Contributing

Feel free to fork the repo and submit pull requests.

---

## 📄 License

MIT License  

---

## 👨‍💻 Author

-**Anubhav Kayal**
-**Dev Mahendru**
-**Devraj Chandani**
-**Deep Arjit Prasad**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!