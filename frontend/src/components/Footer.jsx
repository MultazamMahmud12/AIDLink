import { FiHeart, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FiHeart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">AIDLink</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting communities in crisis with global support. Together, we can make a difference in times of need.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-primary font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link to="/events" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Browse Crises
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link to="/how-it-works" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                How It Works
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-primary font-semibold">Support</h3>
            <nav className="space-y-2">
              <Link to="/help" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Help Center
              </Link>
              <Link to="/donate" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Start a Fundraiser
              </Link>
              <Link to="/safety" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Safety & Security
              </Link>
              <Link to="/guidelines" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                Community Guidelines
              </Link>
              <Link to="/faq" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-primary font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Relief Street<br />
                  Global City, GC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@aidlink.org</span>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mt-4">
              <p className="text-red-200 text-xs font-medium mb-1">24/7 Emergency Support</p>
              <p className="text-red-100 text-sm font-bold">Emergency: +1 (555) 911-HELP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Stay Updated on Crisis Response</h3>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              Get notified about new crises, emergency alerts, and how your donations are making an impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2025 AIDLink. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <FiHeart className="h-4 w-4 text-red-500" />
              <span>for humanitarian aid</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
