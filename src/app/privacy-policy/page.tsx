'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-300 text-lg">
              At REGALOO BY PS, we value your privacy and are committed to protecting your personal information.
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
            <span className="text-black font-medium">Privacy Policy</span>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <p>
              At REGALOO BY PS, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>
            <p className="mb-4">When you use our website, we may collect:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Billing and Shipping Address</li>
              <li>Order Details</li>
              <li>Payment Information (processed securely through payment gateways)</li>
              <li>Website usage information through cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Process and fulfill orders</li>
              <li>Provide customer support</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Improve our products and services</li>
              <li>Respond to inquiries and requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Payment Security</h2>
            <p>
              All online transactions are processed through secure and encrypted payment gateways. We do not store complete credit card, debit card, or banking details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Information Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information. Information may be shared only with trusted partners such as payment processors, courier companies, and service providers necessary to complete your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Cookies</h2>
            <p>
              Our website may use cookies to improve user experience, remember preferences, and analyze website traffic.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Data Protection</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal information by contacting us.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
            <p className="mb-2">Email: <a href="mailto:regaloobyps@gmail.com" className="text-black hover:underline">regaloobyps@gmail.com</a></p>
            <p>Phone: 8983434817</p>
          </section>

          <section className="text-center pt-8 border-t border-gray-200">
            <p className="font-medium">By using our website, you agree to this Privacy Policy.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
