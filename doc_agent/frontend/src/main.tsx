import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // global styling for the app
import { RouterProvider, createBrowserRouter } from "react-router-dom"; //  browser router to be able to route through my app
import SettingsPage from "./pages/SettingsPage";
import PromptPage from "./pages/Promptpage";

import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  { path: "/", Component: MainPage }, //Main page when landing on the app
  { path: "prompt", Component: PromptPage }, // Prompt page for making request to Doc
  { path: "settings", Component: SettingsPage }, // Page to adjust the settings of the application
  { path: "login", Component: LoginPage }, // Page to login to the app
  { path: "signup", Component: SignUpPage }, // Page to sign up for the app
  { path: "*", Component: NotFound }, // Page if the user searches for a page that isn't there or isn't allowed
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
