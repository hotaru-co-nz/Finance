import {
    Button,
    Card,
    ScrollShadow,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    getKeyValue,
} from "@nextui-org/react";
import { RiBillLine, RiDeleteBinLine, RiEdit2Line, RiRefreshLine } from "@remixicon/react";
import { getExchangeRates } from "../../providers/ExchangeRate";
import { AppData, useAppData } from "../../App";
import { useCallback, useContext } from "react";
import dayjs from "../../lib/dayjs";
import { useTransactions } from "../../hooks/useTransactions";
export default function Transactions() {
    const app = useAppData();
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
                        <div className="text-tiny opacity-50">{`${item.Tag}·${item.Date.format("L")}`}</div>
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
                <Button size="sm" variant="light" onPress={transactions.open}>
                    <RiBillLine className="size-4 opacity-80" />
                    <span>{"Create"}</span>
                </Button>
                <Button size="sm" variant="light" onPress={() => app.onMessageOpenChange(true)}>
                    <RiDeleteBinLine className="size-4 opacity-80" />
                    <span>{"Delete"}</span>
                </Button>
            </Card>
            <ScrollShadow className="h-full p-3 w-full" hideScrollBar size={10}>
                <Table
                    removeWrapper
                    classNames={{ base: "h-full w-full" }}
                    isHeaderSticky
                    // bottomContent={

                    // }
                >
                    <TableHeader
                        columns={
                            window.innerWidth < 768
                                ? [
                                      { key: "CounterpartyX", label: "Counterparty" },
                                      { key: "Amount", label: "Amount" },
                                  ]
                                : [
                                      { key: "Counterparty", label: "Counterparty" },
                                      { key: "Date", label: "Date" },
                                      { key: "Tag", label: "Tag" },
                                      { key: "Amount", label: "Amount" },
                                      { key: "Description", label: "Description" },
                                  ]
                        }
                    >
                        {(column) => (
                            <TableColumn key={column.key} allowsSorting>
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={transactions.items}>
                        {(item) => (
                            <TableRow key={item.key}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollShadow>
        </div>
    );
}
