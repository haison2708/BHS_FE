import { Fragment } from "react";
import { Redirect } from "react-router";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/user/userSlice";

interface IProtectedProps {
}

const Protected: React.FC<IProtectedProps > = ({ children }) => {
    const user = useAppSelector(selectUser)
    if (!user.identity)
    return <Redirect to={'/login'}/>
    return <Fragment>{children}</Fragment>
};

export default Protected;
