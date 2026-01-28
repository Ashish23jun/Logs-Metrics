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
        <div className="flex gap-4 mt-1 text-sm text-gray-500">
          <span>Found {results.length} matching events</span>
          <span>•</span>
          <span>Search Time: {searchTime.toFixed(3)} seconds</span>
        </div>
      </div>

      <div className="space-y-4">
        {currentResults.map((event, index) => (
          <div 
            key={`${event.source_file}-${event.serialno}-${index}`}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-3 pb-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 text-lg">
                {event.srcaddr} → {event.dstaddr}
              </h4>
              <div className="flex gap-4 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.action === 'ACCEPT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {event.action}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.log_status === 'OK' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.log_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Serial No:</span>
                <span className="ml-2 text-gray-900">{event.serialno}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Version:</span>
                <span className="ml-2 text-gray-900">{event.version}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Protocol:</span>
                <span className="ml-2 text-gray-900">{event.protocol}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Account ID:</span>
                <span className="ml-2 text-gray-900 font-mono text-xs">{event.account_id}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Instance ID:</span>
                <span className="ml-2 text-gray-900 font-mono text-xs">{event.instance_id}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Source Port:</span>
                <span className="ml-2 text-gray-900">{event.srcport}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dest Port:</span>
                <span className="ml-2 text-gray-900">{event.dstport}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Packets:</span>
                <span className="ml-2 text-gray-900">{event.packets}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Bytes:</span>
                <span className="ml-2 text-gray-900">{event.bytes.toLocaleString()}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Source File:</span>
                <span className="ml-2 text-gray-900 font-mono text-xs">{event.source_file}</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Start Time:-</span>
                  <span className="font-mono text-xs">{event.starttime}</span>
                  {/* <span className="text-gray-500 ml-2">
                    ({new Date(event.starttime * 1000).toLocaleString()})
                  </span> */}
              </div>
              <div>
                <span className="font-medium text-gray-700">End Time:-</span>
              
                  <span className="font-mono text-xs">{event.endtime}</span>
                  {/* <span className="text-gray-500 ml-2">
                    ({new Date(event.endtime * 1000).toLocaleString()})
                  </span> */}
              </div>
            </div>
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
