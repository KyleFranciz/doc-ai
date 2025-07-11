import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // global styling for the app
import { RouterProvider, createBrowserRouter } from "react-router-dom"; //  browser router to be able to route through my app
import SettingsPage from "./pages/SettingsPage";
import PromptPage from "./pages/Promptpage";
import NotFound from "./pages/NotFound";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import ChatPage from "./pages/ChatPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from "./pages/MainPage";
import { Toaster } from "sonner";
import { SidebarProvider } from "./context/SidebarContext";

// defined routes
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      //Main page when landing on the app
      { index: true, Component: MainPage },
      // Prompt page for making request to Doc
      { path: "prompt", Component: PromptPage },
      // Page to host the different chats that the user makes with doc
      { path: "chat/:sessionId", Component: ChatPage },
      // Page to adjust the settings of the application
      { path: "settings", Component: SettingsPage },
      // Page to login to the app
      { path: "login", Component: LoginPage },
      // Page to sign up for the app
      { path: "signup", Component: SignUpPage },
      // Page if the user searches for a page that isn't there or isn't allowed
      { path: "*", Component: NotFound },
    ],
  },
]);

// create a query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          theme="dark"
          duration={4000}
          richColors
          toastOptions={{
            classNames: {
              toast: "bg-[#171717] text-white",
            },
          }}
        />
      </QueryClientProvider>
    </SidebarProvider>
  </StrictMode>
);
