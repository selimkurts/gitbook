/**
 * Authentication Context for managing user state and auth operations
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { apiClient, User, LoginData, RegisterData } from '../lib/api-client'

interface AuthContextType {
	user: User | null
	isLoading: boolean
	isAuthenticated: boolean
	login: (credentials: LoginData) => Promise<void>
	register: (userData: RegisterData) => Promise<void>
	logout: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const isAuthenticated = !!user

	const initializeAuth = useCallback(async (): Promise<void> => {
		try {
			if (apiClient.isAuthenticated()) {
				const profile = await apiClient.getProfile()
				setUser(profile)
			}
		} catch (error) {
			console.error('Failed to initialize auth:', error)
			// Clear invalid token
			await apiClient.logout()
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	/**
	 * Initialize authentication state on app load
	 */
	useEffect(() => {
		initializeAuth()
	}, [initializeAuth])

	const login = useCallback(async (credentials: LoginData): Promise<void> => {
		try {
			setIsLoading(true)
			const response = await apiClient.login(credentials)
			setUser(response.user)
		} catch (error) {
			console.error('Login failed:', error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [])

	const register = useCallback(async (userData: RegisterData): Promise<void> => {
		try {
			setIsLoading(true)
			const response = await apiClient.register(userData)
			setUser(response.user)
		} catch (error) {
			console.error('Registration failed:', error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [])

	const logout = useCallback(async (): Promise<void> => {
		try {
			await apiClient.logout()
			setUser(null)
		} catch (error) {
			console.error('Logout failed:', error)
			// Clear user state even if API call fails
			setUser(null)
		}
	}, [])

	const refreshUser = useCallback(async (): Promise<void> => {
		try {
			if (apiClient.isAuthenticated()) {
				const profile = await apiClient.getProfile()
				setUser(profile)
			}
		} catch (error) {
			console.error('Failed to refresh user:', error)
			await logout()
		}
	}, [logout])

	const value: AuthContextType = useMemo(() => ({
		user,
		isLoading,
		isAuthenticated,
		login,
		register,
		logout,
		refreshUser,
	}), [user, isLoading, isAuthenticated, login, register, logout, refreshUser])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export default AuthContext