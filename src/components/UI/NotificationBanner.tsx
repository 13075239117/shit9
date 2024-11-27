import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 flex items-center justify-center gap-2 shadow-md"
    >
      <AlertCircle size={20} />
      <span className="text-sm font-medium">
        有问题，不会做，不会部署等。请联系微信：zhizhi1699999 或者QQ：935764227
      </span>
    </motion.div>
  );
};

export default NotificationBanner;