import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/client/home.tsx";
import LoginPage from "./pages/client/auth/login.tsx";
import RegisterPage from "./pages/client/auth/register.tsx";
import {App, ConfigProvider} from "antd";
import {AppProvider} from "./components/context/app.context.tsx";
import ProtectedRoute from "./components/auth/auth.tsx";
import ManageTestingPage from "./pages/client/load-testing/manage.testing.tsx";
import AdminLayout from './components/layout/admin.layout.tsx';
import AdminDashboard from './pages/admin/admin.dashboard.tsx';
import CreateTestPlan from "./components/client/load-testing/create-test-plan/create.test.plan.tsx";
import enUS from 'antd/locale/en_US';
import TestResultPage from "./pages/client/load-testing/test.result.page.tsx";
import TestPlanDetail from "./components/client/load-testing/test-plan/test.plan.detail.tsx";
import TestRunHistory from "./components/client/load-testing/test-plan/test-run-history/test.run.history.tsx";
import TestRunComparisonPage from "./pages/client/load-testing/test.run.comparision.tsx";
import EditTestPlanPage from "./pages/client/load-testing/edit.test.plan.page.tsx";

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
                    path: "/plan",
                    element: (
                        <ProtectedRoute>
                            <ManageTestingPage/>
                        </ProtectedRoute>
                    ),
                    children: [
                        {
                            path: "/plan/create",
                            element: (
                                <ProtectedRoute>
                                    <CreateTestPlan/>
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: '/plan/:id',
                            element: (
                                <ProtectedRoute>
                                    <TestPlanDetail />
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: '/plan/runs/:id',
                            element: (
                                <ProtectedRoute>
                                    <TestRunHistory />
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: '/plan/test-run/:id',
                            element: (
                                <ProtectedRoute>
                                    <TestResultPage/>
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: '/plan/compare/:planId/:runId1/:runId2',
                            element: (
                                <ProtectedRoute>
                                    <TestRunComparisonPage/>
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: '/plan/edit/:id',
                            element: (
                                <ProtectedRoute>
                                    <EditTestPlanPage/>
                                </ProtectedRoute>
                            )
                        }
                    ]
                }
            ]
        },
        {
            path: "/admin",
            element: <AdminLayout/>,
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute>
                            <AdminDashboard/>
                        </ProtectedRoute>
                    )
                }
            ]
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
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App>
          <AppProvider>
              <ConfigProvider locale={enUS}>
                  <RouterProvider router={router} />
              </ConfigProvider>
          </AppProvider>
      </App>
  </StrictMode>,
)
