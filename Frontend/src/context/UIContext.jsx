import { createContext, useContext, useEffect, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <UIContext.Provider
      value={{
        collapsed,
        toggleSidebar,
        darkMode,
        toggleDarkMode,
        mobileOpen,
        setMobileOpen,
        openMobile,
        closeMobile,
        isMobileOpen: mobileOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}