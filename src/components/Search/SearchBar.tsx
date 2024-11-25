import React, { useState, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import { searchFiles, SearchResult } from '../../api/files';

interface SearchBarProps {
  onSelect: (fileId: string, parentPath: string[]) => void;
  onSearch: (results: SearchResult[], query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onSearch }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 1000);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      onSearch([], '');
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchFiles(query);
      onSearch(searchResults, query);
    } catch (error) {
      console.error('Search error:', error);
      onSearch([], query);
    } finally {
      setIsLoading(false);
    }
  };

  // Use React.useEffect directly to avoid potential naming conflicts
  React.useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    if (result.matchType === 'content') {
      window.open(result.path, '_blank');
    } else {
      const pathParts = result.path.split('/').filter(Boolean);
      const parentPath = pathParts.slice(0, -1);
      onSelect(result.id, parentPath);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div ref={searchRef} className="relative flex items-center gap-2" style={{ zIndex: 1000 }}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="搜索文件名或内容..."
          className="w-64 px-4 py-2 pl-10 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={18} className="text-white" />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSearch}
        disabled={isLoading}
        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            搜索中...
          </>
        ) : (
          <>
            <Search size={18} />
            搜索
          </>
        )}
      </motion.button>
    </div>
  );
};

export default React.memo(SearchBar);