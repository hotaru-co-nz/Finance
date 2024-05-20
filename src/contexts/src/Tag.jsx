import { useDisclosure } from "@nextui-org/react";
import { createContext, useState } from "react";

export const TagData = createContext();

export default function TagContext({ children }) {
    const [items, _items] = useState([]);
    const [item, _item] = useState({});
    const [error, _error] = useState({});
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    return (
        <TagData.Provider value={{ items, _items, item, _item, error, _error, isOpen, onOpen, onClose, onOpenChange }}>
            {children}
        </TagData.Provider>
    );
}
