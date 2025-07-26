import {
  createBrowserRouter
} from "react-router";
import App from "../App";
import { Children } from "react";
import Home from "../pages/home/Home";
import EventList from "../pages/event/EventList";
import Eventdetail from "../pages/event/Eventdetail";
import Recipients from "../pages/recipients/Recipients";
import RecipientDetail from "../pages/recipients/RecipientDetail";
import Registration from "../pages/registration";
import Login from "../pages/Login";


const router = createBrowserRouter([
  {     
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />
        },
         {
            path: "/events",
            element: <EventList />
        },
         {
            path: "/events/:eventId",
            element: <Eventdetail />
        },
        {
            path: "/recipients",
            element: <Recipients />
        },
        {
            path: "/recipients/:recipientId",
            element: <RecipientDetail />
        },
        {
            path: "/recipients/:recipientId",
            element: <RecipientDetail />
        },
         {
            path: "/register",
            element: <Registration />
        },
         {
            path: "/login",
            element: <Login/>
        },
        
        {
            path: "/dashboard",
            element: <div>Dashboard coming soon...</div>
        },
        {
            path: "/AdminDashboard",
            element: <div>Admin Dashboard coming soon...</div>
        },
    ]
  },



]);
export default router;