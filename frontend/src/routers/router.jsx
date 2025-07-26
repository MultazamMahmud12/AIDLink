import {
  createBrowserRouter
} from "react-router";
import App from "../App";
import { Children } from "react";
import Home from "../pages/home/Home";
import EventList from "../pages/event/EventList";


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
            element: <div>Event details page coming soon...</div>
        },
         {
            path: "/login",
            element: <div>Login page coming soon...</div>
        },
         {
            path: "/signup",
            element: <div>Signup page coming soon...</div>
        },
        {
            path: "/apply",
            element: <div>Application page coming soon...</div>
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