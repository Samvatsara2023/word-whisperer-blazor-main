
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import DictionaryService from '../services/DictionaryService';

const WordDictionary = () => {
  const [inputWord, setInputWord] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleLookup = () => {
    const result = DictionaryService.lookupWord(inputWord.trim());
    if (result) {
      setOutputText(result);
    } else {
      setOutputText('Word not found in dictionary');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Word Dictionary</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/search">
            <Button variant="outline">Search Dictionary</Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Input</h2>
          <div className="space-y-4">
            <Input
              placeholder="Enter a word to look up"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
            />
            <Button 
              onClick={handleLookup} 
              disabled={!inputWord.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Output</h2>
          <Textarea
            value={outputText}
            readOnly
            className="min-h-[120px] bg-gray-50 border-blue-200"
            placeholder="Meaning/synonyms will appear here"
          />
        </div>
      </div>
    </div>
  );
};

export default WordDictionary;
