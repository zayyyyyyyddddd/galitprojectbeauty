
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, LogIn } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="relative z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-bold italic">Ila's<span className="text-skin-gold">Beauty</span></h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-skin-gold transition-colors">Home</Link>
            <Link to="/shop" className="text-foreground hover:text-skin-gold transition-colors">Shop</Link>
            <Link to="/bestsellers" className="text-foreground hover:text-skin-gold transition-colors">Bestsellers</Link>
            <Link to="/about" className="text-foreground hover:text-skin-gold transition-colors">About</Link>
            <Link to="/contact" className="text-foreground hover:text-skin-gold transition-colors">Contact</Link>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-skin-gold">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-skin-gold" asChild>
              <Link to="/auth">
                <User size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-skin-gold">
              <ShoppingBag size={20} />
              <span className="absolute top-0 right-0 bg-skin-gold text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">0</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-20 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-skin-gold py-2 transition-colors" onClick={toggleMobileMenu}>Home</Link>
              <Link to="/shop" className="text-foreground hover:text-skin-gold py-2 transition-colors" onClick={toggleMobileMenu}>Shop</Link>
              <Link to="/bestsellers" className="text-foreground hover:text-skin-gold py-2 transition-colors" onClick={toggleMobileMenu}>Bestsellers</Link>
              <Link to="/about" className="text-foreground hover:text-skin-gold py-2 transition-colors" onClick={toggleMobileMenu}>About</Link>
              <Link to="/contact" className="text-foreground hover:text-skin-gold py-2 transition-colors" onClick={toggleMobileMenu}>Contact</Link>
            </nav>
            <div className="flex items-center space-x-4 mt-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Search size={18} />
                <span>Search</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2" asChild>
                <Link to="/auth" onClick={toggleMobileMenu}>
                  <User size={18} />
                  <span>Account</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <span>Cart (0)</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
