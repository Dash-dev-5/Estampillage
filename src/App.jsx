"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { checkAuthStatus } from "./redux/actions/authActions"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Pages
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Declaration from "./pages/Declaration"
import NotePerception from "./pages/NotePerception"
import OPGManagement from "./pages/OPGManagement"
import UserManagement from "./pages/UserManagement"
import SubjectManagement from "./pages/SubjectManagement"
import AuditLog from "./pages/AuditLog"
import Archives from "./pages/Archives"
import NotFound from "./pages/NotFound"

// Components
import ProtectedRoute from "./components/common/ProtectedRoute"
import LoadingScreen from "./components/common/LoadingScreen"

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/declaration"
          element={
            <ProtectedRoute>
              <Declaration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note-perception"
          element={
            <ProtectedRoute>
              <NotePerception />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opg-management"
          element={
            <ProtectedRoute>
              <OPGManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject-management"
          element={
            <ProtectedRoute>
              <SubjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-log"
          element={
            <ProtectedRoute>
              <AuditLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archives"
          element={
            <ProtectedRoute>
              <Archives />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
