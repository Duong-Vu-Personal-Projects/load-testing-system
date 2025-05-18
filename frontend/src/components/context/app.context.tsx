import {createContext, type ReactNode, useState} from 'react';

export interface AuthUser {
    email: string;
    name: string;
    role: string;
    id: string;

}

interface AuthContextType {
    user: AuthUser;
    setUser: (user: AuthUser) => void;
    isAppLoading: boolean;
    setIsAppLoading: (loading: boolean) => void;
}

export const AppContext = createContext<AuthContextType>({
    user: { email: '', name: '', role: '', id: '' },
    setUser: () => {},
    isAppLoading: true,
    setIsAppLoading: () => {},
});

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser>({
        email: '',
        name: '',
        role: '',
        id: '',
    });

    const [isAppLoading, setIsAppLoading] = useState(true);

    return (
        <AppContext.Provider value={{ user, setUser, isAppLoading, setIsAppLoading }}>
            {children}
        </AppContext.Provider>
    );
};