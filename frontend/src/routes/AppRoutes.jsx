import { Routes, Route } from "react-router-dom";

import Landing from "../pages/public/Landing";
import Properties from "../pages/public/Properties";
import PropertyDetails from "../pages/public/PropertyDetails";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import TrustProfile from "../pages/tenant/TrustProfile";
import MyApplications from "../pages/tenant/MyApplications";
import MyRentals from "../pages/tenant/MyRentals";
import Payments from "../pages/tenant/Payments";
import Reviews from "../pages/tenant/Reviews";
import TenantDashboard from "../pages/tenant/Dashboard";

import MyProperties from "../pages/landlord/MyProperties";
import LandlordDashboard from "../pages/landlord/Dashboard";
import LandlordApplications from "../pages/landlord/Applications";
import LandlordRentals from "../pages/landlord/Rentals";
import LandlordPayments from "../pages/landlord/Payments";
import LandlordReviews from "../pages/landlord/Reviews";

function Placeholder({ title }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">{title}</h1>

        <p className="mt-3 text-gray-500">
          This TrustRent screen will be implemented next.
        </p>
      </div>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/properties"
        element={<Properties />}
      />

      <Route
        path="/properties/:id"
        element={<PropertyDetails />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/how-it-works"
        element={<Placeholder title="How Trust Works" />}
      />

      <Route
        path="/for-tenants"
        element={<Placeholder title="For Tenants" />}
      />

      <Route
        path="/for-landlords"
        element={<Placeholder title="For Landlords" />}
      />

      {/* TENANT */}
      <Route
        path="/tenant/dashboard"
        element={<TenantDashboard />}
      />

      <Route
        path="/tenant/trust-profile"
        element={<TrustProfile />}
      />

      <Route
        path="/tenant/applications"
        element={<MyApplications />}
      />

      <Route
        path="/tenant/rentals"
        element={<MyRentals />}
      />

      <Route
        path="/tenant/payments"
        element={<Payments />}
      />

      <Route
        path="/tenant/reviews"
        element={<Reviews />}
      />

      {/* LANDLORD */}
      <Route
        path="/landlord/dashboard"
        element={<LandlordDashboard />}
      />

      <Route
        path="/landlord/properties"
        element={<MyProperties />}
      />

      <Route
        path="/landlord/applications"
        element={<LandlordApplications />}
      />

      <Route
        path="/landlord/rentals"
        element={<LandlordRentals />}
      />

      <Route
        path="/landlord/payments"
        element={<LandlordPayments />}
      />

      <Route
        path="/landlord/reviews"
        element={<LandlordReviews />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<Placeholder title="Page Not Found" />}
      />
    </Routes>
  );
}