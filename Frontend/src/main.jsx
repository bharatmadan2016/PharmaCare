import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LocationProvider>
  </StrictMode>,
)
