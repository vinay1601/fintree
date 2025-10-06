import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  {
    id: "dept-1",
    name: "Loan Processing",
    description: "Handles all loan applications and processing.",
    subDepartments: ["Loan Verification", "Loan Approval"],
    isActive: true,
  },
  {
    id: "dept-2",
    name: "Risk Management",
    description: "Evaluates financial risks and ensures compliance.",
    subDepartments: ["Credit Risk", "Operational Risk"],
    isActive: true,
  },
  {
    id: "dept-3",
    name: "Customer Service",
    description: "Assists customers with inquiries and support.",
    subDepartments: ["Call Center", "Email Support"],
    isActive: true,
  },
  {
    id: "dept-4",
    name: "Collections",
    description: "Manages overdue accounts and debt recovery.",
    subDepartments: ["Domestic Collections", "International Collections"],
    isActive: false,
  },
  {
    id: "dept-5",
    name: "IT Support",
    description: "Maintains software systems and infrastructure.",
    subDepartments: ["Network", "Help Desk", "DevOps"],
    isActive: true,
  },
]


const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    addDepartment: (state, action) => {
      state.push({
        ...action.payload,
        subDepartments: action.payload.subDepartments || [],
        isActive: action.payload.isActive ?? true,
      })
    },
    removeDepartment: (state, action) =>
      state.filter((dept) => dept.id !== action.payload),
    updateDepartment: (state, action) => {
      const index = state.findIndex((dept) => dept.id === action.payload.id)
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...action.payload,
          subDepartments: action.payload.subDepartments || state[index].subDepartments,
          isActive: action.payload.isActive ?? state[index].isActive,
        }
      }
    },
  },
})


export const { addDepartment, removeDepartment, updateDepartment } = departmentSlice.actions
export default departmentSlice.reducer

//************************************************************************* */

// import { createSlice } from "@reduxjs/toolkit"

// const initialState = [
//   {
//     id: "dept-1",
//     name: "Loan Processing",
//     description: "Handles all loan applications and processing.",
//   },
//   {
//     id: "dept-2",
//     name: "Risk Management",
//     description: "Evaluates financial risks and ensures compliance.",
//   },
//   {
//     id: "dept-3",
//     name: "Customer Service",
//     description: "Assists customers with inquiries and support.",
//   },
//   {
//     id: "dept-4",
//     name: "Collections",
//     description: "Manages overdue accounts and debt recovery.",
//   },
//   {
//     id: "dept-5",
//     name: "IT Support",
//     description: "Maintains software systems and infrastructure.",
//   },
// ]

// const departmentSlice = createSlice({
//   name: "departments",
//   initialState,
//   reducers: {
//     addDepartment: (state, action) => {
//       state.push(action.payload)
//     },
//     removeDepartment: (state, action) =>
//       state.filter((dept) => dept.id !== action.payload),
//     updateDepartment: (state, action) => {
//       const index = state.findIndex((dept) => dept.id === action.payload.id)
//       if (index !== -1) {
//         state[index] = action.payload
//       }
//     },
//   },
// })

// export const { addDepartment, removeDepartment, updateDepartment } = departmentSlice.actions
// export default departmentSlice.reducer
