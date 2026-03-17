import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const BalanceSection = ({ balance, loadingBalance }) => {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="w-full md:w-3/5">
      <div
        className="relative w-full rounded-2xl p-6 text-white overflow-hidden shadow-lg"
        style={{
          backgroundColor: '#f42619',
          backgroundImage: 'url(/assets/BackgroundSaldo.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right'
        }}
      >
        <p className="text-lg font-medium opacity-90 mb-4">Saldo anda</p>

        <div className="text-4xl font-bold mb-4 flex items-center gap-2">
          <span>Rp</span>
          {loadingBalance ? (
            <div className="h-10 w-32 bg-white/30 animate-pulse rounded ml-2"></div>
          ) : (
            <span>
              {showBalance ? balance.toLocaleString('id-ID') : '••••••••'}
            </span>
          )}
        </div>

        <button
          onClick={() => setShowBalance(!showBalance)}
          className={`flex items-center text-xs font-medium opacity-90 hover:opacity-100 transition-opacity -mt-1 md:-mt-2 relative z-10 ${showBalance ? 'gap-1' : 'gap-3'}`}
        >
          <span>{showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}</span>
          {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
};

export default BalanceSection;
