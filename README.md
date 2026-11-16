# 🍎 SnackMate

**Every Craving Deserves a Better Choice.**

SnackMate is a snack discovery and nutrition platform that helps parents find healthier, better-suited snack options for their children, including kids with dietary needs.

---

## ✨ Features

- 🔍 **Snack Discovery** – Browse and explore snack options in a clean, easy-to-scan interface
- 🥗 **Nutrition Insights** – Understand what's in a snack at a glance
- 👨‍👩‍👧 **Built for Parents** – Designed around the needs of parents choosing snacks for their children
- 🔐 **Backend with Supabase** – Database and authentication powered by Supabase
- 🏷️ **Scan-to-Understand Label Helper** *(Coming Soon)* – Understand food labels in plain language

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS (PostCSS) |
| Backend / DB | Supabase |
| Linting | ESLint |

---

## 📁 Project Structure

```
SnackMate/
├── .bolt/              # Bolt project configuration
├── src/                # Application source code
├── supabase/           # Supabase config and migrations
├── index.html          # App entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── tsconfig*.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# Clone the repository
git clone https://github.com/manasmanchanda/SnackMate.git
cd SnackMate

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🗄️ Database

Database schema and migrations live in the `supabase/` folder. Apply them to your Supabase project using the Supabase CLI or by running the SQL in the Supabase dashboard.

---

## 🗺️ Roadmap

- [ ] Scan-to-Understand Label Helper
- [ ] More filters for dietary needs and allergens
- [ ] Saved favourites and personalised recommendations

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 📄 License

No license has been specified yet. Add one (e.g. MIT) to let others know how they can use this project.

---

Made with 💚 by [@manasmanchanda](https://github.com/manasmanchanda)
