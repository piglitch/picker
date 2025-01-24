// import { AppDetails } from 'constants/types';
// import { fetchReq } from '../../functions/fetchData';
// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
import SideBar from './ui/sideBar';
// import { useClerk } from '@clerk/clerk-react';

const CdnAppSettings = () => {
  // const [, setAppDetails] = useState<AppDetails | null>(null);
  // const {id} = useParams();
  //const { user } = useClerk();
  // const fetcher = async() => {

  //   const data = await fetchReq(user?.id)
  //   setAppDetails(data);
  // }
  // useEffect(() => {
  //   fetcher();
  // }, []);

  //const currApp = appDetails?.userApps.filter(app => app.appId === id)[0]
  return (
    <div className='content-format flex h-96 md:h-[720px] mt-6'>
      <SideBar />
      <div className='content-format'>
        <label>Filename </label>
        <input type="text" className='rounded bg-transparent border border-slate-500' />  
        <div className='danger-zone'>
          <div className='mt-4'>danger zone</div>
          <button type="button" className='bg-red-600 rounded-md p-1 text-white'>Delete app</button>
        </div>
      </div> 
    </div>
  )
}

export default CdnAppSettings