import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Teams = lazy(() => import('./pages/Teams'));
const TeamDetail = lazy(() => import('./pages/TeamDetail'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Standings = lazy(() => import('./pages/Standings'));
const Venues = lazy(() => import('./pages/Venues'));
const VenueDetail = lazy(() => import('./pages/VenueDetail'));
const Bracket = lazy(() => import('./pages/Bracket'));
const BracketPredict = lazy(() => import('./pages/BracketPredict'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));
const DataHub = lazy(() => import('./pages/DataHub'));
const Compare = lazy(() => import('./pages/Compare'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LegacyMatchRedirect() {
  const { matchId } = useParams();
  return <Navigate to={`/match/${matchId ?? ''}`} replace />;
}

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
        <ErrorBoundary>
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
            <Route path="/bracket-predict" element={<BracketPredict />} />
            <Route path="/matches/:matchId" element={<LegacyMatchRedirect />} />
            <Route path="/match/:eventId" element={<MatchDetail />} />
            <Route path="/data" element={<DataHub />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}
