import { AppDetails } from 'constants/types';
import { fetchReq } from '../../functions/fetchData';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import SideBar from './ui/sideBar';
import { useClerk } from '@clerk/clerk-react';

const CdnAppSettings = () => {
  const [, setAppDetails] = useState<AppDetails | null>(null);
  const {id} = useParams();
  const { user } = useClerk();
  console.log(id);
  const fetcher = async() => {  
    const data = await fetchReq(user?.id)
    setAppDetails(data);
  }
  useEffect(() => {
    fetcher();
  }, []);

  //const currApp = appDetails?.userApps.filter(app => app.appId === id)[0]
  return (
    <div className='content-format h-96 md:h-[720px] mt-6 flex border rounded-md bg-gray-200 text-black'>
      <SideBar />
      <div className='content-format'>Settings</div> 
    </div>
  )
}

export default CdnAppSettings