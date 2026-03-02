
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Nexus Core: Initializing Arena UI...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Nexus Error: Could not find root element to mount to");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Nexus Core: Arena UI Deployment Complete.");
}
