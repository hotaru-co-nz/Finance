import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import ContextRoot from "./contexts/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <NextUIProvider>
            <ContextRoot>
                <App />
            </ContextRoot>
        </NextUIProvider>
    </React.StrictMode>
);
