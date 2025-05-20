import {
  FETCH_DECLARATIONS_REQUEST,
  FETCH_DECLARATIONS_SUCCESS,
  FETCH_DECLARATIONS_FAILURE,
  CREATE_DECLARATION_REQUEST,
  CREATE_DECLARATION_SUCCESS,
  CREATE_DECLARATION_FAILURE,
  UPDATE_DECLARATION_REQUEST,
  UPDATE_DECLARATION_SUCCESS,
  UPDATE_DECLARATION_FAILURE,
  DELETE_DECLARATION_REQUEST,
  DELETE_DECLARATION_SUCCESS,
  DELETE_DECLARATION_FAILURE,
  SET_CURRENT_DECLARATION,
} from "../types"

const initialState = {
  declarations: [],
  currentDeclaration: null,
  loading: false,
  error: null,
}

const declarationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DECLARATIONS_REQUEST:
    case CREATE_DECLARATION_REQUEST:
    case UPDATE_DECLARATION_REQUEST:
    case DELETE_DECLARATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_DECLARATIONS_SUCCESS:
      return {
        ...state,
        declarations: action.payload,
        loading: false,
        error: null,
      }
    case CREATE_DECLARATION_SUCCESS:
      return {
        ...state,
        declarations: [...state.declarations, action.payload],
        currentDeclaration: action.payload,
        loading: false,
        error: null,
      }
    case UPDATE_DECLARATION_SUCCESS:
      return {
        ...state,
        declarations: state.declarations.map((declaration) =>
          declaration.id === action.payload.id ? action.payload : declaration,
        ),
        currentDeclaration: action.payload,
        loading: false,
        error: null,
      }
    case DELETE_DECLARATION_SUCCESS:
      return {
        ...state,
        declarations: state.declarations.filter((declaration) => declaration.id !== action.payload),
        loading: false,
        error: null,
      }
    case FETCH_DECLARATIONS_FAILURE:
    case CREATE_DECLARATION_FAILURE:
    case UPDATE_DECLARATION_FAILURE:
    case DELETE_DECLARATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case SET_CURRENT_DECLARATION:
      return {
        ...state,
        currentDeclaration: action.payload,
      }
    default:
      return state
  }
}

export default declarationReducer
