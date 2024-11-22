import React, { useEffect, useState,useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Folder, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchFiles, FileItem, SearchResult } from '../../api/files';
import { setSelectedFolder } from '../../store/slices/filesSlice';
import { setUser } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store';
import QRCodeLoginModal from '../Modals/QRCodeLoginModal';
import FileGridSkeleton from './FileGridSkeleton';

const FileItemComponent: React.FC<{ item: FileItem | SearchResult; onClick: () => void }> = React.memo(({ item, onClick }) => {
  const getIcon = () => {
    return item.type.toLowerCase() === 'folder' ? 
      <Folder className="text-blue-500" size={40} /> : 
      <FileText className="text-orange-500" size={40} />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="file-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        {getIcon()}
        <span className="text-sm text-gray-700 text-center break-words w-full">
          {item.name}
        </span>
      </div>
    </motion.div>
  );
});

interface FileGridProps {
  searchResults?: SearchResult[];
  searchQuery?: string;
}

const FileGrid: React.FC<FileGridProps> = React.memo(({ searchResults, searchQuery }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(true);
  const selectedFolder = useSelector((state: RootState) => state.files.selectedFolder);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const loadFiles = async () => {
      if (searchQuery) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchFiles(selectedFolder || '1');
        setFiles(data);
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [selectedFolder, searchQuery]);

  const handleLoginSuccess = useCallback((userData: any) => {
    dispatch(setUser(userData));
    if (selectedFile) {
      window.open(selectedFile.path, '_blank');
    }
    setSelectedFile(null);
  }, [dispatch, selectedFile]);

  const handleFileClick = useCallback((file: FileItem | SearchResult) => {
    if (file.type.toLowerCase() === 'folder') {
      dispatch(setSelectedFolder(file.id.toString()));
    } else if (!isAuthenticated) {
      setSelectedFile(file as FileItem);
    } else {
      window.open(file.path, '_blank');
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <FileGridSkeleton />;
  }

  const displayItems = searchQuery ? searchResults : files;

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          {searchQuery ? '未找到相关内容' : t('common.noResults')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchQuery && (
        <div className="px-4 py-2 bg-blue-50 rounded-lg">
          <p className="text-blue-600">
            搜索结果: "{searchQuery}" ({displayItems.length} 个结果)
          </p>
        </div>
      )}
      
      <div className="folder-grid">
        <AnimatePresence>
          {displayItems.map((item) => (
            <FileItemComponent
              key={item.id}
              item={item}
              onClick={() => handleFileClick(item)}
            />
          ))}
        </AnimatePresence>
      </div>

      <QRCodeLoginModal
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
});

FileGrid.displayName = 'FileGrid';
FileItemComponent.displayName = 'FileItemComponent';

export default FileGrid;