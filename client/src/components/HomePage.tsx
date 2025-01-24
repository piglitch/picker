const HomePage = () => {
  return (
    <div className="h-max rounded-md">
      <div className="content-format">
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
