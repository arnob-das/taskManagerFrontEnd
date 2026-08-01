import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./utils/firebase.config";
import { setUser, toggleLoading } from "./redux/features/user/userSlice";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const isGoogleUser = user.providerData.some(
      (provider) => provider.providerId === "google.com",
    );
    const savedPhoto = localStorage.getItem("user_photoURL");

    store.dispatch(
      setUser({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || savedPhoto || "",
        providerId: isGoogleUser ? "google.com" : "password",
      }),
    );
  } else {
    store.dispatch(
      setUser({
        name: "",
        email: "",
        photoURL: "",
        providerId: "",
      }),
    );
    localStorage.removeItem("user_photoURL");
  }
  store.dispatch(toggleLoading(false));
});

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.themeSlice);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  </Provider>,
);
