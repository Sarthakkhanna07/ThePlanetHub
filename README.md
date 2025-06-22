# 🌍 The Planet HUB

> 🚀 _"Research to Startup | Made in India, for India | For Planetary Engineers"_
> An AI-powered platform connecting researchers, innovators, and funders to tackle planetary issues and build solutions from idea to impact.

---

## 📚 Overview

**The Planet HUB** is a sci-fi-themed open platform that streamlines the journey from cutting-edge research to funded startups. It’s designed to empower the Indian research ecosystem by enabling transparent, AI-supported, and community-driven research development.

Whether you're a researcher, student, investor, or planetary engineer, The Planet HUB provides the space and tools to collaborate, publish, rate, and support impactful solutions.

---

## 🪐 Key Features

| Module            | Description                                                                     |
| :---------------- | :------------------------------------------------------------------------------ |
| 🌀 **Central Hub** | Overview of all planetary issues, trending research, and AI-powered summaries.  |
| 🌋 **Planetary Issues** | Browse and explore critical issues (climate, waste, energy, etc.) submitted by the community. |
| 🚀 **Launch Pad** | Submit your research or ideas, get AI-evaluated, and link them to planetary challenges. |
| 🛰 **Starboard** | Rate, star, and support promising research to boost its visibility and funding potential. |
| 🧑‍🚀 **My Space** | Manage your submissions, stars, and contributions in a GitHub-like profile view. |

---

## 🧠 Built With

### 🔧 Frontend
- [Next.js](https://nextjs.org/) (JSX-based frontend framework)
- [TailwindCSS](https://tailwindcss.com/) (Utility-first dark-themed styling)
- [GSAP](https://greensock.com/gsap/) (Smooth animations)

### 🔌 Backend & Storage
- [Supabase](https://supabase.com/)
  - 🔐 Authentication (coming soon)
  - 🧾 PostgreSQL Database with RLS (Row Level Security)
  - 🗃️ File Storage for document uploads

### 🤖 AI/ML 
- AI/ML model & community-based validation scoring of research papers
- LLM-based paper summaries
- Weekly AI-generated ideas to work on by the community


---

## 🗂️ Database Tables

Main Supabase tables include:

- `users`
- `categories`
- `planetary_issues`
- `research_submissions`
- `stars`
- `ratings`

Each `research_submission` is tied to a `planetary_issue`, which is linked to a `category`. Submissions include PDF uploads, AI scores, tags, and star ratings.

“One Earth. One Idea. One Hub.”
