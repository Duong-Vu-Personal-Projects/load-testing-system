import {useContext, useState} from "react";
import {AppContext} from "../context/app.context.tsx";
import {useNavigate} from "react-router-dom";
import {logoutAPI} from "../../services/api.ts";
import {App} from "antd";
const AppHeader = () => {
    const {message, notification} = App.useApp();
    const [current, setCurrent] = useState("");
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const onClick = (e: any) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        try {
            const res = await logoutAPI();
            if (res.data) {
                localStorage.removeItem("access_token");
                setUser({ email: "", name: "", role: "", id: "" });
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
    return (
        <>

        </>
    )
};
export default AppHeader;