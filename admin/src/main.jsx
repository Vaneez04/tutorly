import { StrictMode } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import TutorContextProvider from './context/TutorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <TutorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </TutorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
