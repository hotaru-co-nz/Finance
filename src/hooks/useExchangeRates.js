import { useContext } from "react";
import { AppData } from "./../contexts/src/App";

export function useExchangeRates() {
    const { db, user, _user, exchangeRates, _exchangeRates } = useContext(AppData);

    return {
        items: exchangeRates,
        _items: _exchangeRates,
    };
}
