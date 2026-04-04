# Sunil Rathod — Portfolio

Personal portfolio website for **Sunil Rathod**, a Full Stack Developer with 4+ years of experience building real-time industrial and enterprise web applications.

## Tech Stack

- **Frontend:** Vue.js 3, Nuxt 3, TypeScript, Tailwind CSS, Vuetify
- **Backend:** Node.js, Express.js, REST APIs, WebSockets, MQTT, Python
- **Database:** MySQL, PostgreSQL, MongoDB, Typesense
- **Cloud & DevOps:** AWS (EC2, S3, CloudFront), Docker, PM2, GitLab CI/CD
- **IoT & Real-Time:** MQTT Protocol, WebSockets, Industrial Monitoring, Cold Chain
- **AI:** Gen AI, LLMs, AI Agents, Prompt Engineering

## Features

- Dark/Light theme toggle
- Animated hero section with Three.js and GSAP
- Sections: About, Experience, Skills, Projects, Certifications, Contact
- Fully responsive design
- Contact form integration

## Getting Started

### Quick Preview

Open `index.html` in your browser (contact form won't work without the backend).

### Full Local Development (with contact form)

1. Clone the repository:
   ```bash
   git clone git@github.com:SunilRathod27/portfolio.git
   cd portfolio
   ```

2. Install Wrangler CLI (one-time):
   ```bash
   npm install -g wrangler
   ```

3. Create a `.dev.vars` file in the project root with your Gmail credentials:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

4. Start the local server:
   ```bash
   wrangler pages dev .
   ```

5. Open `http://localhost:8788`

## Deployment (Cloudflare Pages)

1. Connect your GitHub repo to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Set build output directory to `/` (root)
3. Add environment variables in Cloudflare dashboard (Settings > Environment variables):
   - `GMAIL_USER` — your Gmail address
   - `GMAIL_APP_PASSWORD` — your Gmail app password (mark as encrypted)
4. Deploy

The `functions/api/contact.js` serverless function handles contact form submissions via Gmail SMTP.

## License

This project is personal and not licensed for redistribution.
