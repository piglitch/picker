import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../redux/slices/counterSlice";
import { RootState } from "../redux/store";
import { useState } from "react";
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


function Dashboard() {
  const [status, setStatus] = useState();
  //const count = useSelector((state: RootState) => state.counter.value);
  //const dispatch = useDispatch();
  // const fetchReq = async() => {  
  //   const res = await fetch("http://localhost:3000/api/images", { mode: 'cors' });
  //   const data = await res.json();
  //   setStatus(data.status)
  //   console.log(data.status ? data.status : ''); 
  // }
  // fetchReq();

  return (
    <div className="content-format mt-6">
      <div className="flex justify-between gap-x-10 cursor-pointer">
        <div>
          <h1>My apps</h1>
          <Card className="mt-6 w-96 h-60 bg-yellow-50 border-none">
            <CardHeader>
              <CardTitle>Example app</CardTitle>
              <div className="flex justify-between bg-slate-300 p-2 rounded-md">
                <CardDescription><i>https://xyzabcd-12345.com</i></CardDescription>
                <ContentCopyIcon fontSize="small" />
              </div>
            </CardHeader>
            <CardContent>
              <p><strong className="text-xl">0.0%</strong> / 2 GB</p>
            </CardContent>
            <CardFooter>
              <p className="bg-green-700 bg-opacity-50 rounded-md p-2">Free</p>
            </CardFooter>
          </Card>
        </div>
        <Link to="/dashboard/new-app">
          <div title="Create a new app" className="bg-violet-500 bg-opacity-50 h-max p-2 rounded-md"><AddIcon className="cursor-pointer"/> Create a new app</div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;