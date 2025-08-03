import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
	return (
		<>
			<Head>
				<title>DocFlow - Intelligent Documentation Platform</title>
				<meta name="description" content="Create beautiful, AI-optimized docs that automatically adapt to your users and drive conversion" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			
			{/* Navigation */}
			<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<h1 className="text-2xl font-bold text-gray-900">DocFlow</h1>
							</div>
						</div>
						<div className="hidden md:block">
							<div className="ml-10 flex items-baseline space-x-4">
								<Link href="/docs" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									Documentation
								</Link>
								<Link href="/api" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									API
								</Link>
								<Link href="/pricing" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									Pricing
								</Link>
								<Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
									Login
								</Link>
								<Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
									Start for free
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
							Intelligent docs that{' '}
							<span className="text-blue-600">sell, support</span> and{' '}
							<span className="text-blue-600">scale</span> your product
						</h1>
						<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
							Create beautiful, AI-optimized docs that automatically adapt to your users and drive conversion
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
								Start for free
							</Link>
							<Link href="/demo" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
								Get a demo
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Essential features, elevated
						</h2>
						<p className="text-xl text-gray-600">
							Everything you need to create world-class documentation
						</p>
					</div>
					
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Documentation</h3>
							<p className="text-gray-600">
								Create beautiful docs with our intuitive editor. Support for Markdown, code blocks, and rich media.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
							<p className="text-gray-600">
								Get intelligent suggestions to improve writing, structure and docs completeness with AI assistance.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">Git Integration</h3>
							<p className="text-gray-600">
								Sync your docs to GitHub or GitLab and collaborate in our WYSIWYG editor or your IDE.
							</p>
						</div>

						{/* Feature 4 */}
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
							<p className="text-gray-600">
								Optimize your docs using built-in analytics to create docs that convert and engage users.
							</p>
						</div>

						{/* Feature 5 */}
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Access</h3>
							<p className="text-gray-600">
								Control who sees your published docs with authenticated access and role-based permissions.
							</p>
						</div>

						{/* Feature 6 */}
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
							<p className="text-gray-600">
								Get help when you need it with our comprehensive documentation and support team.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-blue-600 py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Get started for free
					</h2>
					<p className="text-xl text-blue-100 mb-8">
						Play around with DocFlow and set up your docs for free. Add your team and pay when you&apos;re ready.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/signup" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
							Start for free
						</Link>
						<Link href="/demo" className="border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
							Get a demo
						</Link>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-xl font-bold mb-4">DocFlow</h3>
							<p className="text-gray-400">
								Intelligent documentation platform for modern teams.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Product</h4>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/features" className="hover:text-white">Features</Link></li>
								<li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
								<li><Link href="/api" className="hover:text-white">API</Link></li>
								<li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Resources</h4>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
								<li><Link href="/blog" className="hover:text-white">Blog</Link></li>
								<li><Link href="/tutorials" className="hover:text-white">Tutorials</Link></li>
								<li><Link href="/support" className="hover:text-white">Support</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Company</h4>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/about" className="hover:text-white">About</Link></li>
								<li><Link href="/careers" className="hover:text-white">Careers</Link></li>
								<li><Link href="/contact" className="hover:text-white">Contact</Link></li>
								<li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2025 DocFlow. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</>
	)
} 