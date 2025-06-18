import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined); // Create a context object

export const useSidebar = () => {
  // create  context to provide sidebar state and functions
  const context = useContext(SidebarContext);
  // throw an error if there context
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  // otherwise return the context
  return context;
};

// SidebarProvider component to wrap the application with a sidebar context
interface SidebarProviderProps {
  children: ReactNode;
}

// SidebarProvider component to wrap the application with a sidebar context
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  // useState hook to manage sidebar state and functions
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // function to toggle the sidebar state
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // change the state of the sidebar when the toggle button is clicked
  const setSidebarOpen = (open: boolean) => setIsSidebarOpen(open);

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
