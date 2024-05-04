import { Component } from "react";
import routes from "../config/router";
import Home from "../pages/Home/Home";
import Department from "../component/department/Department";
import Login from "../pages/Login/Login";
import User from "../component/user/User";

const publicRoutes = [
  { path: routes.home, Component: Home },
  { path: routes.login, Component: Login },
  { path: routes.departmet, Component: Department },
  { path: routes.user, Component: User },
];

export default publicRoutes;
