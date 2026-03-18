import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, fetchBalance, fetchServices, fetchBanners } from '../redux/homeSlice';
import Navbar from '../components/Navbar';
import ProfileSection from '../components/ProfileSection';
import BalanceSection from '../components/BalanceSection';
import ServicesSection from '../components/ServicesSection';
import BannersSection from '../components/BannersSection';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    profile, balance, services, banners,
    loadingProfile, loadingBalance, loadingServices, loadingBanners
  } = useSelector((state) => state.home);
  const { token } = useSelector((state) => state.auth);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch semua data, yakni ada profile, balance atau saldo, services atau layanan, dan banners atau banner
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchServices());
    dispatch(fetchBanners());

    // Memberikan delay atau loading agar terlihat lebih hidup
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, token, navigate]);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white animate-fade-in">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#f42619] rounded-full animate-spin mb-4"></div>
        <p className="text-[#f42619] font-medium">Menyiapkan dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pb-15">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-8">

        {/* BAGIAN ATAS: PROFILE & SALDO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <ProfileSection profile={profile} loadingProfile={loadingProfile} />
          <BalanceSection balance={balance} loadingBalance={loadingBalance} />
        </div>

        {/* SECTION KATEGORI LAYANAN */}
        <ServicesSection services={services} loadingServices={loadingServices} />

        {/* SECTION BANNER */}
        <BannersSection banners={banners} loadingBanners={loadingBanners} />

      </main>
    </div>
  );
};

export default Home;
