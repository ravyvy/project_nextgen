// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // if using React Router
// import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';  ← optional

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Column 1 - Brand / About */}
          <div>
            <h3 className="text-green-600 text-lg font-semibold mb-4" >Nextgen</h3>
            <p className="text-sm">
              Building beautiful digital experiences since {currentYear}.
            </p>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Lattops</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">CustomePcbuild</Link></li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 - Social (optional) */}
          <div>
            <h4 className="text-white font-medium mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Replace with your real links */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {/* <FaFacebook size={20} /> */} FB
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {/* <FaInstagram size={20} /> */} IG
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {/* <FaTwitter size={20} /> */} X
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {/* <FaLinkedin size={20} /> */} LI
              </a>
            </div>
          </div>
           {/* Column 3 - conte */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li> QR Code </li>
             <li>
                <img src='https://i.postimg.cc/BQhZMN7L/IMG-4906.jpg' className='w-20' />
             </li>
             <li>Scan Now 🤷‍♀️</li>
            </ul>
          </div>
        </div>
        

        {/* Bottom bar */}
        <div className="text-red-600 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {currentYear} Nextgen. All rights reserved.</p>
          <p className="mt-2 text-gray-500">Made with ❤️ in Phnom Penh</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;