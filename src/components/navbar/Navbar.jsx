import React from 'react'
import Link from 'next/link'

const NavbarComponent = () => {

  return (
    <>
      <nav className='flex items-center flex-wrap bg-black p-3 pt-2 border-b-2 mb-4 border-b-zinc-900'>
        <Link href='/'>
          <span className='sm:text-m lg:text-4xl text-white font-semibold tracking-wide'>
            Chess Openings
          </span>
        </Link>
        <div className='hidden w-full lg:inline-flex lg:flex-grow lg:w-auto'>
          <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto text-white'>
            <Link href="/login">
              <span className='lg:inline-flex lg:w-auto w-full pl-3 py-2 rounded border-2 border-l-zinc-900 border-black text-white items-center justify-center text-xl font-semibold italic'>
                Login
              </span>
            </Link>
            <Link href="/register">
              <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 mx-2 rounded border-2 border-l-zinc-900 border-black items-center justify-center text-xl font-semibold italic text-white'>
                Register
              </span>
            </Link>
            <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded-xl border-2 border-blue-700 text-white font-bold items-center justify-center hover:border-white hover:text-white text-xl bg-blue-600'>
              Try Now!
            </span>
          </div>
        </div>
      </nav>
    </>
    )
  }
  
  export default NavbarComponent