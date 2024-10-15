import { Route, Routes } from "react-router-dom";
import { AdminHome } from "./AdminHome";
import CategoryManagement from "./CategoryManagement";
import AnnouncementCategoriesList from "./AnnouncementCategoryList";
import { CategoryAnnouncement } from "./CategoryAnnouncement";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/announce" element={<AnnouncementCategoriesList />} />
      <Route path="/announce/:categoryId" element={<CategoryAnnouncement />} />
    </Routes>
  );
};
