import React, { useEffect } from 'react'
import { useAuthContext } from './hooks/useAuthContext'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import './App.css'

// Pages & Components
import Projects from "./pages/projects/projects/Projects"
import NewProject from "./pages/new-project/NewProject"
import ProjectPage from "./pages/project-page/projectPage"
import Reports from "./pages/reports/Reports"
import NewReport from "./pages/new-report/NewReport"
import ReportPage from "./pages/report-page/ReportPage"
import ReportApproved from "./pages/report-approved/ReportApproved"
import Profile from "./pages/profile-page/profilePage"
import Dashboard from "./pages/dashboard/Dashboard"
import LoginError from "./pages/login-error/LoginError"
import Login from "./pages/login/Login"
import Equipments from './pages/equipments/Equipments'
import NewEquipment from './pages/new-equipment/NewEquipment'
import EquipmentPage from './pages/equipment-page/EquipmentPage'
import Users from "./pages/users/Users"
import UserPage from "./pages/user-page/UserPage"
import NewUser from "./pages/new-user/NewUser"

function AppComponent() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Login Route */}
          <Route path='login' element={ !user ? <Login /> : <Navigate to='/' /> } />

          <Route path='*' element={<div>Oops! Looks likes something went wrong.</div>} />

          {/* Dashboard */}
          <Route path='/' element={ user ? <Navigate to='projects' /> : <LoginError /> } />

          {/* Project Routes */}
          <Route path='projects' element={ !user ? <LoginError /> : <Projects /> } />
          <Route path='projects/:project_id' element={ user ? <ProjectPage /> : <LoginError /> } />
          <Route path='projects/new-project' element={ user ? ( user.position == "admin" ? <NewProject /> : <Navigate to='/projects' />) : <LoginError /> } /> 

          {/* Report Routes */}
          <Route path='reports' element={ user ? <Reports /> : <LoginError /> } /> 
          <Route path='reports/:report_id' element={ user ? <ReportPage /> : <LoginError /> } />
          <Route path='reports/approved/:report_id' element={ user ? <ReportApproved /> : <LoginError /> } />
          <Route path='reports/new-report' element={ user ? <NewReport /> : <LoginError /> } />
          
          {/* Profile Route */}
          <Route path='profile' element={ user ? <Profile /> : <LoginError /> } />

          {/* Equipments. ONLY FOR ADMIN ACCOUNTS */}
          <Route path='equipments' element={ user ? ( user.position == "admin" ? <Equipments /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />
          <Route path='equipments/new-equipment' element={ user ? ( user.position == "admin" ? <NewEquipment /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />
          <Route path='equipments/:equipment_id' element={ user ? ( user.position == "admin" ? <EquipmentPage /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />

          {/* Users */} {/* ONLY FOR ADMIN ACCOUNTS */}
          <Route path='users' element={ user ? ( user.position == "admin" ? <Users /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />
          <Route path='/users/:user_id' element={ user ? ( user.position == "admin" ? <UserPage /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />
          <Route path='/users/new-user' element={ user ? ( user.position == "admin" ? <NewUser /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default function App() {
  return (
    <> 
      <AuthContextProvider>
        <AppComponent />
      </AuthContextProvider>
    </>
  )
}