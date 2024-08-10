import '../app/globals.css';  // Adjust the path as necessary
import type { AppProps } from 'next/app';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
function MyApp({ Component, pageProps }: AppProps) {
  return  <><Component {...pageProps} /> <ToastContainer/></>;
}

export default MyApp;
