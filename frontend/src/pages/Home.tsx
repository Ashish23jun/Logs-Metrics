import { useState } from 'react';
import { SearchForm } from '../components/SearchForm';
import { FileUpload } from '../components/FileUpload';
import { ResultsTable } from '../components/ResultsTable';
import { searchEvents, type SearchResponse, type SearchRequest } from '../services/api';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'upload'>('upload');

  const handleSearch = async (params: SearchRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchEvents(params);
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    setActiveTab('search');  
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Event Log Search</h1>
              <p className="text-sm text-gray-500">Aceable Cyber Solutions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Search Events
          </button>
        </div>

        {activeTab === 'upload' ? (
          <FileUpload onUploadComplete={handleUploadComplete} />
        ) : (
          <div className="space-y-6">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {searchResult && searchResult.success && (
              <ResultsTable 
                results={searchResult.results} 
                searchTime={searchResult.search_time_seconds}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
