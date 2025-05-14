
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-skin-beige/70">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-serif font-bold italic">Glow<span className="text-skin-gold">Vogue</span></h2>
            </Link>
            <p className="text-muted-foreground mb-6">
              Premium skincare products for your daily self-care ritual. Clean beauty for radiant skin.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-skin-gold transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-skin-gold transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-skin-gold transition" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-muted-foreground hover:text-skin-gold transition">All Products</Link></li>
              <li><Link to="/bestsellers" className="text-muted-foreground hover:text-skin-gold transition">Bestsellers</Link></li>
              <li><Link to="/new-arrivals" className="text-muted-foreground hover:text-skin-gold transition">New Arrivals</Link></li>
              <li><Link to="/gift-sets" className="text-muted-foreground hover:text-skin-gold transition">Gift Sets</Link></li>
              <li><Link to="/skincare-quiz" className="text-muted-foreground hover:text-skin-gold transition">Skincare Quiz</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-skin-gold transition">About Us</Link></li>
              <li><Link to="/ingredients" className="text-muted-foreground hover:text-skin-gold transition">Our Ingredients</Link></li>
              <li><Link to="/sustainability" className="text-muted-foreground hover:text-skin-gold transition">Sustainability</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-skin-gold transition">Blog</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-skin-gold transition">Careers</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-skin-gold" />
                <span className="text-muted-foreground">123 Beauty Lane, Skincare City, SC 28412</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-skin-gold" />
                <span className="text-muted-foreground">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-skin-gold" />
                <span className="text-muted-foreground">hello@glowvogue.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {currentYear} GlowVogue. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-skin-gold transition">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-skin-gold transition">Terms of Service</Link>
              <Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-skin-gold transition">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
