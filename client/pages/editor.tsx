import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/auth-context'
import { useDocuments } from '../contexts/document-context'

export default function Editor() {
	const { isAuthenticated } = useAuth()
	const { createDocument, updateDocument } = useDocuments()
	const router = useRouter()
	
	const [document, setDocument] = useState({
		title: 'Untitled Document',
		content: `# Welcome to DocFlow Editor

This is a powerful markdown editor for creating beautiful documentation.

## Features

- **Markdown Support**: Write in markdown and see live preview
- **Real-time Preview**: See your changes instantly
- **Auto-save**: Your work is automatically saved
- **Version Control**: Track changes and revert when needed

## Getting Started

1. Start writing your content in the editor
2. Use markdown syntax for formatting
3. Preview your document in real-time
4. Save and publish when ready

## Code Examples

\`\`\`javascript
function hello() {
  console.log('Hello, DocFlow!');
}
\`\`\`

## Lists

- Feature 1
- Feature 2
- Feature 3

1. Step 1
2. Step 2
3. Step 3

## Links and Images

[Visit our website](https://docflow.com)

![Example Image](https://via.placeholder.com/400x200)

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✅ | Fully supported |
| Preview | ✅ | Real-time |
| Auto-save | ✅ | Every 30 seconds |
| Version Control | 🚧 | Coming soon |

---

*Happy documenting!*`,
	})

	const [isPreviewMode, setIsPreviewMode] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [documentId, setDocumentId] = useState<string | null>(null)
	
	// Redirect if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/login')
		}
	}, [isAuthenticated, router])

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDocument(prev => ({ ...prev, title: e.target.value }))
	}

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDocument(prev => ({ ...prev, content: e.target.value }))
	}

	const handleSave = async () => {
		if (!document.title.trim() || !document.content.trim()) {
			setError('Please enter both title and content')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			const documentData = {
				title: document.title,
				content: document.content,
				status: 'draft' as const,
			}

			if (documentId) {
				// Update existing document
				await updateDocument(documentId, documentData)
			} else {
				// Create new document
				const newDoc = await createDocument(documentData)
				setDocumentId(newDoc.id)
			}
			
			// Show success message (you could add a toast here)
			console.log('Document saved successfully!')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to save document')
		} finally {
			setIsLoading(false)
		}
	}

	const handlePublish = async () => {
		if (!document.title.trim() || !document.content.trim()) {
			setError('Please enter both title and content')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			const documentData = {
				title: document.title,
				content: document.content,
				status: 'published' as const,
			}

			if (documentId) {
				// Update existing document as published
				await updateDocument(documentId, documentData)
			} else {
				// Create new document as published
				const newDoc = await createDocument(documentData)
				setDocumentId(newDoc.id)
			}
			
			// Redirect to dashboard after publishing
			router.push('/dashboard')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to publish document')
		} finally {
			setIsLoading(false)
		}
	}

	// Enhanced markdown to HTML conversion
	const renderMarkdown = (markdown: string) => {
		if (!markdown.trim()) {
			return '<p class="text-gray-500 italic">Start writing to see the preview...</p>'
		}

		return markdown
			// Headers
			.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
			.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
			.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
			// Bold and italic
			.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
			.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
			// Inline code
			.replace(/`([^`]+)`/gim, '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
			// Code blocks
			.replace(/```(\w+)?\n([\s\S]+?)\n```/gim, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-4 mb-4"><code class="text-sm font-mono">$2</code></pre>')
			// Links
			.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
			// Lists
			.replace(/^\* (.+$)/gim, '<li class="ml-4 mb-1">• $1</li>')
			.replace(/^- (.+$)/gim, '<li class="ml-4 mb-1">• $1</li>')
			// Paragraphs and line breaks
			.replace(/\n\n/gim, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
			.replace(/\n/gim, '<br>')
			// Wrap in paragraph
			.replace(/^(.+)/, '<p class="mb-4 text-gray-700 leading-relaxed">$1')
			.replace(/(.+)$/, '$1</p>')
	}

	return (
		<>
			<Head>
				<title>Document Editor - DocFlow</title>
				<meta name="description" content="Edit your documentation" />
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
									<span className="text-sm text-gray-500">Editor</span>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<button
									onClick={() => setIsPreviewMode(!isPreviewMode)}
									className={`px-3 py-1 text-sm font-medium rounded-md ${
										isPreviewMode
											? 'bg-blue-100 text-blue-700'
											: 'text-gray-500 hover:text-gray-700'
									}`}
								>
									{isPreviewMode ? 'Edit' : 'Preview'}
								</button>
								<button
									onClick={handleSave}
									disabled={isLoading}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? 'Saving...' : 'Save Draft'}
								</button>
								<button
									onClick={handlePublish}
									disabled={isLoading}
									className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? 'Publishing...' : 'Publish'}
								</button>
							</div>
						</div>
					</div>
				</nav>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					{/* Document Title */}
					<div className="mb-6">
						<input
							type="text"
							value={document.title}
							onChange={handleTitleChange}
							className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-500"
							placeholder="Enter document title..."
						/>
						{error && (
							<div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
								{error}
							</div>
						)}
					</div>

					{/* Editor/Preview Toggle */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						{isPreviewMode ? (
							/* Preview Mode */
							<div className="p-8">
								<div
									className="max-w-none"
									dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
								/>
							</div>
						) : (
							/* Edit Mode */
							<div className="flex">
								{/* Editor */}
								<div className="flex-1 p-6 border-r border-gray-200">
									<textarea
										value={document.content}
										onChange={handleContentChange}
										className="w-full h-96 p-4 text-sm font-mono text-gray-900 bg-transparent border-none outline-none resize-none"
										placeholder="Start writing your document in markdown..."
									/>
								</div>
								{/* Live Preview */}
								<div className="flex-1 p-6 bg-gray-50">
									<div className="max-w-none">
										<div
											dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
										/>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Markdown Help */}
					{!isPreviewMode && (
						<div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">Markdown Quick Reference</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<h4 className="font-medium text-gray-700 mb-2">Headers</h4>
									<code className="text-xs bg-gray-100 px-2 py-1 rounded"># H1</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">## H2</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">### H3</code>
								</div>
								<div>
									<h4 className="font-medium text-gray-700 mb-2">Formatting</h4>
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">**bold**</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">*italic*</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">`code`</code>
								</div>
								<div>
									<h4 className="font-medium text-gray-700 mb-2">Lists</h4>
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">- item</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">1. item</code>
								</div>
								<div>
									<h4 className="font-medium text-gray-700 mb-2">Code Blocks</h4>
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">```javascript</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">code here</code>
									<br />
									<code className="text-xs bg-gray-100 px-2 py-1 rounded">```</code>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
} 