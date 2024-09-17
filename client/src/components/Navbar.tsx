import { Link } from "react-router-dom";

const Navbar = () => {
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
        <div>SignIn</div> 
      </div>
    </nav>
  )
}

export default Navbar;