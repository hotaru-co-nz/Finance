import React, { useEffect, useState } from "react";
import { useAppData, useDB } from "../App";
import dayjs from "../lib/dayjs";

export function useExchangeRates() {
    const app = useAppData();
    const db = useDB();

    return {
        items: app.exchangeRates,
    };
}
