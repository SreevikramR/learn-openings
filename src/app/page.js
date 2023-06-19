import Link from 'next/link'
import AnimatedBoard from '@/components/chessboard/AnimatedBoard'
import Image from 'next/image'
import queenLogo from '../../public/queen_logo.png'
import styles from './styles/home.module.css'
import StatTile from '@/components/home/StatTile'
import kingKnightIcon from '../../public/kingKnight.png'

export default function Home() {

	return (
		<>
			<section className={styles.heroSection}>
				<div className='flex flex-col'>
					<div className='flex justify-center mt-40'>
						<div className={styles.logo}>
							<Image src={queenLogo} width={50} height={50} alt='chess queen'/>
						</div>
					</div>
					<div className="w-3/4 lg:w-1/2 flex self-center text-center text-5xl lg:text-7xl font-bold text-blue-600 mt-12">
						<div className={styles.headingText}>
							Master the Art of Chess Openings
						</div>
					</div>
					<div className='w-full flex justify-center items-center text-center mt-12'>
						<div className={styles.button1}>
							<Link href="/register">
								<button className='bg-white hover:border-blue-600 text-zinc-900 font-semibold px-5 py-2 border-2 rounded-full mr-2'>Learn Now</button>
							</Link>
						</div>
						<div className={styles.button2}>
							<Link href="/try_now">
								<button className=' bg-yellow-400 hover:border-white text-zinc-900 font-semibold px-5 py-2 border-2 border-yellow-400 rounded-full ml-2'>Try for Free</button>
							</Link>
						</div>
					</div>
					<div className='text-center pt-6 text-gray-400'>
						<div className={styles.loginButton}>
							<Link href="/login" className='hover:text-white'>
								Login
							</Link>
						</div>
					</div>
				</div>
			</section>
			<section className="bg-blue-600 pt-16 lg:pt-24 flex flex-col">
				<div className="px-4 lg:px-0 lg:w-4/5 text-neutral-900 self-center">
					<span className='text-3xl lg:text-6xl font-semibold'>
						Unleash the <span className={styles.highlightedText}>Grandmaster</span> Within <span className={styles.highlightedText}>You!</span>
					</span>
					<p className='text-base lg:text-xl text-white lg:w-3/5 pb-20 mt-10'>
					Whether you&apos;re a beginner or a seasoned player, our interactive chessboard and diverse range of openings have got you covered. Join a community of chess enthusiasts and elevate your game to the next level. Learn, practice, and unleash the grandmaster within you.
					</p>
				</div>
			</section>
			<section className='flex flex-col lg:flex-row pt-20 pb-20'>
				<div className='lg:w-1/2 px-4 lg:pl-12 lg:pr-0 flex flex-col justify-center'>
					<span className='font-semibold text-3xl lg:text-5xl pb-4 lg:pb-12'>Interactive Learning Experience</span>
					<span className='text-base pb-8 lg:text-xl lg:pb-0'>Learn chess openings step-by-step using our interactive board that will guide you through each move, ensuring a comprehensive understanding. Equip yourself with unbeatable strategies and conquer the 64 squares with newfound expertise</span>
				</div>

				<div className='lg:w-1/2 justify-center flex'>
					<AnimatedBoard />
				</div>
			</section>
			<section className='flex flex-col lg:flex-row lg:pt-20 pb-20 justify-center flex-wrap items-center'>
				<StatTile text="Opening Variations" value={50} index={0}/>
				<StatTile text="Openings" value={5} index={1}/>
			</section>
			<section className='flex flex-col pt-10 pb-20 items-center'>
				<div>
					<Image src={kingKnightIcon} width={250} height={250} alt='chess King, Knight'/>
				</div>
				<div className='w-4/5 lg:w-3/5 text-3xl lg:text-5xl text-center'>
					Ready to unlock your full chess potential? Jump in!
				</div>
				<div className='flex flex-row mt-8'>
					<div>
						<button className='bg-white hover:border-blue-600 text-zinc-900 font-semibold px-5 py-2 border-2 rounded-full mr-2'>Learn Now</button>
					</div>
					<div>
						<Link href="/try_now">
							<button className=' bg-yellow-400 hover:border-white text-zinc-900 font-semibold px-5 py-2 border-2 border-yellow-400 rounded-full ml-2'>Try for Free</button>
						</Link>
					</div>
				</div>
			</section>
			<section>
				<span className='flex justify-center pb-4 pt-10'>
					<a className='p-2 border-white border-2 rounded-lg' href="mailto:sreevikram.r@gmail.com">
						Contact: sreevikram.r@gmail.com
					</a>
				</span>
			</section>
		</>
	)
}
