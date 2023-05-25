import NavbarComponent from '@/components/navbar/Navbar'
import Link from 'next/link'
import AnimatedBoard from '@/components/chessboard/AnimatedBoard'
import TrialPageInit from '@/scripts/TrialPageInit'

export default function Home() {

	return (
		<>
			<NavbarComponent />
			<section className="flex flex-col w-full lg:flex-row lg:flex lg:columns-2 lg:justify-center lg:align-middle lg:items-center lg:w-full">
				<div className="w-full justify-center flex relative lg:w-1/2 lg:col-span-1 lg:relative lg:justify-center lg:flex lg:mt-5">
					<span>
						<AnimatedBoard />
					</span>
				</div>
				<div className="text-white w-full text-4xl font-bold text-center mt-3 lg:text-white lg:col-span-1 lg:w-1/2 lg:text-center lg:text-7xl lg:font-bold lg:flex-row">
					<span className="text-blue-600">Crush</span> your <br/> opponents with <br/> <span className="text-blue-600">flawless</span> openings
					<br/><div className="mt-6 mb-10 xl:mb-0"><Link href="/try_now"><span className="text-3xl font-bold text-white lg:border-4 lg:border-blue-600 bg-blue-600 hover:border-white lg:px-4 px-2 py-2 lg:m-4 lg:py-3 rounded-xl lg:rounded-2xl hover:cursor-pointer"> Try Now! </span></Link></div>
				</div>
			</section>
			<div className="aspect-90/15 w-full bg-no-repeat bg-center bg-cover bg-transition1"></div>
			<section className="bg-blue-800 flex -mt-1">
				<div className='w-full text-center text-2xl lg:text-4xl xl:text-5xl italic font-semibold lg:ml-10 ml-5 mt-5 mb-5 lg:mt-10 mr-5 lg:mb-16'>
					<span className=''>Don’t Just Watch Chess Openings. Start playing them on the board</span>
				</div>
			</section>
			<div className="aspect-90/15 w-full bg-no-repeat bg-center bg-cover bg-transition2 -mt-1"></div>
			<section className="bg-black flex flex-col">
				<div className='w-full lg:w-11/12 text-center text-2xl lg:text-5xl italic font-semibold mb-8 lg:mb-16 lg:justify-end lg:flex'>
					<span className='font-semibold'>What is a Chess Opening?</span>
				</div>
				<div className='lg:w-4/6 text-center text-lg lg:text-3xl font-semibold lg:ml-10 ml-5 lg:mt-10 mr-3 mb-10 lg:mb-24'>
					<span className=''>A chess opening is the first few moves of a chess game. It is important to study openings because they can give you a significant advantage over your opponent. <br/> <br/>
						There are many different chess openings, and each one has its own strengths and weaknesses<br/> <br/>
						With a little practice, you can learn to play chess openings like a pro</span>
				</div>
				<br/><div className="mb-20 flex self-center"><Link href="/try_now"><span className="text-xl lg:text-3xl font-bold text-white lg:border-4 lg:border-blue-600 bg-blue-600 hover:border-white lg:px-4 px-2 py-2 lg:m-4 lg:py-3 rounded-xl lg:rounded-2xl hover:cursor-pointer"> Start Learning Now! </span></Link></div>
			</section>
			<TrialPageInit />
		</>
	)
}
