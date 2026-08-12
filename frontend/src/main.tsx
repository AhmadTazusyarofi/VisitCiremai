import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { TestimonialsProvider } from './context/TestimonialsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TestimonialsProvider>
          <App />
        </TestimonialsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
