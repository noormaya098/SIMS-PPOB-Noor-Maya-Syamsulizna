import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import TopUp from './pages/TopUp';
import Payment from './pages/Payment';
import Transaction from './pages/Transaction';
import Akun from './pages/Akun';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />

        {/* Dialihkan dari halaman autentikasi jika sudah login */}
        <Route
          path="/registration"
          element={token ? <Navigate to="/home" /> : <Registration />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/home" /> : <Login />}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topup"
          element={
            <ProtectedRoute>
              <TopUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/akun"
          element={
            <ProtectedRoute>
              <Akun />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App;
