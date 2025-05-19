import {useCurrentApp} from "../context/app.context.tsx";
import {Link, useNavigate} from "react-router-dom";
import {logoutAPI} from "../../services/api.ts";
import {App, Menu, type MenuProps} from "antd";
import {
    AliwangwangOutlined,
    ExclamationOutlined,
    HomeOutlined,
    LoginOutlined,
    LineChartOutlined,
    HistoryOutlined,
    PlayCircleOutlined,
    FileTextOutlined,
    DashboardOutlined, PlusCircleFilled
} from "@ant-design/icons";
import {useState} from "react";

// Define proper types for menu items
interface IMenuItem {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: IMenuItem[];
  disabled?: boolean;
};
const AppHeader = () => {
    const {message, notification} = App.useApp();
    const {user, setUser, setIsAuthenticated} = useCurrentApp();
    const navigate = useNavigate();
    const [current, setCurrent] = useState<string>("");
    
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };
    
    const handleLogout = async () => {
        try {
            const res = await logoutAPI();
            if (res.statusCode === 200) {
                localStorage.removeItem("access_token");
                setUser(null);
                setIsAuthenticated(false);
                message.success("Logout successfully");
                navigate("/");
            } else {
                notification.error({
                    message: "Log out failed!",
                    description: res.message || "Unknown error",
                });
            }
        } catch (err: any) {
            notification.error({
                message: "Log out failed!",
                description: err?.response?.data?.message || "Unknown error",
            });
        }
    };
    
    const items: IMenuItem[] = [
        {
            label: <Link to={"/"}>Home</Link>,
            key: "home",
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={"/testing"}>Testing</Link>,
            key: "testing",
            icon: <ExclamationOutlined />,
            children: [
                {
                    label: <Link to={"/testing/create"}>Create Test</Link>,
                    key: "create-test",
                    icon: <PlusCircleFilled />
                },
                {
                    label: <Link to={"/testing/run"}>Run Test</Link>,
                    key: "run-test",
                    icon: <PlayCircleOutlined />
                },
                {
                    label: <Link to={"/testing/history"}>Test History</Link>,
                    key: "test-history",
                    icon: <HistoryOutlined />
                },
                {
                    label: <Link to={"/testing/results"}>Test Results</Link>,
                    key: "test-results",
                    icon: <FileTextOutlined />
                },
                {
                    label: <Link to={"/testing/metrics"}>Performance Metrics</Link>,
                    key: "test-metrics",
                    icon: <LineChartOutlined />
                },
                {
                    label: <Link to={"/testing/dashboard"}>Dashboard</Link>,
                    key: "test-dashboard",
                    icon: <DashboardOutlined />
                }
            ]
        },
        ...(!user?.id ? [
            {
                label: <Link to={"/login"}>Login</Link>,
                key: "login",
                icon: <LoginOutlined />,
            },
        ] : []),
        ...(user?.id ? [
            {
                label: `Welcome ${user?.fullName}`,
                key: "setting",
                icon: <AliwangwangOutlined />,
                children: [
                    {
                        label: <span onClick={() => handleLogout()}>Logout</span>,
                        key: "logout",
                    },
                ],
            },
        ] : [])
    ] as IMenuItem[];
    
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Admin Dashboard</Link>,
            key: 'admin',
        });
    }
    
    return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    );
};

export default AppHeader;