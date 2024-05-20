import { useContext } from "react";
import { AppData } from "../contexts/src/App";

export default function useApp() {
    const { db, user, _user, exchangeRates, _exchangeRates } = useContext(AppData);
    return { db, user, _user, exchangeRates, _exchangeRates };
}
