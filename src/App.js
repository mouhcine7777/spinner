// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { database, ref, onValue } from './firebase';
import PrizeSelection from './PrizeSelection';
import SpinningWheel from './SpinningWheel';

function App() {
  const [selectedPrize, setSelectedPrize] = useState('');

  useEffect(() => {
    const prizeRef = ref(database, 'selectedPrize');
    
    const unsubscribe = onValue(prizeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSelectedPrize(data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route
            path="/spinner"
            element={<SpinningWheel selectedPrize={selectedPrize} />}
          />
          <Route
            path="/select-prize"
            element={<PrizeSelection />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;