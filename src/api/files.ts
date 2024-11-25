import { api, handleApiError } from './config';
import { mockFiles } from './mock';

export interface FileItem {
  id: number;
  name: string;
  type: string;
  path: string;
  children: FileItem[];
}

export interface SearchResult {
  id: string;
  name: string;
  path: string;
  type: string;
  matchType: 'name' | 'content';
  matchText?: string; // 匹配到的文本片段
  lineNumber?: number; // 匹配到的行号
}

export const fetchFiles = async (folderId: string | null = null): Promise<FileItem[]> => {
  try {
    const response = await fetch('/fileData.json');
    const data = await response.json();
    
    if (folderId) {
      const findFolder = (items: FileItem[]): FileItem[] => {
        for (const item of items) {
          if (item.id.toString() === folderId) {
            return item.children;
          }
          if (item.children.length > 0) {
            const result = findFolder(item.children);
            if (result.length > 0) return result;
          }
        }
        return [];
      };
      return findFolder(data);
    }
    
    return data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const searchFiles = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  const searchInFiles = (files: FileItem[]): SearchResult[] => {
    let results: SearchResult[] = [];
    const searchQuery = query.toLowerCase();

    const processFile = (file: FileItem) => {
      // 搜索文件名
      if (file.name?.toLowerCase()?.includes(searchQuery)) {
        results.push({
          id: file.id.toString(),
          name: file.name,
          path: file.path,
          type: file.type,
          matchType: 'name'
        });
      }

      // 如果是文件，搜索文件内容（这里模拟文件内容搜索）
      if (file.type.toLowerCase() === 'file') {
        // 在实际应用中，这里应该从后端获取文件内容并搜索
        // 这里仅作为示例，模拟在文件描述中搜索
        const description = file.path.toLowerCase();
        if (description.includes(searchQuery)) {
          results.push({
            id: file.id.toString(),
            name: file.name,
            path: file.path,
            type: file.type,
            matchType: 'content',
            matchText: file.path, // 实际应用中应该显示匹配的文本片段
            lineNumber: 1 // 实际应用中应该是真实的行号
          });
        }
      }

      // 递归搜索子文件和文件夹
      if (file.children && file.children.length > 0) {
        file.children.forEach(processFile);
      }
    };

    files.forEach(processFile);
    return results;
  };

  try {
    const response = await fetch('/search_repositories?keyword='+query);
    const data = await response.json();
    // return searchInFiles(data);
    return data
  } catch (error) {
    handleApiError(error);
    return [];
  }
};