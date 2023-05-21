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
					<script type="text/javascript">
						var sc_project=12883036; 
						var sc_invisible=1; 
						var sc_security="0bbd5ceb"; 
					</script>
					<script type="text/javascript"
					src="https://www.statcounter.com/counter/counter.js" async></script>
					<noscript><div class="statcounter"><a title="Web Analytics"
						href="https://statcounter.com/" target="_blank"><img class="statcounter"
						src="https://c.statcounter.com/12883036/0/0bbd5ceb/1/" alt="Web Analytics"
					referrerPolicy="no-referrer-when-downgrade"/></a></div></noscript>
					{children}
				</body>
			</ContextWrapper>
			<VercelAnalytics/>
		</html>
	)
}
