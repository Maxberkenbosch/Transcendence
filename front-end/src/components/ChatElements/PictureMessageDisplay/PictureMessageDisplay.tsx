// Types
import { PictureMessage, Message } from "../../../types/chat";

// UI
import Asset from "../../Asset";

// Styling
import styled from "styled-components";
import { smallRadius } from "../../../styles/StylingConstants";

interface Props {
    message: Message;
    fromUser: boolean;
}

const Container = styled.div<{ fromUser: boolean }>`
    display: flex;
    flex-direction: column;

    align-items: ${({ fromUser }) => (fromUser ? `end` : `start`)};
    margin-bottom: 18px;

    .asset {
        border: solid 2px black;
        border-radius: ${smallRadius};
        overflow: hidden;
        width: 50%;
        max-width: 50%;
        height: 300px;
    }
`;

const PictureMessageDisplay = ({ fromUser, message }: Props) => {
    const formattedMessage: PictureMessage = message.content as PictureMessage;

    return (
        <Container fromUser={fromUser}>
            <Asset url={formattedMessage.url} alt={formattedMessage.alt} />
            <span>{message.sender?.username}</span>
        </Container>
    );
};

export default PictureMessageDisplay;
