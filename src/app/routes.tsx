import { createHashRouter } from "react-router";
import { Calendar } from "./pages/Calendar";
import { Home } from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { OpportunityDetails } from "./pages/OpportunityDetails";
import { Layout } from "./components";

export const router = createHashRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "oportunidade/:id", Component: OpportunityDetails },
      { path: "calendario", Component: Calendar },
      { path: "quiz", Component: Quiz },
      { path: "*", Component: Home },
    ],
  },
]);
