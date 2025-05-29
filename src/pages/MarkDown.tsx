
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhoneticService from '../services/PhoneticService';

const MarkDown = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleConvert = () => {
    if (!inputText.trim()) return;
    
    const lines = inputText.split('\n');
    const convertedLines = lines.map(line => {
      if (!line.trim()) return line; // Keep empty lines as is
      
      let convertedLine = line;
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
          const regex = new RegExp(`(?<![a-zA-ZæøåÆØÅ])${escapedWord}(?![a-zA-ZæøåÆØÅ])`, 'gi');
          convertedLine = convertedLine.replace(regex, meaning);
        }
      });
      
      // Format as: Original line - **Converted line** - Meaning ##
      return `${line} - **${convertedLine}** - Meaning  ## \\`;
    });
    
    setOutputText(convertedLines.join('\n'));
  };

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (!line.trim()) return <br key={index} />;
        
        // Process markdown formatting
        let processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
          .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
          .replace(/##/g, '') // Remove ## markers
          .replace(/ - Meaning $/g, ''); // Clean up trailing markers
        
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: processedLine }}
            className="mb-2"
          />
        );
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">MarkDown Converter</h1>
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
          <Link to="/converter">
            <Button variant="outline">Text Converter</Button>
          </Link>
          <Link to="/phonetic">
            <Button variant="outline">Phonetic Converter</Button>
          </Link>
          <Link to="/translations">
            <Button variant="outline">Manage Translations</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Markdown Editor</h2>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your markdown text to convert words"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] border-blue-200 focus:border-blue-400 font-mono"
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
          <Tabs defaultValue="raw" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="raw">Raw</TabsTrigger>
              <TabsTrigger value="markdown">Markdown View</TabsTrigger>
            </TabsList>
            <TabsContent value="raw">
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[200px] bg-gray-50 border-blue-200 font-mono"
                placeholder="Raw converted text will appear here"
              />
            </TabsContent>
            <TabsContent value="markdown">
              <div className="min-h-[200px] bg-gray-50 border border-blue-200 rounded-md p-3 overflow-auto">
                {outputText ? (
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdown(outputText)}
                  </div>
                ) : (
                  <p className="text-gray-500">Rendered markdown will appear here</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MarkDown;
