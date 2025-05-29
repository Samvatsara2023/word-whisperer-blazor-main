
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import DictionaryService from '../services/DictionaryService';

const SearchDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const allWords = useMemo(() => DictionaryService.getAllWords(), []);
  
  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return allWords;
    
    const term = searchTerm.toLowerCase();
    return allWords.filter(word => 
      word.toLowerCase().includes(term) || 
      (DictionaryService.lookupWord(word) || '').toLowerCase().includes(term)
    );
  }, [searchTerm, allWords]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Generate pagination numbers with ellipses logic
  const generatePaginationNumbers = () => {
    if (totalPages <= 4) {
      // Show all pages if 4 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Show ellipses pattern for more than 4 pages
      const pages = [];
      const currentPageNum = currentPage;
      
      if (currentPageNum <= 3) {
        // Show first few pages
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPageNum >= totalPages - 2) {
        // Show last few pages
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show current page in middle
        pages.push(1, '...', currentPageNum - 1, currentPageNum, currentPageNum + 1, '...', totalPages);
      }
      
      return pages;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Search Dictionary</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/dictionary">
            <Button variant="outline">Dictionary Lookup</Button>
          </Link>
          <Link to="/converter">
            <Button variant="outline">Text Converter</Button>
          </Link>
          <Link to="/manage">
            <Button variant="outline">Manage Dictionary</Button>
          </Link>
          <Link to="/translations">
            <Button variant="outline">Manage Translations</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mb-6">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search for words or meanings..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-blue-200 focus:border-blue-400"
          />
          <Button 
            onClick={() => handleSearch('')}
            variant="outline"
            className="border-blue-200"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Search Results ({filteredWords.length})</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              {filteredWords.length > 0 
                ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredWords.length)} of ${filteredWords.length} words`
                : "No matching words found"
              }
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Word</TableHead>
                <TableHead>Translation/Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWords.length > 0 ? (
                currentWords.map((word) => (
                  <TableRow key={word}>
                    <TableCell className="font-medium">{word}</TableCell>
                    <TableCell>{DictionaryService.lookupWord(word) || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                    No matching words found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {generatePaginationNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDictionary;
