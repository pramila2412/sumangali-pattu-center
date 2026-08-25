import React, { useEffect } from 'react';
import { GlobalData } from '../data/GlobalData';

const PrivacyPolicyScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[var(--background)] min-h-screen pb-20">
      <div className="relative py-24 text-center text-white bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/90 to-[var(--primary)]/60 z-10"></div>
        <div className="container mx-auto px-6 relative z-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-['Playfair_Display']">Privacy Policy</h1>
          <p className="text-lg text-white/80">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-12 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[var(--border)] prose prose-lg max-w-none text-[var(--paragraph)]">
          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">1. Introduction</h2>
          <p className="mb-6">
            Welcome to {GlobalData.brandName}. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website or services.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">2. Information We Collect</h2>
          <p className="mb-4">We may collect the following types of personal information when you contact us for saree evaluation or pickup:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Identity and Contact Data:</strong> Name, phone number, email address, and residential address (for home pickup services).</li>
            <li><strong>Service Data:</strong> Images, descriptions, and details of the silk sarees you wish to sell or exchange.</li>
            <li><strong>Transaction Data:</strong> Payment details such as bank account or UPI information strictly for processing your payout.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To evaluate your sarees and provide price quotes.</li>
            <li>To schedule and conduct free home pickups at your provided address.</li>
            <li>To process payments via cash, UPI, or bank transfer.</li>
            <li>To communicate with you regarding your queries and our services.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">4. Data Sharing and Security</h2>
          <p className="mb-6">
            We do not sell, trade, or rent your personal identification information to others. We restrict access to your personal data to our trained staff members who need it to provide services to you. We have implemented appropriate security measures to prevent your personal data from being accidentally lost, accessed, or altered.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">5. Your Rights</h2>
          <p className="mb-6">
            You have the right to request access to the personal data we hold about you, request corrections, or ask us to delete your personal information. If you wish to exercise any of these rights, please contact us.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">6. Contact Us</h2>
          <p className="mb-2">If you have any questions about this Privacy Policy, please contact us at:</p>
          <ul className="mb-6">
            <li><strong>Phone:</strong> {GlobalData.contactInfo.phone}</li>
            <li><strong>Email:</strong> {GlobalData.contactInfo.email}</li>
            <li><strong>Address:</strong> {GlobalData.contactInfo.address}</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyScreen;
