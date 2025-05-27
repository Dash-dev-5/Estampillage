import { Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./redux/store"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ToastContainer } from "react-toastify"

// Pages
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Declaration from "./pages/Declaration"
import NotePerception from "./pages/NotePerception"
import SubjectManagement from "./pages/SubjectManagement"
import UserManagement from "./pages/UserManagement"
import OPGManagement from "./pages/OPGManagement"
import AuditLog from "./pages/AuditLog"
import Archives from "./pages/Archives"
import NotFound from "./pages/NotFound"
import ValuePrintManagement from "./pages/ValuePrintManagement"

// Components
import ProtectedRoute from "./components/common/ProtectedRoute"
import MainLayout from "./components/common/MainLayout"

// CSS
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import "./assets/css/main.css"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/declaration"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Declaration />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/note-perception"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <NotePerception />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/value-print-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ValuePrintManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/subject-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SubjectManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/opg-management"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OPGManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-log"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AuditLog />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/archives"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Archives />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ThemeProvider>
    </Provider>
  )
}

export default App
