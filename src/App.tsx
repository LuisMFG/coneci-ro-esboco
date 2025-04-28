import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VotingForm from './components/VotingForm';
import VotingResults from './components/VotingResults';
import Footer from './components/Footer';
import { initializeCandidates } from './utils/firebase-storage';
import './styles/animations.css';

function App() {
  useEffect(() => {
    initializeCandidates();
    
    document.title = 'CONECI-RO | Eleição Presidencial';
  }, []);

  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <VotingForm />
      <VotingResults />
      <Footer />
    </div>
  );
}

export default App;