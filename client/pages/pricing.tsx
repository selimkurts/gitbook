import Head from 'next/head'
import Link from 'next/link'

export default function Pricing() {
	const plans = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			description: 'Perfect for individuals and small projects',
			features: [
				'Up to 3 documents',
				'Basic markdown editor',
				'Public sharing',
				'Community support',
				'1GB storage',
			],
			cta: 'Get Started',
			popular: false,
		},
		{
			name: 'Pro',
			price: '$15',
			period: 'per month',
			description: 'Great for teams and growing businesses',
			features: [
				'Unlimited documents',
				'Advanced markdown editor',
				'Private sharing',
				'Priority support',
				'10GB storage',
				'Analytics dashboard',
				'Custom branding',
				'API access',
			],
			cta: 'Start Free Trial',
			popular: true,
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: 'per month',
			description: 'For large organizations with advanced needs',
			features: [
				'Everything in Pro',
				'Unlimited storage',
				'SSO integration',
				'Advanced analytics',
				'Custom domains',
				'Dedicated support',
				'Team management',
				'Advanced security',
			],
			cta: 'Contact Sales',
			popular: false,
		},
	]

	return (
		<>
			<Head>
				<title>Pricing - DocFlow</title>
				<meta name="description" content="Choose the perfect plan for your documentation needs" />
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
							<div className="hidden md:block">
								<div className="ml-10 flex items-baseline space-x-4">
									<Link href="/docs" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
										Documentation
									</Link>
									<Link href="/api" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
										API
									</Link>
									<Link href="/pricing" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
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

				{/* Header */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Simple, transparent pricing
						</h1>
						<p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
							Choose the perfect plan for your documentation needs. Start free and upgrade as you grow.
						</p>
					</div>

					{/* Pricing Cards */}
					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{plans.map((plan) => (
							<div
								key={plan.name}
								className={`relative bg-white rounded-lg shadow-sm border-2 p-8 ${
									plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-200'
								}`}
							>
								{plan.popular && (
									<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
										<span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
											Most Popular
										</span>
									</div>
								)}

								<div className="text-center">
									<h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
									<div className="mb-4">
										<span className="text-4xl font-bold text-gray-900">{plan.price}</span>
										{plan.period !== 'forever' && (
											<span className="text-gray-600 ml-1">/{plan.period}</span>
										)}
									</div>
									<p className="text-gray-600 mb-8">{plan.description}</p>

									<ul className="space-y-4 mb-8 text-left">
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-start">
												<svg
													className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
												<span className="text-gray-700">{feature}</span>
											</li>
										))}
									</ul>

									<Link
										href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
										className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
											plan.popular
												? 'bg-blue-600 text-white hover:bg-blue-700'
												: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
										}`}
									>
										{plan.cta}
									</Link>
								</div>
							</div>
						))}
					</div>

					{/* FAQ Section */}
					<div className="mt-24 max-w-4xl mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
							Frequently Asked Questions
						</h2>
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Can I change plans anytime?
								</h3>
								<p className="text-gray-600">
									Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Is there a free trial?
								</h3>
								<p className="text-gray-600">
									Yes, all paid plans come with a 14-day free trial. No credit card required to start.
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									What payment methods do you accept?
								</h3>
								<p className="text-gray-600">
									We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Can I cancel anytime?
								</h3>
								<p className="text-gray-600">
									Absolutely. You can cancel your subscription at any time with no cancellation fees.
								</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<div className="mt-24 text-center">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Ready to get started?
						</h2>
						<p className="text-xl text-gray-600 mb-8">
							Join thousands of teams using DocFlow to create beautiful documentation.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/signup"
								className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
							>
								Start for free
							</Link>
							<Link
								href="/contact"
								className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
							>
								Contact sales
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
} 