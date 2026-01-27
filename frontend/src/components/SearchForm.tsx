import { useState, type FormEvent } from 'react';
import type { SearchRequest } from '../services/api';

interface SearchFormProps {
  onSearch: (params: SearchRequest) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [searchString, setSearchString] = useState('');
  const [earliestTime, setEarliestTime] = useState('');
  const [latestTime, setLatestTime] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({
      search_string: searchString || undefined,
      earliest_time: earliestTime ? parseInt(earliestTime) : null,
      latest_time: latestTime ? parseInt(latestTime) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Search Events</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search String
        </label>
        <input
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="e.g., 159.62.125.136, REJECT, account-id..."
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-500">
          Search in: srcaddr, dstaddr, account_id, instance_id, action, log_status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Earliest Time (Epoch)
          </label>
          <input
            type="number"
            value={earliestTime}
            onChange={(e) => setEarliestTime(e.target.value)}
            placeholder="e.g., 1725850449"
            className="input-field"
          />
          {earliestTime && (
            <p className="mt-1 text-xs text-gray-500">
              {new Date(parseInt(earliestTime) * 1000).toLocaleString()}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latest Time (Epoch)
          </label>
          <input
            type="number"
            value={latestTime}
            onChange={(e) => setLatestTime(e.target.value)}
            placeholder="e.g., 1725855086"
            className="input-field"
          />
          {latestTime && (
            <p className="mt-1 text-xs text-gray-500">
              {new Date(parseInt(latestTime) * 1000).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Searching...' : 'Search Events'}
      </button>
    </form>
  );
}
