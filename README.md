This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Using Ngrok for Development

To expose your local development server to the internet for testing webhooks, APIs, or sharing with others, you can use ngrok:

### Prerequisites

1. [Install ngrok](https://ngrok.com/download) on your system
2. Sign up for a free ngrok account and get your authtoken

### Setup

1. Authenticate ngrok:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

2. Start your Next.js development server:

```bash
npm run dev
```

3. In a new terminal, expose your local server:

```bash
ngrok http 3000
```

4. ngrok will provide you with a public URL (e.g., `https://random-string.ngrok-free.app`) that forwards to your local server

### Common Use Cases

- **Testing webhooks**: Use the ngrok URL to receive webhook calls from external services
- **Mobile testing**: Access your local app from mobile devices during development
- **API testing**: Share your API endpoints with teammates for integration testing
- **Demo purposes**: Quickly demo your app to stakeholders without deploying

### Tips

- The free ngrok plan provides random URLs that change each session
- Consider upgrading to ngrok's paid plan for custom subdomains
- Use ngrok's inspect feature to debug webhook requests
- Make sure to handle CORS properly if your app makes API calls to the ngrok URL

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
