import React from 'react'

const CdnApp = () => {
  return (
    <div className='content-format mt-6 flex'>
      <div className='sidebar w-1/5 border'>
        <div>Overview</div>
        <div>Files</div>
        <div>Settings</div>
      </div>
      <div className='w-4/5 border'>
        main section 
      </div>
    </div>
  )
}

export default CdnApp