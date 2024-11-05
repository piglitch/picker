import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!
const hostName = import.meta.env.VITE_REACT_APP_API_URL!
console.log(hostName);
const clerk = new Clerk(clerkPubKey)
clerk.load()

export const fetchReq = async(userId: string | undefined) => {  
  const token = await clerk.session?.getToken();
  const res = await fetch(`http://${hostName}/${userId}/verify-user`, 
    { mode: 'cors', 
      headers: {
        Authorization: `Bearer ${token}`,
      } 
    }
  );
  const data = await res.json();
  console.log('fetchData: ', data);
  return data;
}
