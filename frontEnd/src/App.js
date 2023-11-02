import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Question from "./components/Question";
import ShowResult from "./components/ShowResult";
import { useAuth } from "./context/auth";

import Error from "./components/Error";
import { ToastContainer } from "react-toastify";
import Admin from "./components/Admin";
import Spinner from "./components/Spinner";

function App() {
  const [auth, setauth] = useAuth();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const exam_type = new URLSearchParams(search).get("exam-type");

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          exact
          path={auth.token || id ? "/" : "/n"}
          element={<Login />}
        ></Route>
        <Route
          exact
          path={auth.token ? "/home" : "/n"}
          element={<Home />}
        ></Route>
        {/* <Route path="/" element={<PrivateRoute />}> */}
        {/* <Route path="/home" element={<Home />}></Route> */}
        <Route path={`/question`} element={<Question />}></Route>
        <Route path="/result" element={<ShowResult />}></Route>
        <Route path="/admin" element={<Admin />}></Route>

        <Route path="/*" element={<Error />} />
        <Route path="/spinner" element={<Spinner />} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
