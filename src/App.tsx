
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    // Redirect to our vanilla HTML page
    window.location.href = "/index.html";
  }, []);

  return null;
};

export default App;
