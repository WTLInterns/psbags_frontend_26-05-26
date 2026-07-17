'use client';

import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaPlus, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const FloatingButtonsAdvanced = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/918983434817', '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+918983434817', '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:regaloobyps@gmail.com', '_self');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Main Menu Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-black text-white rounded-full shadow-lg hover:shadow-2xl transform transition-all duration-300 flex items-center justify-center mb-4 ${
          isMenuOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
        aria-label="Toggle contact menu"
      >
        {isMenuOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaPlus className="text-xl" />
        )}
      </button>

      {/* Floating Action Buttons */}
      <div className={`flex flex-col space-y-3 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="text-lg" />
          
          {/* Tooltip */}
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            WhatsApp
          </div>
        </button>

        {/* Call Button */}
        <button
          onClick={handleCallClick}
          className="w-12 h-12 bg-[#007BFF] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
          aria-label="Call us"
        >
          <FaPhoneAlt className="text-sm" />
          
          {/* Tooltip */}
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Call
          </div>
        </button>

        {/* Email Button */}
        <button
          onClick={handleEmailClick}
          className="w-12 h-12 bg-[#EA4335] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
          aria-label="Email us"
        >
          <FaEnvelope className="text-sm" />
          
          {/* Tooltip */}
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Email
          </div>
        </button>
      </div>
    </div>
  );
};

export default FloatingButtonsAdvanced;