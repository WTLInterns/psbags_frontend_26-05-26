'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const FooterWithFallback = () => {
  return (
    <footer className="bg-white">
      {/* Main Footer Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
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
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="WhatsApp"
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
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    Refund Policy
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
        </div>
      </div>

      {/* Payment & Copyright Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Payment Security Heading */}
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-4">100% SECURE PAYMENT</p>
            </div>
            
            {/* Payment Logos - Centered with Next.js Image and Fallback */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* Paytm */}
              <div className="relative h-6 sm:h-8 w-16 sm:w-20 hover:scale-110 transition-transform duration-200">
                <Image 
                  src="/images/Paytm_Logo.png" 
                  alt="Paytm" 
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to styled div if image fails
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-16 sm:w-20 h-6 sm:h-8 bg-blue-600 rounded-sm items-center justify-center">
                  <span className="text-white text-xs font-bold">Paytm</span>
                </div>
              </div>
              
              {/* Google Pay */}
              <div className="relative h-6 sm:h-8 w-16 sm:w-20 hover:scale-110 transition-transform duration-200">
                <Image 
                  src="/images/google-pay-logo.webp" 
                  alt="Google Pay" 
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-16 sm:w-20 h-6 sm:h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-sm items-center justify-center">
                  <span className="text-white text-xs font-bold">GPay</span>
                </div>
              </div>
              
              {/* PhonePe */}
              <div className="relative h-6 sm:h-8 w-16 sm:w-20 hover:scale-110 transition-transform duration-200">
                <Image 
                  src="/images/phonepe_logo.png" 
                  alt="PhonePe" 
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-16 sm:w-20 h-6 sm:h-8 bg-purple-600 rounded-sm items-center justify-center">
                  <span className="text-white text-xs font-bold">PhonePe</span>
                </div>
              </div>
              
              {/* Mastercard */}
              <div className="relative h-6 sm:h-8 w-16 sm:w-20 hover:scale-110 transition-transform duration-200">
                <Image 
                  src="/images/mastercard-logo.png" 
                  alt="Mastercard" 
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-16 sm:w-20 h-6 sm:h-8 bg-red-500 rounded-sm items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
              </div>
              
              {/* Razorpay */}
              <div className="relative h-6 sm:h-8 w-16 sm:w-20 hover:scale-110 transition-transform duration-200">
                <Image 
                  src="/images/razorpay-logo.png" 
                  alt="Razorpay" 
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-16 sm:w-20 h-6 sm:h-8 bg-blue-800 rounded-sm items-center justify-center">
                  <span className="text-white text-xs font-bold">Razor</span>
                </div>
              </div>
              
              {/* UPI */}
              <div className="relative h-6 sm:h-8 w-16 sm:w-20 hover:scale-110 transition-transform duration-200">
                <Image 
                  src="/images/upi-logo.png" 
                  alt="UPI" 
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-16 sm:w-20 h-6 sm:h-8 bg-orange-500 rounded-sm items-center justify-center">
                  <span className="text-white text-xs font-bold">UPI</span>
                </div>
              </div>
            </div>

            {/* Copyright - Below Payment Logos */}
            <div className="pt-4 border-t border-gray-300 w-full max-w-md">
              <p className="text-sm text-gray-600 font-medium">Copyright 2026 © <span className="font-semibold">regaloobyps.com</span> Made with in India</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterWithFallback;