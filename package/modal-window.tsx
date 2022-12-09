import { classNames } from "@knownout/lib";
import modalWindowController, { TModalWindowState } from "@knownout/modal-window-controller";
import { observer } from "mobx-react-lite";
import React, { forwardRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import "./modal-window.scss";

type TIconProps = {
    onClick? (event: React.MouseEvent<HTMLDivElement>): void;
}

function CloseIcon (props: TIconProps) {
    return (
        <div className={ classNames("icon", "close-icon") } onClick={ props.onClick }>
            <svg width="16.97px" height="16.97px" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.99998 7.11465L15.6 0.514648L17.4853 2.39998L10.8853 8.99998L17.4853 15.6L15.6 17.4853L8.99998 10.8853L2.39998 17.4853L0.514648 15.6L7.11465 8.99998L0.514648 2.39998L2.39998 0.514648L8.99998 7.11465Z"
                    fill="#AAD7DC" />
            </svg>
        </div>
    );
}

interface IModalWindowProps {
    /** Уникальный ключ модального окна */
    modalKey: string;

    /** Содержимое модального окна */
    children: any;

    /** Заголовок модального окна */
    modalTitle: string;

    /** дополнительный класс модального окна */
    className?: string;

    /**
     * Если установлено, то перезаписывает собой базовое событие
     * закрытия модального окна (при клике вне или на крестик).
     */
    overrideCloseEvent? (): void;

    /**
     * Событие закрытия модального окна.
     *
     * Будет вызвано только после того, как модальное окно перейдет в состояние CLOSE.
     */
    onClose? (): void;

    /**
     * Событие открытия модального окна.
     *
     * Будет вызвано только после того, как модальное окно перейдет в состояние OPEN.
     */
    onOpen? (): void;

    /**
     * Событие переключения состояния модального окна.
     *
     * Будет вызвано только после того, как модальное окно перейдет в состояние CLOSE или OPEN.
     */
    onSwitch? (state: boolean): void;
}

/**
 * Базовый компонент модального окна.
 *
 * На основе данного компонента должны строится любые модальные окна приложения.
 *
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<IModalWindowProps> &
 *     React.RefAttributes<HTMLDivElement>>}
 */
const _ModalWindow = forwardRef<HTMLDivElement, IModalWindowProps>((
    props,
    ref
) => {
    const windowState = modalWindowController.getModalState(props.modalKey);

    useEffect(() => {
        modalWindowController.connectModalWindow(props.modalKey);

        return () => {
            modalWindowController.disconnectModalWindow(props.modalKey);
        };
    }, [ props.modalKey ]);

    useEffect(() => {
        if (windowState === TModalWindowState.OPEN && props.onOpen) props.onOpen();

        if (windowState === TModalWindowState.CLOSE && props.onClose) props.onClose();

        if (windowState === TModalWindowState.OPEN || windowState === TModalWindowState.CLOSE) {
            if (props.onSwitch) props.onSwitch(windowState === TModalWindowState.OPEN);
        }
    }, [ windowState ]);

    const onModalWindowClose = useCallback(() => {
        if (props.overrideCloseEvent) {
            props.overrideCloseEvent();
            return;
        }

        modalWindowController.closeModal(props.modalKey);
    }, [ props.overrideCloseEvent ]);

    const onBackgroundClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.classList.contains(props.modalKey)) onModalWindowClose();
    }, [ props.modalKey, props.overrideCloseEvent ]);

    if (windowState === TModalWindowState.CLOSE || windowState === TModalWindowState.NOT_CONNECTED) return null;

    return createPortal(
        <div className={ classNames(
            "modal-window", props.modalKey, modalWindowController.getModalState(props.modalKey), props.className ?? '',
        ) } ref={ ref } onClick={ onBackgroundClick }>
            <div className="modal-window-container">
                <div className="modal-window-container-title">
                    <span>{ props.modalTitle }</span>
                    <CloseIcon onClick={ onModalWindowClose } />
                </div>
                <div className="modal-window-container-content">
                    { props.children }
                </div>
            </div>
        </div>,
        document.body
    );
});

const ModalWindow = observer(_ModalWindow);
export default ModalWindow;
