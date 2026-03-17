import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import TopUp from './pages/TopUp';
import Payment from './pages/Payment';
import Transaction from './pages/Transaction';
import Akun from './pages/Akun';

function App() {
  return (
    <Router>
      <Routes>
         {/* Route to redirect root to login for this assignment/login flow */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/akun" element={<Akun />} />
      </Routes>
    </Router>
  )
}

export default App
