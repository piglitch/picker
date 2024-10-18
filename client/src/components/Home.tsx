import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import { SignedIn } from '@clerk/clerk-react';

function Home() {
  const loc = useLocation()
  const isHome = loc.pathname === "/";
  return (
    <div>
      <Navbar />
      <div className='borderNav w-full'></div>
      {isHome && <HomePage />}
      <SignedIn><Outlet /></SignedIn> 
    </div>
  )
}

export default Home;