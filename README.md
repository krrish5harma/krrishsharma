# Krrish Sharma — Creative Portfolio

A responsive portfolio starter built with React, Vite and Express. The profile is editable in `client/src/data/profile.js`; add real, approved projects to the `projects` array in that file and put optimized media in `client/public/media/`.

## Run locally

Requires Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

The site runs at `http://localhost:5173`; the API runs at `http://localhost:3001`. The Vite dev server proxies `/api` requests to the API.

## Contact delivery

Copy `.env.example` to `.env` in the repository root, then set SMTP credentials, `MAIL_FROM`, `CONTACT_TO`, and `ALLOWED_ORIGIN`. The form uses server-side validation, a honeypot and rate limiting. Without delivery configuration, the API responds with an error and the page offers the social links; it never reports an undelivered message as sent.

## Updating content and media

- Edit name, education, tools and social URLs in `client/src/data/profile.js`.
- Add project objects to `projects` with `slug`, `title`, `category`, `thumbnail`, and `description`. Optional `videoUrl`, `year`, `role`, and `tools` are only shown when present.
- Use site-relative media URLs such as `/media/project-poster.webp` and `/media/project-cut.mp4`.
- The current hero artwork is generated CSS and marked as a preview placeholder. It is not represented as completed client work. The work list intentionally remains empty until real project assets and details are supplied.

## Deploy with Vercel

Import this repository into Vercel with the repository root as the project root. `vercel.json` builds the Vite site into `client/dist`, serves the Express contact API as a serverless function, and rewrites app routes to the SPA entry point. Vercel provides `VERCEL_URL` for preview deployments. Set `ALLOWED_ORIGIN` to the production site origin if using a custom domain, and add the SMTP environment variables in the Vercel project's Environment Variables before expecting contact delivery. Vercel previews need SMTP values too if the contact form should deliver messages there.

## Other production hosting

Build the frontend with `npm run build`. Deploy the generated `client/dist` as a static site and run `server/src/server.js` as a Node service. Configure the public frontend origin in `ALLOWED_ORIGIN` and provide SMTP settings through the hosting provider's secret environment variables. Add a canonical site URL and matching Open Graph image when the production domain and approved media are known.
