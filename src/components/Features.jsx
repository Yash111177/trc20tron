import React from 'react';
import './Features.css';

const Features = () => {
  const featureData = [
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Unparalleled Speed',
      description: 'Experience blazing-fast transaction confirmations with up to 3,000 TPS. BNB Chain offers one of the most responsive networks for all your digital asset needs.',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Low Transaction Fees',
      description: 'Save significantly with transaction fees as low as $0.01, making BNB Chain the most gas-effective solution for frequent and everyday users alike.',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Enhanced Security',
      description: 'Rest easy with multi-layered protection including real-time monitoring, automated verification protocols, and advanced detection systems safeguarding your assets.',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Seamless Integration',
      description: 'Connect easily with 100+ major wallet platforms through our standardized APIs and developer-friendly tools built for maximum security.',
    },
  ];

  return (
    <section className="features-container">
      <div className="features-header">
        <h2 className="features-title">Why Choose <span className="text-gold">BNB Chain?</span></h2>
        <p className="features-subtitle">Touch the next generation of blockchain technology with USDT Chain's advanced features</p>
      </div>

      <div className="features-grid">
        {featureData.map((feature, index) => (
          <div key={index} className="feature-card glass-card">
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3 className="feature-card-title">{feature.title}</h3>
            <p className="feature-card-description">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="features-action">
        <button className="btn btn-outline features-btn">
          Get Started with BNB Chain <span className="arrow-icon">→</span>
        </button>
      </div>
    </section>
  );
};

export default Features;
