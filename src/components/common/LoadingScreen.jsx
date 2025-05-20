import { Spinner } from "react-bootstrap"

const LoadingScreen = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="text-center">
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        <h3 className="mt-3">Chargement...</h3>
      </div>
    </div>
  )
}

export default LoadingScreen
