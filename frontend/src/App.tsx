import Layout from "./components/Layout";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "../context/AuthContext";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/*Public Routes*/}
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/*Private Routes*/}
            <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
