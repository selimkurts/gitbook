/**
 * Document Context for managing document state and operations
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { apiClient, Document, CreateDocumentData, UpdateDocumentData } from '../lib/api-client'

interface DocumentContextType {
	documents: Document[]
	isLoading: boolean
	error: string | null
	fetchDocuments: () => Promise<void>
	createDocument: (data: CreateDocumentData) => Promise<Document>
	updateDocument: (id: string, data: UpdateDocumentData) => Promise<Document>
	deleteDocument: (id: string) => Promise<void>
	refreshDocuments: () => Promise<void>
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

interface DocumentProviderProps {
	children: React.ReactNode
}

export function DocumentProvider({ children }: DocumentProviderProps) {
	const [documents, setDocuments] = useState<Document[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchDocuments = useCallback(async (): Promise<void> => {
		setIsLoading(true)
		setError(null)
		
		try {
			const response = await apiClient.getDocuments()
			setDocuments(response.documents)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents'
			setError(errorMessage)
			console.error('Failed to fetch documents:', err)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const createDocument = useCallback(async (data: CreateDocumentData): Promise<Document> => {
		try {
			const newDocument = await apiClient.createDocument(data)
			setDocuments(prev => [newDocument, ...prev])
			return newDocument
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to create document'
			setError(errorMessage)
			throw err
		}
	}, [])

	const updateDocument = useCallback(async (id: string, data: UpdateDocumentData): Promise<Document> => {
		try {
			const updatedDocument = await apiClient.updateDocument(id, data)
			setDocuments(prev => 
				prev.map(doc => doc.id === id ? updatedDocument : doc)
			)
			return updatedDocument
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to update document'
			setError(errorMessage)
			throw err
		}
	}, [])

	const deleteDocument = useCallback(async (id: string): Promise<void> => {
		try {
			await apiClient.deleteDocument(id)
			setDocuments(prev => prev.filter(doc => doc.id !== id))
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to delete document'
			setError(errorMessage)
			throw err
		}
	}, [])

	const refreshDocuments = useCallback(async (): Promise<void> => {
		await fetchDocuments()
	}, [fetchDocuments])

	const value: DocumentContextType = useMemo(() => ({
		documents,
		isLoading,
		error,
		fetchDocuments,
		createDocument,
		updateDocument,
		deleteDocument,
		refreshDocuments,
	}), [documents, isLoading, error, fetchDocuments, createDocument, updateDocument, deleteDocument, refreshDocuments])

	return (
		<DocumentContext.Provider value={value}>
			{children}
		</DocumentContext.Provider>
	)
}

export function useDocuments(): DocumentContextType {
	const context = useContext(DocumentContext)
	if (context === undefined) {
		throw new Error('useDocuments must be used within a DocumentProvider')
	}
	return context
}

export default DocumentContext