import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";

export default function Grid({
    selectedKeys,
    onSelectionChange,
    enableSelection,
    columns,
    cols,
    onRow,
    dataSource,
    renderCell = getKeyValue,
}) {
    return (
        <Table
            removeWrapper
            className={"HOTARU_TABLE"}
            classNames={{ base: "h-full w-full", tbody: "divide-y" }}
            isHeaderSticky
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
            selectionMode={enableSelection ? "multiple" : "none"}
        >
            <TableHeader columns={window.innerWidth < 768 ? cols : columns}>
                {(column) => (
                    <TableColumn key={column.key} allowsSorting>
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={dataSource}>
                {(item) => (
                    <TableRow key={item.key} onClick={() => onRow(item)}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
