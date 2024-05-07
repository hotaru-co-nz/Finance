import React, { useEffect, useState } from "react";
import { useAppData, useDB } from "../App";
import dayjs from "../lib/dayjs";

export function useCounterparties() {
    const app = useAppData();
    const db = useDB();

    // useEffect(() => {
    //     db.find("Transactions").then((data) => app._transactions(data.map((o) => ({ ...o, key: o._id.toString() }))));
    // }, []);


    return {
        items: app.counterparties,
    };
}
