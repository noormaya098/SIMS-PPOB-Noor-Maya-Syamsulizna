import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AtSign, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { loginUser, resetState } from '../redux/authSlice';
import NotificationModal from '../components/NotificationModal';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error, token, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (token && !isRedirecting) {
      navigate('/home');
    }
  }, [token, navigate, isRedirecting]);

  useEffect(() => {
    if (success) {
      setIsRedirecting(true);
      setIsSuccess(true);
      setResultText('Login');
      setShowResult(true);
      setTimeout(() => {
        dispatch(resetState());
        setShowResult(false);
        setIsLoggingIn(true);
        
        setTimeout(() => {
          navigate('/home');
        }, 1200);
      }, 1500);
    }
    if (error) {
       setIsSuccess(false);
       setResultText(error || 'Login Gagal');
       setShowResult(true);
       dispatch(resetState());
    }
  }, [success, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) errors.email = 'Email tidak boleh kosong';
    else if (!emailRegex.test(formData.email)) errors.email = 'Format email tidak valid';

    if (!formData.password) errors.password = 'Password tidak boleh kosong';
    else if (formData.password.length < 8) errors.password = 'Password minimal 8 karakter';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(loginUser({
        email: formData.email,
        password: formData.password
      }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-white font-sans text-[#000000] overflow-hidden relative">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 shrink-0 relative">
        <div className="w-full max-w-md xl:max-w-[420px] flex flex-col h-full py-10 lg:py-16">
          <div className="flex-grow flex flex-col justify-center">
            <div className="flex justify-center items-center gap-2 mb-6 lg:mb-8">
              <img src="/assets/Logo.png" alt="SIMS PPOB Logo" className="w-8 h-8" />
              <span className="text-xl font-bold">SIMS PPOB</span>
            </div>

            <h2 className="text-2xl lg:text-[28px] font-bold text-center mb-10 leading-snug">
              Masuk atau buat akun <br /> untuk memulai
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col">
              <Input
                icon={AtSign}
                type="text"
                name="email"
                placeholder="masukan email anda"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
              />
              <Input
                icon={Lock}
                type="password"
                name="password"
                placeholder="masukan password anda"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
              />

              <button
                type="submit"
                disabled={loading || isRedirecting}
                className={`cursor-pointer w-full py-3 rounded text-white font-bold mt-4 ${(loading || isRedirecting) ? 'bg-[#ff7b73] cursor-not-allowed' : 'bg-[#f42619] hover:bg-[#e32417]'
                  }`}
              >
                {(loading || isRedirecting) ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-400">
              belum punya akun? registrasi <Link to="/registration" className="text-[#f42619] font-bold">di sini</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-full lg:w-1/2 h-screen hidden md:flex items-center justify-center bg-[#fff1f0]">
        <img
          src="/assets/IllustrasiLogin.png"
          alt="Illustration"
          className="w-full h-full object-contain"
        />
      </div>

      {/* RESULT MODAL */}
      {showResult && (
        <NotificationModal 
          isSuccess={isSuccess} 
          message={resultText} 
          onClose={() => setShowResult(false)} 
          buttonText="Tutup"
        />
      )}
      {/* LOADING OVERLAY FOR LOGIN */}
      {isLoggingIn && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#f42619] rounded-full animate-spin mb-4"></div>
          <p className="text-[#f42619] font-medium">Sedang memuat halaman...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
