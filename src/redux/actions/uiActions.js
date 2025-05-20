import { SHOW_TOAST, HIDE_TOAST, SET_LOADING } from "../types"

export const showToast = (toast) => ({
  type: SHOW_TOAST,
  payload: toast,
})

export const hideToast = () => ({
  type: HIDE_TOAST,
})

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
})
