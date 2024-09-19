import React from 'react'

const CdnApp = () => {
  return (
    <div className='content-format h-96 md:h-[720px] mt-6 flex border rounded-md bg-gray-200 text-black'>
      <div className='sidebar flex flex-col gap-2 w-1/6'>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md'>Overview</div>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md'>Files</div>
        <div className='hover:bg-slate-300 p-1 w-48 rounded-md'>Settings</div>
      </div>
      <div className='w-5/6 border-l border-l-blue-400 px-6'>
        main section 
      </div>
    </div>
  )
}

export default CdnApp