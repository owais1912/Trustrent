import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <AppRoutes />
            <Footer />
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}