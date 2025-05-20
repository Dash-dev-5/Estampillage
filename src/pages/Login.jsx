"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap"
import { login } from "../redux/actions/authActions"
import { FileEarmarkText, Person, Lock } from "react-bootstrap-icons"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(credentials))
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: "var(--mac-gradient)",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              <h1 className="text-white display-5 fw-bold mb-0 animate__animated animate__fadeInDown">
                <FileEarmarkText className="me-2" />
                {import.meta.env.VITE_APP_NAME || "ESTAMPILLAGE"}
              </h1>
              <p className="text-white-50 animate__animated animate__fadeIn animate__delay-1s">
                Système de gestion d'estampillage
              </p>
            </div>

            <div className="mac-window animate__animated animate__fadeInUp">
              <div className="mac-window-header">
                <div className="mac-window-buttons">
                  <button className="mac-window-button mac-window-button-close"></button>
                  <button className="mac-window-button mac-window-button-minimize"></button>
                  <button className="mac-window-button mac-window-button-maximize"></button>
                </div>
                <div className="mac-window-title">Connexion</div>
              </div>
              <div className="mac-window-content p-4">
                {error && (
                  <Alert variant="danger" className="animate__animated animate__headShake glass-alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <Person />
                      </span>
                      <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Entrez votre nom d'utilisateur"
                        required
                        className="glass-input border-start-0"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mot de passe</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <Lock />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Entrez votre mot de passe"
                        required
                        className="glass-input border-start-0"
                      />
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading} className="py-2 mac-btn mac-btn-primary">
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" /> Connexion en cours...
                        </>
                      ) : (
                        "Se connecter"
                      )}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    <small>Utilisateurs de test: admin/admin123, opg/opg123, dg/dg123, agent/agent123</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4 text-white-50 animate__animated animate__fadeIn animate__delay-2s">
              <small>
                &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME || "ESTAMPILLAGE"}. Tous droits
                réservés.
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
