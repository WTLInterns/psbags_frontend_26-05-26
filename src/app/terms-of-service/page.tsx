'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
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
            <span className="text-black font-medium">Terms & Conditions</span>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <p>Welcome to REGALOO BY PS.</p>
            <p>By accessing and using this website, you agree to the following terms and conditions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Products</h2>
            <p>
              We strive to display products as accurately as possible. However, slight variations in color, size, or appearance may occur due to screen settings and photography.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Pricing</h2>
            <p>
              All prices are listed in Indian Rupees (INR). Prices may be updated without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Orders</h2>
            <p>
              We reserve the right to accept, reject, or cancel any order at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Payments</h2>
            <p>
              Orders will be processed only after successful payment confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
            <p>
              All content on this website, including logos, product images, designs, graphics, and text, is the property of REGALOO BY PS and may not be copied or used without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Corporate Gifting & Wholesale</h2>
            <p>
              Corporate gifting and wholesale inquiries are subject to separate quotations, availability, minimum order quantities, and business terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or our products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time without prior notice.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
