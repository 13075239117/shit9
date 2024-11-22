import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useWebSocket } from '../../hooks/useWebSocket';

interface PaymentModalProps {
  file: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (downloadUrl: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  file, 
  isOpen, 
  onClose, 
  onSuccess
}) => {
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

  React.useEffect(() => {
    if (isOpen) {
      fetchQRCode();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (loginData) {
      const downloadUrl = `https://api.example.com/download/${file.id}`;
      onSuccess(downloadUrl);
    }
  }, [loginData, file, onSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">扫码关注公众号下载</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-6">
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
                      alt="WeChat QR Code"
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

              <p className={`text-sm ${status === 'closed' ? 'text-red-500' : 'text-gray-500'}`}>
                {message || '请使用微信扫码关注公众号'}
              </p>
              
              <p className="text-xs text-gray-400 text-center mt-2">
                关注后即可下载《{file?.name}》
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;