import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TestimonialsProvider } from './context/TestimonialsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TestimonialsProvider>
        <App />
      </TestimonialsProvider>
    </BrowserRouter>
  </StrictMode>,
)
