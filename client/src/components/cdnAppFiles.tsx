import { AppDetails } from 'constants/types';
import { fetchReq } from '../../functions/fetchData';
import { useEffect, useState } from 'react'
import SideBar from './ui/sideBar';
import { ClipboardSignature } from 'lucide-react';

const CdnAppFiles = () => {
  const [, setAppDetails] = useState<AppDetails | null>(null);
  const fetcher = async() => {  
    const data = await fetchReq()
    setAppDetails(data);
  }
  useEffect(() => {
    fetcher();
  }, []);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Save the selected single file
  };

  const handleUpload = async(e) => {
    console.log(file);
    e.preventDefault();
    if (!file) {
      console.log('no file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', file); 
    try {
      const response = await fetch('http://localhost:3000/api/s3-upload/', {
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
    console.log('uploaded');
  }

  //const currApp = appDetails?.userApps.filter(app => app.appId === id)[0]
  return (
    <div className='content-format h-96 md:h-[720px] mt-6 flex border rounded-md bg-gray-200 text-black'>
      <SideBar />
      <div className='content-format'>
        <input type="file" onChange={handleFileChange} name="fileinput" accept='image/*' />
        <button type="button" className='p-1 w-max rounded-md text-white bg-red-600'
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>  
    </div>
  )
}

export default CdnAppFiles