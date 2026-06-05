'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Main Footer Section */}
      <div className="border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            
            {/* Brand Section */}
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-bold text-black tracking-tight mb-4">PS BAGS</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Premium fashion bags that define style, comfort, and sophistication. 
                  Discover the perfect blend of quality and contemporary design.
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex justify-center md:justify-start space-x-4">
                <a 
                  href="#" 
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
                {/* <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5" />
                </a> */}
                {/* <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a> */}
                <a 
                  href="#" 
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6 text-center md:text-left">
              <h4 className="text-lg font-semibold text-black">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=bags" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Designer Bags
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=travel" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Travel Bags
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    All Categories
                  </Link>
                </li>
                <li>
                  <Link href="/products?sale=true" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-6 text-center md:text-left">
              <h4 className="text-lg font-semibold text-black">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Return & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get In Touch */}
            <div className="space-y-6 text-center md:text-left">
              <h4 className="text-lg font-semibold text-black">Get In Touch</h4>
              <div className="space-y-4">
                <div className="flex items-start justify-center md:justify-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 text-sm leading-relaxed">
                    PS Bags, Pune, Maharashtra<br />
                    Pune, Maharashtra 400001
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <FiPhone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href="tel:+918983434817" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    +91 8983434817
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href="mailto:regaloobyps@gmail.com" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    regaloobyps@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

    {/* Payment & Copyright Section */}
<div className="flex justify-end mt-6">

<div className="flex flex-col space-y-2">

  {/* Payment Security Heading */}
  <p className="text-[10px] md:text-xs font-semibold tracking-wide text-gray-700 text-center">
    100% SECURE PAYMENT
  </p>

  {/* Payment Logos */}
  <div className="flex flex-wrap justify-end items-center gap-2 md:gap-3">

    <img
      src="/images/Paytm_Logo.png"
      alt="Paytm"
      className="h-4 md:h-6 w-auto object-contain hover:scale-105 transition duration-200"
    />

    <img
      src="/images/google-pay-logo.webp"
      alt="Google Pay"
      className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition duration-200"
    />

    <img
      src="/images/phonepe_logo.png"
      alt="PhonePe"
      className="h-4 md:h-6 w-auto object-contain hover:scale-105 transition duration-200"
    />

    <img
      src="/images/mastercard-logo.png"
      alt="Mastercard"
      className="h-4 md:h-6 w-auto object-contain hover:scale-105 transition duration-200"
    />

    <img
      src="/images/razorpay-logo.png"
      alt="Razorpay"
      className="h-7 md:h-8 w-auto object-contain hover:scale-105 transition duration-200"
    />

    <img
      src="/images/upi-logo.png"
      alt="UPI"
      className="h-4 md:h-5 w-auto object-contain hover:scale-105 transition duration-200"
    />

  </div>
</div>
</div>
        </div>
      </div>

      {/* Payment & Copyright Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-4 py-4">
            {/* Copyright - Below Payment Logos */}
              <p className="text-sm text-gray-600 font-medium text-center">
                Copyright 2026 © <span className="font-semibold">psbags.com</span> Made with <span className="text-red-500">❤️</span> in India
              </p>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
