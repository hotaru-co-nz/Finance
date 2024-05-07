import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import React from "react";
import Database from "./providers/Database";

import Authenticator from "./components/dialogs/Authenticator";
import { Button, Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import { RiAddLine, RiMenuFoldLine, RiMenuUnfoldLine } from "@remixicon/react";
import Menu from "./components/Menu";
import ExchangeRates from "./components/pages/ExchangeRates";
import Tags from "./components/pages/Tags";
import Transactions from "./components/pages/Transactions";
import Form from "./components/dialogs/index.js";
import Counterparties from "./components/pages/Counterparties.jsx";

export const AppData = createContext();

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
    const [db] = useState(new Database());
    const [user, _user] = useState({});
    const [hideSidebar, _hideSidebar] = useState(window.innerWidth < 768);
    const [pageId, _pageId] = useState(PageIndex.Dashboard);

    const [authenticated, _authenticated] = useState(false);

    const [counterparties, _counterparties] = useState([]);
    const [exchangeRates, _exchangeRates] = useState([]);
    const [tags, _tags] = useState([]);
    const [transactions, _transactions] = useState([]);

    const [transactionFormEntity, _transactionFormEntity] = useState({});

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
        onOpenChange: onGeneralFormOpenChange,
    } = useDisclosure();
    const [onGeneralFormValidate, _onGeneralFormValidate] = useState(() => {});
    const [onGeneralFormSubmit, _onGeneralFormSubmit] = useState(() => {});

    const {
        isOpen: isTransactionFormOpen,
        onOpen: onTransactionFormOpen,
        onOpenChange: onTransactionFormOpenChange,
    } = useDisclosure();

    const { isOpen: isMessageOpen, onOpen: onMessageOpen, onOpenChange: onMessageOpenChange } = useDisclosure();

    const getAppData = async () => {
        let [respCounterparties, respExchangeRates, respTags, respTransactions] = await Promise.all([
            db.find("Counterparties", { condition: { UID: user.UID } }),
            db.find("ExchangeRates"),
            db.find("Tags", { condition: { UID: user.UID } }),
            db.find("Transactions", { condition: { UID: user.UID } }),
        ]);
        console.log(respExchangeRates);
        _counterparties(respCounterparties.map((value) => ({ ...value, key: value.Name })));
        _exchangeRates(respExchangeRates.map((value) => ({ ...value, key: value.CurrencyCode })));
        _tags(respTags.map((value) => ({ ...value, key: value.Name })));
        console.log(respTransactions);
        _transactions(respTransactions.map((value) => ({ ...value, key: value._id.toString() })));
    };

    useEffect(() => {
        if (authenticated) {
            getAppData();
        }
    }, [authenticated]);

    return (
        <AppData.Provider
            value={{
                db,
                user,
                _user,
                counterparties,
                _counterparties,
                exchangeRates,
                _exchangeRates,
                tags,
                _tags,
                transactions,
                _transactions,
                transactionFormEntity,
                _transactionFormEntity,
                isTransactionFormOpen,
                onTransactionFormOpen,
                onTransactionFormOpenChange,

                generalFormConfig,
                _generalFormConfig,
                isGeneralFormOpen,
                onGeneralFormOpen,
                onGeneralFormOpenChange,
                generalFormEntity,
                _generalFormEntity,
                onGeneralFormValidate,
                _onGeneralFormValidate,
                onGeneralFormSubmit,
                _onGeneralFormSubmit,
                onMessageOpenChange,
            }}
        >
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
            <Form.General
                title={generalFormConfig.title}
                description={generalFormConfig.description}
                entries={generalFormConfig.entries}
                isOpen={isGeneralFormOpen}
                onOpenChange={onGeneralFormOpenChange}
                onSubmit={generalFormConfig.onSubmit}
                formEntity={generalFormEntity}
            />
            <Modal isOpen={isMessageOpen} onOpenChange={onMessageOpenChange} backdrop={"transparent"} hideCloseButton>
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
            </Modal>
        </AppData.Provider>
    );
}

export function useAppData() {
    const app = useContext(AppData);
    return app;
}

export function useDB() {
    const { db } = useContext(AppData);
    return db;
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
