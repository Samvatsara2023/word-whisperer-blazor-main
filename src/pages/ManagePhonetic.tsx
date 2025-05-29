
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Download, Upload, Search } from "lucide-react";
import PhoneticService from "../services/PhoneticService";
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ManagePhonetic = () => {
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
  }, [words, searchTerm]);

  const loadWords = () => {
    const allWords = PhoneticService.getAllWords();
    setWords(allWords);
  };

  const filterWords = () => {
    if (!searchTerm.trim()) {
      setFilteredWords(words);
    } else {
      const filtered = words.filter(word => {
        const meaning = PhoneticService.lookupWord(word) || '';
        return word.toLowerCase().includes(searchTerm.toLowerCase()) ||
               meaning.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredWords(filtered);
    }
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddWord = () => {
    if (newWord.trim() && newMeaning.trim()) {
      PhoneticService.addWord(newWord.trim().toLowerCase(), newMeaning.trim());
      setNewWord('');
      setNewMeaning('');
      loadWords();
      toast({
        title: "Word Added",
        description: `"${newWord}" has been added to the phonetic dictionary.`
      });
    }
  };

  const handleDeleteWord = (word: string) => {
    PhoneticService.removeWord(word);
    loadWords();
    toast({
      title: "Word Deleted",
      description: `"${word}" has been removed from the phonetic dictionary.`,
      variant: "destructive"
    });
  };

  const handleEditWord = () => {
    if (editingWord && editingMeaning) {
      PhoneticService.addWord(editingWord.toLowerCase(), editingMeaning);
      setEditingWord('');
      setEditingMeaning('');
      loadWords();
      toast({
        title: "Word Updated",
        description: `"${editingWord}" has been updated in the phonetic dictionary.`
      });
    }
  };

  const startEditing = (word: string) => {
    const meaning = PhoneticService.lookupWord(word) || '';
    setEditingWord(word);
    setEditingMeaning(meaning);
  };

  const handleExport = () => {
    const data = PhoneticService.exportDictionary();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phonetic-dictionary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dictionary Exported",
      description: "Phonetic dictionary has been exported successfully."
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          const importCount = PhoneticService.importDictionary(importedData);
          loadWords();
          toast({
            title: "Dictionary Imported",
            description: `Successfully imported ${importCount} words to the phonetic dictionary.`
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid file format. Please select a valid JSON file.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  // Generate pagination numbers with ellipses logic
  const generatePaginationNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const pages = [];
      const currentPageNum = currentPage;
      
      if (currentPageNum <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPageNum >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPageNum - 1, currentPageNum, currentPageNum + 1, '...', totalPages);
      }
      
      return pages;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Manage Phonetic Dictionary</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/search-phonetic">
            <Button variant="outline">Search Phonetic</Button>
          </Link>
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
              <label className="block text-sm font-medium mb-1">Phonetic Meaning</label>
              <Textarea 
                value={newMeaning} 
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="Enter phonetic meaning"
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
          
          <div className="mt-6 pt-6 border-t border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Import/Export</h3>
            <div className="space-y-2">
              <Button 
                onClick={handleExport}
                variant="outline" 
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Dictionary
              </Button>
              <label className="block">
                <Button 
                  variant="outline" 
                  className="w-full cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Dictionary
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">Dictionary Words</h2>
            <div className="text-sm text-gray-600">
              {filteredWords.length} of {words.length} words
            </div>
          </div>
          
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search words..."
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="border border-blue-200 rounded-md overflow-hidden">
            <Table>
              <TableCaption>
                {filteredWords.length > 0 
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredWords.length)} of ${filteredWords.length} words`
                  : "No words found"
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Phonetic Meaning</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWords.map((word) => (
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
                              <SheetTitle>Edit Word</SheetTitle>
                              <SheetDescription>
                                Make changes to the word and its phonetic meaning
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
                                <label className="text-sm font-medium">Phonetic Meaning</label>
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

export default ManagePhonetic;
