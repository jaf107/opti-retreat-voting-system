import { Route, Routes } from "react-router-dom";
import { AppKillSwitch } from "./AppKillSwitch";
import CategoryKillSwitchList from "./CategoryKillSwitchList";
import AnnouncementCategoriesList from "./AnnouncementCategoryList";
import { CategoryAnnouncement } from "./CategoryAnnouncement";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppKillSwitch />} />
      <Route path="/categories" element={<CategoryKillSwitchList />} />
      <Route path="/announce" element={<AnnouncementCategoriesList />} />
      <Route path="/announce/:categoryId" element={<CategoryAnnouncement />} />
    </Routes>
  );
};
