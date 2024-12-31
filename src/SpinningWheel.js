// SpinningWheel.js
import React, { useRef, useState, useEffect } from 'react';
import { database, ref, set, get } from './firebase';
import './SpinningWheel.css';

function SpinningWheel({ selectedPrize }) {
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [userIP, setUserIP] = useState('');

  // Fetch user's IP and check if they've already spun
  useEffect(() => {
    const checkIPStatus = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const currentIP = ipData.ip;
        setUserIP(currentIP);

        const spunIPsRef = ref(database, 'spunIPs');
        const snapshot = await get(spunIPsRef);
        const spunIPs = snapshot.val() || {};
        
        if (spunIPs[currentIP.replace(/\./g, '_')]) {
          setHasSpun(true);
        }
      } catch (error) {
        console.error('Error checking IP status:', error);
      }
    };

    checkIPStatus();
  }, []);

  const spinWheel = async () => {
    if (isSpinning || hasSpun || !userIP) return;
    
    setIsSpinning(true);
    setShowPrize(false);  // Reset prize popup state

    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    const randomDegree = 360 * spins + Math.floor(Math.random() * 360);
    const duration = 5000;

    wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.32, 0.94, 0.60, 1)`;
    wheelRef.current.style.transform = `rotate(${randomDegree}deg)`;

    try {
      const sanitizedIP = userIP.replace(/\./g, '_');
      await set(ref(database, `spunIPs/${sanitizedIP}`), {
        timestamp: Date.now(),
        prize: selectedPrize,
        rotation: randomDegree
      });
    } catch (error) {
      console.error('Error saving IP:', error);
    }

    // Wait for wheel to stop spinning, then show prize
    setTimeout(() => {
      setIsSpinning(false);
      setShowPrize(true);
      setHasSpun(true);
    }, duration);
  };

  return (
    <div className="wheel-container">
      <div className="wheel" ref={wheelRef}>
        <img src="/wheel.png" alt="Spinning Wheel" className="wheel-image" />
      </div>
      <div className="spin-button-container">
        <img 
          src="/spin.png" 
          alt="Spin" 
          onClick={!isSpinning && !hasSpun && selectedPrize ? spinWheel : undefined}
          className={`spin-button-image ${isSpinning || hasSpun || !selectedPrize ? 'disabled' : ''}`}
        />
      </div>

      {showPrize && (
        <div className="prize-popup">
          <div className="prize-content">
            <img 
              src={`/${selectedPrize.slice(-1)}.png`} 
              alt="Prize" 
              className="prize-icon"
            />
            <p className="arabic-text" dir="rtl">
              {selectedPrize === "Prize 1" && "جائزة رائعة! مبروك عليك"}
              {selectedPrize === "Prize 2" && "تهانينا! فزت بجائزة قيمة"}
              {selectedPrize === "Prize 3" && "رائع! لقد ربحت هدية مميزة"}
              {selectedPrize === "Prize 4" && "مبروك! جائزة خاصة في انتظارك"}
              {selectedPrize === "Prize 5" && "تهانينا! فزت بمفاجأة سارة"}
              {selectedPrize === "Prize 6" && "عظيم! لقد فزت بجائزة خاصة"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpinningWheel;