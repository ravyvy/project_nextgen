import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from 'react-use-cart'   // <-- import CartProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>          {/* <-- wrap your App */}
      <App />
    </CartProvider>
  </StrictMode>,
)

