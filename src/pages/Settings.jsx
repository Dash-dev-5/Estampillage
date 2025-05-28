"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, Form, Button, Alert, Tab, Tabs, InputGroup } from "react-bootstrap"
import { Gear, Person, Percent, Save, Eye, EyeSlash } from "react-bootstrap-icons"
import MainLayout from "../components/common/MainLayout"
import PageTitle from "../components/common/PageTitle"
import { fetchSettings, updateSettings, updateProfile } from "../redux/actions/settingsActions"
import { isAdmin, isDG } from "../utils/permissions"

const Settings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { settings, loading, error } = useSelector((state) => state.settings)

  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [distributionData, setDistributionData] = useState({
    dgrkc: 45,
    estampi: 35,
    gouvernement: 20,
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    dispatch(fetchSettings())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user])

  useEffect(() => {
    if (settings?.revenueDistribution) {
      setDistributionData(settings.revenueDistribution)
    }
  }, [settings])

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  const handleDistributionChange = (e) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value) || 0
    setDistributionData({
      ...distributionData,
      [name]: numValue,
    })
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()

    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas")
      return
    }

    const updateData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
    }

    if (profileData.newPassword) {
      updateData.password = profileData.newPassword
    }

    dispatch(updateProfile(updateData))
  }

  const handleDistributionSubmit = (e) => {
    e.preventDefault()

    const total = distributionData.dgrkc + distributionData.estampi + distributionData.gouvernement
    if (total !== 100) {
      alert(`La somme des pourcentages doit être égale à 100% (actuellement: ${total}%)`)
      return
    }

    dispatch(
      updateSettings({
        ...settings,
        revenueDistribution: distributionData,
      }),
    )
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }

  const canManageDistribution = isAdmin(user) || isDG(user)

  return (
    <>
      <div className="animate__animated animate__fadeIn">
        <PageTitle
          title="Paramètres"
          subtitle="Gérez vos paramètres et préférences"
          icon={<Gear className="me-2" size={24} />}
        />

        {error && (
          <Alert variant="danger" className="animate__animated animate__fadeIn">
            {error}
          </Alert>
        )}

        <Card className="shadow-sm border-0 metric-card">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
              {/* Onglet Profil */}
              <Tab
                eventKey="profile"
                title={
                  <span>
                    <Person className="me-2" />
                    Mon Profil
                  </span>
                }
              >
                <Form onSubmit={handleProfileSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <hr className="my-4" />
                      <h5>Changer le mot de passe</h5>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="currentPassword">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPasswords.current ? "text" : "password"}
                            name="currentPassword"
                            value={profileData.currentPassword}
                            onChange={handleProfileInputChange}
                            placeholder="Laissez vide si vous ne voulez pas changer"
                          />
                          <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("current")}>
                            {showPasswords.current ? <EyeSlash /> : <Eye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="newPassword">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPasswords.new ? "text" : "password"}
                            name="newPassword"
                            value={profileData.newPassword}
                            onChange={handleProfileInputChange}
                            placeholder="Nouveau mot de passe"
                          />
                          <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("new")}>
                            {showPasswords.new ? <EyeSlash /> : <Eye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPasswords.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={handleProfileInputChange}
                            placeholder="Confirmer le mot de passe"
                          />
                          <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("confirm")}>
                            {showPasswords.confirm ? <EyeSlash /> : <Eye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      <Save className="me-2" />
                      {loading ? "Enregistrement..." : "Enregistrer le profil"}
                    </Button>
                  </div>
                </Form>
              </Tab>

              {/* Onglet Répartition des revenus (Admin/DG seulement) */}
              {canManageDistribution && (
                <Tab
                  eventKey="distribution"
                  title={
                    <span>
                      <Percent className="me-2" />
                      Répartition des Revenus
                    </span>
                  }
                >
                  <Alert variant="info">
                    <strong>Information:</strong> La répartition des revenus détermine comment les fonds collectés sont
                    distribués entre les différentes entités.
                  </Alert>

                  <Form onSubmit={handleDistributionSubmit}>
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group controlId="dgrkc">
                          <Form.Label>DGRKC (%)</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="dgrkc"
                              value={distributionData.dgrkc}
                              onChange={handleDistributionChange}
                              min="0"
                              max="100"
                              step="0.1"
                              required
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group controlId="estampi">
                          <Form.Label>ESTAMPI (%)</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="estampi"
                              value={distributionData.estampi}
                              onChange={handleDistributionChange}
                              min="0"
                              max="100"
                              step="0.1"
                              required
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group controlId="gouvernement">
                          <Form.Label>Gouvernement (%)</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="gouvernement"
                              value={distributionData.gouvernement}
                              onChange={handleDistributionChange}
                              min="0"
                              max="100"
                              step="0.1"
                              required
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="mt-3">
                      <Alert
                        variant={
                          distributionData.dgrkc + distributionData.estampi + distributionData.gouvernement === 100
                            ? "success"
                            : "warning"
                        }
                      >
                        <strong>Total:</strong>{" "}
                        {distributionData.dgrkc + distributionData.estampi + distributionData.gouvernement}%
                        {distributionData.dgrkc + distributionData.estampi + distributionData.gouvernement !== 100 &&
                          " (Doit être égal à 100%)"}
                      </Alert>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={
                          loading ||
                          distributionData.dgrkc + distributionData.estampi + distributionData.gouvernement !== 100
                        }
                      >
                        <Save className="me-2" />
                        {loading ? "Enregistrement..." : "Enregistrer la répartition"}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              )}
            </Tabs>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default Settings
