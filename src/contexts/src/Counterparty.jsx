import { useDisclosure } from "@nextui-org/react";
import { createContext, useState } from "react";

export const CounterpartyData = createContext();

export default function CounterpartyContext({ children }) {
    const [items, _items] = useState([]);
    const [item, _item] = useState({});
    const [error, _error] = useState({});
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    return (
        <CounterpartyData.Provider
            value={{ items, _items, item, _item, error, _error, isOpen, onOpen, onClose, onOpenChange }}
        >
            {children}
        </CounterpartyData.Provider>
    );
}
