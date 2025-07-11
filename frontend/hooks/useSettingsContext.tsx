import { useContext } from "react";
import SettingsContext from "../context/SettingsContext";

const useSettingsContext = () => {
  return useContext(SettingsContext);
};

export default useSettingsContext;
