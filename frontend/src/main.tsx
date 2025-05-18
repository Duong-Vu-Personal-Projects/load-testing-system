import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/client/home.tsx";
import LoginPage from "./pages/client/auth/login.tsx";
import RegisterPage from "./pages/client/auth/register.tsx";
import {App} from "antd";
import {AppProvider} from "./components/context/app.context.tsx";
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    index: true,
                    element: <HomePage/>
                },
                {
                    path: "/login",
                    element: <LoginPage/>
                },
                {
                    path: "/register",
                    element: <RegisterPage/>
                }
            ]
        }
    ]
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App>
          <AppProvider>
              <RouterProvider router={router}/>
          </AppProvider>
      </App>
  </StrictMode>,
)
