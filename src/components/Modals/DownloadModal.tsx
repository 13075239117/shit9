import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Lock } from 'lucide-react';

interface DownloadModalProps {
  file: any;
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ file, isOpen, onClose }) => {
  const [downloadCode, setDownloadCode] = useState('');
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = () => {
    setIsDownloading(true);  // 开始下载，显示提示
    const link = document.createElement('a');
    link.href = file.download_link;

    // 设置下载的文件名（如果需要）
    link.setAttribute('download', 'filename.zip');

    // 将<a>元素临时添加到DOM中
    document.body.appendChild(link);

    // 触发<a>元素的点击事件以开始下载
    link.click();

    // 从DOM中移除<a>元素
    document.body.removeChild(link);
    onClose();

    // 下载后执行关闭操作
    setTimeout(() => {
      setIsDownloading(false);  // 下载开始后，隐藏提示
    }, 1000); // 给用户一些时间看到提示，再关闭
    // onClose();

    // window.open(file.download_link);
    // if (downloadCode === '123456') { // Replace with actual validation
    //   // Handle download logic here
    //   console.log('Downloading:', file.name);
    //   onClose();
    // } else {
    //   setError('下载码不正确');
    // }
  };

  return (
    <AnimatePresence>
       {/* 下载中提示 */}
       {isDownloading && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-white p-4 bg-gray-700 rounded-md shadow-lg">
            正在准备下载...
          </div>
        </motion.div>
      )}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">下载文件</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">文件名：{file?.name}</p>
              {/* <div className="flex gap-2 items-center">
                <Lock size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="请输入下载码"
                  value={downloadCode}
                  onChange={(e) => setDownloadCode(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )} */}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                下载
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;