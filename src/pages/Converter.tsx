
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import PhoneticService from '../services/PhoneticService';

const Converter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleConvert = () => {
    if (!inputText.trim()) return;
    
    let convertedText = inputText;
    const words = PhoneticService.getAllWords();
    
    // Sort words by length (longest first) to avoid partial replacements
    const sortedWords = words.sort((a, b) => b.length - a.length);
    
    // Replace all occurrences of dictionary words with their meanings
    sortedWords.forEach(word => {
      const meaning = PhoneticService.lookupWord(word);
      if (meaning) {
        // Escape special regex characters in the word
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Create a regex that matches the word with custom word boundaries for Danish/Norwegian characters
        // Use negative lookbehind and lookahead to ensure we match whole words including æ, ø, å
        const regex = new RegExp(`(?<![a-zA-ZæøåÆØÅ])${escapedWord}(?![a-zA-ZæøåÆØÅ])`, 'gi');
        convertedText = convertedText.replace(regex, meaning);
      }
    });
    
    setOutputText(convertedText);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Text Converter</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/dictionary">
            <Button variant="outline">Dictionary Lookup</Button>
          </Link>
          <Link to="/manage">
            <Button variant="outline">Manage Dictionary</Button>
          </Link>
          <Link to="/phonetic">
            <Button variant="outline">Phonetic Converter</Button>
          </Link>
          <Link to="/markdown">
            <Button variant="outline">MarkDown Converter</Button>
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
            <Textarea
              placeholder="Enter your text to convert words"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] border-blue-200 focus:border-blue-400"
            />
            <Button 
              onClick={handleConvert} 
              disabled={!inputText.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Convert
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Output</h2>
          <Textarea
            value={outputText}
            readOnly
            className="min-h-[200px] bg-gray-50 border-blue-200"
            placeholder="Converted text will appear here"
          />
        </div>
      </div>
    </div>
  );
};

export default Converter;
