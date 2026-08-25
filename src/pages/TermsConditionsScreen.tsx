import React, { useEffect } from 'react';
import { GlobalData } from '../data/GlobalData';

const TermsConditionsScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[var(--background)] min-h-screen pb-20">
      <div className="relative py-24 text-center text-white bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/90 to-[var(--primary)]/60 z-10"></div>
        <div className="container mx-auto px-6 relative z-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-['Playfair_Display']">Terms & Conditions</h1>
          <p className="text-lg text-white/80">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-12 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[var(--border)] prose prose-lg max-w-none text-[var(--paragraph)]">
          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing and using the services of {GlobalData.brandName}, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">2. Description of Service</h2>
          <p className="mb-6">
            {GlobalData.brandName} offers evaluation, purchasing, and exchange services for authentic old silk sarees, including but not limited to Kanchipuram, Banarasi, and Mysore silk sarees. We provide free doorstep evaluation and pickup services in select cities.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">3. Saree Evaluation & Pricing</h2>
          <p className="mb-4">
            Our evaluations are based on several factors, including:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>The weight and quality of the pure silk.</li>
            <li>The authenticity and silver/gold content of the Zari.</li>
            <li>The overall condition of the saree (damages, tears, or stains may affect the value).</li>
          </ul>
          <p className="mb-6">
            Any estimated price provided over phone or WhatsApp based on photos is tentative. The final binding offer is made only after a physical inspection of the saree by our experts. You are under no obligation to accept our offer.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">4. Ownership and Legal Rights</h2>
          <p className="mb-6">
            By offering a saree for sale or exchange to {GlobalData.brandName}, you declare and warrant that you are the lawful owner of the item, and you have the absolute right to sell or exchange it. We reserve the right to request proof of identity during the transaction.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">5. Payments</h2>
          <p className="mb-6">
            Once a price is mutually agreed upon, payment will be made instantly via Cash, UPI, or Bank Transfer at the time of handover. Once the payment is completed and the saree is handed over, the sale is considered final and irreversible.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">6. Service Availability & Refusal</h2>
          <p className="mb-6">
            We reserve the right to refuse service, cancel pickups, or reject sarees upon physical inspection if they do not meet our purity criteria (e.g., synthetic sarees or imitation zari) without incurring any liability.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">7. Changes to Terms</h2>
          <p className="mb-6">
            {GlobalData.brandName} reserves the right to modify these terms from time to time at our sole discretion. Therefore, you should review this page periodically.
          </p>

          <h2 className="text-2xl font-bold text-[var(--heading)] mb-4">8. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these Terms, please contact us at {GlobalData.contactInfo.phone} or {GlobalData.contactInfo.email}.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsConditionsScreen;
