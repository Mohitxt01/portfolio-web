import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import './styles/index.css';

/* A note for anyone who opens the console — the kind of person
   this portfolio is partly written for. */
if (!import.meta.env.DEV) {
  console.log(
    '%c  MOHIT TANTWAY  %c  Full-Stack · Systems Architect  \n' +
      '  Built with React, GSAP, Lenis, and a hand-written WebGL2 shader.\n' +
      '  No UI kit, no CSS framework. Press ⌘K to navigate.\n' +
      '  Looking for an engineer? mohittantway1234@gmail.com',
    'background:#c8ff00;color:#060608;font-weight:700;font-family:monospace;padding:4px 0',
    'background:#16161e;color:#f5f3ee;font-family:monospace;padding:4px 0'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
