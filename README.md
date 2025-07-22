# SportRadar Frontend Exercise

This is a React + Vite project styled with Bootstrap 5, designed for managing and viewing sports events.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd SportRadar_BE_Exercise_Frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

> **Note:**
> Make sure your backend API is running and accessible at `http://localhost:8000` for full functionality (fetching events, sports, teams, etc.).

## App Structure & Pages

- **Navbar:**
  - Fixed at the top, styled with a dark blue/red/white theme inspired by [sportradar.com](https://sportradar.com).
  - Links to all main pages.

- **Pages:**
  - **Home:** Welcome page.
  - **Events:**
    - Displays a responsive, styled table of all events (fetched from `/eventResults`).
    - Shows event date, time, sport, and both teams.
  - **Add Event:**
    - Form to create a new event and assign two teams.
    - Fetches available sports and teams from the backend.
    - Validates input and submits to `/events` and `/eventTeam` endpoints.

## Technologies Used
- React
- Vite
- Bootstrap 5
- React Router DOM


