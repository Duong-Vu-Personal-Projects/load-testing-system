import {useContext, useState} from "react";
import {AppProvider, useCurrentApp} from "../context/app.context.tsx";
import {useNavigate} from "react-router-dom";
import {logoutAPI} from "../../services/api.ts";
import {App} from "antd";
const AppHeader = () => {
    const {message, notification} = App.useApp();
    const {user} = useCurrentApp();
    const navigate = useNavigate();

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
            <div>
                {JSON.stringify(user)}
            </div>
        </>
    )
};
export default AppHeader;