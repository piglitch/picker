import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
clerk.load()
export const fetchReq = async() => {  
  const res = await fetch("http://localhost:3000/verify-user", 
    { mode: 'cors', 
      headers: {
        Authorization: `Bearer ${await clerk.session?.getToken()}`
    } 
  }
  );
  const data = await res.json();
  console.log(data);
  return data;
}
