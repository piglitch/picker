// import { useDispatch, useSelector } from "react-redux";
// import { decrement, increment } from "../redux/slices/counterSlice";
// import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { v4 as uuidv4 } from 'uuid';
import { fetchReq } from '../../functions/fetchData';
import { AppDetails } from '../../constants/types';
import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

function Dashboard() {
  const [appDetails, setAppDetails] = useState<AppDetails | null>(null);
  const { session, user } = useClerk()
  
  const fetcher = async() => {  
    const data = await fetchReq(user?.id.toString())
    setAppDetails(data);
  }

  useEffect(() => {
    fetcher();
  }, []);

  if (!session || !user) {
    return null;
  }
  console.log(user);
  const handleStorageUnits = (used: string, limit: string) => {
    // console.log('Before: ', used, limit);
    const USED = used.slice(used.length-2, used.length) === 'GB' ? Number(used.split('GB')[0])*1024 : Number(used.split('MB')[0])
    const LIMIT = limit.slice(limit.length-2, limit.length) === 'GB' ? Number(limit.split('GB')[0])*1024 : Number(limit.split('MB')[0])
    // console.log(USED, LIMIT);
    return `${(USED/LIMIT).toFixed(2)}%`;
  }

  const handleRoute = (id: string) => {
    window.location.href = `/dashboard/user/${id}/overview`
  }

  return (
    <div className="content-format mt-6">
      <div className="flex justify-between gap-x-10">
        <div><h1 className="text-violet-500">Welcome, {user.username}</h1>
          <h1 className="pt-10">Your apps</h1>
          <div className="flex mt-10 gap-6">
          {appDetails?.userApps.map(
            app => (    
            <Card key={uuidv4()} className="mt-6 w-96 h-60 border-none bg-violet-700 cursor-pointer text-white" onClick={() => handleRoute(user.id)}>
              <CardHeader>
                <CardTitle>{app.appName}</CardTitle>
                <div onClick={(e) => e.stopPropagation()} className="flex justify-between bg-slate-300 p-2 text-black rounded-md cursor-text">
                  <CardDescription>{app.appUrl}</CardDescription>
                </div>
              </CardHeader>
              <CardContent onClick={(e) => e.stopPropagation()} className="cursor-text w-min">
                <p><strong className="text-xl text-yellow-400">{app.storageUsed}</strong> / {app.storageLimit}
                  &nbsp;<span className="text-sm">({handleStorageUnits(app.storageUsed, app.storageLimit)})</span>
                </p>
              </CardContent>
              <CardFooter onClick={(e) => e.stopPropagation()}>
                <p className="bg-green-700 bg-opacity-80 rounded-md py-1 w-12 text-center cursor-text">{app.plan}</p>
              </CardFooter>
            </Card>
            )
          )}
          </div>
        </div>
        <Link to="/dashboard/new-app">
          <div title="Create a new app" className="bg-pink-600 h-max p-2 rounded-md lg:block md:hidden">
            <AddIcon className="cursor-pointer"/> 
              Create a new app
          </div>
          <div title="Create a new app" className="bg-pink-600 h-max p-2 rounded-md lg:hidden">
            <AddIcon className="cursor-pointer"/> 
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;