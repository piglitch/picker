import { useEffect, useRef, useState } from 'react'
import SideBar from './ui/sideBar';
import { useClerk } from '@clerk/clerk-react';
import fetchFileSizesS3 from '../../functions/fetchFilesSize';

const CdnAppFiles = () => {
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [canUpload, setCanUpload] = useState(true);
  const { session, user } = useClerk();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const fetcher = async() => {  
    const data = await fetchFilesS3()
    setFileList(data)
    const appSizeInBytes =  await fetchFileSizesS3(user?.id)
    const appSizeInMB = (appSizeInBytes: number) => appSizeInBytes / 1024 / 1024
    setCanUpload(appSizeInMB(appSizeInBytes) < 500)
    console.log(appSizeInMB(appSizeInBytes));
  }

  useEffect(() => {
    fetcher();
    if (fileList.length<1) {
      console.log('Loading');
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Save the selected single file
    console.log(e.target.files);
  };

  if (!session || !user) {
    return null;
  }

  const handleUpload = async(e) => {
    e.preventDefault();
    if (!file) {
      console.log('no file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', file); 
    try {
      const response = await fetch(`http://13.60.182.170:3000/api/${user?.id}/s3-upload/`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('File uploaded', result);
    } catch (error) {
      console.log('Error uploading: ', error);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    console.log('uploaded');
    window.location.reload();
  }

  async function fetchFilesS3() {
    try {
      const response = await fetch(`http://13.60.182.170:3000/api/${user?.id}/all-files/`);
      const data = await response.json()
      console.log(data);
     return data
    } catch (err) {
      console.error(err);
    }
  }
  //const currApp = appDetails?.userApps.filter(app => app.appId === id)[0]
  return (
    <div className='content-format h-96 md:h-[720px] mt-6 flex border rounded-md bg-gray-200 text-black'>
      <SideBar />
      { 
        fileList ?
          <div className='content-format'>
            <div>
              <input type="file" onChange={handleFileChange} ref={fileInputRef} name="fileinput" accept='image/*' />
              <button type="button" className='p-1 w-max rounded-md text-white bg-red-600'
                onClick={handleUpload}
                disabled = { !canUpload }
              >
                Upload
              </button>  
            </div>
            <div className='mt-6'>
              <h3>My files</h3>
                {
                  fileList?.map((file, index) => 
                  <div className='flex gap-1 mb-2' key={index}>
                    <img width={80} src={`https://d3p8pk1gmty4gx.cloudfront.net/${file.key}`} />
                    <div className='bg-slate-400 h-max rounded p-1 italic text-xs'>Url: {`https://d3p8pk1gmty4gx.cloudfront.net/${file.key}`}</div>
                  </div>)
                }
            </div>
          </div>  : <div className="content-format animate-pulse">
          <div className="flex space-x-4 items-center">
            {/* File input skeleton */}
            <div className="h-8 w-32 bg-slate-300 rounded"></div>
            
            {/* Upload button skeleton */}
            <div className="h-8 w-20 bg-red-300 rounded-md"></div>
          </div>

          <div className="mt-6">
            <div className="h-6 bg-slate-300 w-24 rounded mb-4"></div> {/* 'My files' title skeleton */}

            {/* File list skeleton */}
            {[...Array(3)].map((_, index) => (
              <div className="flex space-x-4 mb-4" key={index}>
                {/* Image thumbnail skeleton */}
                <div className="w-44 h-24 bg-slate-300 rounded"></div>
                
                {/* URL placeholder skeleton */}
                <div className="bg-slate-300 h-6 w-64 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default CdnAppFiles