import { useContext } from "react";
import { AppData } from "../contexts/src/App";
import { CounterpartyData } from "../contexts/src/Counterparty";
import { TransactionData } from "../contexts/src/Transaction";

export function useCounterparties() {
    const { db, user } = useContext(AppData);
    const { items, _items } = useContext(CounterpartyData);
    const { _items: _transactions } = useContext(TransactionData);

    const merge = async (oldNames = [], newName) => {
        return new Promise(async (resolve, reject) => {
            const newTag = { UID: user.UID, Name: newName };
            // db
            await Promise.all([
                db.update(
                    "Transactions",
                    { Counterparty: { $in: oldNames }, UID: user.UID },
                    { $set: { Counterparty: newName } }
                ), // update transactions' tag to new tag
                db.delete("Counterparties", { Name: { $in: oldNames }, UID: user.UID }), // delete all old tags
                db.insert("Counterparties", [newTag]), // create new tags
            ]);
            // runtime
            _items((prev) => {
                return prev
                    .filter((tag) => !oldNames.includes(tag.Name)) // delete all old tags
                    .concat({ ...newTag, key: newName }); // insert new tags
            });
            _transactions((prev) => {
                return prev.map((value) =>
                    oldNames.includes(value.Counterparty) ? { ...value, Counterparty: newName } : value
                ); // update transactions' tag to new tag
            });
            resolve();
        });
    };

    const rename = (oldName, newName) => {
        return new Promise(async (resolve, reject) => {
            // db
            await Promise.all([
                db.update("Counterparties", { Name: oldName, UID: user.UID }, { $set: { Name: newName } }), // update tag's name
                db.update(
                    "Transactions",
                    { Counterparty: oldName, UID: user.UID },
                    { $set: { Counterparty: newName } }
                ), // update transactions' tag to new tag
            ]);
            // runtime
            _items((prev) => {
                return prev.map((tag) => (tag.Name === oldName ? { ...tag, Name: newName, key: newName } : tag)); // update tag's name
            });
            _transactions((prev) => {
                return prev.map((value) =>
                    value.Counterparty === oldName ? { ...value, Counterparty: newName } : value
                ); // update transactions' tag to new tag
            });
            resolve();
        });
    };

    return {
        items,
        _items,
        merge,
        rename,
    };
}
