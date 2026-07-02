'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ReturnRefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
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
            <span className="text-black font-medium">Return & Refund Policy</span>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Return Eligibility</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Returns must be requested within 7 days of delivery.</li>
              <li>Product must be unused and in original condition.</li>
              <li>Original packaging and tags must be intact.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Non Returnable Items</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Used products.</li>
              <li>Damaged products caused by misuse.</li>
              <li>Customized or bulk order products.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Refund Process</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>After inspection and approval, refunds will be processed within 7–10 business days.</li>
              <li>Refunds will be credited to the original payment method.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Damaged Product</h2>
            <p>
              If you receive a damaged or defective item, contact us within 48 hours of delivery with photos.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
            <p className="font-bold mb-2">REGALOO BY PS</p>
            <p className="mb-4">
              Address:<br />
              Kumar Place, East Street Road,<br />
              Next to Union Bank,<br />
              Camp, Pune – 411001
            </p>
            <p className="mb-2">Phone: 8983434817</p>
            <p className="mb-4">Email: <a href="mailto:regaloobyps@gmail.com" className="text-black hover:underline">regaloobyps@gmail.com</a></p>
            <p className="font-medium">
              Business Hours:<br />
              Monday – Saturday<br />
              10:00 AM – 7:00 PM
            </p>
            <p className="mt-6 text-sm italic">
              For wholesale, distributor, and corporate gifting inquiries, please contact us through email or phone.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnRefundPolicyPage;
