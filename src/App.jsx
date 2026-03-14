import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import Layout from './components/Layout'
import ScrollToAnchor from './components/ScrollToAnchor'
import { AuthProvider } from './context/AuthContext'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router basename="/Beautiful-India">
        <ScrollToAnchor />
        <Routes>
          <Route element={<Layout />}>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
