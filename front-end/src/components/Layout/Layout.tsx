// UI
import Footer from "../Footer";
import NavBar from "../Navbar";

// Styling
import { Container, Content } from "./Layout.style";

interface Props {
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <Container>
            <NavBar />
            <Content>{children}</Content>
            <Footer />
        </Container>
    );
};

export default Layout;
