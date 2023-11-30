# [Limetta](https://limetta.in)
Elevate your financial management with Limetta. Our user-friendly Next.js app simplifies expense tracking, offers multiple account management, easy money transfers, and efficient dues tracking. Take charge of your finances and make informed choices, all in one platform.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Database:** [PlanetScale](https://planetscale.com/)
- **Typesafe APIs** [tRPC](https://trpc.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Deployment:** [Vercel](https://vercel.com/dashboard)

## Key Features

- Authentication with **NextAuth.js**
- End-to-end typesafe APIs with **tRPC**
- ORM using **Drizzle ORM**
- Database on **PlanetScale**
- Validation with **Zod**
- Responsive design with **Tailwind CSS**

## Running Locally

1. Clone the repository

```bash
https://github.com/Sukrittt/Limetta.git
```

2. Install dependencies using pnpm

```bash
pnpm install
```

3. Copy the `.env.example` to `.env` and update the variables.

```bash
cp .env.example .env
```

4. Start the development server

```bash
pnpm dev
```

5. Push the database schema

```bash
pnpm db:push
```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
