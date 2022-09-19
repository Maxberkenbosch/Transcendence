// React
import { useEffect, useState } from "react";

// Components
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ChatInterface from "../containers/ChatInterface";
import DirectMessageList from "../containers/DirectMessageList";
import ChatBox from "../containers/ChatBox";

// Types
import { GroupChat } from "../types/chat";

// Requests
// import getChatByUserName from "../proxies/chat/getChatsByUserName";

// Auth
import { useAuth } from "../contexts/AuthContext";
// import Logger from "../utils/Logger";

// Temp data
import { useFakeData } from "../contexts/FakeDataContext";

const Chat = () => {
    const [groupChats, setGroupChats] = useState<GroupChat[]>(null!);
    const [selectedChat, setSelectedChat] = useState<number>(0);

    const { user, authToken } = useAuth();

    const { chats } = useFakeData();

    useEffect(() => {
        if (user !== null) {
            setGroupChats(chats);
            // getChatByUserName(user.username, authToken)
            //     .then((returnedChats) => {
            //         setGroupChats(returnedChats as GroupChat[]);
            //     })
            //     .catch((err) =>
            //         Logger("ERROR", "Chat page", "Retrieved chats request", err)
            //     );
        }
    }, [authToken, chats, user]);

    return (
        <Layout>
            {groupChats !== null ? (
                <ChatInterface>
                    <DirectMessageList
                        directMessages={groupChats}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                    />
                    <ChatBox chat={groupChats[selectedChat]} />
                </ChatInterface>
            ) : (
                <Loader />
            )}
        </Layout>
    );
};

export default Chat;
