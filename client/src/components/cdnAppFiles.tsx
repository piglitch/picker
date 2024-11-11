import { useEffect, useRef, useState } from 'react'
import SideBar from './ui/sideBar';
import { useClerk } from '@clerk/clerk-react';
import { deleteFile, fetchFileSizesS3, fetchFilesS3, uploadFile } from '../../functions/fetchData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MoreVertIcon from '@mui/icons-material/MoreVert';
// const hostName = import.meta.env.VITE_REACT_APP_API_URL!



const CdnAppFiles = () => {
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [canUpload, setCanUpload] = useState(true);
  const { session, user } = useClerk();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = async() => {  
    // const token = await clerk.session?.getToken();
    const data = await fetchFilesS3(user?.id)
    console.log(data);
    setFileList(data)
    const appSizeInBytes =  await fetchFileSizesS3(user?.id)
    const appSizeInMB = (appSizeInBytes: number) => appSizeInBytes / 1024 / 1024
    setCanUpload(appSizeInMB(appSizeInBytes) < 500)
    console.log(appSizeInMB(appSizeInBytes));
  }

  useEffect(() => {
    fetcher();
  }, [fileList.length]);

  const handleFileDeletion = async(userId: string, fileKey: string) => {
    await deleteFile(userId, fileKey)
    await fetcher()
  }

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
      const response = await uploadFile(user.id, formData)
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
    await fetcher();
  }

  return (
<div className='content-format h-96 md:h-[720px] mt-6 flex border rounded-lg bg-gray-100 shadow-md text-gray-800'>
  <SideBar />
  <div className='flex-1 p-6 space-y-6'>
    <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
      <input 
        type="file" 
        onChange={handleFileChange} 
        ref={fileInputRef} 
        name="fileinput" 
        accept='image/*'
        className='border border-gray-300 rounded-md p-2 text-sm bg-white'
      />
      <button 
        type="button" 
        className='px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50'
        onClick={handleUpload}
        disabled={!canUpload}
      >
        Upload
      </button>  
    </div>
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-700'>My Files</h3>
      <div className='space-y-3'>
        {fileList?.map((file, index) => (
          <div className='flex items-center justify-between gap-3 border-b pb-2' key={index}>
          <img width={80} src={`https://d3p8pk1gmty4gx.cloudfront.net/${file.key}`} alt="" />
          <div className='flex-1 text-gray-600 font-medium'>{file.title}</div>
            <DropdownMenu>
              <DropdownMenuTrigger className='p-2 rounded-full hover:bg-gray-200'>
                <MoreVertIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-white border rounded-md shadow-lg'>
                <DropdownMenuItem 
                  className='px-4 py-2 text-red-600'
                  onClick={() => handleFileDeletion(user.id, file.key)}
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className='px-4 py-2'
                  onClick={() => navigator.clipboard.writeText(`https://d3p8pk1gmty4gx.cloudfront.net/${file.key}`)}
                >
                  Copy URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  )
}

export default CdnAppFiles

// : <div className="content-format animate-pulse">
//           <div className="flex space-x-4 items-center">
//             {/* File input skeleton */}
//             <div className="h-8 w-32 bg-slate-300 rounded"></div>
            
//             {/* Upload button skeleton */}
//             <div className="h-8 w-20 bg-red-300 rounded-md"></div>
//           </div>

//           <div className="mt-6">
//             <div className="h-6 bg-slate-300 w-24 rounded mb-4"></div> {/* 'My files' title skeleton */}

//             {/* File list skeleton */}
//             {[...Array(3)].map((_, index) => (
//               <div className="flex space-x-4 mb-4" key={index}>
//                 {/* Image thumbnail skeleton */}
//                 <div className="w-44 h-24 bg-slate-300 rounded"></div>
                
//                 {/* URL placeholder skeleton */}
//                 <div className="bg-slate-300 h-6 w-64 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       }
