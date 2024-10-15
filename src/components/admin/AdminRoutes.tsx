import { Route, Routes } from "react-router-dom";
import { AppKillSwitch } from "./AppKillSwitch";
import CategoryManagement from "./CategoryManagement";
import AnnouncementCategoriesList from "./AnnouncementCategoryList";
import { CategoryAnnouncement } from "./CategoryAnnouncement";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppKillSwitch />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/announce" element={<AnnouncementCategoriesList />} />
      <Route path="/announce/:categoryId" element={<CategoryAnnouncement />} />
    </Routes>
  );
};
