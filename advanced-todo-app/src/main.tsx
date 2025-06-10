import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GoogleclientId = '886443410076-g6qpk28dcqii7vhu5fcueek3gm052mvf.apps.googleusercontent.com'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GoogleclientId}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
