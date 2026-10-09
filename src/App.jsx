import { Routes, Route, Link } from 'react-router-dom';
import DashboardHome from './components/AboutMe';
import Profile from './components/Profile';
import Hobby from './components/Hobby';
import Game from './components/Games';


export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', margin: 0, overflow: 'hidden' }}>
      {/* 🧭 Sidebar Navigation */}
      <nav style={{
        width: '240px', 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 10
      }}>
        <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #475569', paddingBottom: '10px' }}>
           Dashboard
        </h3>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Me</Link>
        <Link to="/hobby" style={{ color: 'white', textDecoration: 'none' }}>Hobbies</Link>
        <Link to="/play" style={{ color: 'white', textDecoration: 'none' }}>my most favourite work</Link>
      </nav>

      {/* 🖥️ Main Content Area Routes Layout Mapping */}
      <Routes>
        <Route path="/" element={<main style={{ flex: 1, padding: '40px', backgroundColor: '#f8fafc' }}><DashboardHome /></main>} />
        <Route path="/about" element={<main style={{ flex: 1, padding: '40px', backgroundColor: '#f8fafc' }}><Profile /></main>} />
        <Route path="/hobby" element={<main style={{ flex: 1, padding: '40px', backgroundColor: '#f8fafc' }}><Hobby /></main>} />
        <Route path="/play" element={<main style={{ flex: 1, padding: 0, backgroundColor: 'black', position: 'relative' }}><Game /></main>} />
      </Routes>
    </div>
  );
}
