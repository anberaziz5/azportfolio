# Add a blog post

1. Copy `content/blog/_template.md` to `content/blog/your-slug.md`.
2. Fill in the frontmatter. `slug` must match the filename (without `.md`).
3. Covers are generated automatically on `npm run build`. For a local preview, run `npm run blog:covers` (or drop your own 1200x630 WebP at `public/blog/your-slug.webp`).
4. Write the article in Markdown. Tables, lists, and fenced code blocks are supported.
5. Restart or refresh `/blog`. Posts are sorted by `date`, newest first.

Do not edit `README.md` as a post. Files without `title` and `date` are ignored.
