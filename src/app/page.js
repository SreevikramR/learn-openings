import NavbarComponent from '@/components/navbar/Navbar'
import Link from 'next/link'
import AnimatedBoard from '@/components/chessboard/AnimatedBoard'

export default function Home() {
	return (
		<>
		<NavbarComponent />
		<main className="flex-row flex columns-2 justify-center align-middle items-center w-full">
			<div className="w-1/2 col-span-1 relative justify-center flex mt-5">
				<span>
					<AnimatedBoard />
				</span>
			</div>
			<div className="text-white col-span-1 w-1/2 text-center text-7xl font-bold flex-row">
				<span className="text-blue-600">Crush</span> your <br/> opponents with <br/> <span className="text-blue-600">flawless</span> openings
				<br/><div className="mt-4"><Link href="/try_now"><span className="text-3xl font-bold text-white border-4 border-blue-600 bg-blue-600 hover:border-white px-4 m-4 py-3 rounded-2xl hover:cursor-pointer"> Try Now! </span></Link></div>
			</div>
		</main>
		</>
	)
}
