import CloseIcon from '@mui/icons-material/Close';

const HomePage = () => {
  return (
    <div className="h-max rounded-md">
      <div className="content-format">
        {/* <h1 className="text-3xl border rounded-2xl p-2 bg-black text-red-600">
          Server is down at the moment. Will be fixed soon!
        </h1> */}
        <dialog open>
          <div className="p-1 border border-l-red-600 border-x-4 
          border-t-0 border-b-0 border-r-0 flex">
            <p>This application is hosted on Render's free tier to keep costs down. This means there might be a short delay (up to a minute) when accessing it after a period of inactivity. Thanks for your understanding!</p>
            <form className="w-max ml-auto" method="dialog">
              <button className='bg-red-500'><CloseIcon /></button>
            </form>
          </div>
        </dialog>
        <h1 className="text-6xl max-w-32 flex flex-col pt-44">
          <span className="font-extrabold">Fast</span>
          <span className="font-extrabold">Reliable</span> 
          <span className="font-extrabold">Secure</span>
        </h1>
        <p className="flex text-wrap max-w-lg text-left pt-4 text-lg">
          Picker offers a lightning-fast solution to deliver your images seamlessly across the globe. With our optimized network and advanced caching technology, your images will load in a flash, no matter where your visitors are located.
        </p>
      </div> 
      <footer className="content-format text-xs">
        &#169;	
        <a href="https://github.com/piglitch" target="_blank" rel="noopener noreferrer">
          <u>piglitch</u> 
        </a>, 2024
      </footer>
    </div>
  )
}

export default HomePage;
