import { createContext, useState } from "react";
import Database from "../../providers/Database";

export const AppData = createContext();

export default function AppContext({ children }) {
    const [db] = useState(new Database());
    const [user, _user] = useState({});
    const [exchangeRates, _exchangeRates] = useState([]);

    return <AppData.Provider value={{ db, user, _user, exchangeRates, _exchangeRates }}>{children}</AppData.Provider>;
}
