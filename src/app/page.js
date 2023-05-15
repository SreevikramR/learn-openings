import NavbarComponent from '@/components/navbar/Navbar'
import Link from 'next/link'
import AnimatedBoard from '@/components/chessboard/AnimatedBoard'
import TrialPageInit from '@/scripts/TrialPageInit'

export default function Home() {

	return (
		<>
			<NavbarComponent />
			<main className="flex flex-col w-full lg:flex-row lg:flex lg:columns-2 lg:justify-center lg:align-middle lg:items-center lg:w-full">
				<div className="w-full justify-center flex relative lg:w-1/2 lg:col-span-1 lg:relative lg:justify-center lg:flex lg:mt-5">
					<span>
						<AnimatedBoard />
					</span>
				</div>
				<div className="text-white w-full text-4xl font-bold text-center mt-3 lg:text-white lg:col-span-1 lg:w-1/2 lg:text-center lg:text-7xl lg:font-bold lg:flex-row">
					<span className="text-blue-600">Crush</span> your <br/> opponents with <br/> <span className="text-blue-600">flawless</span> openings
					<br/><div className="mt-6"><Link href="/try_now"><span className="text-3xl font-bold text-white lg:border-4 lg:border-blue-600 bg-blue-600 hover:border-white lg:px-4 px-2 py-2 lg:m-4 lg:py-3 rounded-xl lg:rounded-2xl hover:cursor-pointer"> Try Now! </span></Link></div>
				</div>
			</main>
			<TrialPageInit />
		</>
	)
}
