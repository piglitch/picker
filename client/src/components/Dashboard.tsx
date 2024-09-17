import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../redux/slices/counterSlice";
import { RootState } from "../redux/store";

function Dashboard() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const fetchReq = async() => {  
    const res = await fetch("http://localhost:3000/", { mode: 'cors' });
    const data = await res.json();
    console.log(data); 
  }
  fetchReq();

  return (
    <div className="content-format mt-64">
      Counter: {count}
      <p/>
      <button className="bg-green-500 p-2 rounded-lg" onClick={() => dispatch(increment())}>+1</button>
      <button className="bg-red-500 p-2 rounded-lg" onClick={() => dispatch(decrement())}>-1</button>
    </div>
  )
}

export default Dashboard;