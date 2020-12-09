import React, { useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './firebase';

interface Auth {
    loggedIn: boolean;
    userId?: string;
}

interface AuthState {
    loading: boolean;
    auth?: Auth;
}

export const AuthContext = React.createContext<Auth>({ loggedIn: false });

export const useAuth = (): Auth => {
    return useContext(AuthContext);
}

export const useAuthState = (): AuthState => {
    const [ authState, setAuthState ] = useState<AuthState>({ loading: true });

    useEffect(() => {
        return firebaseAuth.onAuthStateChanged(firebaseUser => {
            setAuthState({ loading: false, auth: {loggedIn: Boolean(firebaseUser), userId: firebaseUser?.uid} });
        })
    }, []);

    return authState;
}