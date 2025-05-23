import TablePlan from "../../../components/client/load-testing/test-plan/table.plan.tsx";
import {Outlet, useLocation} from "react-router-dom";

const ManageTestingPage = () => {
    const location = useLocation();
    const isRootPath = location.pathname === "/plan";

    return (
        <div className="testing-container">
            {/* Show table only on the main testing page */}
            {isRootPath ? (
                <TablePlan />
            ) : (
                <Outlet />
            )}
        </div>
    );
};
export default ManageTestingPage;