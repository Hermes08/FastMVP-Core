# FastMVP-Core

A comprehensive Full-Stack Framework for building MVPs (Minimum Viable Products) at production scale. Built with **Next.js 14 App Router** and modern SaaS UI patterns. Designed to accelerate development while maintaining enterprise-grade code quality, security, and maintainability.

## Key Features

- **Next.js 14 App Router**: Modern React Server Components architecture
- **SaaS-Ready UI**: Professional blue gradient design with onboarding wizard
- **Full-Stack Architecture**: Next.js (Frontend/Backend) + Supabase (Database & Auth)
- **Production-Ready**: Includes authentication, database migrations, API routes, and deployment scripts
- **Type-Safe**: Built with TypeScript for runtime safety and IDE support
- **Scalable**: Component-based architecture with modular design patterns
- **SEO-Optimized**: Built-in SEO components and meta tag management
- **Database-Agnostic**: Prisma ORM with easy migration support
- **Real-time Capabilities**: Supabase real-time subscriptions ready
- **Secure by Default**: Row Level Security (RLS) policies and authentication

## Project Structure (Next.js 14 App Router)

```
FastMVP-Core/
├── src/
│   ├── app/                      # App Router pages (Next.js 14)
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page with SaaS UI
│   │   ├── globals.css          # Global styles
│   │   ├── new-project/         # Onboarding wizard
│   │   │   ├── page.tsx         # Step 1: Project details
│   │   │   ├── team/
│   │   │   │   └── page.tsx     # Step 2: Team setup
│   │   │   ├── stack/
│   │   │   │   └── page.tsx     # Step 3: Tech stack
│   │   │   └── confirm/
│   │   │       └── page.tsx     # Step 4: Confirmation
│   │   ├── projects/            # Projects dashboard
│   │   ├── api/                 # API routes
│   │   └── [...other routes]
│   ├── components/
│   │   ├── seo/
│   │   │   ├── MetaTags.tsx
│   │   │   ├── StructuredData.tsx
│   │   │   └── SocialMeta.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── MainLayout.tsx
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   ├── api.ts               # API helpers
│   │   └── auth.ts              # Authentication utilities
│   └── styles/
├── prisma/
│   └── schema.prisma            # Data model definitions
├── public/
│   └── assets/
├── .env.local.example
├── next.config.js
├── tsconfig.json
└── package.json
```

## Tech Stack

### Frontend
- **Next.js 14** - App Router with React Server Components
- **React 18** - Latest React features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time features
- **Prisma** - Type-safe ORM
- **NextAuth.js** - Authentication solution

### DevOps
- **Vercel** - Deployment platform
- **GitHub Actions** - CI/CD
- **ESLint & Prettier** - Code quality

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hermes08/FastMVP-Core.git
cd FastMVP-Core

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_postgres_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Features in Detail

### Modern SaaS UI
- Professional blue gradient hero section
- Responsive design optimized for all devices
- Clean, modern component library
- Smooth animations and transitions

### Onboarding Wizard
- Multi-step project creation flow
- Step 1: Project details (name, description)
- Step 2: Team configuration
- Step 3: Technology stack selection
- Step 4: Review and confirmation
- Progress tracking and validation

### Authentication
- Email/password authentication
- OAuth providers (Google, GitHub)
- Protected routes and API endpoints
- Session management

### Database
- PostgreSQL with Supabase
- Type-safe queries with Prisma
- Automatic migrations
- Row Level Security (RLS)

## Development Workflow

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev --name description  # Create migration

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- AWS Amplify
- Netlify
- Railway
- Self-hosted with Docker

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@fastmvp.dev
- 🐛 Issues: [GitHub Issues](https://github.com/Hermes08/FastMVP-Core/issues)
- 📖 Docs: [Documentation](https://docs.fastmvp.dev)

## Roadmap

- [ ] Multi-tenancy support
- [ ] Advanced analytics dashboard
- [ ] Email templates and notifications
- [ ] Payment integration (Stripe)
- [ ] Admin panel
- [ ] Mobile app (React Native)

---

Built with ❤️ using Next.js 14 App Router
