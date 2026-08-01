import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import auth from "../../utils/firebase.config";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    let user = auth.currentUser;

    if (!user) {
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          user = u;
          unsubscribe();
          resolve();
        });
        setTimeout(resolve, 1500);
      });
    }

    if (user) {
      try {
        const token = await user.getIdToken();
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Failed to retrieve Firebase ID token:", error);
      }
    }
    return headers;
  },
});

const baseQueryWithAuthErrorHandling = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If request returned 401 or 403, attempt a force token refresh once and retry
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.getIdToken(true); // Force refresh token
        result = await rawBaseQuery(args, api, extraOptions); // Retry query
      } catch (refreshErr) {
        console.error("Token force refresh failed:", refreshErr);
      }
    }
  }

  if (result.error) {
    const status = result.error.status;
    const serverErrorMessage = result.error.data?.error;

    if (serverErrorMessage) {
      toast.error(serverErrorMessage, { id: "global-auth-error" });
    } else if (status === 401 || status === 403) {
      toast.error("Forbidden: Invalid or expired token", { id: "global-auth-error" });
    } else if (status === "FETCH_ERROR") {
      toast.error("Unable to connect to server. Please ensure backend is running.", {
        id: "global-auth-error",
      });
    } else {
      toast.error(result.error.error || "An unexpected network error occurred.", {
        id: "global-auth-error",
      });
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthErrorHandling,
  tagTypes: ["Tasks"],
  endpoints: () => ({}),
});

export default baseApi;
