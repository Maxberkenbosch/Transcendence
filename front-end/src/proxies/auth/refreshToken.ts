// Routes
import ApiRoutes from "../../config/ApiRoutes";

// Types
import { AuthTokenType } from "../../types/request";

// Api
import { API } from "../instances/apiInstance";

/**
 * Checks auth token validity and upates if required, otherwise reroutes the user to the home page to re-login
 */
const refreshAuthToken = async (token: AuthTokenType): Promise<AuthTokenType> => {
    try {
        const { data } = await API.get<AuthTokenType>(
            ApiRoutes.refreshAuthToken(),
            {
                headers: {
                    Authorization: `Bearer ${token.refreshToken}`
                }
            }
        );
        return Promise.resolve(data);
    } catch (err: any) {
        return Promise.reject(err);
    }
};

export { refreshAuthToken };
