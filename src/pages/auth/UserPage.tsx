import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import UserSidebar from "@/components/profile/UserSideBar";
import { Outlet } from "react-router-dom";


export default function UserPage() {
  const handleOpenAuth = () => {
    // User is already authenticated to access this page
    // This is a no-op function
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header onOpenAuth={handleOpenAuth} />
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid grid-cols-12 gap-6 mt-4">
          {/* Sidebar */}
          <div className="col-span-3">
            <UserSidebar />
          </div>

          {/* Main content */}
          <div className="col-span-9">
            <Outlet />
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
