import { AppDetails } from 'constants/types';
import { fetchReq } from '../../functions/fetchData';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import SideBar from './ui/sideBar';
// import { useDispatch, useSelector } from 'react-redux';

const CdnAppOverView = () => {
  const [appDetails, setAppDetails] = useState<AppDetails | null>(null);
  const {id} = useParams();
  //const appId = useSelector((state) => state.setAppId.value);
  //const dispatch = useDispatch();

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
      <SideBar />
      <div className='w-5/6 px-6'>
       <h3>{currApp?.appName}</h3>  
       <div className='bg-slate-100 mt-4 rounded-md shadow-md h-[500px]'>Usage</div>
      </div>
    </div>
  )
}

export default CdnAppOverView