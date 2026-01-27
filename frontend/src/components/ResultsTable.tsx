import { useState } from 'react';
import type { Event } from '../services/api';

interface ResultsTableProps {
  results: Event[];
  searchTime: number;
}

export function ResultsTable({ results, searchTime }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 20;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  if (results.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">No results found</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
        <p className="text-sm text-gray-500 mt-1">Search Time: {searchTime.toFixed(2)} seconds</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
        <p className="text-sm text-gray-500">Found {results.length} matching events</p>
      </div>

      <div className="space-y-3">
        {currentResults.map((event, index) => (
          <div 
            key={`${event.source_file}-${event.serialno}-${index}`}
            className="border border-gray-200 rounded p-3"
          >
            <p className="font-medium text-gray-900">
              Event Found: {event.srcaddr} → {event.dstaddr} | Action: {event.action} | Log Status: {event.log_status}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              File: {event.source_file}
            </p>
            <p className="text-sm text-gray-600 mt-1">Search Time: {searchTime.toFixed(2)} seconds</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
