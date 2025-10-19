import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { LocationProvider } from "./contexts/LocationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LocationProvider>
      <CartProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </CartProvider>
    </LocationProvider>
  </AuthProvider>
);
