import {
  // Employee actions
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  CREATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_SUCCESS,
  // Contract actions
  FETCH_CONTRACTS_REQUEST,
  FETCH_CONTRACTS_SUCCESS,
  FETCH_CONTRACTS_FAILURE,
  CREATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT_SUCCESS,
  // Leave actions
  FETCH_LEAVES_REQUEST,
  FETCH_LEAVES_SUCCESS,
  FETCH_LEAVES_FAILURE,
  CREATE_LEAVE_SUCCESS,
  UPDATE_LEAVE_SUCCESS,
  DELETE_LEAVE_SUCCESS,
  // Payroll actions
  FETCH_PAYROLLS_REQUEST,
  FETCH_PAYROLLS_SUCCESS,
  FETCH_PAYROLLS_FAILURE,
  CREATE_PAYROLL_SUCCESS,
  UPDATE_PAYROLL_SUCCESS,
  // Evaluation actions
  FETCH_EVALUATIONS_REQUEST,
  FETCH_EVALUATIONS_SUCCESS,
  FETCH_EVALUATIONS_FAILURE,
  CREATE_EVALUATION_SUCCESS,
  UPDATE_EVALUATION_SUCCESS,
  // Department actions
  FETCH_DEPARTMENTS_REQUEST,
  FETCH_DEPARTMENTS_SUCCESS,
  FETCH_DEPARTMENTS_FAILURE,
  CREATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_SUCCESS,
} from "../types"

// Données simulées pour le développement
const mockEmployees = [
  {
    id: 1,
    name: "Jean Dupont",
    matricule: "EMP001",
    email: "jean.dupont@company.com",
    phone: "+225 01 02 03 04 05",
    position: "Développeur Senior",
    department: "IT",
    departmentId: 1,
    hireDate: "2022-01-15",
    salary: 800000,
    status: "active",
    contractType: "CDI",
  },
  {
    id: 2,
    name: "Marie Kouassi",
    matricule: "EMP002",
    email: "marie.kouassi@company.com",
    phone: "+225 01 02 03 04 06",
    position: "Responsable RH",
    department: "RH",
    departmentId: 2,
    hireDate: "2021-03-10",
    salary: 900000,
    status: "active",
    contractType: "CDI",
  },
]

const mockContracts = [
  {
    id: 1,
    employeeId: 1,
    employee: mockEmployees[0],
    type: "CDI",
    startDate: "2022-01-15",
    endDate: null,
    status: "active",
    salary: 800000,
    renewalCount: 0,
  },
  {
    id: 2,
    employeeId: 2,
    employee: mockEmployees[1],
    type: "CDI",
    startDate: "2021-03-10",
    endDate: null,
    status: "active",
    salary: 900000,
    renewalCount: 0,
  },
]

const mockLeaves = [
  {
    id: 1,
    employeeId: 1,
    employee: mockEmployees[0],
    type: "annual",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    days: 5,
    reason: "Congé annuel",
    status: "approved",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    employeeId: 2,
    employee: mockEmployees[1],
    type: "sick",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Maladie",
    status: "pending",
    createdAt: "2024-01-19",
  },
]

const mockPayrolls = [
  {
    id: 1,
    employeeId: 1,
    employee: mockEmployees[0],
    month: "01",
    year: 2024,
    baseSalary: 800000,
    overtime: 50000,
    bonuses: 100000,
    deductions: 20000,
    socialSecurity: 80000,
    tax: 120000,
    netSalary: 730000,
    status: "paid",
  },
  {
    id: 2,
    employeeId: 2,
    employee: mockEmployees[1],
    month: "01",
    year: 2024,
    baseSalary: 900000,
    overtime: 0,
    bonuses: 150000,
    deductions: 10000,
    socialSecurity: 90000,
    tax: 140000,
    netSalary: 810000,
    status: "approved",
  },
]

const mockEvaluations = [
  {
    id: 1,
    employeeId: 1,
    employee: mockEmployees[0],
    period: "Q1",
    year: 2024,
    overallScore: 85,
    criteria: [
      { name: "Qualité du travail", score: 90, weight: 20 },
      { name: "Productivité", score: 85, weight: 20 },
      { name: "Ponctualité", score: 80, weight: 15 },
      { name: "Travail en équipe", score: 85, weight: 15 },
      { name: "Initiative", score: 90, weight: 15 },
      { name: "Communication", score: 80, weight: 15 },
    ],
    comments: "Excellent travail ce trimestre",
    objectives: "Améliorer la communication avec l'équipe",
    status: "completed",
    createdAt: "2024-01-15",
  },
]

const mockDepartments = [
  {
    id: 1,
    name: "Direction Générale",
    description: "Direction générale de l'entreprise",
    managerId: null,
    parentId: null,
    budget: 5000000,
    status: "active",
  },
  {
    id: 2,
    name: "Ressources Humaines",
    description: "Gestion du personnel et des ressources humaines",
    managerId: 2,
    parentId: 1,
    budget: 2000000,
    status: "active",
  },
  {
    id: 3,
    name: "Informatique",
    description: "Développement et maintenance des systèmes informatiques",
    managerId: 1,
    parentId: 1,
    budget: 3000000,
    status: "active",
  },
]

// Employee Actions
export const fetchEmployees = () => async (dispatch) => {
  dispatch({ type: FETCH_EMPLOYEES_REQUEST })
  try {
    // Simulation d'un appel API
    setTimeout(() => {
      dispatch({
        type: FETCH_EMPLOYEES_SUCCESS,
        payload: mockEmployees,
      })
    }, 500)
  } catch (error) {
    dispatch({
      type: FETCH_EMPLOYEES_FAILURE,
      payload: error.message,
    })
  }
}

export const createEmployee = (employeeData) => async (dispatch) => {
  try {
    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      createdAt: new Date().toISOString(),
    }
    dispatch({
      type: CREATE_EMPLOYEE_SUCCESS,
      payload: newEmployee,
    })
  } catch (error) {
    console.error("Error creating employee:", error)
  }
}

export const updateEmployee = (id, employeeData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_EMPLOYEE_SUCCESS,
      payload: { id, ...employeeData },
    })
  } catch (error) {
    console.error("Error updating employee:", error)
  }
}

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_EMPLOYEE_SUCCESS,
      payload: id,
    })
  } catch (error) {
    console.error("Error deleting employee:", error)
  }
}

// Contract Actions
export const fetchContracts = () => async (dispatch) => {
  dispatch({ type: FETCH_CONTRACTS_REQUEST })
  try {
    setTimeout(() => {
      dispatch({
        type: FETCH_CONTRACTS_SUCCESS,
        payload: mockContracts,
      })
    }, 500)
  } catch (error) {
    dispatch({
      type: FETCH_CONTRACTS_FAILURE,
      payload: error.message,
    })
  }
}

export const createContract = (contractData) => async (dispatch) => {
  try {
    const newContract = {
      id: Date.now(),
      ...contractData,
      createdAt: new Date().toISOString(),
    }
    dispatch({
      type: CREATE_CONTRACT_SUCCESS,
      payload: newContract,
    })
  } catch (error) {
    console.error("Error creating contract:", error)
  }
}

export const updateContract = (id, contractData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_CONTRACT_SUCCESS,
      payload: { id, ...contractData },
    })
  } catch (error) {
    console.error("Error updating contract:", error)
  }
}

// Leave Actions
export const fetchLeaves = () => async (dispatch) => {
  dispatch({ type: FETCH_LEAVES_REQUEST })
  try {
    setTimeout(() => {
      dispatch({
        type: FETCH_LEAVES_SUCCESS,
        payload: mockLeaves,
      })
    }, 500)
  } catch (error) {
    dispatch({
      type: FETCH_LEAVES_FAILURE,
      payload: error.message,
    })
  }
}

export const createLeave = (leaveData) => async (dispatch) => {
  try {
    const newLeave = {
      id: Date.now(),
      ...leaveData,
      createdAt: new Date().toISOString(),
    }
    dispatch({
      type: CREATE_LEAVE_SUCCESS,
      payload: newLeave,
    })
  } catch (error) {
    console.error("Error creating leave:", error)
  }
}

export const updateLeave = (id, leaveData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_LEAVE_SUCCESS,
      payload: { id, ...leaveData },
    })
  } catch (error) {
    console.error("Error updating leave:", error)
  }
}

export const deleteLeave = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_LEAVE_SUCCESS,
      payload: id,
    })
  } catch (error) {
    console.error("Error deleting leave:", error)
  }
}

// Payroll Actions
export const fetchPayrolls = () => async (dispatch) => {
  dispatch({ type: FETCH_PAYROLLS_REQUEST })
  try {
    setTimeout(() => {
      dispatch({
        type: FETCH_PAYROLLS_SUCCESS,
        payload: mockPayrolls,
      })
    }, 500)
  } catch (error) {
    dispatch({
      type: FETCH_PAYROLLS_FAILURE,
      payload: error.message,
    })
  }
}

export const createPayroll = (payrollData) => async (dispatch) => {
  try {
    const newPayroll = {
      id: Date.now(),
      ...payrollData,
      createdAt: new Date().toISOString(),
    }
    dispatch({
      type: CREATE_PAYROLL_SUCCESS,
      payload: newPayroll,
    })
  } catch (error) {
    console.error("Error creating payroll:", error)
  }
}

export const updatePayroll = (id, payrollData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_PAYROLL_SUCCESS,
      payload: { id, ...payrollData },
    })
  } catch (error) {
    console.error("Error updating payroll:", error)
  }
}

// Evaluation Actions
export const fetchEvaluations = () => async (dispatch) => {
  dispatch({ type: FETCH_EVALUATIONS_REQUEST })
  try {
    setTimeout(() => {
      dispatch({
        type: FETCH_EVALUATIONS_SUCCESS,
        payload: mockEvaluations,
      })
    }, 500)
  } catch (error) {
    dispatch({
      type: FETCH_EVALUATIONS_FAILURE,
      payload: error.message,
    })
  }
}

export const createEvaluation = (evaluationData) => async (dispatch) => {
  try {
    const newEvaluation = {
      id: Date.now(),
      ...evaluationData,
      createdAt: new Date().toISOString(),
    }
    dispatch({
      type: CREATE_EVALUATION_SUCCESS,
      payload: newEvaluation,
    })
  } catch (error) {
    console.error("Error creating evaluation:", error)
  }
}

export const updateEvaluation = (id, evaluationData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_EVALUATION_SUCCESS,
      payload: { id, ...evaluationData },
    })
  } catch (error) {
    console.error("Error updating evaluation:", error)
  }
}

// Department Actions
export const fetchDepartments = () => async (dispatch) => {
  dispatch({ type: FETCH_DEPARTMENTS_REQUEST })
  try {
    setTimeout(() => {
      dispatch({
        type: FETCH_DEPARTMENTS_SUCCESS,
        payload: mockDepartments,
      })
    }, 500)
  } catch (error) {
    dispatch({
      type: FETCH_DEPARTMENTS_FAILURE,
      payload: error.message,
    })
  }
}

export const createDepartment = (departmentData) => async (dispatch) => {
  try {
    const newDepartment = {
      id: Date.now(),
      ...departmentData,
      createdAt: new Date().toISOString(),
    }
    dispatch({
      type: CREATE_DEPARTMENT_SUCCESS,
      payload: newDepartment,
    })
  } catch (error) {
    console.error("Error creating department:", error)
  }
}

export const updateDepartment = (id, departmentData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_DEPARTMENT_SUCCESS,
      payload: { id, ...departmentData },
    })
  } catch (error) {
    console.error("Error updating department:", error)
  }
}
