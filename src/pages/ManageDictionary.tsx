import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Edit, Trash2, Search, FileJson, Import } from "lucide-react";
import DictionaryService from "../services/DictionaryService";
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ManageDictionary = () => {
  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [editingWord, setEditingWord] = useState('');
  const [editingMeaning, setEditingMeaning] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    filterWords();
  }, [searchTerm, words]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const loadWords = () => {
    const allWords = DictionaryService.getAllWords();
    setWords(allWords);
  };

  const filterWords = () => {
    if (!searchTerm.trim()) {
      setFilteredWords(words);
      setCurrentPage(1); // Reset to first page when clearing search
      return;
    }

    const filtered = words.filter(word => {
      const meaning = DictionaryService.lookupWord(word) || '';
      return word.toLowerCase().includes(searchTerm.toLowerCase()) ||
             meaning.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredWords(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddWord = () => {
    if (newWord.trim() && newMeaning.trim()) {
      DictionaryService.addWord(newWord.trim().toLowerCase(), newMeaning.trim());
      setNewWord('');
      setNewMeaning('');
      loadWords();
      toast({
        title: "Success",
        description: "Word added successfully to dictionary",
      });
    }
  };

  const handleDeleteWord = (word: string) => {
    DictionaryService.removeWord(word);
    loadWords();
    toast({
      title: "Success", 
      description: "Word removed from dictionary",
    });
  };

  const handleEditWord = () => {
    if (editingWord && editingMeaning) {
      DictionaryService.addWord(editingWord.toLowerCase(), editingMeaning);
      setEditingWord('');
      setEditingMeaning('');
      loadWords();
      toast({
        title: "Success",
        description: "Word updated successfully",
      });
    }
  };

  const startEditing = (word: string) => {
    const meaning = DictionaryService.lookupWord(word) || '';
    setEditingWord(word);
    setEditingMeaning(meaning);
  };

  const handleExport = () => {
    try {
      const dictionary = DictionaryService.exportDictionary();
      const dataStr = JSON.stringify(dictionary, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dictionary.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Dictionary exported as JSON file",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export dictionary",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (typeof importedData !== 'object' || importedData === null) {
          throw new Error('Invalid file format');
        }

        const importCount = DictionaryService.importDictionary(importedData);
        loadWords();
        
        toast({
          title: "Import Successful",
          description: `Imported ${importCount} words into dictionary`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid JSON file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input value
    event.target.value = '';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Manage Dictionary</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dictionary Lookup</Button>
          </Link>
          <Link to="/converter">
            <Button variant="outline">Text Converter</Button>
          </Link>
          <Link to="/translations">
            <Button variant="outline">Manage Translations</Button>
          </Link>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search words or meanings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="border-blue-200">
            <FileJson className="mr-2 h-4 w-4" />
            Export
          </Button>
          <label htmlFor="import-file">
            <Button variant="outline" className="border-blue-200" asChild>
              <span>
                <Import className="mr-2 h-4 w-4" />
                Import
              </span>
            </Button>
          </label>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Add New Word</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Word</label>
              <Input 
                value={newWord} 
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Enter word"
                className="w-full border-blue-200 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meaning/Synonyms</label>
              <Textarea 
                value={newMeaning} 
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="Enter meaning or synonyms (comma separated)"
                className="w-full border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button 
              onClick={handleAddWord}
              disabled={!newWord.trim() || !newMeaning.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2" /> Add Word
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">Dictionary Words</h2>
            <span className="text-sm text-gray-500">
              {filteredWords.length} of {words.length} words
            </span>
          </div>
          <div className="border border-blue-200 rounded-md overflow-hidden max-h-96 overflow-y-auto">
            <Table>
              <TableCaption>
                {filteredWords.length > 0 
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredWords.length)} of ${filteredWords.length} words`
                  : "No matching words found"
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWords.map((word) => (
                  <TableRow key={word}>
                    <TableCell>{word}</TableCell>
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
                              <SheetTitle>Edit Word</SheetTitle>
                              <SheetDescription>
                                Make changes to the dictionary entry
                              </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="text-sm font-medium">Word</label>
                                <Input 
                                  value={editingWord} 
                                  onChange={(e) => setEditingWord(e.target.value)}
                                  className="mt-1 border-blue-200"
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Meaning/Synonyms</label>
                                <Textarea 
                                  value={editingMeaning} 
                                  onChange={(e) => setEditingMeaning(e.target.value)}
                                  className="mt-1 border-blue-200"
                                />
                              </div>
                              <Button 
                                onClick={handleEditWord} 
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
                          onClick={() => handleDeleteWord(word)}
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

export default ManageDictionary;
