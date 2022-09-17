// React
import { useEffect, useState } from "react";

// Components
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ChatInterface from "../containers/ChatInterface";
import DirectMessageList from "../containers/DirectMessageList";
import ChatBox from "../containers/ChatBox";

// Types
import { GroupChat } from "../types/GlobalTypes";

// Requests
import getChatByUserName from "../proxies/chat/getChatsByUserName";

// Auth
import { useAuth } from "../contexts/AuthContext";
import Logger from "../utils/Logger";

// Temp data
import { useDataDebug } from "../contexts/DebugDataContext";

const Chat = () => {
    const [groupChats, setGroupChats] = useState<GroupChat[]>(null!);
    const [selectedChat, setSelectedChat] = useState<number>(0);

    const { user, authToken } = useAuth();

    const { chats } = useDataDebug();

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
    }, [authToken, user]);

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
