import { createContext, ReactNode, useState } from "react";

interface SettingsContext {
  theme: "light" | "dark";
  setTheme: (val: SettingsContext["theme"]) => void;
  currency: string;
  setCurrency: (val: SettingsContext["currency"]) => void;
}

interface SettingsProviderProps {
  children: ReactNode;
}

const SettingsContext = createContext<SettingsContext>({} as SettingsContext);

export const SettingsContextProvider = ({
  children,
}: SettingsProviderProps) => {
  const [theme, setTheme] = useState<SettingsContext["theme"]>("light");
  const [currency, setCurrency] = useState<SettingsContext["currency"]>("USD");
  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, currency, setCurrency }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
