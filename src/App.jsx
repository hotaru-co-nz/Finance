import React, { createContext, useEffect, useState } from "react";
import "./App.css";

import { Button, useDisclosure } from "@nextui-org/react";
import { RiAddLine, RiMenuFoldLine, RiMenuUnfoldLine } from "@remixicon/react";
import Menu from "./components/Menu";
import Authenticator from "./components/dialogs/src/Authenticator.jsx";
import Form from "./components/dialogs/index.js";
import Counterparties from "./components/pages/Counterparties.jsx";
import ExchangeRates from "./components/pages/ExchangeRates";
import Tags from "./components/pages/Tags";
import Transactions from "./components/pages/Transactions";
import useApp from "./hooks/useApp.js";
import { useCounterparties } from "./hooks/useCounterparties.js";
import { useTags } from "./hooks/useTags.js";
import { useTransactions } from "./hooks/useTransactions.js";

class PageIndex {
    static Account = "Account";
    static Dashboard = "Dashboard";
    static Transactions = "Transactions";
    static ExchangeRates = "ExchangeRates";
    static Tags = "Tags";
    static Counterparties = "Counterparties";
    static Settings = "Settings";
    static Feedback = "Feedback";
}

const PageTitle = {
    Account: "Account",
    Dashboard: "Dashboard",
    Transactions: "Transactions",
    ExchangeRates: "Exchange Rates",
    Tags: "Tags",
    Counterparties: "Counterparties",
    Settings: "Settings",
    Feedback: "Feedback",
};
export default function App() {
    const [hideSidebar, _hideSidebar] = useState(window.innerWidth < 768);
    const [pageId, _pageId] = useState(PageIndex.Dashboard);

    const [authenticated, _authenticated] = useState(false);

    const { db, user, _user, exchangeRates, _exchangeRates } = useApp();
    const { items: counterparties, _items: _counterparties } = useCounterparties();
    const { items: tags, _items: _tags } = useTags();
    const {
        items: transactions,
        _items: _transactions,
        opem: onTransactionFormOpen,
        isOpen: isTransactionFormOpen,
        onOpenChange: onTransactionFormOpenChange,
    } = useTransactions();

    const [generalFormEntity, _generalFormEntity] = useState();
    const [generalFormConfig, _generalFormConfig] = useState({
        title: "",
        description: "",
        entries: { Name: { invalid: (n) => !n, msg: "You must provide a name!" } },
        onSubmit: console.log,
    });

    const {
        isOpen: isGeneralFormOpen,
        onOpen: onGeneralFormOpen,
        onClose: onGeneralFormClose,
        onOpenChange: onGeneralFormOpenChange,
    } = useDisclosure();
    const [onGeneralFormValidate, _onGeneralFormValidate] = useState(() => {});
    const [onGeneralFormSubmit, _onGeneralFormSubmit] = useState(() => {});

    const getAppData = async () => {
        let [respCounterparties, respExchangeRates, respTags, respTransactions] = await Promise.all([
            db.find("Counterparties", { condition: { UID: user.UID } }),
            db.find("ExchangeRates"),
            db.find("Tags", { condition: { UID: user.UID } }),
            db.find("Transactions", { condition: { UID: user.UID } }),
        ]);
        _counterparties(respCounterparties.map((value) => ({ ...value, key: value.Name })));
        _exchangeRates(respExchangeRates.map((value) => ({ ...value, key: value.CurrencyCode })));
        _tags(respTags.map((value) => ({ ...value, key: value.Name })));
        _transactions(respTransactions.map((value) => ({ ...value, key: value._id.toString() })));
    };

    useEffect(() => {
        if (authenticated) {
            getAppData();
        }
    }, [authenticated]);

    return (
        <>
            <Authenticator _isAuthenticated={_authenticated} />
            <div className="flex flex-col w-screen h-screen">
                <div className="px-3 flex flex-row items-center h-14 border-b-1 gap-3">
                    <Button onPress={() => _hideSidebar(!hideSidebar)} isIconOnly variant="light">
                        {hideSidebar ? <RiMenuUnfoldLine className="size-5" /> : <RiMenuFoldLine className="size-5" />}
                    </Button>
                    <div>{PageTitle[pageId]}</div>
                </div>
                <div className="flex w-screen overflow-hidden flex-1">
                    <div
                        className={`${hideSidebar ? "w-0 opacity-0" : "w-full md:w-72 opacity-100"} 
                        flex transition-all ease-in-out border-r-1`}
                    >
                        <div className="w-full overflow-hidden">
                            <Menu
                                onChange={(v) => {
                                    _pageId(v);
                                    if (window.innerWidth < 768) {
                                        _hideSidebar(true);
                                    }
                                }}
                                defaultSelected={PageIndex.Dashboard}
                            />
                        </div>
                    </div>
                    <div className={`flex-1 ${hideSidebar ? "w-full" : "w-0"}`}>
                        {pageId === PageIndex.Transactions && <Transactions source={exchangeRates} />}
                        {pageId === PageIndex.ExchangeRates && <ExchangeRates source={exchangeRates} />}
                        {pageId === PageIndex.Tags && <Tags source={exchangeRates} />}
                        {pageId === PageIndex.Counterparties && <Counterparties source={exchangeRates} />}
                    </div>
                </div>
            </div>

            <Button
                className="fixed right-4 md:right-8 bottom-4 md:bottom-8"
                onPress={() => onTransactionFormOpen()}
                isIconOnly
                variant="flat"
                color="primary"
                radius="full"
                size="lg"
            >
                <RiAddLine className="size-5" />
            </Button>
            <Form.Transaction isOpen={isTransactionFormOpen} onOpenChange={onTransactionFormOpenChange} />
            {/* <Form.General
                title={generalFormConfig.title}
                description={generalFormConfig.description}
                entries={generalFormConfig.entries}
                isOpen={isGeneralFormOpen}
                onOpenChange={onGeneralFormOpenChange}
                onSubmit={generalFormConfig.onSubmit}
                formEntity={generalFormEntity}
            /> */}
            {/* <Modal isOpen={isMessageOpen} onOpenChange={onMessageOpenChange} backdrop={"transparent"} hideCloseButton>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <AutoExecute func={onClose} />
                                <Button onPress={onClose}>6</Button>
                                Are you OK?
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal> */}
        </>
    );
}

function AutoExecute({ func, delay = 3000 }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            console.log("6");
            func();
        }, delay);
        return () => clearTimeout(timeout);
    }, []);
    return <span></span>;
}
