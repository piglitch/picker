export const fetchReq = async() => {  
  const res = await fetch("http://localhost:3000/api/user-apps/", { mode: 'cors' });
  const data = await res.json();
  return data;
}
