// pages/_app.js

import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "../components/AuthInitializer";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <>
        <Toaster />
        <Component {...pageProps} />
      </>
    </Provider>
  );
}
