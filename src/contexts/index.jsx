import AppContext from "./src/App";
import CounterpartyContext from "./src/Counterparty";
import TagContext from "./src/Tag";
import TransactionContext from "./src/Transaction";

export default function ContextRoot({ children }) {
    return (
        <AppContext>
            <CounterpartyContext>
                <TagContext>
                    <TransactionContext>{children}</TransactionContext>
                </TagContext>
            </CounterpartyContext>
        </AppContext>
    );
}
