// React
import { useEffect, useState } from "react";

// Optional url params
import { useParams } from "react-router-dom";

// UI
import Layout from "../components/Layout";
import Loader from "../components/Loader";
// import GameHistory from "../components/GameHistory";

// Profile components
import ProfileDisplay from "../components/Profile/ProfileDisplay";
import ProfileStats from "../components/Profile/ProfileStats";
import ProfileActions from "../components/Profile/ProfileActions";

// Authentication
import { useAuth } from "../contexts/AuthContext";

// Types
import { ProfileType } from "../types/profile";
import { RequestErrorType } from "../types/request";

// Styling constants
import { largeRadius, mainColor } from "../styles/StylingConstants";

// Debug data
import { useFakeData } from "../contexts/FakeDataContext";

// API
import getProfileByUserName from "../proxies/user/getProfileByUsername";

// Debugging
import { useModal } from "../contexts/ModalContext";
import { getItem, setItem } from "../modules/Store";
import StoreId from "../config/StoreId";
import { getValueFromUrl } from "../utils/getValueFromUrl";
import Logger from "../utils/Logger";
import CreateAccount from "./CreateAccount";

const ProfilePage = () => {
    // Profile to be displayed
    const [selectedProfile, setSelectedProfile] = useState<ProfileType>(null!);
    const [isUserProfile, setIsUserProfile] = useState<boolean>(false);

    const [loadProfile, setLoadProfile] = useState<boolean>(false);

    // Temp debug data
    const { matchHistory } = useFakeData();

    // Local profile
    const { user, signIn } = useAuth();

    const { setModalOpen, setModalElement } = useModal();

    /**
     * The `userName` in the url '/profile/:userName' if not
     * specified will default to undefined
     */
    const { profileName } = useParams();

    useEffect(() => {
        const runUserRetrieval = async () => {
            const inLoginProcess = getItem<boolean>(StoreId.loginProcess);

            if (inLoginProcess) {
                const href = window.location.href;
                const token = getValueFromUrl(href, "code"); // TODO: put "code" in a config file

                try {
                    const shouldCreateUser = await signIn(token);

                    if (shouldCreateUser) {
                        setModalElement(
                            <CreateAccount setModalOpen={setModalOpen} />
                        );
                        setModalOpen(true);
                    }
                } catch (err) {
                    Logger("AUTH", "Succesful login", "Sign in issue", err);
                }
            }

            /**
             * If there is no profile name in the url we set the
             * user as the current profile. Meaning we are on
             * the user's own profile page
             */
            if (profileName === undefined) {
                setSelectedProfile(user);
                setIsUserProfile(true);
                return;
            }

            try {
                const returnedProfileByUsername = await getProfileByUserName(
                    profileName
                );
                setSelectedProfile(returnedProfileByUsername);
            } catch (err) {
                console.error(err);
            }
        };
        runUserRetrieval();
    }, [profileName, user]);

    return (
        <Layout>
            {selectedProfile && user ? (
                <div
                    style={{
                        borderRadius: largeRadius,
                        backgroundColor: mainColor
                    }}
                >
                    <ProfileDisplay user={selectedProfile} />
                    <ProfileStats
                        player={selectedProfile}
                        matches={matchHistory}
                    />
                    {!isUserProfile && (
                        <ProfileActions profile={selectedProfile} />
                    )}
                    {/* <GameHistory
                        player={selectedProfile}
                        matches={matchHistory}
                    /> */}
                </div>
            ) : (
                <Loader />
            )}
        </Layout>
    );
};

export default ProfilePage;
function signIn(token: any) {
    throw new Error("Function not implemented.");
}
