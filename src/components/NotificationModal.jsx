import React from 'react';
import { Check, X } from 'lucide-react';

const NotificationModal = ({ isSuccess, message, amount, onClose, buttonText = "Kembali ke Beranda" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm flex flex-col items-center shadow-xl animate-pop-in">
        {isSuccess ? (
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-6">
            <Check size={32} />
          </div>
        ) : (
          <div className="w-16 h-16 bg-[#f42619] text-white rounded-full flex items-center justify-center mb-6">
            <X size={32} />
          </div>
        )}

        <p className="text-gray-600 mb-2 text-center">{message}</p>
        
        {amount && (
          <p className="text-xl font-bold text-center mb-1">
            Rp{amount}
          </p>
        )}
        
        <p className="text-gray-500 text-sm mb-6 text-center">
          {isSuccess ? 'berhasil!' : 'gagal'}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded text-[#f42619] font-medium hover:bg-red-50 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
