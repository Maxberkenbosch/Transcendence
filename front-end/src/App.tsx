// Styling
import GlobalStyle from "./styles/GlobalStyle";

// Routing
import Router from "./containers/Router";

// Only for debug purposes
import FakeDataProvider from "./contexts/FakeDataContext";

// Providers
import AuthProvider from "./contexts/AuthContext";
import ModalProvider from "./contexts/ModalContext";
import ChatProvider from "./contexts/ChatContext";

const App = (): JSX.Element => {
    return (
        <AuthProvider>
            {/* TODO: wrapper for providers? */}
            <ModalProvider>
                {/* TODO: remove data debug provider */}
                <FakeDataProvider>
                    <ChatProvider>
                        {/* Global Styling */}
                        <GlobalStyle />

                        {/* Page routing */}
                        <Router />
                    </ChatProvider>
                </FakeDataProvider>
            </ModalProvider>
        </AuthProvider>
    );
};
export default App;
