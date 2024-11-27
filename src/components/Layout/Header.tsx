import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User, Globe, ShoppingBag, Info, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/authSlice';
import { setSelectedFolder } from '../../store/slices/filesSlice';
import SearchBar from '../Search/SearchBar';
import type { RootState } from '../../store/store';
import { SearchResult } from '../../api/files';

interface HeaderProps {
  onSearch: (results: SearchResult[], query: string) => void;
  onShowWelcome: () => void;
}

const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onShowWelcome: () => void;
  user: any;
  onLogout: () => void;
}> = ({ isOpen, onClose, onShowWelcome, user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [showPurchases, setShowPurchases] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">菜单</h3>
              <button onClick={onClose} className="p-2">
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  onShowWelcome();
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <Info size={20} />
                <span>关于</span>
              </button>

              <button
                onClick={toggleLanguage}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <Globe size={20} />
                <span>{i18n.language.toUpperCase()}</span>
              </button>

              {user && (
                <>
                  <button
                    onClick={() => {
                      setShowPurchases(true);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <ShoppingBag size={20} />
                    <span>购买记录</span>
                  </button>

                  <div className="flex items-center gap-2 px-4 py-2">
                    <User size={20} />
                    <span>{user.name}</span>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <LogOut size={20} />
                    <span>{t('auth.logout')}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header: React.FC<HeaderProps> = ({ onSearch, onShowWelcome }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);

  const handleSearchSelect = (fileId: string, parentPath: string[]) => {
    if (parentPath.length > 0) {
      const lastFolderId = parentPath[parentPath.length - 1];
      dispatch(setSelectedFolder(lastFolderId));
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 relative">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <motion.h1 
          className="text-xl sm:text-3xl font-bold text-white text-center flex-1"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          2024全网最全计算机专业毕设项目代码资料大合集
        </motion.h1>
        
        <div className="flex items-center gap-2">
          <SearchBar 
            onSelect={handleSearchSelect} 
            onSearch={onSearch}
          />

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={onShowWelcome}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              <Info size={18} />
              <span>关于</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="sm:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onShowWelcome={onShowWelcome}
        user={user}
        onLogout={() => dispatch(logout())}
      />

      {user && (
        <PurchaseHistory 
          isOpen={showPurchases} 
          onClose={() => setShowPurchases(false)} 
        />
      )}
    </header>
  );
};

const PurchaseHistory: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const purchases = useSelector((state: RootState) => state.purchases.purchases);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">购买记录</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>

            {purchases.length === 0 ? (
              <p className="text-center text-gray-500 py-8">暂无购买记录</p>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="font-medium">{purchase.fileName}</h4>
                        <p className="text-sm text-gray-500">
                          购买时间: {new Date(purchase.purchaseDate).toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-600">￥{purchase.price}</p>
                      </div>
                      <button
                        onClick={() => window.open(purchase.downloadUrl, '_blank')}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Header;