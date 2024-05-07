import React, { useEffect, useState } from "react";
import { useAppData, useDB } from "../App";
import dayjs from "../lib/dayjs";

export function useTransactions() {
    const app = useAppData();
    const db = useDB();

    // const fetch(() => {
    //     db.find("Transactions").then((data) => app._transactions(data.map((o) => ({ ...o, key: o._id.toString() }))));
    // }, []);

    const openForm = (obj) => {
        app._transactionFormEntity(obj);
        app.onTransactionFormOpen(true);
    };

    const newFormData = () => {
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

    const insert = async (obj) => {
        obj = { ...obj, UID: app.user.UID };
        if (app.tags.findIndex((value) => value.key === obj.Tag) === -1) {
            const newTag = { UID: app.user.UID, Name: obj.Tag };
            const respTag = await db.insert("Tags", [newTag]);
            app._tags((prev) => {
                prev.push({ ...newTag, key: respTag.insertedIds[0].toString() });
                return [...prev];
            });
        }
        if (app.counterparties.findIndex((value) => value.key === obj.Counterparty) === -1) {
            const newCounterparty = { UID: app.user.UID, Name: obj.Counterparty };
            const respCounterparty = await db.insert("Counterparties", [newCounterparty]);
            app._counterparties((prev) => {
                prev.push({ ...newCounterparty, key: respCounterparty.insertedIds[0].toString() });
                return [...prev];
            });
        }

        const resp = await db.insert("Transactions", [obj]);
        if (resp.insertedIds.length === 1) {
            console.log("insert");
            app._transactions((prev) => {
                prev.push({ ...obj, key: resp.insertedIds[0].toString() });
                return [...prev];
            });
            return true;
        }
    };

    return {
        items: app.transactions,
        open: openForm,
        new: newFormData,
        insert: insert,
    };
}
