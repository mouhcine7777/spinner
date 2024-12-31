// PrizeSelection.js
import React, { useState } from 'react';
import { database, ref, set, remove } from './firebase';

function PrizeSelection() {
  const [prizes] = useState(['vote supp', 'stop 5mns', 'Vote x2', '7assana', 'No prize', 'water']);
  const [selected, setSelected] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSelect = async () => {
    if (selected) {
      setUpdating(true);
      try {
        await set(ref(database, 'selectedPrize'), selected);
        alert(`Prize "${selected}" selected!`);
      } catch (error) {
        alert('Error updating prize. Please try again.');
        console.error('Error:', error);
      } finally {
        setUpdating(false);
      }
    }
  };

  const clearIPHistory = async () => {
    try {
      // Remove all stored IPs
      await remove(ref(database, 'spunIPs'));
      alert('IP history cleared! Users can now spin again.');
    } catch (error) {
      alert('Error clearing IP history. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="prize-selection flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Select Prize</h2>
      <select 
        value={selected} 
        onChange={(e) => setSelected(e.target.value)}
        className="p-2 border rounded"
        disabled={updating}
      >
        <option value="">-- Select a Prize --</option>
        {prizes.map((prize, index) => (
          <option key={index} value={prize}>
            {prize}
          </option>
        ))}
      </select>
      <button 
        disabled={!selected || updating} 
        onClick={handleSelect}
        className={`px-4 py-2 rounded ${
          !selected || updating
            ? 'bg-gray-300' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {updating ? 'Saving...' : 'Save Prize'}
      </button>
      
      <button 
        onClick={clearIPHistory}
        className="mt-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
      >
        Clear IP History
      </button>
    </div>
  );
}

export default PrizeSelection;