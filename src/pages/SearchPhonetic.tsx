
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft } from 'lucide-react';
import PhoneticService from '../services/PhoneticService';

const SearchPhonetic = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{word: string, meaning: string}[]>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const allWords = PhoneticService.getAllWords();
    const results = allWords
      .filter(word => {
        const meaning = PhoneticService.lookupWord(word) || '';
        return word.toLowerCase().includes(searchTerm.toLowerCase()) ||
               meaning.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .map(word => ({
        word,
        meaning: PhoneticService.lookupWord(word) || ''
      }))
      .slice(0, 20); // Limit to 20 results
    
    setSearchResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Search Phonetic Dictionary</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/manage-phonetic">
            <Button variant="outline">Manage Phonetic</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-600">Search Phonetic Dictionary</CardTitle>
            <CardDescription>
              Search for words or meanings in the phonetic dictionary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter word or meaning to search..."
                className="flex-1 border-blue-200 focus:border-blue-400"
              />
              <Button 
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} result(s) for "{searchTerm}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-blue-600">{result.word}</h3>
                        <p className="text-gray-700 mt-1">{result.meaning}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {searchTerm && searchResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No results found for "{searchTerm}"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchPhonetic;
