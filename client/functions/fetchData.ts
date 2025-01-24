import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.CLERK_PUBLISHABLE_KEY!
const hostName = import.meta.env.REACT_APP_API_URL!
console.log(hostName);
const clerk = new Clerk(clerkPubKey)
clerk.load()
export const fetchReq = async(userId: string | undefined) => {  
  const token = await clerk.session?.getToken();
  const res = await fetch(`https://${hostName}/api/${userId}/verify-user`, 
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

export const uploadFile = async(userId: string | undefined, formData: BodyInit | null) => {  
  const token = await clerk.session?.getToken();
  const response = await fetch(`https://${hostName}/api/${userId}/s3-upload/`, 
    { 
      method: 'POST',
      body: formData,
      mode: 'cors', 
      headers: {
        Authorization: `Bearer ${token}`,
      } 
    }
  );
  return response;
}

export async function fetchFilesS3(userId: string | undefined) {
  try {
    const token = await clerk.session?.getToken();
    const response = await fetch(`https://${hostName}/api/${userId}/all-files/`,
      { mode: 'cors', 
        headers: {
          Authorization: `Bearer ${token}`,
        } 
      }
    );
    // if (!response.body?.stream) {
    //   console.log("none");
    //   return []
    // }
    // console.log('Response from s3: ', response.headers.get('Content-Length'));
    const data = await response.json()
    return data
  } catch (err) {
    console.error(err);
  }
}

export async function fetchFileSizesS3(userId: string | undefined) {
  try {
    const token = await clerk.session?.getToken();
    const response = await fetch(`https://${hostName}/api/${userId}/file-details`, {
      mode: 'cors', 
      headers: {
        Authorization: `Bearer ${token}`,
      } 
    });
    if (response === undefined) {
      return 0;
    }
    const data = await response.json()
    const appSizeInBytes = data.appSize;
    // console.log("fetched user id: ", userId);
    return appSizeInBytes;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteFile(userId: string | undefined, fileKey: string) {
  try {
    console.log(userId, fileKey);
    const token = await clerk.session?.getToken();
    const deleteFile = await fetch(`https://${hostName}/api/${userId}/delete-object/${fileKey}/`,
      { 
        method: "DELETE",
        mode: 'cors', 
        headers: {
          Authorization: `Bearer ${token}`,
        } 
      }
    );
    console.log('file deleted: ', deleteFile);
  } catch (err) {
    console.error(err);
  }
}

export async function test(){
  const token = await clerk.session?.getToken();

  const response = await fetch(`http://localhost:3000/api/protected`, 
    { mode: 'cors', 
      headers: {
        Authorization: `Bearer ${token}`,
      } 
    }
  );
  console.log(response, 'authenticated'); 
}