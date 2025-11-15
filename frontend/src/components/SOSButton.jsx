import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

function SOSButton({ token, onTrigger }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSOSClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setSending(true);
    try {
      await axios.post(
        `${API_BASE}/sos/trigger`,
        { message: 'Child has triggered SOS alert' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setShowConfirm(false);
      if (onTrigger) {
        onTrigger();
      }
      
      // Show success message
      alert('SOS alert has been sent to your trusted adults. Help is on the way!');
    } catch (error) {
      console.error('SOS error:', error);
      alert('Failed to send SOS alert. Please try again or contact a trusted adult directly.');
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-2xl shadow-red-600/50 animate-pulse hover:animate-none transition-all hover:scale-110 flex items-center justify-center"
        title="Press if you need immediate help"
      >
        <span className="text-3xl">🆘</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border-2 border-red-600 p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🆘</div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">
                Send SOS Alert?
              </h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to alert your trusted adults for help?
                <br />
                <span className="text-sm text-slate-400">
                  This will notify parents and teachers immediately.
                </span>
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  disabled={sending}
                  className="flex-1 px-6 py-3 rounded-lg bg-slate-800 text-slate-100 font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={sending}
                  className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Yes, Send SOS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SOSButton;


