import { Route, Routes } from "react-router-dom";
import { AppKillSwitch } from "./AppKillSwitch";
import CategoryKillSwitchList from "./category/CategoryKillSwitchList";
import AnnouncementList from "./announcement/AnnouncementList";
import { WinnerAnnouncement } from "../WinnerAnnouncement";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppKillSwitch />} />
      <Route path="/categories" element={<CategoryKillSwitchList />} />
      <Route path="/announce" element={<AnnouncementList />} />
    </Routes>
  );
};
