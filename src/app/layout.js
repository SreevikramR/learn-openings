/* eslint-disable react/no-unescaped-entities */
import VercelAnalytics from '@/scripts/vercelAnalytics/VercelAnalytics'
import './globals.css'
import ContextWrapper from '@/components/wrapper/contextWrapper'
import Script from 'next/script'
import { Oxanium } from 'next/font/google'

export const metadata = {
	title: 'Openigns 101',
	description: 'Learn Chess openings and practice them with our interactive trainer.',
}

const unbounded = Oxanium({
	weight: ['200', '300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
})

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="h-full">
			<ContextWrapper>
				<body className="h-full">
					<Script async strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-6KBPW0W9J9`}/>
					<Script async id="ga-script" strategy="lazyOnload">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-6KBPW0W9J9', {
						page_path: window.location.pathname,
						});
							`}
					</Script>
					<main className={unbounded.className}>
						{children}
					</main>
				</body>
			</ContextWrapper>
			<VercelAnalytics/>
		</html>
	)
}
