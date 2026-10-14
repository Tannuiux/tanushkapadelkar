# Tanushka Padelkar · Portfolio

Built with **Next.js** (the site), **Motion** (animations), **Lenis** (smooth scroll), **Matter.js** (falling tools) and **Cal.com** (book a call). Hosted free on **Vercel**.

## Where things live

| I want to change… | Open this file |
|---|---|
| Any words, links, email, tools, process steps, AI twin facts | `data/content.js` |
| Colours, spacing, fonts | `app/globals.css` (colours are at the top, in `:root`) |
| The order of sections on the page | `app/page.js` |
| One section's layout | `components/<Section>.js` (Hero, Work, Process, Beyond, Connect) |
| Images | `public/img/` |
| The AI twin's server | `app/api/chat/route.js` |

## Switching things on

- **Book a call:** make a free Cal.com account, then put your link (e.g. `tanushka/30min`) in `calLink` in `data/content.js`.
- **Typed AI twin questions:** in Vercel → Settings → Environment Variables, add `GEMINI_API_KEY`. Without it, the preset questions still work.

## Run it on your own computer (optional)

```
npm install
npm run dev
```
Then open http://localhost:3000.
