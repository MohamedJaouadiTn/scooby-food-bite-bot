
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the styles needed for animations and existing styling
import './styles.css'; 

// Add the Lovable script tag for the select feature
createRoot(document.getElementById("root")!).render(<App />);
