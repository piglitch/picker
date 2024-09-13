import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import { Provider } from 'react-redux';
import store from './redux/store';

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
