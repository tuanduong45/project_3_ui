import "./App.css";
import Login from "./pages/Login/Login";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import SignUpForm from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Department from "./component/department/Department";
import User from "./component/user/User";
import { Switch } from "antd";
import publicRoutes from "./router";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.Component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
