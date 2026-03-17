import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AtSign, User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import NotificationModal from '../components/NotificationModal';
import { registerUser, resetState } from '../redux/authSlice';

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    if (success) {
      setIsSuccess(true);
      setResultText('Registrasi');
      setShowResult(true);
      dispatch(resetState());
      setTimeout(() => navigate('/login'), 2000);
    }
    if (error) {
      setIsSuccess(false);
      setResultText(error || 'Registrasi Gagal');
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

    if (!formData.first_name) errors.first_name = 'Nama depan tidak boleh kosong';
    if (!formData.last_name) errors.last_name = 'Nama belakang tidak boleh kosong';

    if (!formData.password) errors.password = 'Password tidak boleh kosong';
    else if (formData.password.length < 8) errors.password = 'Password minimal 8 karakter';

    if (!formData.confirm_password) errors.confirm_password = 'Konfirmasi password tidak boleh kosong';
    else if (formData.password !== formData.confirm_password) errors.confirm_password = 'password tidak sama';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(registerUser({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password
      }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-white font-sans text-[#000000] overflow-y-auto lg:overflow-hidden">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 shrink-0">
        <div className="w-full max-w-md xl:max-w-[420px]">
          <div className="flex justify-center items-center gap-2 mb-6 lg:mb-8">
            <img src="/assets/Logo.png" alt="SIMS PPOB Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">SIMS PPOB</span>
          </div>

          <h2 className="text-2xl lg:text-[28px] font-bold text-center mb-8 lg:mb-10 leading-snug">
            Lengkapi data untuk <br /> membuat akun
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
              icon={User}
              type="text"
              name="first_name"
              placeholder="nama depan"
              value={formData.first_name}
              onChange={handleChange}
              error={formErrors.first_name}
            />
            <Input
              icon={User}
              type="text"
              name="last_name"
              placeholder="nama belakang"
              value={formData.last_name}
              onChange={handleChange}
              error={formErrors.last_name}
            />
            <Input
              icon={Lock}
              type="password"
              name="password"
              placeholder="buat password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
            />
            <Input
              icon={Lock}
              type="password"
              name="confirm_password"
              placeholder="konfirmasi password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={formErrors.confirm_password}
            />

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full py-3 rounded text-white font-bold mt-2 ${loading ? 'bg-[#ff7b73] cursor-not-allowed' : 'bg-[#f42619] hover:bg-[#e32417]'
                }`}
            >
              {loading ? 'Memproses...' : 'Registrasi'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            sudah punya akun? login <Link to="/login" className="text-[#f42619] font-bold">di sini</Link>
          </p>
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
    </div>
  );
};

export default Registration;
