import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1E293B',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: { iconTheme: { primary: '#3B82F6', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
