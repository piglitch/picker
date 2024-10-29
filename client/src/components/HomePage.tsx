import { GridBackgroundDemo } from './ui/grid';
import { Vortex } from './ui/vortex';

const HomePage = () => {
  return (
    <div className='my-auto mx-auto rounded-md h-max overflow-hidden'>
      <Vortex
        backgroundColor="#000000"
        rangeY={100}
        className="px-2 pb-10 md:px-10 my-4 w-screen h-full"
        particleCount={300}
        baseHue={200}
      >
        <div className='content-format'>
          <h1 className='text-6xl max-w-32 flex flex-col pt-44'><span className='font-extrabold text-green-600'>Fast</span><span className='font-extrabold text-blue-600'>Reliable</span> 
          <span className='font-extrabold text-pink-700'>Secure</span>
          </h1>
          <p className='flex text-wrap max-w-lg text-left pt-4 text-lg font-extralight'>
            Picker offers a lightning-fast solution to deliver your images seamlessly across the globe. With our optimized network and advanced caching technology, your images will load in a flash, no matter where your visitors are located.
          </p>
        </div> 
      </Vortex>
      <GridBackgroundDemo />
      <footer className='text-slate-100  font-thin text-sm'>
        &#169; &nbsp;	
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          <u>piglitch</u> 
        </a>
        , 2024
      </footer>
    </div>
  )
}

export default HomePage;