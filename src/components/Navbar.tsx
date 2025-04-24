import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { FaHome, FaInfoCircle, FaVoteYea, FaChartBar } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-green-950/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 group">
              <img
                src="images\versão 2 logo teste (1).png"
                alt="Logo"
                className="w-42 h-24 object-contain"
              />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {[
              { href: '#inicio', icon: FaHome, label: 'Início' },
              { href: '#sobre', icon: FaInfoCircle, label: 'Sobre' },
              { href: '#votacao', icon: FaVoteYea, label: 'Votação' },
              { href: '#resultados', icon: FaChartBar, label: 'Resultados' }
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center space-x-2 font-medium text-white/90 hover:text-white px-5 py-3 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-green-950/95 backdrop-blur-md transition-all duration-300 ${isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="container mx-auto px-6 py-4 flex flex-col space-y-2">
          {[
            { href: '#inicio', icon: FaHome, label: 'Início' },
            { href: '#sobre', icon: FaInfoCircle, label: 'Sobre' },
            { href: '#votacao', icon: FaVoteYea, label: 'Votação' },
            { href: '#resultados', icon: FaChartBar, label: 'Resultados' }
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center space-x-3 font-medium text-white/90 hover:text-white px-5 py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
              onClick={toggleMenu}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;