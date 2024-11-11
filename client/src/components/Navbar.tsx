import { SignedIn, SignedOut, SignInButton, useClerk, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useClerk();
  const [dot, setDot] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setDot(prevDot => !prevDot); // Toggle dot state
    }, 500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
   return (
    <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
      <div className="text-2xl my-auto">
        <Link to="/">
          picker
          <span className="text-red-600 font-bold">
            {dot ? '/': ''}
          </span>
        </Link>
      </div>
      <div className="my-auto flex justify-between gap-6">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div><Link to={`/user/${user?.id}/overview`}>Dashboard</Link></div>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar;