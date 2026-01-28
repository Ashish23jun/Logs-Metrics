import { useState, type FormEvent } from 'react';
import type { SearchRequest } from '../services/api';

interface SearchFormProps {
  onSearch: (params: SearchRequest) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [searchString, setSearchString] = useState('');
  const [searchField, setSearchField] = useState('');
  const [earliestTime, setEarliestTime] = useState('');
  const [latestTime, setLatestTime] = useState('');

  const searchFieldOptions = [
    { value: '', label: 'All Fields' },
    { value: 'serialno', label: 'Serial Number' },
    { value: 'version', label: 'Version' },
    { value: 'account_id', label: 'Account ID' },
    { value: 'instance_id', label: 'Instance ID' },
    { value: 'srcaddr', label: 'Source Address' },
    { value: 'dstaddr', label: 'Destination Address' },
    { value: 'srcport', label: 'Source Port' },
    { value: 'dstport', label: 'Destination Port' },
    { value: 'protocol', label: 'Protocol' },
    { value: 'packets', label: 'Packets' },
    { value: 'bytes', label: 'Bytes' },
    { value: 'action', label: 'Action' },
    { value: 'log_status', label: 'Log Status' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({
      search_string: searchString || undefined,
      search_field: searchField || undefined,
      earliest_time: earliestTime ? parseInt(earliestTime) : null,
      latest_time: latestTime ? parseInt(latestTime) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Search Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
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
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search In
          </label>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="input-field"
          >
            {searchFieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 -mt-2">
        {searchField 
          ? `Searching in: ${searchFieldOptions.find(opt => opt.value === searchField)?.label}`
          : 'Searching in: All fields (serialno, version, account_id, instance_id, srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, action, log_status)'}
      </p>

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
