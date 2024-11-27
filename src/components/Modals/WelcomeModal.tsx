import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Code, MessageSquare, Download, Phone } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">欢迎访问</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Download className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">免费下载</h3>
                  <p className="text-gray-600">本站所有项目资源均可免费下载使用，为广大学子提供优质的学习参考资料。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Code className="text-blue-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">项目定制</h3>
                  <p className="text-gray-600">站主承接各类大作业、网站设计开发、毕业设计等项目，价格实惠，质量保证。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare className="text-purple-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">技术咨询</h3>
                  <p className="text-gray-600">大小项目均可咨询，提供专业的技术支持和解决方案。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Gift className="text-red-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">特别优惠</h3>
                  <p className="text-gray-600">首次合作即可享受优惠价格，长期合作还有更多优惠等着您！</p>
                </div>
              </div>``

              <div className="flex items-start gap-4">
                <Phone className="text-yellow-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">联系方式</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">QQ：935764227</p>
                    <p className="text-gray-600">微信：zhizhi1699999</p>
                    <p className="text-gray-600 text-sm">工作时间：周一至周日 9:00-22:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                开始浏览
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;