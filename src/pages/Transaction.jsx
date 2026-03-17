import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, fetchBalance, fetchHistory, resetHistory } from '../redux/homeSlice';
import Navbar from '../components/Navbar';
import ProfileSection from '../components/ProfileSection';
import BalanceSection from '../components/BalanceSection';

const limit = 5;

const Transaction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { 
    profile, balance, loadingProfile, loadingBalance, 
    history, loadingHistory, hasMoreHistory
  } = useSelector((state) => state.home);
  const { token } = useSelector((state) => state.auth);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(resetHistory());
    dispatch(fetchHistory({ offset: 0, limit }));
  }, [dispatch, token, navigate]);

  const handleShowMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    dispatch(fetchHistory({ offset: nextOffset, limit }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-8">
        
        {/* TOP SECTION: PROFILE & BALANCE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <ProfileSection profile={profile} loadingProfile={loadingProfile} />
          <BalanceSection balance={balance} loadingBalance={loadingBalance} />
        </div>

        {/* TRANSACTIONS SECTION */}
        <div className="w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Semua Transaksi</h2>
          
          {history.length === 0 && !loadingHistory ? (
            <div className="flex justify-center mt-12">
               <p className="text-gray-400">Maaf tidak ada histori transaksi saat ini</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((record, index) => {
                const isTopup = record.transaction_type === "TOPUP";
                
                return (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex flex-col gap-1">
                      <span className={`text-lg font-bold ${isTopup ? 'text-green-500' : 'text-[#f42619]'}`}>
                        {isTopup ? '+' : '-'} Rp{record.total_amount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(record.created_on)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {record.description}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SHOW MORE BUTTON */}
          {hasMoreHistory && history.length > 0 && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleShowMore}
                disabled={loadingHistory}
                className="text-[#f42619] font-medium hover:text-red-600 transition-colors"
              >
                {loadingHistory ? 'Memuat...' : 'Show more'}
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Transaction;
