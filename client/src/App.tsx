import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
// import Dashboard from './components/Dashboard';
import Home from './components/Home';
// import NewApp from './components/NewApp';
import CdnAppOverview from './components/cdnAppOverview';
import CdnAppFiles from './components/cdnAppFiles';
import CdnAppSettings from './components/cdnAppSettings';
import NotFound from './components/ErrorFile';
import About from './components/about';

function App() {
  const router = createBrowserRouter([ 
    {     
      path: "/",
      element: <Home />,
      children: [
        // {
        //   path: "/dashboard",
        //   element: <Dashboard />
        // },
        // {
        //   path: "/dashboard/new-app",
        //   element: <NewApp />
        // },

	{
          path: "/about",
          element: <About />
        }, 

        {
          path: "/user/:id/usage",
          element: <CdnAppOverview />
        },
        {
          path: "/user/:id/files",
          element: <CdnAppFiles />
        },
        {
          path: "/user/:id/settings",
          element: <CdnAppSettings />
        }
      ],
    },

    {
      path: "*",
      element: <NotFound />
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
