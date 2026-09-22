import './App.css'
// import ProtectedRoute from './components/ProtectedRoutes'  
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Groups from './pages/Groups'
import GroupTasks from './pages/GroupTasks'
import GroupMembers from './pages/GroupMembers'
import MainLayout from './layouts/Mainlayout'
import AssignLayout from './layouts/AssignLayout'
import AssignSimple from './pages/AssignSimple'
import AssignAdvanced from './pages/AssignAdvanced'
import Profile from './pages/Profile'



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
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to={`/groups/:id/tasks`} replace />} />
            <Route path="/groups/:id" element={<Groups />} />
            
            {/* Everything under a specific group nests here */}
            <Route path="/groups/:id/tasks" element={<GroupTasks />} />
            <Route path="/groups/:id/members" element={<GroupMembers />} />

            {/* "Assign" is itself a mini-layout with two sub-views */}
            <Route path="/groups/:id/assign" element={<AssignLayout />}>
              <Route index element={<Navigate to="simple" replace />} />
              <Route path="simple" element={<AssignSimple />} />
              <Route path="advanced" element={<AssignAdvanced />} />
            </Route>

            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    
  )
}

export default App
