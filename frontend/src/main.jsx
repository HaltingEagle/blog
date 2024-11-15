import { createRoot } from 'react-dom/client'
import './output.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import BlogContextProvider from './context/BlogContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <BlogContextProvider>
      <App />
    </BlogContextProvider>
  </BrowserRouter>,
)