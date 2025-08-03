import type { AppProps } from 'next/app'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '../contexts/auth-context'
import { DocumentProvider } from '../contexts/document-context'
import '../styles/globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<DocumentProvider>
				<div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<Component {...pageProps} />
				</div>
			</DocumentProvider>
		</AuthProvider>
	)
} 