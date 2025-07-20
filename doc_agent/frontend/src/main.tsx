import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // global styling for the app
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SidebarProvider } from "./context/SidebarContext";
import App from "./App.tsx";

// create a query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <App />
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
  </StrictMode>,
);
