import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, ShieldCheck, ShieldAlert } from "lucide-react";
import { authApi } from "@/modules/auth/api/auth.api";
import { tokenStore } from "@/modules/auth/store/token.store";
import { AvatarUpload } from "@/modules/profile/components/AvatarUpload";
import { ProfileEditForm } from "@/modules/profile/components/ProfileEditForm";
import type { CurrentUser } from "@/modules/auth/types/auth.types";

type ProfileUser = CurrentUser & {
  displayName?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
};

export const ProfilePage = () => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data as ProfileUser);
    } catch {
      tokenStore.clear();
      navigate("/logout");
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          Thông tin cá nhân
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý thông tin tài khoản LUXE và tuỳ chọn cá nhân của bạn.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — avatar card */}
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-card p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:col-span-1">
          <AvatarUpload
            currentAvatarUrl={user?.avatarUrl}
            userInitials={initials}
            onUploadSuccess={(newUrl) =>
              setUser((prev) => (prev ? { ...prev, avatarUrl: newUrl } : prev))
            }
          />

          <div className="text-center">
            {user?.displayName && (
              <p className="text-lg font-semibold text-foreground">
                {user.displayName}
              </p>
            )}
            <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-4" />
              <span>{user?.email ?? "—"}</span>
            </div>
            {user?.phone && (
              <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="size-4" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {/* Email verification badge */}
          <div
            className={
              user?.isEmailVerified
                ? "inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent"
                : "inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-destructive"
            }
          >
            {user?.isEmailVerified ? (
              <>
                <ShieldCheck className="size-3.5" />
                Email đã xác thực
              </>
            ) : (
              <>
                <ShieldAlert className="size-3.5" />
                Chưa xác thực email
              </>
            )}
          </div>

          {/* VIP-style member badge, matching LUXE branding */}
          <div className="w-full rounded-lg border border-border bg-muted/40 p-4 text-center">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Hạng thành viên
            </p>
            <p className="mt-1 text-sm font-bold text-secondary">LUXE VIP</p>
          </div>
        </div>

        {/* Right column — edit form */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-primary">
            Chỉnh sửa hồ sơ
          </h2>
          {user ? (
            <ProfileEditForm
              defaultValues={{
                displayName: user.displayName ?? "",
                bio: user.bio ?? "",
                phone: user.phone ?? "",
              }}
              onSuccess={fetchUser}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          )}
        </div>
      </div>
    </div>
  );
};
