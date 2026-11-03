import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AppStoreProvider } from "@/store/AppStore";
import Home from "@/screens/Home";
import RequestHire from "@/screens/RequestHire";
import Roles from "@/screens/Roles";
import RoleDetail from "@/screens/RoleDetail";
import Candidates from "@/screens/Candidates";
import Outreach from "@/screens/Outreach";
import Billing from "@/screens/Billing";
import Settings from "@/screens/Settings";

export default function App() {
  return (
    <AppStoreProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<RequestHire />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/:roleId" element={<RoleDetail />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </AppStoreProvider>
  );
}
