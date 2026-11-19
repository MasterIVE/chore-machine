import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoutes'
import MainLayout from './layouts/Mainlayout'
import GroupLayout from './layouts/GroupLayout'
import AssignLayout from './pages/AssignLayout.tsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Groups from './pages/Groups'
import GroupTasks from './pages/GroupTasks'
import GroupMembers from './pages/GroupMembers'
import AssignSimple from './pages/AssignSimple'
import AssignAdvanced from './pages/AssignAdvanced'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" replace />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected area: everything here requires a valid token */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/groups" replace />} />
          <Route path="groups" element={<Groups />} />

          {/* One parent for everything under a specific group */}
          <Route path="groups/:id" element={<GroupLayout />}>
            <Route index element={<Navigate to="tasks" replace />} />
            <Route path="tasks" element={<GroupTasks />} />
            <Route path="members" element={<GroupMembers />} />

            {/* Assign is a mini-layout with two sub-views */}
            <Route path="assign" element={<AssignLayout />}>
              <Route index element={<Navigate to="simple" replace />} />
              <Route path="simple" element={<AssignSimple />} />
              <Route path="advanced" element={<AssignAdvanced />} />
            </Route>
          </Route>

          <Route path="profile/:id" element={<Profile />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App