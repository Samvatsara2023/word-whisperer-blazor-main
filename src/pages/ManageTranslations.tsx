import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import PhoneticService from "../services/PhoneticService";
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ManageTranslations = () => {
  const [translations, setTranslations] = useState<string[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<string[]>([]);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [editingOriginal, setEditingOriginal] = useState('');
  const [editingTranslation, setEditingTranslation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [translations, searchTerm]);

  const loadTranslations = () => {
    const allWords = PhoneticService.getAllWords();
    setTranslations(allWords);
  };

  const filterTranslations = () => {
    if (!searchTerm.trim()) {
      setFilteredTranslations(translations);
    } else {
      const filtered = translations.filter(word => {
        const meaning = PhoneticService.lookupWord(word) || '';
        return word.toLowerCase().includes(searchTerm.toLowerCase()) ||
               meaning.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredTranslations(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredTranslations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTranslations = filteredTranslations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddTranslation = () => {
    if (originalText.trim() && translatedText.trim()) {
      PhoneticService.addWord(originalText.trim().toLowerCase(), translatedText.trim());
      setOriginalText('');
      setTranslatedText('');
      loadTranslations();
      toast({
        title: "Translation Added",
        description: `"${originalText}" has been added to translations.`
      });
    }
  };

  const handleDeleteTranslation = (word: string) => {
    PhoneticService.removeWord(word);
    loadTranslations();
    toast({
      title: "Translation Deleted",
      description: `"${word}" has been removed from translations.`,
      variant: "destructive"
    });
  };

  const handleEditTranslation = () => {
    if (editingOriginal && editingTranslation) {
      PhoneticService.addWord(editingOriginal.toLowerCase(), editingTranslation);
      setEditingOriginal('');
      setEditingTranslation('');
      loadTranslations();
      toast({
        title: "Translation Updated",
        description: `"${editingOriginal}" translation has been updated.`
      });
    }
  };

  const startEditing = (word: string) => {
    const meaning = PhoneticService.lookupWord(word) || '';
    setEditingOriginal(word);
    setEditingTranslation(meaning);
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Manage Translations</h1>
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
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Add New Translation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Original Text</label>
              <Input 
                value={originalText} 
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Enter original text"
                className="w-full border-blue-200 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Translated Text</label>
              <Textarea 
                value={translatedText} 
                onChange={(e) => setTranslatedText(e.target.value)}
                placeholder="Enter translation"
                className="w-full border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button 
              onClick={handleAddTranslation}
              disabled={!originalText.trim() || !translatedText.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2" /> Add Translation
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">Translation Pairs</h2>
            <div className="text-sm text-gray-600">
              {filteredTranslations.length} of {translations.length} translations
            </div>
          </div>
          
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search translations..."
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="border border-blue-200 rounded-md overflow-hidden">
            <Table>
              <TableCaption>
                {filteredTranslations.length > 0 
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredTranslations.length)} of ${filteredTranslations.length} translation pairs`
                  : "No translation pairs found"
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Original</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTranslations.map((word) => (
                  <TableRow key={word}>
                    <TableCell>{word}</TableCell>
                    <TableCell>{PhoneticService.lookupWord(word)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => startEditing(word)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Edit Translation</SheetTitle>
                              <SheetDescription>
                                Make changes to the translation
                              </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="text-sm font-medium">Original Text</label>
                                <Input 
                                  value={editingOriginal} 
                                  onChange={(e) => setEditingOriginal(e.target.value)}
                                  className="mt-1 border-blue-200"
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Translation</label>
                                <Textarea 
                                  value={editingTranslation} 
                                  onChange={(e) => setEditingTranslation(e.target.value)}
                                  className="mt-1 border-blue-200"
                                />
                              </div>
                              <Button 
                                onClick={handleEditTranslation} 
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteTranslation(word)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  );
};

export default ManageTranslations;
