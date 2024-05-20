import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    Chip,
    ScrollShadow,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { RiDeleteBinLine, RiEditLine, RiGitMergeLine, RiLogoutCircleLine } from "@remixicon/react";
import { useCallback, useState } from "react";
import useGeneralForm from "../../hooks/useGeneralForm";
import Grid from "../wrappers/Grid";
import { useCounterparties } from './../../hooks/useCounterparties';

const CounterpartyFormEntries = { Name: { name: "Name", invalid: (n) => !n, msg: "You must provide a name!" } };

export default function Counterparties() {
    const counterparties = useCounterparties();

    const form = useGeneralForm();

    const [isMerging, _isMerging] = useState(false);
    const [isDeleting, _isDeleting] = useState(false);
    const [selected, _selected] = useState(new Set());

    const renderCell = useCallback((item, columnKey) => {
        return item[columnKey];
    });

    const renameCounterparty = async (newCounterparty, oldCounterparty) => {
        await counterparties.rename(oldCounterparty.Name, newCounterparty.Name);

        form.close(true);
    };

    const mergeCounterparties = async (tag) => {
        await counterparties.merge(Array.from(selected), tag.Name);
        form.close(true);
        _selected(new Set());
        _isMerging(false);
    };

    return (
        <div className="flex w-full h-full flex-col">
            <Card shadow="sm" className="mx-3 mt-3 px-3 py-1 flex flex-row items-center" radius="sm">
                <div className="flex-1" />
                {(isMerging || isDeleting) && (
                    <Button
                        size="sm"
                        variant="light"
                        onPress={() => {
                            _isMerging(false);
                            _isDeleting(false);
                            _selected(new Set());
                        }}
                    >
                        <RiLogoutCircleLine className="size-4 opacity-80" />
                        <span>{"Cancel"}</span>
                    </Button>
                )}
                <Button
                    size="sm"
                    variant="light"
                    isDisabled={isDeleting}
                    color={isMerging ? "primary" : "default"}
                    onPress={() => {
                        if (isMerging) {
                            if (selected.size > 1) {
                                form.open(
                                    "Merge Counterparties",
                                    <span>
                                        <span>Selected counterparties</span>
                                        <span className={"inline-flex gap-1 mx-1"}>
                                            {Array.from(selected).map((value) => (
                                                <Chip variant={"flat"}>{value}</Chip>
                                            ))}
                                        </span>
                                        <span>will be merged to a new tag. Please enter a new name.</span>
                                    </span>,
                                    CounterpartyFormEntries,
                                    mergeCounterparties
                                );
                            } else {
                            }
                        } else {
                            _isMerging(true);
                        }
                    }}
                >
                    <RiGitMergeLine className="size-4 opacity-80" />
                    <span>{"Merge"}</span>
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    color={isDeleting ? "primary" : "default"}
                    isDisabled={isMerging}
                    onPress={() => {
                        _isDeleting(true);
                    }}
                >
                    <RiDeleteBinLine className="size-4 opacity-80" />
                    <span>{"Delete"}</span>
                </Button>
            </Card>
            <ScrollShadow className="h-full p-3 w-full" hideScrollBar size={10}>
                <Grid
                    className={"HOTARU_TABLE"}
                    selectedKeys={selected}
                    onSelectionChange={_selected}
                    enableSelection={isMerging || isDeleting}
                    columns={[
                        { key: "Name", label: "Counterparty Name" },
                        { key: "Percentage", label: "Percentage" },
                        { key: "Count", label: "Count" },
                    ]}
                    cols={[
                        { key: "Name", label: "Counterparty Name" },
                        { key: "Count", label: "Count" },
                    ]}
                    onRow={(item) => {
                        if (!(isDeleting || isMerging))
                            form.open("Modify Counterparty", "", CounterpartyFormEntries, renameCounterparty, item);
                    }}
                    dataSource={counterparties.items}
                    renderCell={renderCell}
                />
            </ScrollShadow>
        </div>
    );
}
