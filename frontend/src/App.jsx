import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./components/SocketProvider";
import Landing from "./pages/Landing";
import Dispatcher from "./pages/Dispatcher";
import Driver from "./pages/Driver";
import TrafficCentre from "./pages/TrafficCentre";
import Police from "./pages/Police";
import Hospital from "./pages/Hospital";
import TrafficStatus from "./pages/TrafficStatus";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <SocketProvider>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dispatcher" element={<Dispatcher />} />
                    <Route path="/driver" element={<Driver />} />
                    <Route path="/traffic" element={<TrafficCentre />} />
                    <Route path="/police" element={<Police />} />
                    <Route path="/hospital" element={<Hospital />} />
                    <Route path="/traffic-status" element={<TrafficStatus />} />
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </SocketProvider>
    );
}

export default App;
