'use client';

import { useState } from 'react';
import { event, trackVehicleView, trackSearch, trackFavoriteAdd } from '@/utils/analytics';

export default function AnalyticsTestPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleTestEvent = () => {
    event({
      action: 'test_event',
      category: 'testing',
      label: 'manual_test',
      value: 1,
    });
    alert('Test event sent!');
  };

  const handleTestVehicleView = () => {
    trackVehicleView('test-vehicle-1', 'Tesla Model 3');
    alert('Vehicle view event sent!');
  };

  const handleTestSearch = () => {
    if (searchTerm) {
      trackSearch(searchTerm);
      alert(`Search event sent for: ${searchTerm}`);
    } else {
      alert('Please enter a search term');
    }
  };

  const handleTestFavorite = () => {
    trackFavoriteAdd('test-vehicle-1', 'Tesla Model 3');
    alert('Favorite event sent!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Google Analytics Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Events</h2>
          <div className="space-y-4">
            <button
              onClick={handleTestEvent}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Send Test Event
            </button>
            
            <button
              onClick={handleTestVehicleView}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors ml-4"
            >
              Test Vehicle View
            </button>
            
            <button
              onClick={handleTestFavorite}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors ml-4"
            >
              Test Favorite Add
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Search</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTestSearch}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Test Search
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Network tab</li>
            <li>Click the test buttons above</li>
            <li>Look for requests to google-analytics.com or googletagmanager.com</li>
            <li>Check the Console tab for any errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 