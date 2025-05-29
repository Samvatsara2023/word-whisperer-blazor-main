
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DictionaryService from '../services/DictionaryService';
import PhoneticService from '../services/PhoneticService';

const Diff = () => {
  const [dictionaryOnlyWords, setDictionaryOnlyWords] = useState<string[]>([]);
  const [phoneticOnlyWords, setPhoneticOnlyWords] = useState<string[]>([]);
  const [commonWords, setCommonWords] = useState<string[]>([]);

  useEffect(() => {
    calculateDiff();
  }, []);

  const calculateDiff = () => {
    const dictWords = new Set(DictionaryService.getAllWords().map(w => w.toLowerCase()));
    const phoneticWords = new Set(PhoneticService.getAllWords().map(w => w.toLowerCase()));
    
    const dictOnly = [...dictWords].filter(word => !phoneticWords.has(word)).sort();
    const phoneticOnly = [...phoneticWords].filter(word => !dictWords.has(word)).sort();
    const common = [...dictWords].filter(word => phoneticWords.has(word)).sort();
    
    setDictionaryOnlyWords(dictOnly);
    setPhoneticOnlyWords(phoneticOnly);
    setCommonWords(common);
  };

  const syncToPhonetic = (word: string) => {
    const meaning = DictionaryService.lookupWord(word);
    if (meaning) {
      PhoneticService.addWord(word, meaning);
      calculateDiff();
    }
  };

  const syncToDictionary = (word: string) => {
    const meaning = PhoneticService.lookupWord(word);
    if (meaning) {
      DictionaryService.addWord(word, meaning);
      calculateDiff();
    }
  };

  const syncAllToPhonetic = () => {
    dictionaryOnlyWords.forEach(word => {
      const meaning = DictionaryService.lookupWord(word);
      if (meaning) {
        PhoneticService.addWord(word, meaning);
      }
    });
    calculateDiff();
  };

  const syncAllToDictionary = () => {
    phoneticOnlyWords.forEach(word => {
      const meaning = PhoneticService.lookupWord(word);
      if (meaning) {
        DictionaryService.addWord(word, meaning);
      }
    });
    calculateDiff();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Dictionary Diff Tool</h1>
        <div className="space-x-2">
          <Link to="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link to="/manage">
            <Button variant="outline">Manage Dictionary</Button>
          </Link>
          <Link to="/manage-phonetic">
            <Button variant="outline">Manage Phonetic</Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dictionary Only</CardTitle>
            <CardDescription>Words only in main dictionary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{dictionaryOnlyWords.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phonetic Only</CardTitle>
            <CardDescription>Words only in phonetic dictionary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{phoneticOnlyWords.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Words</CardTitle>
            <CardDescription>Words in both dictionaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{commonWords.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Dictionary Only Words
              <Button onClick={syncAllToPhonetic} disabled={dictionaryOnlyWords.length === 0}>
                Sync All to Phonetic
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dictionaryOnlyWords.map((word) => (
                <div key={word} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{word}</span>
                  <Button size="sm" onClick={() => syncToPhonetic(word)}>
                    Sync →
                  </Button>
                </div>
              ))}
              {dictionaryOnlyWords.length === 0 && (
                <p className="text-gray-500">No unique words in dictionary</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Phonetic Only Words
              <Button onClick={syncAllToDictionary} disabled={phoneticOnlyWords.length === 0}>
                Sync All to Dictionary
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {phoneticOnlyWords.map((word) => (
                <div key={word} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{word}</span>
                  <Button size="sm" onClick={() => syncToDictionary(word)}>
                    ← Sync
                  </Button>
                </div>
              ))}
              {phoneticOnlyWords.length === 0 && (
                <p className="text-gray-500">No unique words in phonetic dictionary</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Diff;
