import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./setup";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import "./index.css";
import AppearanceProvider from "./providers/AppearanceProvider";
import { store } from "./store/store";
import "./styles/appearance.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AppearanceProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AppearanceProvider>
  </Provider>,
);
