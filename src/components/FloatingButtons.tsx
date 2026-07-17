'use client';

import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { useState } from 'react';

const FloatingButtons = () => {
  const [whatsappHover, setWhatsappHover] = useState(false);
  const [callHover, setCallHover] = useState(false);

  const handleWhatsAppClick = () => {
window.open('https://wa.me/918983434817', '_blank');
  };

  const handleCallClick = () => {
window.open('tel:+918983434817', '_self');
  };

  return (
    <>
      {/* WhatsApp Button - Bottom Right */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setWhatsappHover(true)}
          onMouseLeave={() => setWhatsappHover(false)}
          className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-200" />
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"></div>
          
          {/* Tooltip */}
          <div className={`absolute bottom-14 sm:bottom-16 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200 ${
            whatsappHover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            Chat on WhatsApp
            <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Call Button - Bottom Left */}
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={handleCallClick}
          onMouseEnter={() => setCallHover(true)}
          onMouseLeave={() => setCallHover(false)}
          className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#007BFF] text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none"
          aria-label="Call us"
        >
          <FaPhoneAlt className="text-base sm:text-xl group-hover:scale-110 transition-transform duration-200" />
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-[#007BFF] opacity-30 animate-ping"></div>
          
          {/* Tooltip */}
          <div className={`absolute bottom-14 sm:bottom-16 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200 ${
            callHover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            Call us now
            <div className="absolute top-full left-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>
    </>
  );
};

export default FloatingButtons;