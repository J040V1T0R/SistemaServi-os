import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext' // <--- Importe isso!

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* O AuthProvider TEM que estar aqui fora, abraçando o App */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)