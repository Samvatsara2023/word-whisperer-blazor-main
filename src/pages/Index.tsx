
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, FileText, Mic, Hash, Settings, Book, Languages, Volume2, VolumeX, Scissors, Diff, ChartBar } from 'lucide-react';
import DictionaryService from '../services/DictionaryService';
import PhoneticService from '../services/PhoneticService';

const Index = () => {
  const [showChart, setShowChart] = useState(false);
  
  // Get dictionary statistics
  const allWords = DictionaryService.getAllWords();
  const totalWords = allWords.length;
  
  // Get phonetic dictionary statistics
  const allPhoneticWords = PhoneticService.getAllWords();
  const totalPhoneticWords = allPhoneticWords.length;
  
  // Create sample data for charts
  const usageData = [
    {
      name: 'Dictionary Lookup',
      usage: 85,
    },
    {
      name: 'Text Converter',
      usage: 72,
    },
    {
      name: 'Phonetic',
      usage: 45,
    },
    {
      name: 'MarkDown',
      usage: 38,
    },
    {
      name: 'Search',
      usage: 62,
    },
    {
      name: 'Scrubber',
      usage: 25,
    },
    {
      name: 'Diff Tool',
      usage: 18,
    },
  ];

  const navigationCards = [
    {
      title: 'Word Dictionary',
      description: 'Look up individual words and their meanings',
      icon: Book,
      path: '/dictionary',
      color: 'bg-blue-500',
    },
    {
      title: 'Search Dictionary',
      description: 'Search through all dictionary entries',
      icon: Search,
      path: '/search',
      color: 'bg-green-500',
    },
    {
      title: 'Text Converter',
      description: 'Convert entire text passages word by word',
      icon: FileText,
      path: '/converter',
      color: 'bg-purple-500',
    },
    {
      title: 'Phonetic Converter',
      description: 'Convert text with phonetic format display',
      icon: Mic,
      path: '/phonetic',
      color: 'bg-orange-500',
    },
    {
      title: 'Search Phonetic',
      description: 'Search through phonetic dictionary entries',
      icon: Volume2,
      path: '/search-phonetic',
      color: 'bg-cyan-500',
    },
    {
      title: 'MarkDown Converter',
      description: 'Convert text with markdown formatting',
      icon: Hash,
      path: '/markdown',
      color: 'bg-indigo-500',
    },
    {
      title: 'Text Scrubber',
      description: 'Extract distinct words and filter by phonetic dictionary',
      icon: Scissors,
      path: '/scrubber',
      color: 'bg-yellow-500',
    },
    {
      title: 'Dictionary Diff',
      description: 'Compare and sync between dictionary and phonetic dictionary',
      icon: Diff,
      path: '/diff',
      color: 'bg-emerald-500',
    },
    {
      title: 'Manage Dictionary',
      description: 'Add, edit, and manage dictionary entries',
      icon: Settings,
      path: '/manage',
      color: 'bg-red-500',
    },
    {
      title: 'Manage Phonetic',
      description: 'Add, edit, and manage phonetic dictionary entries',
      icon: VolumeX,
      path: '/manage-phonetic',
      color: 'bg-pink-500',
    },
    {
      title: 'Manage Translations',
      description: 'Manage translation pairs and language settings',
      icon: Languages,
      path: '/translations',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Dictionary Dashboard</h1>
        <p className="text-gray-600">Manage and convert text using our comprehensive dictionary tools</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWords}</div>
            <p className="text-xs text-muted-foreground">
              in dictionary database
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">
              available conversion tools
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phonetic Words</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPhoneticWords}</div>
            <p className="text-xs text-muted-foreground">
              in phonetic dictionary
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Toggle Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowChart(!showChart)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChartBar className="h-4 w-4" />
          {showChart ? 'Hide' : 'Show'} Usage Statistics
        </Button>
      </div>

      {/* Usage Chart */}
      {showChart && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tool Usage Statistics</CardTitle>
            <CardDescription>
              Usage frequency of different dictionary tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={500}
                height={300}
                data={usageData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={card.path}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-md ${card.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
