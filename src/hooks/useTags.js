import { useContext } from "react";
import { AppData } from "../contexts/src/App";
import { TagData } from "../contexts/src/Tag";
import { TransactionData } from "../contexts/src/Transaction";

export function useTags() {
    const { db, user } = useContext(AppData);
    const { items, _items } = useContext(TagData);
    const { _items: _transactions } = useContext(TransactionData);

    const merge = async (oldNames = [], newName) => {
        return new Promise(async (resolve, reject) => {
            const newTag = { UID: user.UID, Name: newName };
            // db
            await Promise.all([
                db.update("Transactions", { Tag: { $in: oldNames }, UID: user.UID }, { $set: { Tag: newName } }), // update transactions' tag to new tag
                db.delete("Tags", { Name: { $in: oldNames }, UID: user.UID }), // delete all old tags
                db.insert("Tags", [newTag]), // create new tags
            ]);
            // runtime
            _items((prev) => {
                return prev
                    .filter((tag) => !oldNames.includes(tag.Name)) // delete all old tags
                    .concat({ ...newTag, key: newName }); // insert new tags
            });
            _transactions((prev) => {
                return prev.map((value) => (oldNames.includes(value.Tag) ? { ...value, Tag: newName } : value)); // update transactions' tag to new tag
            });
            resolve();
        });
    };

    const rename = (oldName, newName) => {
        return new Promise(async (resolve, reject) => {
            // db
            await Promise.all([
                db.update("Tags", { Name: oldName, UID: user.UID }, { $set: { Name: newName } }), // update tag's name
                db.update("Transactions", { Tag: oldName, UID: user.UID }, { $set: { Tag: newName } }), // update transactions' tag to new tag
            ]);
            // runtime
            _items((prev) => {
                return prev.map((tag) => (tag.Name === oldName ? { ...tag, Name: newName, key: newName } : tag)); // update tag's name
            });
            _transactions((prev) => {
                return prev.map((value) => (value.Tag === oldName ? { ...value, Tag: newName } : value)); // update transactions' tag to new tag
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
