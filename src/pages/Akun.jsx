import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Input } from '../components/Input';
import { AtSign, User, Pencil } from 'lucide-react';
import { fetchProfile, updateProfile, updateProfileImage } from '../redux/homeSlice';
import NotificationModal from '../components/NotificationModal';

const Akun = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { profile, loadingProfile } = useSelector((state) => state.home);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: ''
  });

  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultText, setResultText] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);

    // Simulasi delay untuk loading ketika masuk ke halaman login
    setTimeout(() => {
      dispatch({ type: 'auth/logout' });
      navigate('/login', { replace: true });
    }, 1500);
  };

  const handleSaveProfile = async () => {
    if (!formData.first_name || !formData.last_name) {
      setIsSuccess(false);
      setResultText('Nama harus diisi');
      setShowResult(true);
      return;
    }

    try {
      await dispatch(updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name
      })).unwrap();
      setIsEditing(false);
      setIsSuccess(true);
      setResultText('Update Profile');
      setShowResult(true);
      dispatch(fetchProfile()); // Untuk refresh data profile
    } catch (error) {
      setIsSuccess(false);
      setResultText(error || 'Update Profile');
      setShowResult(true);
    }
  };

  const handleImageClick = () => {
    if (!isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cek limit data size ( 100kb )
    if (file.size > 100 * 1024) {
      setIsSuccess(false);
      setResultText('Maksimum 100 kb');
      setShowResult(true);
      // Untuk clear input 
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const payload = new FormData();
    payload.append('file', file);

    try {
      await dispatch(updateProfileImage(payload)).unwrap();
      setIsSuccess(true);
      setResultText('Update Profile Image');
      setShowResult(true);
      dispatch(fetchProfile());
    } catch (error) {
      setIsSuccess(false);
      setResultText(error || 'Format Image tidak sesuai');
      setShowResult(true);
    } finally {
      // Untuk clear input 
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getProfileImage = () => {
    if (profile?.profile_image && !profile.profile_image.includes('null')) {
      return profile.profile_image;
    }
    return '/assets/ProfilePhoto.png'; // Fallback image, ketika belum ada fotonya maka menggunakan foto default yang ada pada assets 
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col items-center">
        {/* PROFILE SECTION */}
        <div className="relative mb-4 cursor-pointer" onClick={handleImageClick}>
          <div className="w-28 h-28 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
            <img
              src={getProfileImage()}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/ProfilePhoto.png';
              }}
            />
          </div>
          {!isEditing && (
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
              <Pencil size={14} />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#333333] mb-10">
          {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
        </h1>

        {/* FORM FIELDS */}
        <div className="w-full max-w-xl">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">Email</label>
            <Input
              icon={AtSign}
              name="email"
              value={formData.email}
              readOnly
              disabled
              placeholder="Email"
              className="bg-white text-gray-800"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">Nama Depan</label>
            <Input
              icon={User}
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              placeholder="Nama Depan"
              className={!isEditing ? "bg-white text-gray-800" : "bg-white"}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#333333] mb-2">Nama Belakang</label>
            <Input
              icon={User}
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              placeholder="Nama Belakang"
              className={!isEditing ? "bg-white text-gray-800" : "bg-white"}
            />
          </div>

          {/* BUTTON AKSI PROFILE */}
          <div className="space-y-4 pt-2">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 px-4 bg-[#f42619] hover:bg-red-600 text-white font-semibold rounded transition-colors disabled:opacity-70"
                  disabled={loadingProfile}
                >
                  Edit Profil
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-3 px-4 bg-white border-2 border-[#f42619] text-[#f42619] hover:bg-red-50 font-semibold rounded transition-colors disabled:opacity-70"
                  disabled={loadingProfile}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full py-3 px-4 bg-[#f42619] hover:bg-red-600 text-white font-semibold rounded transition-colors disabled:opacity-70"
                  disabled={loadingProfile || (!formData.first_name && !formData.last_name)}
                >
                  {loadingProfile ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset profile ketika sudah di edit maka memanggil ulang response 
                    if (profile) {
                      setFormData({
                        email: profile.email || '',
                        first_name: profile.first_name || '',
                        last_name: profile.last_name || ''
                      });
                    }
                  }}
                  className="w-full py-3 px-4 bg-white border-2 border-[#f42619] text-[#f42619] hover:bg-red-50 font-semibold rounded transition-colors disabled:opacity-70"
                  disabled={loadingProfile}
                >
                  Batalkan
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL NOTIFIKASI */}
      {showResult && (
        <NotificationModal
          isSuccess={isSuccess}
          message={resultText}
          onClose={() => setShowResult(false)}
          buttonText="Tutup"
        />
      )}

      {/* MODAL KONFIRMASI KETIKA AKAN LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm flex flex-col items-center shadow-xl animate-pop-in">
            <h3 className="text-lg font-bold text-[#333333] mb-2 text-center">
              Konfirmasi Logout
            </h3>
            <p className="text-gray-500 mb-8 text-center text-sm">
              Apakah Anda yakin ingin keluar dari aplikasi?
            </p>
            <div className="flex w-full gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded border border-[#f42619] text-[#f42619] font-medium hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded bg-[#f42619] text-white font-medium hover:bg-red-600 transition-colors"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY LOADING KETIKA AKAN LOGOUT */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#f42619] rounded-full animate-spin mb-4"></div>
          <p className="text-[#f42619] font-medium">Sedang keluar...</p>
        </div>
      )}
    </div>
  );
};

export default Akun;
