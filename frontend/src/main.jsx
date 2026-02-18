import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <App />
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </React.StrictMode>
);
