// import { fetchReq } from '../../functions/fetchData';
import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
import SideBar from './ui/sideBar';
import { useClerk } from '@clerk/clerk-react';
// import Stack from '@mui/material/Stack';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { fetchFileSizesS3, fetchReq } from '../../functions/fetchData';
// const hostName = import.meta.env.VITE_REACT_APP_API_URL!

const CdnAppOverView = () => {
  // const [appDetails, setAppDetails] = useState<AppDetails | null>(null);
  const [appsize, setAppSize] = useState(0);
  // const {id} = useParams();
  //const appId = useSelector((state) => state.setAppId.value);
  //const dispatch = useDispatch();
  const { user } = useClerk()

  const fetcher = async() => {  
    await fetchReq(user?.id.toString())
    // setAppDetails(user.id);
    const appSizeInBytes =  await fetchFileSizesS3(user?.id.toString())
    console.log(appSizeInBytes);
    const appSizeInMB = (appSizeInBytes: number) => appSizeInBytes / 1024 / 1024
    setAppSize(parseFloat(appSizeInMB(appSizeInBytes).toFixed(2)));
  }
  useEffect(() => {
    fetcher();
  }, []);
 
  return (
    <div className='content-format h-96 md:h-[720px] mt-6 lg:flex'>
      <SideBar />
      {
        appsize >= 0 ?
        <div className='lg:w-5/6 px-6'>
          <div className='mt-4 rounded-md h-[500px] w-lg'>
            <Gauge 
              className='mx-auto' 
                height={250} 
                sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: '#ADFF2F',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: theme.palette.text.disabled,
                },
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 0,
                },
                
              })} 
              value={appsize*100/500} valueMin={0} valueMax={100} 
            />
            <div className='flex justify-center'>
              {appsize}MB / 1024MB ({(appsize*100/1024).toFixed(2)} %)
            </div>
          </div>
        </div>        
        : <div className="w-5/6 px-6 animate-pulse">
        <div className="h-6 bg-slate-400 rounded w-32 mb-4"></div>
        <div className="bg-slate-100 mt-4 rounded-md shadow-md h-[500px] w-full">
          <div className="h-full w-full bg-slate-400 rounded-md"></div>
        </div>
        </div>
      }
    </div>
  )
}

export default CdnAppOverView