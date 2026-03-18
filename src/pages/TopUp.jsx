import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, fetchBalance, postTopUp } from '../redux/homeSlice';
import Navbar from '../components/Navbar';
import ProfileSection from '../components/ProfileSection';
import BalanceSection from '../components/BalanceSection';
import NotificationModal from '../components/NotificationModal';
import { Wallet, Banknote } from 'lucide-react';

const QUICK_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000];

const TopUp = () => {
  // callback ketika ada update terbaru dari api 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, balance, loadingProfile, loadingBalance, loadingTopUp } = useSelector((state) => state.home);
  const { token } = useSelector((state) => state.auth);

  const [amount, setAmount] = useState('');

  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch, token, navigate]);

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
    } else {
      setAmount(parseInt(rawValue, 10));
    }
  };

  const handleQuickAmount = (val) => {
    setAmount(val);
  };

  const isValidAmount = typeof amount === 'number' && amount >= 10000 && amount <= 1000000;

  const handleTopUpClick = () => {
    if (isValidAmount) {
      setShowConfirm(true);
    }
  };

  const executeTopUp = async () => {
    setShowConfirm(false);

    // Call API
    const resultAction = await dispatch(postTopUp(amount));
    if (postTopUp.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      setShowResult(true);
    } else {
      setIsSuccess(false);
      setShowResult(true);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setAmount('');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-8">

        {/* BAGIAN ATAS: PROFILE & SALDO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <ProfileSection profile={profile} loadingProfile={loadingProfile} />
          <BalanceSection balance={balance} loadingBalance={loadingBalance} />
        </div>

        {/* TOP UP SECTION */}
        <div className="w-full">
          <p className="text-gray-500 mb-1">Silahkan masukan</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Nominal Top Up</h1>

          <div className="flex flex-col md:flex-row gap-6">

            {/* Input & Submit */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Banknote size={20} />
                </span>
                <input
                  type="text"
                  placeholder="masukan nominal Top Up"
                  value={amount ? amount.toLocaleString('id-ID') : ''}
                  onChange={handleAmountChange}
                  className="w-full pl-12 pr-4 py-3 rounded border border-gray-300 outline-none focus:border-[#f42619] text-gray-800 transition-colors"
                />
              </div>

              <button
                onClick={handleTopUpClick}
                disabled={!isValidAmount || loadingTopUp}
                className={`w-full py-3 rounded font-medium text-white transition-colors duration-200 mt-2 ${!isValidAmount || loadingTopUp ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f42619] hover:bg-red-600'
                  }`}
              >
                {loadingTopUp ? 'Memproses...' : 'Top Up'}
              </button>
            </div>

            {/* Quick Amounts */}
            <div className="md:w-[40%] grid grid-cols-3 gap-3">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2 py-3 border border-gray-300 rounded text-sm text-gray-700 hover:border-[#f42619] hover:text-[#f42619] transition-colors"
                >
                  Rp{val.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

          </div>
        </div>
      </main>

      {/* MODAL KONFIRMASI */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm flex flex-col items-center shadow-xl animate-pop-in">
            <div className="w-16 h-16 bg-[#f42619] text-white rounded-full flex items-center justify-center mb-6">
              <Wallet size={32} />
            </div>

            <p className="text-gray-600 mb-2">Anda yakin untuk Top Up sebesar</p>
            <p className="text-xl font-bold mb-6">Rp{amount.toLocaleString('id-ID')} ?</p>

            <button
              onClick={executeTopUp}
              className="w-full py-2.5 rounded text-[#f42619] font-medium hover:bg-red-50 mb-2 transition-colors"
            >
              Ya, lanjutkan Top Up
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

      {/* MODAL HASIL ATAU MODAL RESPONSE */}
      {showResult && (
        <NotificationModal
          isSuccess={isSuccess}
          message="Top Up sebesar"
          amount={amount.toLocaleString('id-ID')}
          onClose={closeResult}
        />
      )}

    </div>
  );
};

export default TopUp;
