import React from 'react'
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
import Profile from "./pages/profile-page/profilePage"
import Dashboard from "./pages/dashboard/Dashboard"
import Login from "./pages/login/Login"

function AppComponent() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Dashboard */}
          <Route path='/' element={ user ? <Dashboard /> : <Navigate to='/login' />} />

          {/* Project Routes */}
          <Route path='/projects' element={ user ? <Projects /> : <Navigate to='/login' /> } />
          <Route path='/projects/:project_id' element={ user ? <ProjectPage /> : <Navigate to='/login' /> } />
          <Route path='/projects/new-project' element={ user ? ( user.position == "admin" ? <NewProject /> : <Navigate to='/projects' />) : <Navigate to='/login' /> } /> 

          {/* Report Routes */}
          <Route path='/reports' element={ user ? <Reports /> : <Login /> } /> 
          <Route path='/reports/:report_id' element={ user ? <ReportPage /> : <Navigate to='/login' /> } />
          <Route path='/reports/new-report' element={ user ? <NewReport /> : <Navigate to='/login' /> } />
          
          {/* Profile Route */}
          <Route path='/profile' element={ user ? <Profile /> : <Navigate to='/login' /> } />

          {/* Login Route */}
          <Route path='/login' element={ !user ? <Login /> : <Navigate to='/projects' /> } />

          {/* Users */} {/* ONLY FOR ADMIN ACCOUNTS */}
          {/* <Route path='/users' element={ user ? ( user.position == "admin" ? <Users /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } />
          <Route path='/users/new-user' element={ user ? ( user.position == "admin" ? <Users /> : <Navigate to='/' /> ) : <Navigate to='/login' /> } /> */}

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
