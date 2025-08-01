// pages/_app.js

import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <>
        <Toaster />
        <Component {...pageProps} />
      </>
    </Provider>
  );
}
