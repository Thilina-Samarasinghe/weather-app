import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Weather Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sign in to access real-time weather data and comfort index rankings.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Log In / Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
