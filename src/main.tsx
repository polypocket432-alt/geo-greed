import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { LocationProvider } from "./contexts/LocationContext";

createRoot(document.getElementById("root")!).render(
  <LocationProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </LocationProvider>
);
