import {
  // Employee types
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  CREATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_SUCCESS,
  // Contract types
  FETCH_CONTRACTS_REQUEST,
  FETCH_CONTRACTS_SUCCESS,
  FETCH_CONTRACTS_FAILURE,
  CREATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT_SUCCESS,
  // Leave types
  FETCH_LEAVES_REQUEST,
  FETCH_LEAVES_SUCCESS,
  FETCH_LEAVES_FAILURE,
  CREATE_LEAVE_SUCCESS,
  UPDATE_LEAVE_SUCCESS,
  DELETE_LEAVE_SUCCESS,
  // Payroll types
// Payroll types
FETCH_PAYROLLS_REQUEST,
FETCH_PAYROLLS_SUCCESS,
FETCH_PAYROLLS_FAILURE,
CREATE_PAYROLL_SUCCESS,
UPDATE_PAYROLL_SUCCESS,
  // Evaluation types
  FETCH_EVALUATIONS_REQUEST,
  FETCH_EVALUATIONS_SUCCESS,
  FETCH_EVALUATIONS_FAILURE,
  CREATE_EVALUATION_SUCCESS,
  UPDATE_EVALUATION_SUCCESS,
  // Department types
  FETCH_DEPARTMENTS_REQUEST,
  FETCH_DEPARTMENTS_SUCCESS,
  FETCH_DEPARTMENTS_FAILURE,
  CREATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_SUCCESS,
} from "../types"

const initialState = {
  // Employees
  employees: [],
  employeesLoading: false,
  employeesError: null,

  // Contracts
  contracts: [],
  contractsLoading: false,
  contractsError: null,

  // Attendance
  attendance: [],
  attendanceLoading: false,
  attendanceError: null,

  // Leaves
  leaves: [],
  leavesLoading: false,
  leavesError: null,

  // Payrolls
  payrolls: [],
  payrollsLoading: false,
  payrollsError: null,

  // Evaluations
  evaluations: [],
  evaluationsLoading: false,
  evaluationsError: null,

  // Departments
  departments: [],
  departmentsLoading: false,
  departmentsError: null,

  // General
  loading: false,
  error: null,
}

const hrReducer = (state = initialState, action) => {
  switch (action.type) {
    // Employee cases
    case FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        employeesLoading: true,
        employeesError: null,
      }
    case FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        employees: action.payload,
        employeesLoading: false,
        employeesError: null,
      }
    case FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        employeesLoading: false,
        employeesError: action.payload,
      }
    case CREATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: [...state.employees, action.payload],
      }
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.map((emp) => (emp.id === action.payload.id ? { ...emp, ...action.payload } : emp)),
      }
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.filter((emp) => emp.id !== action.payload),
      }

    // Contract cases
    case FETCH_CONTRACTS_REQUEST:
      return {
        ...state,
        contractsLoading: true,
        contractsError: null,
      }
    case FETCH_CONTRACTS_SUCCESS:
      return {
        ...state,
        contracts: action.payload,
        contractsLoading: false,
        contractsError: null,
      }
    case FETCH_CONTRACTS_FAILURE:
      return {
        ...state,
        contractsLoading: false,
        contractsError: action.payload,
      }
    case CREATE_CONTRACT_SUCCESS:
      return {
        ...state,
        contracts: [...state.contracts, action.payload],
      }
    case UPDATE_CONTRACT_SUCCESS:
      return {
        ...state,
        contracts: state.contracts.map((contract) =>
          contract.id === action.payload.id ? { ...contract, ...action.payload } : contract,
        ),
      }

    // Leave cases
    case FETCH_LEAVES_REQUEST:
      return {
        ...state,
        leavesLoading: true,
        leavesError: null,
      }
    case FETCH_LEAVES_SUCCESS:
      return {
        ...state,
        leaves: action.payload,
        leavesLoading: false,
        leavesError: null,
      }
    case FETCH_LEAVES_FAILURE:
      return {
        ...state,
        leavesLoading: false,
        leavesError: action.payload,
      }
    case CREATE_LEAVE_SUCCESS:
      return {
        ...state,
        leaves: [...state.leaves, action.payload],
      }
    case UPDATE_LEAVE_SUCCESS:
      return {
        ...state,
        leaves: state.leaves.map((leave) => (leave.id === action.payload.id ? { ...leave, ...action.payload } : leave)),
      }
    case DELETE_LEAVE_SUCCESS:
      return {
        ...state,
        leaves: state.leaves.filter((leave) => leave.id !== action.payload),
      }

    // Payroll cases
    case FETCH_PAYROLLS_REQUEST:
      return {
        ...state,
        payrollsLoading: true,
        payrollsError: null,
      }
    case FETCH_PAYROLLS_SUCCESS:
      return {
        ...state,
        payrolls: action.payload,
        payrollsLoading: false,
        payrollsError: null,
      }
    case FETCH_PAYROLLS_FAILURE:
      return {
        ...state,
        payrollsLoading: false,
        payrollsError: action.payload,
      }
    case CREATE_PAYROLL_SUCCESS:
      return {
        ...state,
        payrolls: [...state.payrolls, action.payload],
      }
    case UPDATE_PAYROLL_SUCCESS:
      return {
        ...state,
        payrolls: state.payrolls.map((payroll) =>
          payroll.id === action.payload.id ? { ...payroll, ...action.payload } : payroll,
        ),
      }

    // Evaluation cases
    case FETCH_EVALUATIONS_REQUEST:
      return {
        ...state,
        evaluationsLoading: true,
        evaluationsError: null,
      }
    case FETCH_EVALUATIONS_SUCCESS:
      return {
        ...state,
        evaluations: action.payload,
        evaluationsLoading: false,
        evaluationsError: null,
      }
    case FETCH_EVALUATIONS_FAILURE:
      return {
        ...state,
        evaluationsLoading: false,
        evaluationsError: action.payload,
      }
    case CREATE_EVALUATION_SUCCESS:
      return {
        ...state,
        evaluations: [...state.evaluations, action.payload],
      }
    case UPDATE_EVALUATION_SUCCESS:
      return {
        ...state,
        evaluations: state.evaluations.map((evaluation) =>
          evaluation.id === action.payload.id ? { ...evaluation, ...action.payload } : evaluation,
        ),
      }

    // Department cases
    case FETCH_DEPARTMENTS_REQUEST:
      return {
        ...state,
        departmentsLoading: true,
        departmentsError: null,
      }
    case FETCH_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        departments: action.payload,
        departmentsLoading: false,
        departmentsError: null,
      }
    case FETCH_DEPARTMENTS_FAILURE:
      return {
        ...state,
        departmentsLoading: false,
        departmentsError: action.payload,
      }
    case CREATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departments: [...state.departments, action.payload],
      }
    case UPDATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept.id === action.payload.id ? { ...dept, ...action.payload } : dept,
        ),
      }

    default:
      return state
  }
}

export default hrReducer
