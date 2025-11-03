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
- **Secure by Default**: Row Level Security (RLS) policies and authentication

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
│   │   └── auth.ts (Authentication utilities)
│   ├── pages/
│   │   ├── api/ (API routes)
│   │   ├── articles/
│   │   ├── projects/
│   │   └── [...routes]
│   └── styles/
├── prisma/
│   └── schema.prisma (Data model definitions)
├── scripts/
│   └── supabase_setup.sql (Database schema with RLS)
├── public/
├── .env.example
├── next.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Hermes08/FastMVP-Core.git
cd FastMVP-Core
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`

## Database Setup (Supabase)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Note your project URL and API keys

### 2. Run the Setup Script

Execute the SQL setup script to create all tables, indexes, and Row Level Security policies:

```sql
-- Option 1: Use Supabase SQL Editor
-- 1. Open your project in Supabase
-- 2. Go to SQL Editor
-- 3. Create a new query
-- 4. Copy the entire content from scripts/supabase_setup.sql
-- 5. Execute the query

-- Option 2: Using psql (if you have PostgreSQL client installed)
psql -h [your-supabase-host] -U postgres -d postgres < scripts/supabase_setup.sql
```

The setup script creates:
- **Users** table with authentication integration
- **Articles** table for blog/content management
- **Projects** table for portfolio/project showcase
- **Images** table for asset management
- Row Level Security policies for data protection
- Performance indexes
- Test seed data

### 3. Schema Overview

#### Users Table
```sql
- id: BIGSERIAL (Primary Key)
- email: VARCHAR (UNIQUE)
- name: VARCHAR
- password: VARCHAR (hashed)
- role: ENUM (ADMIN, USER, EDITOR)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Articles Table
```sql
- id: BIGSERIAL (Primary Key)
- title: VARCHAR
- content: TEXT
- slug: VARCHAR (UNIQUE)
- published: BOOLEAN
- user_id: BIGINT (Foreign Key → users.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Projects Table
```sql
- id: BIGSERIAL (Primary Key)
- title: VARCHAR
- description: TEXT
- slug: VARCHAR (UNIQUE)
- featured: BOOLEAN
- user_id: BIGINT (Foreign Key → users.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Images Table
```sql
- id: BIGSERIAL (Primary Key)
- url: VARCHAR (UNIQUE)
- alt: VARCHAR
- caption: TEXT
- user_id: BIGINT (Foreign Key → users.id)
- article_id: BIGINT (Foreign Key → articles.id, nullable)
- project_id: BIGINT (Foreign Key → projects.id, nullable)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Row Level Security (RLS)

All tables have Row Level Security policies enabled for security:

### Users Table Policies
- **SELECT**: Public read access (everyone can view user profiles)
- **UPDATE**: Users can only update their own profile
- **INSERT**: Users can create their own profile
- **DELETE**: Only admins can delete users

### Articles Table Policies
- **SELECT (Published)**: Everyone can see published articles
- **SELECT (Own)**: Users can see their own articles (published or not)
- **INSERT**: Authenticated users can create articles
- **UPDATE**: Users can only update their own articles
- **DELETE**: Users can only delete their own articles

### Projects Table Policies
- **SELECT**: Everyone can see all projects
- **INSERT**: Authenticated users can create projects
- **UPDATE**: Users can only update their own projects
- **DELETE**: Users can only delete their own projects

### Images Table Policies
- **SELECT**: Everyone can view all images
- **INSERT**: Authenticated users can upload images
- **UPDATE**: Users can only modify their own images
- **DELETE**: Users can only delete their own images

## Prisma Setup

### Initialize Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# or
yarn prisma generate
```

### Database Migrations

```bash
# Create a new migration
npm run prisma:migrate:create -- --name initial

# Apply migrations
npm run prisma:migrate:deploy

# Push schema to database (development)
npm run prisma:db:push
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Database
DATABASE_URL=postgresql://postgres:password@your-project.supabase.co:5432/postgres

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your FastMVP-Core repository
5. Configure environment variables (same as `.env.local`)
6. Click "Deploy"

**Connected Services:**
- ✅ Supabase (Database & Authentication)
- ✅ GitHub (Version Control)
- ✅ Vercel (Hosting & Deployment)

### Production Checklist

- [ ] Set up custom domain in Vercel
- [ ] Configure Supabase password authentication policies
- [ ] Set up Supabase email templates
- [ ] Enable HTTPS and security headers
- [ ] Configure CORS in Supabase
- [ ] Set up monitoring and logging
- [ ] Test RLS policies thoroughly
- [ ] Backup database configuration

## API Routes

Example API endpoints:

```bash
# Articles
GET  /api/articles          # Get all published articles
GET  /api/articles/[id]     # Get article by ID
POST /api/articles          # Create new article (authenticated)
PUT  /api/articles/[id]     # Update article (owner only)
DELETE /api/articles/[id]   # Delete article (owner only)

# Projects
GET  /api/projects          # Get all projects
GET  /api/projects/[id]     # Get project by ID
POST /api/projects          # Create new project (authenticated)
PUT  /api/projects/[id]     # Update project (owner only)
DELETE /api/projects/[id]   # Delete project (owner only)

# Images
GET  /api/images            # Get all images
GET  /api/images/[id]       # Get image by ID
POST /api/images            # Upload image (authenticated)
DELETE /api/images/[id]     # Delete image (owner only)
```

## Development

```bash
# Run development server
npm run dev
# or
yarn dev

# Open http://localhost:3000 in your browser
```

## Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure Supabase Auth is properly configured
   - Verify auth.uid() is returning correct user ID
   - Check that auth.roles() contains correct role

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase project is active
   - Ensure IP whitelist allows your connection

3. **Prisma Issues**
   - Run `npm run prisma:generate` to regenerate client
   - Check schema.prisma syntax
   - Verify database connection string

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@fastmvp.com or open an issue on GitHub.

## Roadmap

- [ ] Email notifications system
- [ ] Advanced search and filtering
- [ ] Multi-language support (i18n)
- [ ] Analytics dashboard
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting and API quotas
- [ ] GraphQL API layer
- [ ] WebSocket real-time features

## Authors

- **FastMVP Team** - Initial work - [GitHub](https://github.com/Hermes08)

## Acknowledgments

- Next.js for the amazing framework
- Supabase for the database and auth solution
- Vercel for hosting and deployment
- Prisma for the powerful ORM
