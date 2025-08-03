/**
 * API Client for DocFlow application
 * Handles HTTP requests to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface ApiResponse<T = unknown> {
	data?: T
	message?: string
	error?: string
}

export interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	role: 'admin' | 'editor' | 'viewer'
	avatar?: string
	isActive: boolean
	fullName: string
	createdAt: string
	updatedAt: string
}

export interface AuthResponse {
	accessToken: string
	user: User
}

export interface Document {
	id: string
	title: string
	content: string
	description?: string
	status: 'draft' | 'published' | 'archived'
	slug: string
	isPublic: boolean
	views: number
	author: User
	createdAt: string
	updatedAt: string
	publishedAt?: string
}

export interface DocumentListResponse {
	documents: Document[]
	total: number
	page: number
	limit: number
}

export interface RegisterData {
	firstName: string
	lastName: string
	email: string
	password: string
	company?: string
}

export interface LoginData {
	email: string
	password: string
}

export interface CreateDocumentData {
	title: string
	content: string
	status?: 'draft' | 'published'
	description?: string
}

export interface UpdateDocumentData {
	title?: string
	content?: string
	status?: 'draft' | 'published' | 'archived'
	description?: string
}

class ApiClient {
	private baseUrl: string
	private token: string | null = null

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl
		this.loadToken()
	}

	private loadToken(): void {
		if (typeof window !== 'undefined') {
			this.token = localStorage.getItem('accessToken')
		}
	}

	private saveToken(token: string): void {
		this.token = token
		if (typeof window !== 'undefined') {
			localStorage.setItem('accessToken', token)
		}
	}

	private removeToken(): void {
		this.token = null
		if (typeof window !== 'undefined') {
			localStorage.removeItem('accessToken')
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(options.headers as Record<string, string>),
		}

		if (this.token) {
			headers.Authorization = `Bearer ${this.token}`
		}

		try {
			const response = await fetch(url, {
				...options,
				headers,
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || `HTTP ${response.status}`)
			}

			return data
		} catch (error) {
			console.error('API request failed:', error)
			throw error
		}
	}

	// Authentication methods
	async register(userData: RegisterData): Promise<AuthResponse> {
		const response = await this.request<AuthResponse>('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		})
		this.saveToken(response.accessToken)
		return response
	}

	async login(credentials: LoginData): Promise<AuthResponse> {
		const response = await this.request<AuthResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		})
		this.saveToken(response.accessToken)
		return response
	}

	async logout(): Promise<void> {
		this.removeToken()
	}

	async getProfile(): Promise<User> {
		return this.request<User>('/auth/profile')
	}

	// Document methods
	async getDocuments(page = 1, limit = 10): Promise<DocumentListResponse> {
		return this.request<DocumentListResponse>(
			`/documents?page=${page}&limit=${limit}`
		)
	}

	async getDocument(id: string): Promise<Document> {
		return this.request<Document>(`/documents/${id}`)
	}

	async getDocumentBySlug(slug: string): Promise<Document> {
		return this.request<Document>(`/documents/slug/${slug}`)
	}

	async createDocument(documentData: CreateDocumentData): Promise<Document> {
		return this.request<Document>('/documents', {
			method: 'POST',
			body: JSON.stringify(documentData),
		})
	}

	async updateDocument(
		id: string,
		documentData: UpdateDocumentData
	): Promise<Document> {
		return this.request<Document>(`/documents/${id}`, {
			method: 'PUT',
			body: JSON.stringify(documentData),
		})
	}

	async deleteDocument(id: string): Promise<void> {
		await this.request(`/documents/${id}`, {
			method: 'DELETE',
		})
	}

	async getMyDocuments(): Promise<DocumentListResponse> {
		return this.request<DocumentListResponse>('/documents/my/documents')
	}

	// Health check
	async healthCheck(): Promise<{ message: string; timestamp: string }> {
		return this.request('/health')
	}

	// Check if user is authenticated
	isAuthenticated(): boolean {
		return !!this.token
	}

	// Get current token
	getToken(): string | null {
		return this.token
	}
}

export const apiClient = new ApiClient()
export default apiClient