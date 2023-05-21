/* eslint-disable react/no-unescaped-entities */
import VercelAnalytics from '@/scripts/vercelAnalytics/VercelAnalytics'
import './globals.css'
import ContextWrapper from '@/components/wrapper/contextWrapper'

export const metadata = {
	title: 'Chess Openings',
	description: 'Learn Chess openings and practice them with our interactive trainer.',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="h-full">
			<ContextWrapper>
				<body className="h-full">
					{children}
				</body>
			</ContextWrapper>
			<VercelAnalytics/>
		</html>
	)
}
