"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "./LoadingScreen"
import { checkAuthStatus } from "../../redux/actions/authActions"

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, isAuthenticated, loading])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

export default ProtectedRoute
