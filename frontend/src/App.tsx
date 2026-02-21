import { Header, Container } from "./components/Layout";
import { ErrorBoundary } from "./components/UI";
import { ConnectButton } from "./components/WalletConnect";
import { TokenDeployForm } from "./components/TokenDeployForm";

function App() {
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <div className="min-h-screen bg-gray-50">
        <Header>
          <ConnectButton />
        </Header>
        <main id="main-content">
          <Container>
            <div className="py-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Deploy Your Token
                </h1>
                <p className="text-lg text-gray-600">
                  Create a custom token on the Stellar network in minutes
                </p>
              </div>
              <TokenDeployForm />
            </div>
          </Container>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
