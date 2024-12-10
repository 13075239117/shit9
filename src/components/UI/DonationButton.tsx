import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X } from 'lucide-react';
import mm_reward_qrcode from './mm_reward_qrcode_1733796034335.png'; 

const DonationButton: React.FC = () => {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <motion.button
        className="fixed bottom-24 right-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(true)}
      >
        <Coffee size={24} />
      </motion.button>

      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full relative"
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">请作者喝杯咖啡 ☕️</h3>
                <div className="mb-4">
                  <img
                    src={mm_reward_qrcode}
                    alt="微信赞赏码"
                    className="w-48 h-48 mx-auto rounded-lg shadow-md"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  如果这些资源对您有帮助，欢迎赞赏支持！
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DonationButton;