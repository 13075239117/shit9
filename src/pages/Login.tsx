import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { setUser } from '../store/slices/authSlice';
import QRCodeLogin from '../components/Auth/QRCodeLogin';

const Login: React.FC = () => {
  const [showQRCode, setShowQRCode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = (userData: any) => {
    dispatch(setUser(userData));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <LogIn size={40} className="text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          欢迎回来
        </h2>

        {showQRCode ? (
          <QRCodeLogin onSuccess={handleLoginSuccess} />
        ) : (
          <div className="text-center">
            <button
              onClick={() => setShowQRCode(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              微信扫码登录
            </button>
            
            <button
              onClick={() => setShowQRCode(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              使用账号密码登录
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;