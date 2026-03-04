import React from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Column 1 - Brand & About */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src="https://i.postimg.cc/fTSqrR8w/Screenshot-2026-01-24-125133.png"
                className="h-10 w-auto object-contain brightness-0 invert"
                alt="Nextgen Logo"
              />
            </Link>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
              Your premier destination for high-end computing components and custom PC builds in Cambodia. We bring you the latest technology with world-class service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                <FacebookFilled style={{ fontSize: '20px' }} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                <InstagramFilled style={{ fontSize: '20px' }} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                <TwitterSquareFilled style={{ fontSize: '20px' }} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                <LinkedinFilled style={{ fontSize: '20px' }} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Categories</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/categories/Rog" className="hover:text-emerald-500 transition-colors">ROG Series</Link></li>
              <li><Link to="/categories/Msi" className="hover:text-emerald-500 transition-colors">MSI Gaming</Link></li>
              <li><Link to="/categories/Apple" className="hover:text-emerald-500 transition-colors">Apple Ecosystem</Link></li>
              <li><Link to="/categories/Accessoris" className="hover:text-emerald-500 transition-colors">Accessories</Link></li>
              <li><Link to="/categories/CustomePcbuild" className="hover:text-emerald-500 transition-colors">Custom Builds</Link></li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/warranty" className="hover:text-emerald-500 transition-colors">Warranty Info</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Get In Touch</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <EnvironmentOutlined className="text-emerald-500 mt-1" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneOutlined className="text-emerald-500" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <MailOutlined className="text-emerald-500" />
                <span>support@nextgen.com</span>
              </li>
              <li className="mt-6">
                <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
                  <img src='https://i.postimg.cc/BQhZMN7L/IMG-4906.jpg' className='w-24 h-24 object-contain rounded-lg' alt="QR Code" />
                </div>
                <p className="text-[10px] mt-2 text-slate-500 font-bold uppercase tracking-widest">Scan for Telegram</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {currentYear} Nextgen. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Build with <span className="text-red-500">❤️</span> for the Gaming Community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
