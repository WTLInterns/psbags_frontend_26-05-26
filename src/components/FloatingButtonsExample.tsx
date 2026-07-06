'use client';

import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

// Example of how to use floating buttons in a specific page
const FloatingButtonsExample = () => {
  return (
    <div className="relative min-h-screen">
      {/* Your page content here */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Your Page Content</h1>
        <p>This is an example of how to add floating buttons to a specific page.</p>
      </div>

      {/* Floating Buttons - Only for this page */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/918983434817?text=Hi%20Regaloo,%20I%20want%20to%20know%20more."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="text-2xl" />
          
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat on WhatsApp
          </div>
        </a>

        {/* Call Button */}
        <a
          href="tel:+918983434817"
          className="w-14 h-14 bg-[#007BFF] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Call us"
        >
          <FaPhoneAlt className="text-xl" />
          
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Call us now
          </div>
        </a>
      </div>
    </div>
  );
};

export default FloatingButtonsExample;