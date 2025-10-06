import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  {
    id: "1",
    role: "superadmin",
    description: "Full access to all features and settings.",
  },
  {
    id: "2",
    role: "admin",
    description: "Manage users and content, limited system settings.",
  },
  {
    id: "3",
    role: "user",
    description: "Can create and edit content but no user management.",
  },
]

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addRole: (state, action) => {
      state.push(action.payload)
    },
    removeRole: (state, action) =>
      state.filter((role) => role.id !== action.payload),
    updateRole: (state, action) => {
      const index = state.findIndex((role) => role.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
  },
})

export const { addRole, removeRole, updateRole } = roleSlice.actions
export default roleSlice.reducer
