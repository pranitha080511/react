import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useReducer } from 'react';
import { appReducer, defaultAppState } from './appReducer';
export const AppContext = createContext({
    appState: defaultAppState,
    setAppState: (() => { }),
});
export const AppContextProvider = ({ children }) => {
    const [appState, setAppState] = useReducer(appReducer, defaultAppState);
    return (_jsx(AppContext.Provider, { value: {
            appState: appState,
            setAppState,
        }, children: children }));
};
