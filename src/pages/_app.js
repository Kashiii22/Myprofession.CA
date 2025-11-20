// pages/_app.js

import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "../components/AuthInitializer";
import WebsiteLoader from "../components/WebsiteLoader";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <WebsiteLoader>
        <AuthInitializer />
        <>
          <Toaster />
          <Component {...pageProps} />
        </>
      </WebsiteLoader>
    </Provider>
  );
}
