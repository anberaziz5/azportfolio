# Anber Aziz - Personal Portfolio

A production-ready personal portfolio built for Anber Aziz, Full-Stack Software Engineer & AI Researcher.

## Features
- **Next.js App Router**: Modern React framework.
- **Tailwind CSS v4**: Strict aesthetic configuration with dark mode.
- **Framer Motion**: Page transitions and micro-interactions.
- **Three.js & WebGL Shaders**: Custom artistic visualizations.
- **Local Markdown blog**: Posts live in `content/blog`. Add a `.md` file to publish.
- **Resend API**: Wired to scheduling and Ada.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` with keys for Resend, Supabase, Groq/Gemini, and Jina.

### 3. Add a blog post
Copy `content/blog/_template.md` to `content/blog/your-slug.md`, fill the frontmatter, and put a 1200x630 WebP cover at `public/blog/your-slug.webp`.

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel
1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables.
4. Deploy! It automatically uses the included \`vercel.json\`.

### Cloudflare Pages
This project includes a \`wrangler.toml\` file configured for Cloudflare Pages.
1. Push to GitHub.
2. Connect to Cloudflare Pages.
3. Set build command to \`npx @cloudflare/next-on-pages\`
4. Add Environment Variables.
5. Deploy!
