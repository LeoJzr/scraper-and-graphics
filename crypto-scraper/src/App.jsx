import FetchData from "./components/FetchData";

export default function App() {

  return (
      <div className='text-neutral-800 font-semibold m-0 flex flex-col min-h-screen'>
        <div className="bg-cyan-900/90 py-6 justify-start text-neutral-100">
          <h1 className="mx-10 text-xl">Crypto Scraping</h1> 
        </div>
        <div className="flex-grow">
          <FetchData />
        </div>
        <div className="flex bg-neutral-900 py-4 justify-center text-neutral-200">
          https://github.com/LeoJzr
        </div>
      </div>
  )
}
