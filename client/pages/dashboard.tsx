import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/auth-context'
import { useDocuments } from '../contexts/document-context'

export default function Dashboard() {
	const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
	const { documents, isLoading, error, fetchDocuments } = useDocuments()
	const router = useRouter()

	// Redirect to login if not authenticated (but wait for auth to initialize)
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/login')
		}
	}, [authLoading, isAuthenticated, router])

	// Fetch documents on component mount
	useEffect(() => {
		if (isAuthenticated) {
			fetchDocuments()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])

	const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published' | 'archived'>('all')

	const filteredDocuments = documents.filter(doc => {
		if (activeTab === 'all') return true
		return doc.status === activeTab
	})

	const handleLogout = async () => {
		await logout()
		router.push('/')
	}

	// Show loading state during auth initialization
	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		)
	}

	// Show redirecting state if not authenticated
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Redirecting to login...</div>
			</div>
		)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'published':
				return 'bg-green-100 text-green-800'
			case 'draft':
				return 'bg-yellow-100 text-yellow-800'
			case 'archived':
				return 'bg-gray-100 text-gray-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	return (
		<>
			<Head>
				<title>Dashboard - DocFlow</title>
				<meta name="description" content="Manage your documentation" />
			</Head>

			<div className="min-h-screen bg-gray-50">
				{/* Navigation */}
				<nav className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center">
								<Link href="/" className="text-2xl font-bold text-gray-900">
									DocFlow
								</Link>
							</div>
							<div className="flex items-center space-x-4">
								<Link 
									href="/editor"
									className="text-gray-500 hover:text-gray-700 font-medium"
								>
									New Document
								</Link>
								<div className="relative group">
									<button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
											{user?.firstName?.[0]}{user?.lastName?.[0]}
										</div>
										<span className="text-sm font-medium">{user?.fullName}</span>
									</button>
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
										<div className="px-4 py-2 text-sm text-gray-700 border-b">
											<div className="font-medium">{user?.fullName}</div>
											<div className="text-gray-500">{user?.email}</div>
										</div>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Sign out
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="mb-8">
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
								<p className="mt-2 text-gray-600">
									Manage your documentation and track performance
								</p>
							</div>
							<Link 
								href="/editor"
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-block"
							>
								+ New Document
							</Link>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<div className="bg-white p-6 rounded-lg shadow-sm">
							<div className="flex items-center">
								<div className="p-2 bg-blue-100 rounded-lg">
									<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">Total Documents</p>
									<p className="text-2xl font-bold text-gray-900">{documents.length}</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm">
							<div className="flex items-center">
								<div className="p-2 bg-green-100 rounded-lg">
									<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">Published</p>
									<p className="text-2xl font-bold text-gray-900">
										{documents.filter(doc => doc.status === 'published').length}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm">
							<div className="flex items-center">
								<div className="p-2 bg-yellow-100 rounded-lg">
									<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">Drafts</p>
									<p className="text-2xl font-bold text-gray-900">
										{documents.filter(doc => doc.status === 'draft').length}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm">
							<div className="flex items-center">
								<div className="p-2 bg-purple-100 rounded-lg">
									<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">Total Views</p>
									<p className="text-2xl font-bold text-gray-900">
										{documents.reduce((sum, doc) => sum + doc.views, 0).toLocaleString()}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Error State */}
					{error && (
						<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium">Error loading documents</h3>
									<div className="mt-2 text-sm">
										<p>{error}</p>
									</div>
									<div className="mt-4">
										<button
											onClick={fetchDocuments}
											className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium"
										>
											Try again
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Documents Section */}
					<div className="bg-white rounded-lg shadow-sm">
						<div className="px-6 py-4 border-b border-gray-200">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-medium text-gray-900">Documents</h2>
								<div className="flex items-center space-x-4">
									{isLoading && (
										<div className="flex items-center text-gray-500">
											<div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
											Loading...
										</div>
									)}
									<div className="flex space-x-1">
										{(['all', 'draft', 'published', 'archived'] as const).map((tab) => (
											<button
												key={tab}
												onClick={() => setActiveTab(tab)}
												className={`px-3 py-1 text-sm font-medium rounded-md ${
													activeTab === tab
														? 'bg-blue-100 text-blue-700'
														: 'text-gray-500 hover:text-gray-700'
												}`}
											>
												{tab.charAt(0).toUpperCase() + tab.slice(1)}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Document
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Last Modified
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Views
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredDocuments.length === 0 ? (
										<tr>
											<td colSpan={5} className="px-6 py-12 text-center">
												<div className="text-gray-500">
													<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
													</svg>
													<h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
													<p className="mt-1 text-sm text-gray-500">
														{activeTab === 'all' 
															? 'Get started by creating your first document.'
															: `No ${activeTab} documents found.`
														}
													</p>
													<div className="mt-6">
														<Link
															href="/editor"
															className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
														>
															+ New Document
														</Link>
													</div>
												</div>
											</td>
										</tr>
									) : (
										filteredDocuments.map((document) => (
											<tr key={document.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">
															{document.title}
														</div>
														<div className="text-sm text-gray-500">
															{document.description}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(document.status)}`}>
														{document.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{new Date(document.updatedAt).toLocaleDateString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{document.views.toLocaleString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex space-x-2">
														<button className="text-blue-600 hover:text-blue-900">Edit</button>
														<button className="text-gray-600 hover:text-gray-900">View</button>
														<button className="text-red-600 hover:text-red-900">Delete</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	)
} 