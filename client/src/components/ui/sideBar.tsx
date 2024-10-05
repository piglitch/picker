import { useParams } from "react-router-dom";

const SideBar = () => {
  const params = useParams();

  return (
    <div className='sidebar flex flex-col py-4 gap-2 w-1/6 mt-8'>
      <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md' onClick={() => window.location.href = `/dashboard/app/${params.id}/overview/`}>Overview</div>
      <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md' onClick={() => window.location.href = `/dashboard/app/${params.id}/files`}>Files</div>
      <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md' onClick={() => window.location.href = `/dashboard/app/${params.id}/settings`}>Settings</div>
    </div>
  )
}

export default SideBar