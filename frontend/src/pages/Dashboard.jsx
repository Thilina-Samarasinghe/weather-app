import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getWeather } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import Loading from '../components/Loading';
import ThemeToggle from '../components/ThemeToggle';
import TemperatureTrend from '../components/TemperatureTrend';

const Dashboard = () => {
  const { getAccessTokenSilently, logout, user } = useAuth0();
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'ascending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await getWeather(token);
        if (response.success) {
          setCities(response.data);
          setFilteredCities(response.data);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchData();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    let result = [...cities];

    // Search
    if (searchTerm) {
      result = result.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties if necessary (e.g. comfortIndex.score if structure changed, but currrently flattened or direct)
        // Assuming comfortIndex is a number on city object based on previous context, or we check structure.
        // Let's assume city structure from API. Based on typical weather apps:
        // city = { name, main: { temp }, comfortIndex, rank }
        // If sort key is 'temperature', it might be in city.main.temp

        if (sortConfig.key === 'temperature') {
          aValue = a.temperature;
          bValue = b.temperature;
        } else if (sortConfig.key === 'comfortIndex') {
          aValue = a.comfortIndex;
          bValue = b.comfortIndex;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCities(result);
  }, [cities, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Sorting and Filtering Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex space-x-2">
          <button
            onClick={() => handleSort('name')}
            className={`px-4 py-2 rounded-lg ${sortConfig.key === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('temperature')}
            className={`px-4 py-2 rounded-lg ${sortConfig.key === 'temperature' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Temp {sortConfig.key === 'temperature' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('comfortIndex')}
            className={`px-4 py-2 rounded-lg ${sortConfig.key === 'comfortIndex' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Comfort {sortConfig.key === 'comfortIndex' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Temperature Trend Graph */}
      {!loading && !error && cities.length > 0 && (
        <TemperatureTrend cities={cities} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <WeatherCard key={city.id} city={city} rank={city.rank} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
