import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../redux/slices/counterSlice";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom";
import { dummyData } from '../../constants/dummy';
import { v4 as uuidv4 } from 'uuid';

function Dashboard() {
  const [status, setStatus] = useState();
  let appDetails = {};
  //const count = useSelector((state: RootState) => state.counter.value);
  //const dispatch = useDispatch();
  // const fetchReq = async() => {  
  //   const res = await fetch("http://localhost:3000/api/images", { mode: 'cors' });
  //   const data = await res.json();
  //   setStatus(data.status)
  //   console.log(data.status ? data.status : ''); 
  // }
  // fetchReq();
  // useEffect(() => {
  //   appDetails = {
  //     name: dummyData.userApps[0].
  //   }
  // }, [])
  const handleStorageUnits = (used: string, limit: string) => {
    console.log('Before: ', used, limit);
    const USED = used.slice(used.length-2, used.length) === 'GB' ? Number(used.split('GB')[0])*1024 : Number(used.split('MB')[0])
    const LIMIT = limit.slice(limit.length-2, limit.length) === 'GB' ? Number(limit.split('GB')[0])*1024 : Number(limit.split('MB')[0])
    console.log(USED, LIMIT);
    return `${(USED/LIMIT).toFixed(2)}%`;
  }
  return (
    <div className="content-format mt-6">
      <div className="flex justify-between gap-x-10 cursor-pointer">
        <div>
          <h1>My apps</h1>
          {dummyData.userApps.map(
            app => (    
            <Card key={uuidv4()} className="mt-6 w-96 h-60 bg-yellow-50 border-none">
              <CardHeader>
                <CardTitle>{app.appName}</CardTitle>
                <div className="flex justify-between bg-slate-300 p-2 text-black rounded-md">
                  <CardDescription>App Url: {app.appUrl}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p><strong className="text-xl">{app.storageUsed}</strong> / {app.storageLimit}
                  &nbsp;<span className="text-sm">({handleStorageUnits(app.storageUsed, app.storageLimit)})</span>
                </p>
              </CardContent>
              <CardFooter>
                <p className="bg-green-700 bg-opacity-50 rounded-md p-1">{app.plan}</p>
              </CardFooter>
            </Card>
            )
          )}
        </div>
        <Link to="/dashboard/new-app">
          <div title="Create a new app" className="bg-violet-500 bg-opacity-50 h-max p-2 rounded-md"><AddIcon className="cursor-pointer"/> Create a new app</div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;