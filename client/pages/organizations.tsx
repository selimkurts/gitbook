import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/auth-context'

interface Organization {
	id: string
	name: string
	subdomain: string
	description?: string
	website?: string
	isPublic: boolean
	isActive: boolean
	createdAt: string
	updatedAt: string
}

interface OrganizationMembership {
	id: string
	role: 'owner' | 'admin' | 'editor' | 'viewer'
	joinedAt: string
	isActive: boolean
	organization: Organization
}

export default function Organizations() {
	const { user, isAuthenticated } = useAuth()
	const router = useRouter()
	const [organizations, setOrganizations] = useState<OrganizationMembership[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		subdomain: '',
		description: '',
		website: '',
		isPublic: true,
	})

	// Redirect if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/login')
		}
	}, [isAuthenticated, router])

	// Fetch organizations
	useEffect(() => {
		if (isAuthenticated) {
			fetchOrganizations()
		}
	}, [isAuthenticated])

	const fetchOrganizations = async () => {
		try {
			setIsLoading(true)
			const token = localStorage.getItem('accessToken')
			const response = await fetch('/api/organizations/my-organizations', {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error('Failed to fetch organizations')
			}

			const data = await response.json()
			setOrganizations(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch organizations')
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target
		const checked = (e.target as HTMLInputElement).checked
		
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	const handleCreateOrganization = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		try {
			const token = localStorage.getItem('accessToken')
			const response = await fetch('/api/organizations/create-with-owner', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Failed to create organization')
			}

			// Reset form and close modal
			setFormData({
				name: '',
				subdomain: '',
				description: '',
				website: '',
				isPublic: true,
			})
			setShowCreateForm(false)
			
			// Refresh organizations list
			await fetchOrganizations()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create organization')
		}
	}

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Redirecting to login...</div>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>Organizations - DocFlow</title>
				<meta name="description" content="Manage your organizations" />
			</Head>

			<div className="min-h-screen bg-gray-50">
				{/* Navigation */}
				<nav className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center space-x-4">
								<Link href="/dashboard" className="text-2xl font-bold text-gray-900">
									DocFlow
								</Link>
								<div className="flex items-center space-x-2">
									<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
									<span className="text-sm text-gray-500">Organizations</span>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<span className="text-sm text-gray-700">
									Welcome, {user?.firstName} {user?.lastName}
								</span>
								<Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
									Dashboard
								</Link>
							</div>
						</div>
					</div>
				</nav>

				{/* Main Content */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="md:flex md:items-center md:justify-between mb-8">
						<div className="flex-1 min-w-0">
							<h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
								Organizations
							</h2>
							<p className="mt-1 text-sm text-gray-500">
								Manage your organizations and subdomains
							</p>
						</div>
						<div className="mt-4 flex md:mt-0 md:ml-4">
							<button
								onClick={() => setShowCreateForm(true)}
								className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Create Organization
							</button>
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
							<div className="text-sm text-red-600">{error}</div>
						</div>
					)}

					{/* Organizations List */}
					{isLoading ? (
						<div className="text-center py-8">
							<div className="text-lg text-gray-500">Loading organizations...</div>
						</div>
					) : organizations.length === 0 ? (
						<div className="text-center py-8">
							<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5m6 0V9a2 2 0 012-2h2a2 2 0 012 2v6" />
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
							<p className="mt-1 text-sm text-gray-500">Get started by creating your first organization.</p>
						</div>
					) : (
						<div className="bg-white shadow overflow-hidden sm:rounded-md">
							<ul className="divide-y divide-gray-200">
								{organizations.map((membership) => (
									<li key={membership.id}>
										<div className="px-4 py-4 sm:px-6">
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<div className="flex items-center">
														<p className="text-lg font-medium text-blue-600 truncate">
															{membership.organization.name}
														</p>
														<span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
															membership.organization.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
														}`}>
															{membership.organization.isPublic ? 'Public' : 'Private'}
														</span>
														<span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
															membership.role === 'owner' ? 'bg-purple-100 text-purple-800' :
															membership.role === 'admin' ? 'bg-red-100 text-red-800' :
															membership.role === 'editor' ? 'bg-blue-100 text-blue-800' :
															'bg-gray-100 text-gray-800'
														}`}>
															{membership.role.charAt(0).toUpperCase() + membership.role.slice(1)}
														</span>
													</div>
													<div className="mt-2 sm:flex sm:justify-between">
														<div className="sm:flex sm:space-x-4">
															<p className="flex items-center text-sm text-gray-500">
																<span className="font-medium">Subdomain:</span>
																<a 
																	href={`http://${membership.organization.subdomain}.docflow.local`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="ml-1 text-blue-600 hover:text-blue-800"
																>
																	{membership.organization.subdomain}.docflow.local
																</a>
															</p>
															<p className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
																<span className="font-medium">Role:</span>
																<span className="ml-1">{membership.role}</span>
															</p>
														</div>
														<div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
															<time dateTime={membership.organization.createdAt}>
																Created {new Date(membership.organization.createdAt).toLocaleDateString()}
															</time>
														</div>
													</div>
													{membership.organization.description && (
														<p className="mt-2 text-sm text-gray-600">{membership.organization.description}</p>
													)}
													
													{/* Management Actions for Owners/Admins */}
													{(membership.role === 'owner' || membership.role === 'admin') && (
														<div className="mt-4 flex space-x-3">
															<Link 
																href={`/organizations/${membership.organization.id}/members`}
																className="text-sm text-blue-600 hover:text-blue-800"
															>
																Manage Members
															</Link>
															<Link 
																href={`/organizations/${membership.organization.id}/documents`}
																className="text-sm text-blue-600 hover:text-blue-800"
															>
																Manage Documents
															</Link>
														</div>
													)}
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				{/* Create Organization Modal */}
				{showCreateForm && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
							<div className="mt-3">
								<h3 className="text-lg font-medium text-gray-900 mb-4">Create New Organization</h3>
								<form onSubmit={handleCreateOrganization} className="space-y-4">
									<div>
										<label htmlFor="name" className="block text-sm font-medium text-gray-700">
											Organization Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											required
											value={formData.name}
											onChange={handleInputChange}
											className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
										/>
									</div>

									<div>
										<label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
											Subdomain
										</label>
										<div className="mt-1 flex rounded-md shadow-sm">
											<input
												type="text"
												id="subdomain"
												name="subdomain"
												required
												value={formData.subdomain}
												onChange={handleInputChange}
												className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
												placeholder="acme"
											/>
											<span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
												.docflow.local
											</span>
										</div>
									</div>

									<div>
										<label htmlFor="description" className="block text-sm font-medium text-gray-700">
											Description (optional)
										</label>
										<textarea
											id="description"
											name="description"
											rows={3}
											value={formData.description}
											onChange={handleInputChange}
											className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
										/>
									</div>

									<div>
										<label htmlFor="website" className="block text-sm font-medium text-gray-700">
											Website (optional)
										</label>
										<input
											type="url"
											id="website"
											name="website"
											value={formData.website}
											onChange={handleInputChange}
											className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
											placeholder="https://example.com"
										/>
									</div>

									<div className="flex items-center">
										<input
											id="isPublic"
											name="isPublic"
											type="checkbox"
											checked={formData.isPublic}
											onChange={handleInputChange}
											className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
										/>
										<label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
											Make organization publicly accessible
										</label>
									</div>

									<div className="flex justify-end space-x-3 pt-4">
										<button
											type="button"
											onClick={() => setShowCreateForm(false)}
											className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
										>
											Create
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}