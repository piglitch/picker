import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hostName = import.meta.env.VITE_REACT_APP_API_URL
console.log(hostName);
const clerk = new Clerk(clerkPubKey)
clerk.load()

async function test(){
  const token = await clerk.session?.getToken();

  const response = await fetch(`ttp://localhost:3000/protected`, 
    { mode: 'cors', 
      headers: {
        Authorization: `Bearer ${token}`,
      } 
    }
  );
  const data = await response.json()
  console.log(data); 
}

test()