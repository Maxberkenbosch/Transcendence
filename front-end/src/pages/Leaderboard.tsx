// React
import { useEffect, useState } from "react";

// UI
import Heading from "../components/Heading";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import RankingList from "../containers/RankingList";

// Proxy
import getLeaderboard from "../proxies/leaderboard/getLeaderboard";

// Types
import { ProfileType } from "../types/profile";

const Leaderboard = (): JSX.Element => {
    const [leaderboard, setLeaderboard] = useState<ProfileType[]>(null!);

    ////////////////////////////////////////////////////////////

    useEffect(() => {
        getLeaderboard().then(setLeaderboard).catch(console.log);
    }, []);

    ////////////////////////////////////////////////////////////

    return (
        <Layout>
            <Heading type={1}>Leaderboard</Heading>
            {leaderboard !== null ? (
                <RankingList rankings={leaderboard} />
            ) : (
                <Loader />
            )}
        </Layout>
    );
};

export default Leaderboard;
