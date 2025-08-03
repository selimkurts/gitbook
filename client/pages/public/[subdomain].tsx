import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { useState } from 'react'

interface PublicDocument {
	id: string
	title: string
	description?: string
	slug?: string
	content: string
	views: number
	publishedAt?: string
	updatedAt: string
}

interface Organization {
	name: string
	subdomain: string
	description?: string
	website?: string
	logo?: string
}

interface PublicOrganizationData {
	organization: Organization
	documents: PublicDocument[]
}

interface PublicSubdomainPageProps {
	data: PublicOrganizationData | null
	error?: string
	subdomain: string
}

export default function PublicSubdomainPage({ data, error, subdomain }: PublicSubdomainPageProps) {
	const [selectedDocument, setSelectedDocument] = useState<PublicDocument | null>(null)

	// Render markdown content (basic implementation)
	const renderMarkdown = (markdown: string) => {
		return markdown
			.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
			.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
			.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
			.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
			.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
			.replace(/`([^`]+)`/gim, '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
			.replace(/```(\w+)?\n([\s\S]+?)\n```/gim, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-4 mb-4"><code class="text-sm font-mono">$2</code></pre>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
			.replace(/^\* (.+$)/gim, '<li class="ml-4 mb-1">• $1</li>')
			.replace(/^- (.+$)/gim, '<li class="ml-4 mb-1">• $1</li>')
			.replace(/\n\n/gim, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
			.replace(/\n/gim, '<br>')
			.replace(/^(.+)/, '<p class="mb-4 text-gray-700 leading-relaxed">$1')
			.replace(/(.+)$/, '$1</p>')
	}

	if (error) {
		return (
			<>
				<Head>
					<title>Organization Not Found</title>
				</Head>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h1>
						<p className="text-gray-600 mb-6">{error}</p>
						<Link href="http://localhost:3000" className="text-blue-600 hover:text-blue-800">
							Go to DocFlow Homepage
						</Link>
					</div>
				</div>
			</>
		)
	}

	if (!data) {
		return (
			<>
				<Head>
					<title>Loading...</title>
				</Head>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-lg text-gray-500">Loading...</div>
				</div>
			</>
		)
	}

	const { organization, documents } = data

	return (
		<>
			<Head>
				<title>{organization.name} - Documentation</title>
				<meta name="description" content={organization.description || `${organization.name} documentation`} />
			</Head>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<header className="bg-white shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-6">
							<div className="flex items-center">
								{organization.logo ? (
									<img src={organization.logo} alt={organization.name} className="h-8 w-8 mr-3" />
								) : (
									<div className="h-8 w-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
										<span className="text-white font-bold text-sm">
											{organization.name.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
								<div>
									<h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
									{organization.description && (
										<p className="text-sm text-gray-600">{organization.description}</p>
									)}
								</div>
							</div>
							<div className="flex items-center space-x-4">
								{organization.website && (
									<a
										href={organization.website}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-gray-600 hover:text-gray-900"
									>
										Website
									</a>
								)}
								<a
									href="http://localhost:3000"
									className="text-sm text-blue-600 hover:text-blue-800"
								>
									Powered by DocFlow
								</a>
							</div>
						</div>
					</div>
				</header>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Sidebar - Document List */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
								{documents.length === 0 ? (
									<p className="text-sm text-gray-500">No documents available</p>
								) : (
									<nav className="space-y-2">
										{documents.map((doc) => (
											<button
												key={doc.id}
												onClick={() => setSelectedDocument(doc)}
												className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
													selectedDocument?.id === doc.id
														? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
														: 'text-gray-700 hover:bg-gray-50'
												}`}
											>
												<div className="font-medium">{doc.title}</div>
												{doc.description && (
													<div className="text-xs text-gray-500 mt-1">{doc.description}</div>
												)}
											</button>
										))}
									</nav>
								)}
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-3">
							{selectedDocument ? (
								<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
									<div className="mb-6">
										<h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedDocument.title}</h1>
										{selectedDocument.description && (
											<p className="text-lg text-gray-600">{selectedDocument.description}</p>
										)}
										<div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
											<span>{selectedDocument.views} views</span>
											{selectedDocument.publishedAt && (
												<span>Published {new Date(selectedDocument.publishedAt).toLocaleDateString()}</span>
											)}
											<span>Updated {new Date(selectedDocument.updatedAt).toLocaleDateString()}</span>
										</div>
									</div>
									
									<div className="prose max-w-none">
										<div
											dangerouslySetInnerHTML={{
												__html: renderMarkdown(selectedDocument.content)
											}}
										/>
									</div>
								</div>
							) : documents.length > 0 ? (
								<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
									<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
									<p className="text-gray-600">Choose a document from the sidebar to start reading.</p>
								</div>
							) : (
								<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
									<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<h3 className="text-lg font-medium text-gray-900 mb-2">No Documentation Available</h3>
									<p className="text-gray-600">This organization hasn&apos;t published any documents yet.</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { subdomain } = context.params as { subdomain: string }

	try {
		const response = await fetch(`http://localhost:3001/organizations/public/subdomain/${subdomain}`)
		
		if (!response.ok) {
			if (response.status === 404) {
				return {
					props: {
						data: null,
						error: 'Organization not found or not publicly accessible',
						subdomain,
					},
				}
			}
			throw new Error('Failed to fetch organization data')
		}

		const data = await response.json()

		return {
			props: {
				data,
				subdomain,
			},
		}
	} catch (error) {
		return {
			props: {
				data: null,
				error: 'Failed to load organization data',
				subdomain,
			},
		}
	}
}