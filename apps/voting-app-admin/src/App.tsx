import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import ResultsDashboard from "./components/ResultsDashboard";
import CategoriesManagement from "./components/CategoriesManagement";

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ResultsDashboard />} />
          <Route path="/results" element={<AdminDashboard />} />
          <Route path="/categories" element={<CategoriesManagement />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
