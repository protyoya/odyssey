import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Profile from './pages/Profile';
import KYC from './pages/Kyc'
import Geofencing from './components/Geofencing'
import SOS from './pages/SOS'
import Places from './pages/Places'


import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/geofencing" element={<Geofencing />} />
            <Route path="/sos" element={<SOS />} />
            <Route path="/places" element={<Places />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;