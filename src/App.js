import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import SubjectManagement from "./pages/SubjectManagement"
import OPGManagement from "./pages/OPGManagement"
import UserManagement from "./pages/UserManagement"
import AuditLog from "./pages/AuditLog"
import Archives from "./pages/Archives"
import Declaration from "./pages/Declaration"
import NotePerception from "./pages/NotePerception"
import ValuePrintManagement from "./pages/ValuePrintManagement"
import ProtectedRoute from "./components/common/ProtectedRoute"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
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
          path="/value-print-management"
          element={
            <ProtectedRoute>
              <ValuePrintManagement />
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </>
  )
}

export default App
