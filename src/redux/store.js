import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import themeSlice from "./features/theme/themeSlice";
import baseApi from "./api/baseApi";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    userSlice: userSlice,
    themeSlice: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
