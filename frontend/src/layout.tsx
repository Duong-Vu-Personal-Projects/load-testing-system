import {Outlet} from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import AppHeader from "./components/layout/app.header";

function Layout() {
  return (
    <>
        <AppHeader />
        <Outlet/>
    </>
  )
}

export default Layout
