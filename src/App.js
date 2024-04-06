import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Layout from "./components/common/Layout";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Profile from "./components/profile/Profile";
import Challenges from "./components/challenges/Challenges";
import SignupOtp from "./components/signup/SignupOtp";
import Messages from "./components/messages/Messages";
import Block from "./components/block/Block";
import Chat from "./components/chat/Chat";
import Result from "./components/result/Result";
import Nopage from "./components/common/Nopage";
import style from "./css/style.css";
import LocationState from "./context/location/LocationState";
import SportState from "./context/sports/SportsState";
import SignupState from "./context/signup/SignupState";
import SignupOTPState from "./context/signup/SignupOTPState";
import LoginState from "./context/login/LoginState";
import AuthorizeState from "./context/common/AuthorizeState";
import OperationState from "./context/common/OperationState";
import ProfileState from "./context/profile/ProfileState";
import OpponentState from "./context/profile/OpponentState";
import SidebarState from "./context/sidebar/SidebarState";
import HomeState from "./context/home/HomeState";
import ChallengeState from "./context/challenges/ChallengesState";
import MessagesState from "./context/messages/MessagesState";
import ChatState from "./context/chat/ChatState";
import ResultState from "./context/result/ResultState";
import BlockState from "./context/block/BlockState";
import Terms from "./components/common/Terms";
import Privacy from "./components/common/Privacy";
import Cookies from "./components/common/Cookies";
import NotificationState from "./context/notification/NotificationState";
import NotificationAll from "./components/notification/NotificationAll";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthorizeState><LoginState><Login /></LoginState></AuthorizeState>,
    },
    {
      path: "/signup",
      element: <AuthorizeState><LocationState><SportState><SignupState><Signup /></SignupState></SportState></LocationState></AuthorizeState>,
    },
    {
      path: "/signup_otp",
      element: <AuthorizeState><SignupOTPState><SignupOtp /></SignupOTPState></AuthorizeState>,
    },
    {
      path: "/terms",
      element: <Terms />,
    },
    {
      path: "/privacy",
      element: <Privacy />,
    },
    {
      path: "/cookies",
      element: <Cookies />,
    },
    {
      element: <><AuthorizeState><OperationState><SidebarState><Layout /><Outlet /></SidebarState></OperationState></AuthorizeState></>,
      children: [
        {
          path: "/*",
          element: (
            <Nopage />
          ),
        },
        {
          path: "home",
          element: <NotificationState><HomeState><OpponentState><Home /></OpponentState></HomeState></NotificationState>,
        },
        {
          path: "profile",
          element: <NotificationState><LocationState><SportState><ProfileState><Profile /></ProfileState></SportState></LocationState></NotificationState>,
        },
        {
          path: "challenges",
          element: <NotificationState><ChallengeState><OpponentState><Challenges /></OpponentState></ChallengeState></NotificationState>,
        },
        {
          path: "messages",
          element: <NotificationState><MessagesState><OpponentState><Messages /></OpponentState></MessagesState></NotificationState>,
        },
        {
          path: "chat",
          element: <NotificationState><ChatState><OpponentState><Chat /></OpponentState></ChatState></NotificationState>,
        },
        {
          path: "result",
          element: <NotificationState><ResultState><OpponentState><Result /></OpponentState></ResultState></NotificationState>,
        },
        {
          path: "block",
          element: <NotificationState><BlockState><OpponentState><Block /></OpponentState></BlockState></NotificationState>,
        },
        {
          path: "notification",
          element: <NotificationState><BlockState><OpponentState><NotificationAll /></OpponentState></BlockState></NotificationState>,
        },
      ]
    }
  ]);

  return (<RouterProvider router={router} />);
}

export default App;
