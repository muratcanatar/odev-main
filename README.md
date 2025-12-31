# NBA Stats Hub

A comprehensive NBA statistics and analytics platform built with Next.js 16, featuring real-time player stats, team information, standings, schedules, and a complete admin panel for data management.

## Features

### Public Features
- **Home Page**: Dashboard with league leaders, standings, and quick stats
- **Teams**: Browse all NBA teams by conference with detailed team pages
- **Team Details**: View team rosters, statistics, and rankings
- **Players**: Search and browse all NBA players
- **Player Details**: Comprehensive player statistics and performance metrics
- **Standings**: Conference rankings with sortable team statistics
- **Schedule**: View upcoming and past games with venue information
- **Stats/Leaders**: League leaders across multiple statistical categories

### Admin Features
- **Dashboard**: Overview of all database statistics
- **Teams Management**: Full CRUD operations for teams
- **Players Management**: Add, edit, and delete players
- **Fixtures Management**: Manage game schedules
- **Arenas Management**: Edit venue information
- **Statistics Management**: Update player and team stats

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Data Fetching**: SWR
- **API Client**: Custom typed fetch wrapper
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form + Zod validation
- **Toast Notifications**: Sonner

## Backend API

The project connects to a Flask-based NBA backend API:
- **Production URL**: `https://nba-backend-391303839683.europe-west1.run.app`
- **Database**: MySQL (Cloud SQL)

### API Endpoints

#### Players
- `GET /api/v1/players` - List all players (with pagination)
- `GET /api/v1/players/:id` - Get player details with stats
- `GET /api/v1/players/search?q=name` - Search players
- `POST /api/v1/players` - Create player (admin)
- `PUT /api/v1/players/:id` - Update player (admin)
- `DELETE /api/v1/players/:id` - Delete player (admin)

#### Teams
- `GET /api/v1/teams` - List all teams
- `GET /api/v1/teams/:id` - Get team details with roster
- `GET /api/v1/teams/standings` - Get conference standings
- `GET /api/v1/teams/:id/arena` - Get team arena info
- `GET /api/v1/teams/:id/fixtures` - Get team schedule
- `POST /api/v1/admin/teams` - Create team (admin)
- `PUT /api/v1/admin/teams/:id` - Update team (admin)
- `DELETE /api/v1/admin/teams/:id` - Delete team (admin)

#### Fixtures
- `GET /api/v1/fixtures` - List all fixtures
- `GET /api/v1/fixtures/:id` - Get fixture details
- `POST /api/v1/admin/fixtures` - Create fixture (admin)
- `PUT /api/v1/admin/fixtures/:id` - Update fixture (admin)
- `DELETE /api/v1/admin/fixtures/:id` - Delete fixture (admin)

#### Stats
- `GET /api/v1/stats/leaders?category=PTS&season=REGULAR` - Get league leaders
- `GET /api/v1/stats/complex` - Get complex statistics
- `GET /api/v1/stats/team-comparison?team1=1&team2=2` - Compare teams

#### Admin
- `GET /api/v1/admin/dashboard` - Get admin dashboard stats
- `POST /api/v1/admin/players/:id/stats` - Add/update player stats
- `POST /api/v1/admin/teams/:id/ranking` - Add/update team ranking

## Project Structure

```
nba/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin panel
│   │   ├── page.tsx             # Admin dashboard
│   │   └── teams/               # Team management
│   ├── player/[id]/             # Player detail pages
│   ├── team/[id]/               # Team detail pages
│   ├── players/                 # Players listing
│   ├── teams/                   # Teams listing
│   ├── standings/               # Standings page
│   ├── schedule/                # Schedule/fixtures page
│   ├── stats/                   # Stats/leaders page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # UI components (Radix)
│   └── site-header.tsx          # Navigation header
├── lib/                         # Utilities and API
│   ├── api/                     # API client
│   │   ├── api-client.ts       # API functions
│   │   ├── client.ts           # Fetch wrapper
│   │   ├── hooks.ts            # SWR hooks
│   │   └── types.ts            # TypeScript types
│   └── utils.ts                # Utility functions
└── public/                      # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nba
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=https://nba-backend-391303839683.europe-west1.run.app
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Client Usage

The project includes a comprehensive typed API client. Example usage:

```typescript
import { playersApi, teamsApi } from '@/lib/api/api-client'

// Get all players
const players = await playersApi.getAll({ per_page: 20 })

// Get player by ID
const player = await playersApi.getById(123, { season: 'REGULAR' })

// Search players
const results = await playersApi.search('LeBron')

// Admin: Create team
await teamsApi.create({
  teamID: 1,
  teamName: 'Los Angeles Lakers',
  teamAbbreviation: 'LAL',
  conference: 'West'
})
```

### Using SWR Hooks

```typescript
import { usePlayers, useTeam, useLeaders } from '@/lib/api/hooks'

function MyComponent() {
  const { data, error, isLoading } = usePlayers({ per_page: 10 })
  const { data: teamData } = useTeam(1, { season: 'REGULAR' })
  const { data: leaders } = useLeaders({ category: 'PTS', limit: 5 })

  // ...
}
```

## Features Breakdown

### Home Page
- League leaders in points, assists, and rebounds
- Conference standings (top 5 teams)
- Quick stats cards
- Links to all major sections

### Teams Section
- Grid view of all NBA teams
- Filter by conference (East/West)
- Team logos and basic information
- Clickable cards leading to team details

### Team Detail Page
- Team header with logo and conference badge
- Team statistics (Win rank, Defensive rating, Steals, Blocks)
- Full roster with player cards
- Player averages (PPG, RPG, APG)

### Players Section
- Grid view of all players
- Search functionality by player name
- Player headshots and positions
- Links to player detail pages

### Standings Page
- Full conference standings
- Sortable by conference
- Win rank and defensive ratings
- Team logos and clickable rows

### Schedule Page
- List of all fixtures
- Game date and time
- Arena and city information
- Final scores for completed games

### Stats/Leaders Page
- Multiple stat categories (Points, Assists, Rebounds, Steals, Efficiency, FG%, 3P%, FT%)
- Switch between Regular Season and Playoffs
- Top 20 players per category
- Player headshots and team information

### Admin Panel
- Dashboard with database statistics
- CRUD operations for Teams
- CRUD operations for Players (coming soon)
- CRUD operations for Fixtures (coming soon)
- CRUD operations for Arenas (coming soon)
- Form validation
- Toast notifications for actions
- Confirmation dialogs for deletions

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
