import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../redux/slices/counterSlice";
import { RootState } from "../redux/store";
import { useState } from "react";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


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
          <Card className="mt-6 w-96 h-60">
            <CardHeader>
              <CardTitle>Example app</CardTitle>
              <CardDescription>url goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong className="text-xl">0.0%</strong> / 2 GB</p>
            </CardContent>
            <CardFooter>
              <p className="bg-green-700 bg-opacity-50 rounded-md p-2">Free</p>
            </CardFooter>
          </Card>
        </div>
        <div title="Create a new app"><AddBoxIcon fontSize="large" className="cursor-pointer hover:scale-110"/></div>
      </div>
    </div>
  )
}

export default Dashboard;