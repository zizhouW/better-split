import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Dashboard from './components/dashboard/Dashboard';
import { Login } from './components/login/Login';
import theme from './theme';

const router = createHashRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
);
