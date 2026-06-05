'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ShippingPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
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
            <span className="text-black font-medium">Shipping Policy</span>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Order Processing</h2>
            <p>
              Orders are typically processed within 1–3 business days after payment confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Delivery Timeline</h2>
            <p>
              Standard delivery usually takes 3–10 business days depending on the destination location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Shipping Charges</h2>
            <p>
              Shipping charges, if applicable, will be displayed during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Delivery Partners</h2>
            <p>
              We work with trusted courier partners to ensure safe and timely delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Tracking Information</h2>
            <p>
              Customers will receive tracking details via email, SMS, or WhatsApp once the order has been shipped.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Delays</h2>
            <p>
              Delivery timelines may occasionally be affected by weather conditions, holidays, logistics issues, or unforeseen circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Incorrect Address</h2>
            <p>
              Customers are responsible for providing accurate shipping information. We are not responsible for delays caused by incorrect addresses provided during checkout.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicyPage;
