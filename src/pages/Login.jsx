"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../redux/actions/authActions"
import { BoxArrowInDown, Person, Lock } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [validated, setValidated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

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
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    dispatch(login(credentials))
  }

  return (
    <div className="bg-primary bg-opacity-10 min-vh-100 d-flex align-items-center">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5} className="fade-in">
            <div className="text-center mb-4">
              <BoxArrowInDown className="text-primary" size={50} />
              <h2 className="mt-3 fw-bold text-primary">{import.meta.env.VITE_APP_NAME || "ESTAMPILLAGE"}</h2>
              <p className="text-muted">Système de gestion intégré pour une entreprise publique d'estampillage</p>
            </div>

            <Card className="shadow-lg border-0 pulse">
              <Card.Body className="p-4">
                <h3 className="text-center mb-4">Connexion</h3>

                {error && (
                  <Alert variant="danger" className="animate__animated animate__fadeIn">
                    {error}
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Person />
                      </span>
                      <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Entrez votre nom d'utilisateur"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez entrer votre nom d'utilisateur.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mot de passe</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock />
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Entrez votre mot de passe"
                        required
                      />
                      <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Masquer" : "Afficher"}
                      </Button>
                      <Form.Control.Feedback type="invalid">Veuillez entrer votre mot de passe.</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading} className="py-2 hover-lift">
                      {loading ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Identifiants de démo: <br />
                    Admin: admin / admin123 <br />
                    OPG: opg / opg123 <br />
                    DG: dg / dg123
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4 text-muted">
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
