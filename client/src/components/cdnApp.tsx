import { AppDetails } from 'constants/types';
import { fetchReq } from '../../functions/fetchData';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const CdnApp = () => {
  const [appDetails, setAppDetails] = useState<AppDetails | null>(null);
  const {id} = useParams();
  console.log(id);
  const fetcher = async() => {  
    const data = await fetchReq()
    setAppDetails(data);
  }
  useEffect(() => {
    fetcher();
  }, []);

  const currApp = appDetails?.userApps.filter(app => app.appId === id)[0]
  return (
    <div className='content-format h-96 md:h-[720px] mt-6 flex border rounded-md bg-gray-200 text-black'>
      <div className='sidebar flex flex-col py-4 gap-2 w-1/6'>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md'>Overview</div>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md'>Files</div>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md shadow-md'>Settings</div>
      </div>
      <div className='w-5/6 px-6'>
       <h3>{currApp?.appName}</h3>  
       <div className='bg-slate-100 mt-4 rounded-md shadow-md h-[500px]'>Usage</div>
      </div>
    </div>
  )
}

export default CdnApp