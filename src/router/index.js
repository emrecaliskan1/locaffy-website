import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import JoinUs from '../pages/JoinUs';
import BusinessApplication from '../pages/BusinessApplication';
import Login from '../pages/Login';
import Register from '../pages/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'joinus',
        element: <JoinUs />
      },
      {
        path: 'business-application',
        element: <BusinessApplication />
      },
      {
      path: 'login',
      element: <Login />
      },
      {
      path: 'register',
      element: <Register />
    }]
  }
]);