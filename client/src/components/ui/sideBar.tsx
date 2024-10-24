import { Link, useParams } from "react-router-dom";


const SideBar = () => {
  const params = useParams();

  return (
    <div className='sidebar flex flex-col py-4 gap-2 w-1/6 mt-8'> 
      <Link to={`/dashboard/app/${params.id}/overview/`}>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md'>
          Dashboard  
        </div>
      </Link>
      <Link to={`/dashboard/app/${params.id}/files/`}>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md'>
          Files  
        </div>  
      </Link>
      <Link to={`/dashboard/app/${params.id}/settings/`}>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md'>
          Settings
        </div>
      </Link>      
    </div>
  )
}

export default SideBar