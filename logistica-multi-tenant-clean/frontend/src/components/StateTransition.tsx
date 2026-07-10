import React, { useState } from 'react';
import { theme } from '../theme.config';

interface StateTransitionProps {
  currentState: string;
  productId: number;
  onStateChanged: () => void;
}

const stateTransitions: { [key: string]: string[] } = {
  'Received': ['In Analysis'],
  'In Analysis': ['Approved', 'Rejected'],
  'Rejected': ['In Return'],
  'Approved': ['In Storage'],
  'In Storage': ['In Preparation', 'In Shipment'],
  'In Preparation': ['In Shipment', 'Cancelled'],
  'In Shipment': ['Delivered'],
  'Delivered': [],
  'In Return': ['Received', 'Deleted'],
  'Deleted': [],
  'Cancelled': ['In Storage']
};

export const StateTransition: React.FC<StateTransitionProps> = ({
  currentState,
  productId,
  onStateChanged
}) => {
  const [newState, setNewState] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const availableStates = stateTransitions[currentState] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/change-state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          newState,
          comments
        })
      });

      if (response.ok) {
        alert('State changed successfully!');
        setComments('');
        setNewState('');
        onStateChanged();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error changing state');
    } finally {
      setLoading(false);
    }
  };

  if (availableStates.length === 0) {
    return (
      <div className="bg-[#1e293b]/80 p-4 rounded">
        <p className="text-slate-300">Final state - no transitions available</p>
      </div>
    );
  }

  return (
    <div className={`${theme.cards.form} p-6 rounded-lg shadow`}> 
      <h3 className="text-lg font-semibold mb-4 text-white">Change State</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            New State
          </label>
          <select
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            className={theme.inputs.base}
            required
          >
            <option value="">Select...</option>
            {availableStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Comments/Reason
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className={theme.inputs.base}
            rows={3}
            placeholder="Describe the reason for the change..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !newState}
          className={theme.buttons.primary + " disabled:opacity-50"}
        >
          {loading ? 'Changing...' : 'Confirm Change'}
        </button>
      </form>
    </div>
  );
};