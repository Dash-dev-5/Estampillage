import * as types from "../types"

// Actions pour la gestion du personnel
export const fetchPersonnel = () => ({
  type: types.FETCH_PERSONNEL_REQUEST,
})

export const fetchPersonnelSuccess = (personnel) => ({
  type: types.FETCH_PERSONNEL_SUCCESS,
  payload: personnel,
})

export const fetchPersonnelFailure = (error) => ({
  type: types.FETCH_PERSONNEL_FAILURE,
  payload: error,
})

export const addPersonnel = (personnelData) => ({
  type: types.ADD_PERSONNEL_REQUEST,
  payload: personnelData,
})

export const addPersonnelSuccess = (personnel) => ({
  type: types.ADD_PERSONNEL_SUCCESS,
  payload: personnel,
})

export const addPersonnelFailure = (error) => ({
  type: types.ADD_PERSONNEL_FAILURE,
  payload: error,
})

export const updatePersonnel = (id, personnelData) => ({
  type: types.UPDATE_PERSONNEL_REQUEST,
  payload: { id, personnelData },
})

export const updatePersonnelSuccess = (personnel) => ({
  type: types.UPDATE_PERSONNEL_SUCCESS,
  payload: personnel,
})

export const updatePersonnelFailure = (error) => ({
  type: types.UPDATE_PERSONNEL_FAILURE,
  payload: error,
})

export const deletePersonnel = (id) => ({
  type: types.DELETE_PERSONNEL_REQUEST,
  payload: id,
})

export const deletePersonnelSuccess = (id) => ({
  type: types.DELETE_PERSONNEL_SUCCESS,
  payload: id,
})

export const deletePersonnelFailure = (error) => ({
  type: types.DELETE_PERSONNEL_FAILURE,
  payload: error,
})

export const setPersonnelFilter = (filter) => ({
  type: types.SET_PERSONNEL_FILTER,
  payload: filter,
})
