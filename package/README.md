# 🧱 React components library

Simple React component for creating modal windows.

Перед использованием модального окна его необходимо добавить в
контроллер (см. https://github.com/re-knownout/modal-window-controller).
Поскольку добавление модального окна в контроллер происходит единожды, можем
сделать это в эффекте:

```tsx
useEffect(() => {
    modalWindowController.connectModalWindow("my-modal");

    return () => {
        modalWindowController.disconnectModalWindow("my-modal");
    }
}, []);
```

Для того чтобы добавить модальное окно, достаточно просто
встроить его в любое место приложения:

```tsx
<ModalWindow modalKey="my-modal" modalTitle="My Test Modal">
    Hello world
</ModalWindow>
```

Изначально модальное окно будет закрыто, для того, чтобы открыть его,
используем метод контроллера:

```ts
modalWindowController.openModal("my-modal");
```

re-knownout - https://github.com/re-knownout/
<br>knownout@hotmail.com
