import AppRouter from "./router/routers"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div >
      <AppRouter />
      <ToastContainer />
    </div>
  )
}

export default App