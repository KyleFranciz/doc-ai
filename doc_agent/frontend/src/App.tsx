// This is going to be the page that has all the routes for the app
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./connections/supabaseClient";
import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import PromptPage from "./pages/Promptpage";
import NotFound from "./pages/NotFound";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import { RouterProvider } from "react-router-dom";

function App() {
  // states to store for the user to help w/ giving access to certain parts of the app
  const [user, setUser] = useState<User | null>(null); // null by default since the user is not logged in yet by default
  const [loading, setLoading] = useState<boolean>(true); // handles the loading states for the different page and components
  // handle the users session so that I can check if the user is logged in (handle on reload)
  useEffect(() => {
    // get the session from supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null); // set the user if in a session or null if not
      setLoading(false); // set loading if the page is loading or not
    });

    // listen for the auth state changes that happen
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // clean up the unmounting of the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // router for all the different pages in my app
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout user={user} />,
      children: [
        //Main page when landing on the app
        {
          index: true,
          element: user ? <PromptPage user={user} /> : <MainPage />,
        },
        // Prompt page for making request to Doc
        { path: "prompt", element: <PromptPage user={user} /> }, // make accessible to everyone, just don't save chat history
        // Page to host the different chats that the user makes with doc
        { path: "chat/:sessionId", Component: user ? ChatPage : LoginPage },
        // Page to adjust the settings of the application
        { path: "settings", Component: user ? SettingsPage : SignUpPage },
        // Page to login to the app
        {
          path: "login",
          element: user ? <PromptPage user={user} /> : <LoginPage />,
        },
        // Page to sign up for the app
        {
          path: "signup",
          element: user ? <PromptPage user={user} /> : <SignUpPage />,
        },
        // Page if the user searches for a page that isn't there or isn't allowed
        { path: "*", Component: NotFound },
      ],
    },
  ]);

  // TODO:: set up loading animation to show when the page is loading
  if (loading) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
