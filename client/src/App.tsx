import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom';
import './App.css'
// import Dashboard from './components/Dashboard';
import Home from './components/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
// import NewApp from './components/NewApp';
import CdnAppOverview from './components/cdnAppOverview';
import CdnAppFiles from './components/cdnAppFiles';
import CdnAppSettings from './components/cdnAppSettings';
import NotFound from './components/ErrorFile';

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
          path: "/user/:id/overview",
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
