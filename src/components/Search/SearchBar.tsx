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
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    console.log(12312);
    
    if (!searchQuery.trim()) {
      onSearch([], '');
      return;
    }
    console.log(1231231231231);
    
    setIsLoading(true);
    try {
      const results = await searchFiles(searchQuery);
      onSearch(results, searchQuery);
    } catch (error) {
      console.error('Search error:', error);
      onSearch([], searchQuery);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch]);

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

  return (
    <div ref={searchRef} className="relative" style={{ zIndex: 1000 }}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文件名或内容..."
          className="w-64 px-4 py-2 pl-10 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 size={18} className="text-white animate-spin" />
          ) : (
            <Search size={18} className="text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SearchBar);