import { useAuth0 } from "@auth0/auth0-react";

const useUserObject = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return { user: null, loading: true };
    }

    if (!isAuthenticated) {
        return { user: null, loading: false };
    }

    return { user, loading: false };
};

export default useUserObject;