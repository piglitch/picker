import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import { SignedIn } from '@clerk/clerk-react';

function Home() {
  const loc = useLocation();
  const isHome = loc.pathname === "/";
  const requiresAuth = loc.pathname.startsWith("/user");

  return (
    <div>
      <Navbar />
      <div className='borderNav w-full'></div>
      {isHome && <HomePage />}
      {requiresAuth ? <SignedIn><Outlet /></SignedIn> : <Outlet />}
    </div>
  );
}

export default Home;
