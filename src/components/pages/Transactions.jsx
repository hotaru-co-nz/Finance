import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { RiBillLine, RiDeleteBinLine } from "@remixicon/react";
import { useCallback, useContext } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import dayjs from "../../lib/dayjs";
import Grid from "../wrappers/Grid";
import { AppData } from "../../contexts/src/App";

export default function Transactions() {
    const { db, tags } = useContext(AppData);
    const transactions = useTransactions();
    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "Date":
                return dayjs(item.Date).format("LL");
            case "Counterparty":
                return item.Counterparty;
            case "Tag":
                return item.Tag;
            case "Amount":
                return <span>{`${item.IsExpense ? "-" : ""}${item.Amount} ${item.Currency}`}</span>;
            case "CounterpartyX":
                return (
                    <div>
                        <div>{item.Counterparty}</div>
                        <div className="text-tiny opacity-50">{`${item.Tag}·${dayjs(item.Date).format("L")}`}</div>
                    </div>
                );
            case "Description":
                return item.Description;
            default:
                break;
        }
    });

    return (
        <div className="flex w-full h-full flex-col">
            <Card shadow="sm" className="mx-3 mt-3 px-3 py-1 flex flex-row items-center gap-1" radius="sm">
                <div className="flex-1" />
                <Button size="sm" variant="light" onPress={() => transactions.open()}>
                    <RiBillLine className="size-4 opacity-80" />
                    <span>{"Create"}</span>
                </Button>
                <Button size="sm" variant="light">
                    <RiDeleteBinLine className="size-4 opacity-80" />
                    <span>{"Delete"}</span>
                </Button>
            </Card>
            <ScrollShadow className="h-full p-3 w-full" hideScrollBar size={10}>
                <Grid
                    renderCell={renderCell}
                    columns={[
                        { key: "Counterparty", label: "Counterparty" },
                        { key: "Date", label: "Date" },
                        { key: "Tag", label: "Tag" },
                        { key: "Amount", label: "Amount" },
                        { key: "Description", label: "Description" },
                    ]}
                    cols={[
                        { key: "CounterpartyX", label: "Counterparty" },
                        { key: "Amount", label: "Amount" },
                    ]}
                    dataSource={transactions.items}
                    onRow={(item) => transactions.open(item)}
                />
            </ScrollShadow>
        </div>
    );
}
