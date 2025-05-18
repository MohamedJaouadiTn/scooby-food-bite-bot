
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

// Import the styles needed for animations and existing styling
import './styles.css'; 

// Create root and render app
createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
