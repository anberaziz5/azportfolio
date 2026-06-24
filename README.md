# Anber Aziz - Personal Portfolio

A production-ready personal portfolio built for Anber Aziz, Full-Stack Software Engineer & AI Researcher.

## Features
- **Next.js 14 App Router**: Modern React framework.
- **Tailwind CSS v4**: Strict aesthetic configuration with dark mode.
- **Framer Motion**: Page transitions and micro-interactions.
- **Three.js & WebGL Shaders**: Custom artistic visualizations (Rotating Earth, Dithering, Dotted Surface).
- **Sanity CMS**: Fully integrated for managing blog posts.
- **Resend API**: Wired to the contact form.
- **Cross-Platform Deployment**: Ready for Vercel and Cloudflare Pages out of the box.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Copy the `.env.example` to `.env.local` and add your keys:
\`\`\`bash
cp .env.example .env.local
\`\`\`
- \`RESEND_API_KEY\`: Get it from [Resend](https://resend.com)
- \`NEXT_PUBLIC_SANITY_PROJECT_ID\`: Get it from your [Sanity](https://sanity.io) dashboard

### 3. Initialize Sanity (If not already created)
To manage blogs, you'll need to create a Sanity project and get the Project ID.
If you don't have a project yet, you can run:
\`\`\`bash
npx sanity init --env
\`\`\`

### 4. Run Locally
\`\`\`bash
npm run dev
\`\`\`
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
