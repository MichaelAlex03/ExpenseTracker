import Layout from "./components/Layout";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "../context/AuthContext";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import OAuthSuccess from "./components/OAuthSuccess";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/*Public Routes*/}
              <Route path="/" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="oauth2/success" element={<OAuthSuccess />} />

              {/*Private Routes*/}
              <Route element={<RequireAuth />}>
                <Route path="home" element={<Home />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;



