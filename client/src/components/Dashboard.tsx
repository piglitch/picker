import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../redux/slices/counterSlice";
import { RootState } from "../redux/store";
import { useState } from "react";

function Dashboard() {
  const [status, setStatus] = useState();
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const fetchReq = async() => {  
    const res = await fetch("http://localhost:3000/", { mode: 'cors' });
    const data = await res.json();
    setStatus(data.status)
    console.log(data.status ? data.status : ''); 
  }
  fetchReq();

  return (
    <div className="content-format mt-64">
      <p>Status: {status}</p>
      Counter: {count}
      <p/>
      <button className="bg-green-500 p-2 rounded-lg" onClick={() => dispatch(increment())}>+1</button>
      <button className="bg-red-500 p-2 rounded-lg" onClick={() => dispatch(decrement())}>-1</button>
    </div>
  )
}

export default Dashboard;