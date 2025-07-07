
import Layout from './components/Layout'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from '../context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Layout />}>

            {/*Public Routes*/}
            <Route path='/' element={<Login />} />
            <Route path="register" element={<Register />} />

            {/*Private Routes*/}

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
