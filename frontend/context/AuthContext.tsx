import React, { createContext, useState, type ReactNode } from 'react'

interface AuthData {
    email: string
    userId: number
    accessToken: string
}

interface AuthContext {
    auth: AuthData
    setAuth: (auth: AuthData) => void
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthData>({} as AuthData)

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext