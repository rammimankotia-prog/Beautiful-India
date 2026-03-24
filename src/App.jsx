import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { routes } from './routes'
import Layout from './components/Layout'
import ScrollToAnchor from './components/ScrollToAnchor'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import './index.css'

function App() {
  return (
    <HelmetProvider>
      <DataProvider>
        <AuthProvider>
          <Router>
            <ScrollToAnchor />
            <Routes>
              <Route element={<Layout />}>
                {routes.map((route, index) => {
                  if (route.children) {
                    return (
                      <Route key={index} path={route.path} element={route.element}>
                        {route.children.map((child, cIdx) => (
                          <Route key={cIdx} path={child.path} element={child.element} />
                        ))}
                      </Route>
                    );
                  }
                  return <Route key={index} path={route.path} element={route.element} />;
                })}
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </DataProvider>
    </HelmetProvider>
  )
}

export default App
