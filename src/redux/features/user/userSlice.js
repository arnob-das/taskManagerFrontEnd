import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import auth from "../../../utils/firebase.config";

const initialState = {
  name: "",
  email: "",
  photoURL: "",
  providerId: "",
  isLoading: true,
  isError: false,
  error: "",
};

export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ email, password, name }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName: name });
    const isGoogle = data.user.providerData.some(
      (p) => p.providerId === "google.com"
    );
    return {
      name: name,
      email: data.user.email,
      photoURL: data.user.photoURL || "",
      providerId: isGoogle ? "google.com" : "password",
    };
  },
);

export const signInUserWithEmailPassword = createAsyncThunk(
  "userSlice/signInUserWithEmailPassword",
  async ({ email, password }) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    const isGoogle = data.user.providerData.some(
      (p) => p.providerId === "google.com"
    );
    return {
      name: data.user.displayName,
      email: data.user.email,
      photoURL: data.user.photoURL || "",
      providerId: isGoogle ? "google.com" : "password",
    };
  },
);

export const loginWithGoogle = createAsyncThunk(
  "userSlice/loginWithGoogle",
  async () => {
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);
    return {
      name: data.user.displayName,
      email: data.user.email,
      photoURL: data.user.photoURL || "",
      providerId: "google.com",
    };
  },
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.name = payload?.name || "";
      state.email = payload?.email || "";
      state.photoURL = payload?.photoURL || localStorage.getItem("user_photoURL") || "";
      state.providerId = payload?.providerId || "";
      state.isError = false;
      state.error = "";
    },
    updateUserPhoto: (state, { payload }) => {
      state.photoURL = payload;
      if (payload) {
        localStorage.setItem("user_photoURL", payload);
      } else {
        localStorage.removeItem("user_photoURL");
      }
    },
    toggleLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    clearUserError: (state) => {
      state.isError = false;
      state.error = "";
    },
    logoutUser: (state) => {
      state.name = "";
      state.email = "";
      state.photoURL = "";
      state.providerId = "";
      state.isError = false;
      state.error = "";
      localStorage.removeItem("user_photoURL");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.photoURL = action.payload.photoURL;
        state.providerId = action.payload.providerId;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.providerId = "";
      });
    builder
      .addCase(signInUserWithEmailPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.providerId = "";
      })
      .addCase(signInUserWithEmailPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.photoURL = action.payload.photoURL;
        state.providerId = action.payload.providerId;
        state.isError = false;
        state.error = "";
      })
      .addCase(signInUserWithEmailPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.providerId = "";
      });
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.providerId = "";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.photoURL = action.payload.photoURL;
        state.providerId = action.payload.providerId;
        state.isError = false;
        state.error = "";
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.providerId = "";
      });
  },
});

export const { setUser, toggleLoading, logoutUser, updateUserPhoto, clearUserError } =
  userSlice.actions;

export default userSlice.reducer;
