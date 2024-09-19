import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ComboboxDemo } from './ui/Combobox'

const NewApp = () => {
  return (
    <div className='content-format flex justify-center mt-20'>
      <Card className="mt-6 w-96 h-max">
        <CardHeader>
          <CardTitle>Create a new app</CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="">Name of the app</label><input type="text" className='bg-white outline-none border rounded-md border-slate-400 p-1 w-full' />            
        </CardContent>
        <CardContent>
          <label htmlFor="">Url of the app</label><input type="text" className='bg-white outline-none border rounded-md border-slate-400 p-1 w-full' />            
        </CardContent>
        <CardContent>
          <label htmlFor="">Hosting region</label>
          <p/>
          <ComboboxDemo />         
        </CardContent>
        <CardFooter>
          <button type="button" className="bg-green-500 p-1 rounded-md text-white">Submit</button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewApp