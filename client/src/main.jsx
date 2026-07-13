import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure a caching QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Avoid refetching when user tabs away and returns
      retry: 1,                    // Limit automatic request retries on failure
      staleTime: 5 * 60 * 1000,    // Cache views for up to 5 minutes by default
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
