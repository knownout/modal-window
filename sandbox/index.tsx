import modalWindowController from "@knownout/modal-window-controller";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import ModalWindow from "../package/modal-window";

import "./styles.scss";

function App () {
    useEffect(() => {
        modalWindowController.connectModalWindow("my-modal");

        return () => {
            modalWindowController.disconnectModalWindow("my-modal");
        }
    }, []);

    return <>
        <h1>React modal window component @knownout/modal-window</h1>

        <button onClick={ () => {
            modalWindowController.openModal("my-modal");
        } }>
            Open modal window
        </button>

        <ModalWindow modalKey="my-modal" modalTitle="My Test Modal">
            Hello world
        </ModalWindow>
    </>;
}

const root = ReactDOM.createRoot(document.querySelector("#app-root")!);
root.render(<App />);
