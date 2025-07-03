
import Layout from './components/Layout'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>

          {/*Public Routes*/}
          <Route path='/' element={<Login />}/>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
