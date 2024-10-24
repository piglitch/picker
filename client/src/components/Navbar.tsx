import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const addUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/create-user/', {
        method: 'POST',
      });
      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

      const result = await response.json();
      console.log('user created', result);
    } catch (error) {
      console.log('Error creating: ', error);
    }
    console.log('user craeted!!!');
  }
  return (
    <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
      <div className="text-2xl my-auto">
        <Link to="/">
          <span className="text-violet-500">pic</span>ker
          <span className="text-yellow-400">.</span>
        </Link>
      </div>
      <div className="my-auto flex justify-between gap-6">
        <div><Link to="/dashboard">Dashboard</Link></div>
        <div>
          {/* <button type="button" onClick={addUser}>Add user</button> */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div> 
      </div>
    </nav>
  )
}

export default Navbar;