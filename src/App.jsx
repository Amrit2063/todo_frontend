import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Todos from './components/Todos'
import Register from './components/Register'
import Navbar from './components/Navbar'
import { useAuthContext } from './context/AuthContext'
import {ToastContainer} from 'react-toastify'

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <BrowserRouter>
      <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <Todos /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={authUser ? <Navigate to='/' /> : <Login />} />
          <Route path="/register" element={authUser ? <Navigate to='/' /> : <Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
