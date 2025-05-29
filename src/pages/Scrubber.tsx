
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import PhoneticService from '../services/PhoneticService';

const Scrubber = () => {
  const [inputText, setInputText] = useState('');
  const [distinctWords, setDistinctWords] = useState('');
  const [filteredWords, setFilteredWords] = useState('');
  const [missingWords, setMissingWords] = useState('');

  const handleScrub = () => {
    if (!inputText.trim()) return;
    
    // Extract distinct words from input text
    const words = inputText
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.replace(/[^\w\sæøåÆØÅ]/g, ''))
      .filter(word => word.length > 0);
    
    const uniqueWords = [...new Set(words)].sort();
    setDistinctWords(uniqueWords.join('\n'));
    
    // Filter words that exist in phonetic dictionary
    const phoneticWords = PhoneticService.getAllWords();
    const filteredUniqueWords = uniqueWords.filter(word => 
      phoneticWords.includes(word.toLowerCase())
    );
    setFilteredWords(filteredUniqueWords.join('\n'));
    
    // Find missing words and format them
    const missingUniqueWords = uniqueWords.filter(word => 
      !phoneticWords.includes(word.toLowerCase())
    );
    const formattedMissingWords = missingUniqueWords.map(word => 
      `"${word}": "**${word}**",`
    ).join('\n');
    setMissingWords(formattedMissingWords);
  };

  return (
    <div className="container mx-auto p-4">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Text Scrubber</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/converter">
            <Button variant="outline">Text Converter</Button>
          </Link>
          <Link to="/manage-phonetic">
            <Button variant="outline">Manage Phonetic</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Input Text</h2>
          <Textarea
            placeholder="Enter your text to extract distinct words"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] border-blue-200 focus:border-blue-400 w-full"
          />
          <Button 
            onClick={handleScrub} 
            disabled={!inputText.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
          >
            Scrub Text
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Missing Words in Phonetic Dictionary</h2>

          <Textarea
            value={missingWords}
            readOnly
            className="min-h-[200px] border-blue-200 focus:border-blue-400 w-full"
            placeholder="Missing words will appear here in the format: ---- "
          />

          <h2 className="text-xl font-semibold mb-4 text-blue-600">Missing Words in Phonetic Dictionary</h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Distinct Words</h2>
            <Textarea
              value={distinctWords}
              readOnly
              className="min-h-[300px] bg-gray-50 border-blue-200"
              placeholder="Distinct words will appear here"
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Words in Phonetic Dictionary</h2>
            <Textarea
              value={filteredWords}
              readOnly
              className="min-h-[300px] bg-gray-50 border-blue-200"
              placeholder="Words found in phonetic dictionary will appear here"
            />
          </div>
          
        </div>

          
      </div>
      
    </div>
  );
};

export default Scrubber;
