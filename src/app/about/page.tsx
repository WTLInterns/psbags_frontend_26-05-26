'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-gray-300 text-lg">
              Welcome to REGALOO BY PS.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-medium">About Us</span>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to REGALOO BY PS.
          </p>
          <p>
            We are passionate about creating high-quality bags that combine style, durability, and functionality.
          </p>
          <p>
            Our mission is to provide reliable travel, business, and everyday carry solutions for individuals and organizations. In addition to retail customers, we also serve corporate gifting requirements, wholesale buyers, and distribution partners across India.
          </p>
          <p>
            Every product is selected with a focus on quality, practicality, and customer satisfaction.
          </p>
          <p>
            Whether you’re purchasing a single bag for personal use or sourcing products in bulk for your business, we are committed to delivering value, reliability, and excellent service.
          </p>
          <p className="font-medium">
            Thank you for choosing REGALOO BY PS.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
