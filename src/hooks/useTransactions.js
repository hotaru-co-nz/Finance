import { useContext } from "react";
import { AppData } from "../contexts/src/App";
import { CounterpartyData } from "../contexts/src/Counterparty";
import { TagData } from "../contexts/src/Tag";
import { TransactionData } from "../contexts/src/Transaction";
import dayjs from "../lib/dayjs";

export function useTransactions() {
    const { items, _items, item, _item, error, _error, isOpen, onOpen, onClose, onOpenChange } =
        useContext(TransactionData);
    const { db, user } = useContext(AppData);
    const { items: tags, _items: _tags } = useContext(TagData);
    const { items: counterparties, _items: _counterparties } = useContext(CounterpartyData);

    const open = (obj) => {
        _item(obj ?? blank());
        onOpen();
    };

    const close = () => {
        onClose();
    };

    const blank = () => {
        return {
            Amount: undefined,
            Currency: undefined,
            Date: dayjs().format("YYYYMMDD"),
            Description: undefined,
            IsExpense: true,
            Counterparty: undefined,
            Tag: undefined,
        };
    };

    const update = async (obj) => {
        console.log(obj);
    };

    const insert = async (obj) => {
        obj = { ...obj, UID: user.UID };
        if (tags.findIndex((value) => value.key === obj.Tag) === -1) {
            const newTag = { UID: user.UID, Name: obj.Tag };
            await db.insert("Tags", [newTag]);
            _tags((prev) => {
                prev.push({ ...newTag, key: obj.Tag });
                return [...prev];
            });
        }
        if (counterparties.findIndex((value) => value.key === obj.Counterparty) === -1) {
            const newCounterparty = { UID: user.UID, Name: obj.Counterparty };
            await db.insert("Counterparties", [newCounterparty]);
            _counterparties((prev) => {
                prev.push({ ...newCounterparty, key: obj.Counterparty });
                return [...prev];
            });
        }

        const resp = await db.insert("Transactions", [obj]);
        if (resp.insertedIds.length === 1) {
            console.log("insert");
            _items((prev) => {
                prev.push({ ...obj, key: resp.insertedIds[0].toString() });
                return [...prev];
            });
            return true;
        }
    };

    return {
        items,
        _items,
        error,
        _error,
        open,
        close,
        blank,
        insert,
        update,
        item,
        _item,
        isOpen,
        onOpenChange,
    };
}
