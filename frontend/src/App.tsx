import './App.css'
import ProtectedRoute from './components/ProtectedRoutes'  
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Groups from './pages/Groups'



 function Logout(){
     localStorage.clear()
     return <Navigate to ="/login" />
   }

  function RegisterAndLogout(){
    localStorage.clear()
    return <Register />
  }

function App() {


  return (
    
      <BrowserRouter>
        <Routes>
           {/* <Route path="/" element={
            <ProtectedRoute>
              
            </ProtectedRoute>
            } /> */}
          <Route path="/groups" element={<Groups/>} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    
  )
}

export default App
