import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
clerk.load()

export const fetchReq = async(userId: string | undefined) => {  
  const token = await clerk.session?.getToken();
  const res = await fetch(`https://13.60.182.170/${userId}/verify-user`, 
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
