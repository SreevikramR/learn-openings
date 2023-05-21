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
				<script	async src="https://www.googletagmanager.com/gtag/js?id=G-6KBPW0W9J9"/>
    			<script>{injectGA()}</script>
					{children}
				</body>
			</ContextWrapper>
			<VercelAnalytics/>
		</html>
	)
}

const injectGA = () => {
	if (typeof window == 'undefined') {
	  return;
	}
	window.dataLayer = window.dataLayer || [];
	function gtag() {
	  window.dataLayer.push(arguments);
	}
	gtag('js', new Date());
  
	gtag('config', 'G-6KBPW0W9J9');
  };
