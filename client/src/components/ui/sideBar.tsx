import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const SideBar = () => {
  const params = useParams();
  const [dot, setDot] = useState(true)
  const getLastXLetters = (str, x) => str.slice(-x);
  useEffect(() => {
    const interval = setInterval(() => {
      setDot(prevDot => !prevDot); // Toggle dot state
    }, 500);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  return (

    <div className='sidebar flex justify-center lg:inline-block py-4 gap-24 lg:gap-2 lg:w-1/6 mt-8'> 
      <Link to={`/user/${params.id}/files/`}>
        <div className='p-1 w-20 underline text-center lg:mb-4 rounded-md hover:text-green-600'>
          File<span>
            {dot && getLastXLetters(location.pathname, 6) === 'files/' ? <span className="text-red-600 bg-black">s</span>: 's'}
          </span>
        </div>  
      </Link>

      <Link to={`/user/${params.id}/usage/`}>
        <div className='p-1 w-20 underline text-center rounded-md hover:text-green-600'>
          Usag
          <span>
            {dot && getLastXLetters(location.pathname, 6) === 'usage/' ? <span className="text-red-600 bg-black">e</span>: 'e'}
          </span>
        </div>
      </Link>
      
      {/* <Link to={`/user/${params.id}/settings/`}>
        <div className='p-1 rounded-md hover:text-green-600'>
          Settings
          <span className="text-red-600 ml-2 font-bold mt-auto">
            {dot && getLastXLetters(location.pathname, 9) === 'settings/' ? <span className="h-2 w-2  bg-red-600 rounded-full inline-block"></span>: ''}
          </span>
        </div>
      </Link>       */}
    </div>
  )
}

export default SideBar
