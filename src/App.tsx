import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { ProtectedRoute } from "@/modules/auth/components/ProtectedRoute";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { RegisterPage } from "@/modules/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/modules/auth/pages/ForgotPasswordPage";
import { LogoutPage } from "@/modules/auth/pages/LogoutPage";
import { MePage } from "@/modules/auth/pages/MePage";
import { HomePage } from "@/modules/home/pages/HomePage";
import { AdminProductsPage } from "@/modules/admin/pages/AdminProductsPage";
import { ProfilePage } from "@/modules/profile/pages/ProfilePage";
import { ProductDetailPage } from "@/modules/product/pages/ProductDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminProductsPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="/logout" element={<LogoutPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/me" element={<MePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
