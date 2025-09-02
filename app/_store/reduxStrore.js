import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./userSlice";
import admin from "./adminSlice";

export const store = configureStore({
  reducer: {
    userChat: chatReducer,
    adminSlice: admin,
  },
});
