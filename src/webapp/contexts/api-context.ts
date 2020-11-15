import { useContext, createContext } from 'react';
import { D2Api } from "../../types/d2-api";
 
export interface AppContextI {
    api: D2Api;
    d2: Object;
}

export const AppContext = createContext<AppContextI | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (context) {
        return context;
    } else {
        throw new Error("Context not found");
    }
}