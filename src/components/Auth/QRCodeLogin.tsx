import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useWebSocket } from '../../hooks/useWebSocket';

interface QRCodeLoginProps {
  onSuccess: (data: any) => void;
}

const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ onSuccess }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [sceneStr, setSceneStr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { status, message, loginData } = useWebSocket(sceneStr);

  const fetchQRCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8889/api/login/qrcode');
      setQrCode(response.data.qrcode);
      setSceneStr(response.data.sceneStr);
    } catch (error) {
      console.error('获取二维码失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  useEffect(() => {
    if (loginData) {
      onSuccess(loginData);
    }
  }, [loginData, onSuccess]);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">微信扫码登录</h2>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-48 h-48 flex items-center justify-center"
          >
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </motion.div>
        ) : qrCode ? (
          <motion.div
            key="qrcode"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <img
              src={qrCode}
              alt="Login QR Code"
              className="w-48 h-48 rounded-lg"
            />
            {status === 'closed' && (
              <div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg cursor-pointer"
                onClick={fetchQRCode}
              >
                <div className="text-white text-center">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2" />
                  <span>点击刷新</span>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-48 h-48 flex items-center justify-center"
          >
            <div className="text-center text-gray-500">
              <QrCode className="w-8 h-8 mx-auto mb-2" />
              <span>获取二维码失败</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`mt-4 text-sm ${status === 'closed' ? 'text-red-500' : 'text-gray-500'}`}>
        {message}
      </p>
    </div>
  );
};

export default QRCodeLogin;