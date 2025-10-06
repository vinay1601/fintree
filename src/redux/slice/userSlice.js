import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St",
    phone: "9876543210",
    city: "New York",
    age: "30",
    role: "admin",
    departmentId: "dept-1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    address: "456 Park Ave",
    phone: "8765432109",
    city: "Los Angeles",
    age: "28",
    role: "user",
    departmentId: "dept-2",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    address: "789 Sunset Blvd",
    phone: "7654321098",
    city: "Chicago",
    age: "35",
    role: "user",
    departmentId: "dept-3",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    address: "321 Elm St",
    phone: "6543210987",
    city: "San Francisco",
    age: "32",
    role: "superadmin",
    departmentId: "dept-5",
  },
];


const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload)
    },
    removeUser: (state, action) =>
      state.filter((user) => user.id !== action.payload),
    updateUser: (state, action) => {
      const index = state.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
  },
})

export const { addUser, removeUser, updateUser } = userSlice.actions
export default userSlice.reducer