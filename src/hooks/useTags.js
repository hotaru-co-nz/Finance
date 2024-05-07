import React, { useEffect, useState } from "react";
import { useAppData, useDB } from "../App";
import dayjs from "../lib/dayjs";

export function useTags() {
    const app = useAppData();
    const db = useDB();

    // useEffect(() => {
    //     db.find("Transactions").then((data) => app._transactions(data.map((o) => ({ ...o, key: o._id.toString() }))));
    // }, []);

    const mergeTags = async (oldNames = [], newName) => {
        await db.update("Transactions", { Tag: { $in: oldNames }, UID: app.user.UID }, { $set: { Tag: newName } });
    };

    return {
        items: app.tags,
        merge: mergeTags,
    };
}
