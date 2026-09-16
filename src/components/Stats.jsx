import React from 'react';
import './Stats.css';

const Stats = () => {
  const statsData = [
    { value: '2M+', label: 'Assets Verified' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '50K+', label: 'Active Users' },
    { value: '24/7', label: 'Real-time Monitoring' },
  ];

  return (
    <section className="stats-container">
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-item">
            <h2 className="stat-value">{stat.value}</h2>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
