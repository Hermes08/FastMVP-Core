# FastMVP-Core

A comprehensive Full-Stack Framework for building MVPs (Minimum Viable Products) at production scale. Designed to accelerate development while maintaining enterprise-grade code quality, security, and maintainability.

## Key Features

- **Full-Stack Architecture**: Next.js (Frontend/Backend) + Supabase (Database & Auth)
- **Production-Ready**: Includes authentication, database migrations, API routes, and deployment scripts
- **Type-Safe**: Built with TypeScript for runtime safety and IDE support
- **Scalable**: Component-based architecture with modular design patterns
- **SEO-Optimized**: Built-in SEO components and meta tag management
- **Database-Agnostic**: Prisma ORM with easy migration support
- **Real-time Capabilities**: Supabase real-time subscriptions ready

## Project Structure

```
FastMVP-Core/
├── src/
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
│   │   ├── db.ts (Supabase client)
│   │   ├── api.ts (API helpers)
│   │   ├── auth.ts (Authentication utilities)
│   │   └── utils.ts (General utilities)
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login.ts
│   │   │   │   ├── register.ts
│   │   │   │   └── logout.ts
│   │   │   ├── users/
│   │   │   │   ├── [id].ts
│   │   │   │   └── index.ts
│   │   │   └── health.ts
│   │   ├── _document.tsx
│   │   ├── _app.tsx
│   │   ├── index.tsx (Home)
│   │   ├── dashboard.tsx
│   │   ├── profile.tsx
│   │   └── 404.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── components.css
│   └── types/
│       ├── index.ts
│       ├── api.ts
│       └── models.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── init/
│           └── migration.sql
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── config.toml
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── .env.example
├── .env.local
├── .gitignore
├── next.config.js
├── tsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hermes08/FastMVP-Core.git
   cd FastMVP-Core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Visit `http://localhost:3000`

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Database migrations
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

## Core Technologies

### Frontend
- **Next.js 14**: React framework with SSR/SSG capabilities
- **React 18**: UI library
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

### Backend
- **Next.js API Routes**: Serverless functions
- **Prisma ORM**: Type-safe database client
- **Supabase**: PostgreSQL database, authentication, and real-time APIs

### DevTools
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Jest/React Testing Library**: Testing

## Authentication

Authentication is handled by Supabase:

```typescript
// Using Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Sign up
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

## Database

### Using Prisma

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create
await prisma.user.create({
  data: { email: 'user@example.com' }
})

// Read
await prisma.user.findUnique({
  where: { id: userId }
})

// Update
await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' }
})

// Delete
await prisma.user.delete({
  where: { id: userId }
})
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { status: 'ok' }
```

### Authentication
```
POST /api/auth/register
Body: { email, password }

POST /api/auth/login
Body: { email, password }

POST /api/auth/logout
```

### Users
```
GET /api/users - Get all users
GET /api/users/[id] - Get user by ID
PUT /api/users/[id] - Update user
DELETE /api/users/[id] - Delete user
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy with Docker

See `Dockerfile` for containerized deployment.

### Environment Variables for Production

Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (for Prisma)

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- TypeScript strict mode enabled
- ESLint configuration included
- Prettier for code formatting
- Husky pre-commit hooks recommended

## Performance Optimization

- Image optimization with Next.js Image
- Code splitting and lazy loading
- CSS-in-JS optimization
- API route optimization
- Database query optimization with Prisma

## Security

- Environment variables for sensitive data
- SQL injection prevention with Prisma
- XSS protection with React
- CSRF tokens in forms
- Rate limiting recommendations
- CORS configuration

## Troubleshooting

### Supabase Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys
- Check Supabase project is active
- Verify network connectivity

### Database Migration Issues
- Run `npx prisma migrate reset` (use with caution)
- Check Prisma schema syntax
- Verify database permissions

### Build Issues
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## License

MIT License - feel free to use this for your projects!

## Support

For issues and questions:
- GitHub Issues: [FastMVP-Core Issues](https://github.com/Hermes08/FastMVP-Core/issues)
- Documentation: [Full Docs](./docs)

## Roadmap

- [ ] GraphQL support
- [ ] WebSocket integration
- [ ] Advanced caching strategies
- [ ] Monitoring and analytics
- [ ] CLI tool for scaffolding
- [ ] Plugin system

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Built with ❤️ for the MVP community**
