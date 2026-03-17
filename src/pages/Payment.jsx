import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProfile, fetchBalance, postTransaction } from '../redux/homeSlice';
import Navbar from '../components/Navbar';
import ProfileSection from '../components/ProfileSection';
import BalanceSection from '../components/BalanceSection';
import NotificationModal from '../components/NotificationModal';
import { Banknote, Wallet } from 'lucide-react';

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.service;
  
  const { profile, balance, loadingProfile, loadingBalance, loadingTransaction } = useSelector((state) => state.home);
  const { token } = useSelector((state) => state.auth);

  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!service) {
      navigate('/home');
      return;
    }
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch, token, navigate, service]);

  if (!service) return null;

  const handlePayClick = () => {
    setShowConfirm(true);
  };

  const executePayment = async () => {
    setShowConfirm(false);
    
    // Call API
    const resultAction = await dispatch(postTransaction(service.service_code));
    if (postTransaction.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      setShowResult(true);
      // Wait, update balance too. postTransaction doesn't return balance, TopUp does.
      // So let's re-fetch balance.
      dispatch(fetchBalance());
    } else {
      setIsSuccess(false);
      setShowResult(true);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    navigate('/home');
  };

  const amountString = service.service_tariff.toLocaleString('id-ID');

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-8">
        
        {/* TOP SECTION: PROFILE & BALANCE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <ProfileSection profile={profile} loadingProfile={loadingProfile} />
          <BalanceSection balance={balance} loadingBalance={loadingBalance} />
        </div>

        {/* PAYMENT SECTION */}
        <div className="w-full">
          <p className="text-gray-500 mb-2 font-medium">PemBayaran</p>
          <div className="flex items-center gap-3 mb-8">
            <img src={service.service_icon} alt="Service Icon" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold text-gray-800">{service.service_name}</h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Banknote size={20} />
              </span>
              <input
                type="text"
                value={amountString}
                disabled
                className="w-full pl-12 pr-4 py-3 rounded border border-gray-300 bg-gray-50 text-gray-600 outline-none"
              />
            </div>

            <button
              onClick={handlePayClick}
              disabled={loadingTransaction}
              className={`w-full py-3 rounded font-medium text-white transition-colors duration-200 mt-2 ${
                loadingTransaction ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f42619] hover:bg-red-600'
              }`}
            >
              {loadingTransaction ? 'Memproses...' : 'Bayar'}
            </button>
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm flex flex-col items-center shadow-xl animate-pop-in">
             <div className="w-16 h-16 bg-[#f42619] text-white rounded-full flex items-center justify-center mb-6">
                <Wallet size={32} />
             </div>
            
            <p className="text-gray-600 mb-2 text-center">Beli {service.service_name.toLowerCase()} senilai</p>
            <p className="text-xl font-bold mb-6">Rp{amountString} ?</p>
            
            <button
              onClick={executePayment}
              className="w-full py-2.5 rounded text-[#f42619] font-medium hover:bg-red-50 mb-2 transition-colors"
            >
              Ya, lanjutkan Bayar
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="w-full py-2.5 rounded text-gray-400 font-medium hover:bg-gray-50 transition-colors"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* RESULT MODAL */}
      {showResult && (
        <NotificationModal 
          isSuccess={isSuccess} 
          message={`Pembayaran ${service.service_name.toLowerCase()} sebesar`} 
          amount={amountString} 
          onClose={closeResult} 
        />
      )}
    </div>
  );
};

export default Payment;
