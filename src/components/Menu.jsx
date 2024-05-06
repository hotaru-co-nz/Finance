import { Listbox, ListboxItem, User } from "@nextui-org/react";
import { useState } from "react";
import {
    RiAddLargeLine,
    RiAddLine,
    RiArrowRightSLine,
    RiBillLine,
    RiDashboardLine,
    RiExchangeDollarLine,
    RiFeedbackLine,
    RiHandCoinLine,
    RiMenuFoldLine,
    RiMenuUnfoldLine,
    RiPriceTagLine,
    RiSettings3Line,
    RiShoppingBag3Line,
    RiShoppingBag4Line,
} from "@remixicon/react";
import "./Menu.css";

class Pages {
    static Account = "Account";
    static Dashboard = "Dashboard";
    static Transactions = "Transactions";
    static ExchangeRates = "ExchangeRates";
    static Tags = "Tags";
    static Settings = "Settings";
    static Feedback = "Feedback";
}

const PageTitle = {
    Account: "Account",
    Dashboard: "Dashboard",
    Transactions: "Transactions",
    ExchangeRates: "Exchange Rates",
    Tags: "Tags",
    Settings: "Settings",
    Feedback: "Feedback",
};

export default function Menu({ defaultSelected, onChange }) {
    const [selected, setSelected] = useState(new Set([defaultSelected]));
    return (
        <Listbox
            aria-label="Menu"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selected}
            onSelectionChange={(selection) => {
                setSelected(selection);
                onChange(selection.values().next().value);
            }}
            hideSelectedIcon
            className="Navigator"
            textValue="Menu"
        >
            <ListboxItem key={Pages.Account} textValue={Pages.Account} showDivider className="pl-2.5 pr-5">
                <div className="flex flex-row gap-5 items-center">
                    <User
                        name="Superman"
                        description="Visitor"
                        avatarProps={{
                            src: "",
                        }}
                    />
                </div>
            </ListboxItem>
            {[
                { key: Pages.Dashboard, icon: RiDashboardLine, label: PageTitle.Dashboard },
                { key: Pages.Transactions, icon: RiBillLine, label: PageTitle.Transactions },
                { key: Pages.ExchangeRates, icon: RiExchangeDollarLine, label: PageTitle.ExchangeRates },
                { key: Pages.Tags, icon: RiPriceTagLine, label: PageTitle.Tags, divider: true },
                { key: Pages.Settings, icon: RiSettings3Line, label: PageTitle.Settings },
                { key: Pages.Feedback, icon: RiFeedbackLine, label: PageTitle.Feedback },
            ].map((item) => (
                <ListboxItem
                    key={item.key}
                    textValue={item.key}
                    className="px-5"
                    startContent={<item.icon className="size-4" />}
                    showDivider={item.divider}
                >
                    {item.label}
                </ListboxItem>
            ))}
        </Listbox>
    );
}
