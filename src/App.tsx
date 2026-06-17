import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Teams = lazy(() => import('./pages/Teams'));
const TeamDetail = lazy(() => import('./pages/TeamDetail'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Standings = lazy(() => import('./pages/Standings'));
const Venues = lazy(() => import('./pages/Venues'));
const VenueDetail = lazy(() => import('./pages/VenueDetail'));
const Bracket = lazy(() => import('./pages/Bracket'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:shortName" element={<TeamDetail />} />
            <Route path="/players/:teamCode/:playerName" element={<PlayerDetail />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:venueId" element={<VenueDetail />} />
            <Route path="/bracket" element={<Bracket />} />
            <Route path="/match/:eventId" element={<MatchDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
