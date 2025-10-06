import { configureStore } from "@reduxjs/toolkit"
import departmentReducer from "./slice/departmentSlice"
import roleReducer from "./slice/roleSlice"
import userReducer from "./slice/userSlice"

export const store = configureStore({
  reducer: {
    departments: departmentReducer,
    roles: roleReducer,
    users: userReducer,
  },
})
