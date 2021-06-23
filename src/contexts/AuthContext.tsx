import { createContext, useState, useEffect, ReactNode } from 'react';

import { firebase, auth } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();

    // codigo que tenta recuperar o login sempre que a pagina é acarregada
    useEffect(() => {

        // função que acessa o firebase e pago o usuario caso ele tenha logado
        const unsubscribe = auth.onAuthStateChanged(user => {

            // verifica se o usuario foi encontrado
            if (user) {

                // desconstroi o usuario para pegar as informações usadas pelo app
                const { displayName, photoURL, uid } = user;

                // verifica se o usuario tem foto e nome para se exibido
                if (!displayName || !photoURL) {
                    throw new Error('Missing informarion from Google Account.');
                }

                // autera a variavel de contexto com o usuario encontrado
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })

            }

        })

        return () => {
            unsubscribe();
        }

    }, []);

    async function signInWithGoogle() {

        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider)

        if (result.user) {

            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL) {
                throw new Error('Missing informarion from Google Account.');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })

        }

    }

    return (

        <AuthContext.Provider value={{ user, signInWithGoogle }} >
            {props.children}
        </AuthContext.Provider>

    );

}