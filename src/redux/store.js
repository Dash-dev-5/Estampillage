import { createStore, applyMiddleware, combineReducers } from "redux"
import { thunk } from "redux-thunk"
// import { composeWithDevTools } from "redux-devtools-extension"
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./reducers/authReducer"
import declarationReducer from "./reducers/declarationReducer"
import perceptionReducer from "./reducers/perceptionReducer"
import opgReducer from "./reducers/opgReducer"
import userReducer from "./reducers/userReducer"
import subjectReducer from "./reducers/subjectReducer"
import auditReducer from "./reducers/auditReducer"
import archiveReducer from "./reducers/archiveReducer"
import notificationReducer from "./reducers/notificationReducer"
import uiReducer from "./reducers/uiReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  declaration: declarationReducer,
  perception: perceptionReducer,
  opg: opgReducer,
  user: userReducer,
  subject: subjectReducer,
  audit: auditReducer,
  archive: archiveReducer,
  notification: notificationReducer,
  ui: uiReducer,
})

const store = configureStore({
  reducer: rootReducer,
  // Pas besoin de redux-devtools-extension ici
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store
