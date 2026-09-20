import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. استيراد الموجه
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. تغليف التطبيق بالموجه */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)