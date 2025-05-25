# 🔐 Simple API Key Manager

**Simple API Key Manager** is a lightweight, developer-friendly tool that allows users to securely store, organize, and track their API keys. Designed as a step-by-step tutorial project, it demonstrates how to build a functional API key management system using **Next.js**, **TypeScript**, and **Supabase**.

---

## 🚀 Why Use This?

Modern companies often manage **dozens or even hundreds of API keys** across multiple services. Without a centralized interface, it becomes difficult to:

- Keep track of which key belongs to which service.
- Understand how much usage (tokens, requests) each API is consuming.
- Share and manage keys across teams in a secure way.

Simple API Key Manager solves these challenges by providing:

✅ Centralized storage  
📊 Token and request tracking  
🔒 Secure backend with Supabase  
🧩 Developer-focused modular architecture

---

## ✨ Features

- **Secure Storage**: Store your API keys in Supabase using client-safe patterns.
- **Usage Monitoring**: Log and display token usage per key.
- **Categorization**: Organize keys by project, environment (dev/staging/prod), or purpose.
- **Clean UI**: Simple and responsive dashboard built with Tailwind CSS.
- **Learning Resource**: Ideal for those learning full-stack development using modern tools.

---

## 🛠 Tech Stack

| Layer         | Technology                       |
|---------------|----------------------------------|
| Frontend      | [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| Backend/Auth  | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime) |
| Styling       | Tailwind CSS                     |
| Hosting       | Vercel or your choice            |

---

## 📸 Demo

> _(Add a screenshot or screen recording here if available)_

---

## 📦 Getting Started

### 1. Clone the Repository

git clone https://github.com/your-username/simple-api-key-manager.git
cd simple-api-key-manager

2. Install Dependencies
npm install

3. Configure Supabase
Create a Supabase project.
Copy the credentials and set them in your .env.local file:

env

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
4. Run the Application

npm run dev