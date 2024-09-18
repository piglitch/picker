import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
import NewApp from './components/NewApp';

function App() {
  const router = createBrowserRouter([ 
    {     
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />
        },
        {
          path: "/dashboard/new-app",
          element: <NewApp />
        }
      ]
    }
  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
