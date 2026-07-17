'use client';

import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { useState } from 'react';

const FloatingButtons = () => {
  const [whatsappHover, setWhatsappHover] = useState(false);
  const [callHover, setCallHover] = useState(false);

//   <a
//   href="https://wa.me/918983434817"
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   <FaWhatsapp />
// </a>

//   <a href="tel:+918983434817">
//   <FaPhoneAlt />
// </a>

  return (
    <>
      {/* WhatsApp Button - Bottom Right */}
     <div className="fixed bottom-5 right-5 z-50">
  <a
    href="https://wa.me/918983434817"
    target="_blank"
    rel="noopener noreferrer"
    className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
    aria-label="Contact us on WhatsApp"
  >
    <FaWhatsapp className="text-lg sm:text-2xl" />
  </a>
</div>

      {/* Call Button - Bottom Left */}
      <div className="fixed bottom-5 left-5 z-50">
  <a
    href="tel:+918983434817"
    className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#007BFF] text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
    aria-label="Call us"
  >
    <FaPhoneAlt className="text-base sm:text-xl" />
  </a>
</div>
    </>
  );
};

export default FloatingButtons;