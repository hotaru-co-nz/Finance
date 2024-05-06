import dayjs from "../lib/dayjs";

export function getExchangeRates() {
    return new Promise(async (resolve) => {
        let resp = await fetch("https://v6.exchangerate-api.com/v6/4ec9e92c6e5b70ced65c1717/latest/USD");
        if (resp.status === 200) {
            resp = await resp.json();
            resolve({
                updatedOn: dayjs.unix(resp.time_last_update_unix),
                data: resp.conversion_rates,
            });
        }
    });
}
