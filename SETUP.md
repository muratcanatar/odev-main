# NBA Stats Hub - Setup & Deployment Guide

## Project Overview

A comprehensive NBA statistics and analytics platform with:
- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, and Radix UI
- **Backend**: Flask API (Python) with MySQL database
- **Deployment**: Google Cloud Run (Backend) + Vercel/Custom hosting (Frontend)

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/muratcanatar/Desktop/nba/nba
npm install
```

### 2. Environment Setup

The `.env.local` file is already configured with your production backend:

```env
NEXT_PUBLIC_API_URL=https://nba-backend-391303839683.europe-west1.run.app
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
nba/
├── app/                        # Next.js App Router
│   ├── admin/                  # Admin Panel
│   │   ├── page.tsx           # Dashboard
│   │   └── teams/             # Team Management
│   ├── player/[id]/           # Player Details
│   ├── team/[id]/             # Team Details
│   ├── players/               # Players List
│   ├── teams/                 # Teams List
│   ├── standings/             # Standings
│   ├── schedule/              # Schedule/Fixtures
│   ├── stats/                 # League Leaders
│   └── page.tsx               # Home
├── components/
│   ├── ui/                    # Radix UI Components
│   └── site-header.tsx        # Navigation
├── lib/
│   └── api/                   # API Client & Hooks
└── public/                    # Static Assets
```

## Available Pages

### Public Pages
- `/` - Home page with league leaders and standings
- `/teams` - All NBA teams
- `/team/[id]` - Team details with roster
- `/players` - All players with search
- `/player/[id]` - Player details with stats
- `/standings` - Conference standings
- `/schedule` - Fixtures and schedule
- `/stats` - League leaders by category

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/teams` - Team management (CRUD)

## Features Implemented

### Frontend Features
✅ Modern, responsive UI with Tailwind CSS
✅ Typed API client with SWR for data fetching
✅ Real-time search functionality
✅ Conference filtering (East/West)
✅ Season type toggle (Regular/Playoffs)
✅ Player and team statistics
✅ Admin panel with CRUD operations
✅ Toast notifications (Sonner)
✅ Loading states and error handling
✅ Image optimization with Next.js Image

### Backend Integration
✅ All API endpoints connected
✅ Pagination support
✅ Query parameter filtering
✅ Error handling with custom ApiError
✅ Request timeout management (8s default)
✅ Type-safe API responses

## UI Components Available

All Radix UI components are configured:
- ✅ Button, Badge, Card
- ✅ Tabs, Input, Label
- ✅ Dialog, AlertDialog
- ✅ Select dropdown
- ✅ Toast notifications (Sonner)

## API Endpoints

### Players
- GET `/api/v1/players` - List players
- GET `/api/v1/players/:id` - Player details
- GET `/api/v1/players/search?q=name` - Search
- POST `/api/v1/players` - Create (admin)
- PUT `/api/v1/players/:id` - Update (admin)
- DELETE `/api/v1/players/:id` - Delete (admin)

### Teams
- GET `/api/v1/teams` - List teams
- GET `/api/v1/teams/:id` - Team details with roster
- GET `/api/v1/teams/standings` - Standings
- POST `/api/v1/admin/teams` - Create (admin)
- PUT `/api/v1/admin/teams/:id` - Update (admin)
- DELETE `/api/v1/admin/teams/:id` - Delete (admin)

### Fixtures
- GET `/api/v1/fixtures` - List fixtures
- GET `/api/v1/fixtures/:id` - Fixture details

### Stats
- GET `/api/v1/stats/leaders?category=PTS&season=REGULAR` - Leaders
- GET `/api/v1/stats/complex` - Complex stats
- GET `/api/v1/stats/team-comparison?team1=1&team2=2` - Compare

### Admin
- GET `/api/v1/admin/dashboard` - Dashboard stats

## Common Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Troubleshooting

### Port already in use
If port 3000 is in use, Next.js will automatically use 3001 or the next available port.

### API Connection Issues
Verify the backend is running:
```bash
curl https://nba-backend-391303839683.europe-west1.run.app/api/v1/health
```

### Missing Dependencies
```bash
npm install
```

### Build Errors
Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Manual Deployment
```bash
npm run build
# Upload .next, public, package.json to server
npm run start
```

## Next Steps

1. **Test all features** - Browse through pages and test functionality
2. **Add more admin pages** - Players, Fixtures, Arenas CRUD
3. **Customize styling** - Adjust colors, fonts in `app/globals.css`
4. **Add authentication** - Protect admin routes
5. **Deploy to production** - Use Vercel or your preferred platform

## Support

For issues or questions:
- Check console for errors
- Verify API is accessible
- Review network tab in browser DevTools
- Check backend logs on Google Cloud Run

## Notes

- Backend URL is configured for production
- All API calls include automatic timeout (8s)
- SWR handles caching and revalidation
- Toast notifications appear for all admin actions
- Images are optimized via Next.js Image component
