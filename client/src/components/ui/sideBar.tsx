import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const SideBar = () => {
  const params = useParams();
  const [dot, setDot] = useState(true)
  //console.log(location.pathname[]);
  const getLastXLetters = (str, x) => str.slice(-x);
  useEffect(() => {
    const interval = setInterval(() => {
      setDot(prevDot => !prevDot); // Toggle dot state
    }, 500);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  return (
    <div className='sidebar flex flex-col py-4 gap-2 w-1/6 mt-8'> 
      <Link to={`/user/${params.id}/overview/`}>
        <div className='p-1 rounded-md hover:text-green-600'>
          Dashboard
          <span className="text-red-600 ml-2 font-bold mt-auto">
            {dot && getLastXLetters(location.pathname, 9) === 'overview/' ? <span className="h-2 w-2  bg-red-600 rounded-full inline-block"></span>: ''}
          </span>
        </div>
      </Link>
      <Link to={`/user/${params.id}/files/`}>
        <div className='p-1 rounded-md hover:text-green-600'>
          Files  
          <span className="text-red-600 ml-2 font-bold mt-auto">
            {dot && getLastXLetters(location.pathname, 6) === 'files/' ? <span className="h-2 w-2  bg-red-600 rounded-full inline-block"></span>: ''}
          </span>
        </div>  
      </Link>
      <Link to={`/user/${params.id}/settings/`}>
        <div className='p-1 rounded-md hover:text-green-600'>
          Settings
          <span className="text-red-600 ml-2 font-bold mt-auto">
            {dot && getLastXLetters(location.pathname, 9) === 'settings/' ? <span className="h-2 w-2  bg-red-600 rounded-full inline-block"></span>: ''}
          </span>
        </div>
      </Link>      
    </div>
  )
}

export default SideBar