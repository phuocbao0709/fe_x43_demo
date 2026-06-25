import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { tokenStore } from "../store/token.store";
import { cn } from "@/shared/lib/utils";

const BRAND_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAvW6M2vvfbmg7VZkTJeOzEkZkzyFf7LrWuNYmjW4v7cAnIcAOLmvNyadq3r7gMN1MM0GklPwZAJJ-lsIFWSIRYubs3BB9R4Mzkmwcl0okpyqJAM2LRsTFNaYHUmnFo6uRaWzj7qAANdDlcDyFdH_RdRKN21ZqISMDBAthreZIrpvIV7c_JeH4oGndQtOeSopMkQE9bCxY6BCWP9zJTzkjf5hk8W-5WL1VWOrEdpue0Xf9M3Kkt8tx3CxgH2riLEwTm0uDvYd9HiZQ";

const GOOGLE_ICON =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAigCq0EEkXXyEPFbEkE2I42JrtyvB3oD-qozGN78ZcewALOCFc4_t_z82UfUKAF43jswHz3GyQ2xy2OaNp3pvq_KKdRHSHk69h_46-3nIWVPZWnAFzGVWvK9eEVyKbTI1-V70gI_Pa5s3bRvtR2nXVrXsqcS4RYKZEt6RbPwlXJ11PGToz9-7FMnH1YIsIBGCyZor_EghE3xni8J9PG_AR99IhjJmH9gLPELmBvSRu_mGgjQ2oGoiaT2hu2awpAX_ju3VPWcuBJ04";

const FACEBOOK_ICON =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDfHOZFpQYvlkUA0Aw5s6-D36VsATNaoOntU8MRs5feKhLveqa6pw6oHeqkumPY6yyjbelQkYR0hSs2W0EAtOH4ML76fPV9TMOdCzoN7UXPSxXKsLik3b_cVX-zNnuvXaTvMA98NrkglNZK2R9t1iDKmYXh3GuvYT7lUTuOSRwvMH_uNbyKtBWEOTUVE3mwqZlmwi-E0gRCQQA4TkHfIa3o591suS8Dix8dEVjxbLyyRn_vVlRMl1oFEvYt8RYLw74YIV70ZugCiws";

const loginSchema = z.object({
  identity: z.string().trim().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof loginSchema>;

const inputClassName =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identity: "",
      password: "",
      remember: false,
    },
  });

  const onLoginSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await authApi.login({
        email: values.identity,
        password: values.password,
      });
      const token = response.data?.token as string | undefined;

      if (!token) {
        toast.error("Đăng nhập thất bại, vui lòng thử lại.");
        return;
      }

      tokenStore.set(token);
      toast.success("Đăng nhập thành công.");
      const meResponse = await authApi.getMe();
      const role = meResponse.data?.role as 'user' | 'admin' | undefined;
      navigate(role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden antialiased">
      <div className="flex h-screen w-full">
        <section className="relative hidden overflow-hidden bg-primary lg:flex lg:w-1/2">
          <img
            alt="LUXE Branding"
            className="absolute inset-0 h-full w-full object-cover contrast-[110%] grayscale-[20%]"
            src={BRAND_IMAGE}
          />
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-primary/10 to-primary/60 p-16">
            <div className="text-white">
              <h1 className="mb-4 text-5xl font-bold tracking-tighter">LUXE</h1>
              <p className="max-w-md text-lg opacity-90">
                Định nghĩa lại sự sang trọng trong từng trải nghiệm thương mại hiện đại.
              </p>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="h-1 w-12 bg-secondary" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Premium Choice 2024
              </span>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center overflow-y-auto bg-white p-6 lg:w-1/2 lg:p-12">
          <div className="w-full max-w-[480px] space-y-12 py-8">
            <div className="lg:hidden">
              <h1 className="text-5xl font-bold tracking-tighter text-primary">
                LUXE
              </h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-[32px] font-semibold leading-tight text-primary">
                Chào mừng quay trở lại
              </h2>
              <p className="text-base text-muted-foreground">
                Vui lòng nhập thông tin để truy cập tài khoản LUXE của bạn.
              </p>
            </div>

            <form className="space-y-6" onSubmit={onLoginSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="identity"
                  className="block text-xs font-medium text-muted-foreground"
                >
                  Email hoặc Số điện thoại
                </label>
                <input
                  id="identity"
                  type="text"
                  placeholder="example@luxe.com"
                  className={inputClassName}
                  {...register("identity")}
                />
                {errors.identity && (
                  <p className="text-xs text-destructive">
                    {errors.identity.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-muted-foreground"
                  >
                    Mật khẩu
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-secondary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(inputClassName, "pr-12")}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                  {...register("remember")}
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-muted-foreground"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-4 text-sm font-semibold uppercase tracking-widest text-secondary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[hsl(28,100%,23%)] hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-60"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Đăng nhập
              </button>
            </form>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-border" />
              <span className="mx-4 shrink-0 text-xs text-muted-foreground">
                Hoặc đăng nhập bằng
              </span>
              <div className="flex-grow border-t border-border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-lg border border-border py-3 text-sm font-semibold text-primary transition-all hover:bg-muted"
              >
                <img alt="Google" className="size-5" src={GOOGLE_ICON} />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-lg border border-border py-3 text-sm font-semibold text-primary transition-all hover:bg-muted"
              >
                <img alt="Facebook" className="size-5" src={FACEBOOK_ICON} />
                Facebook
              </button>
            </div>

            <p className="text-center text-base text-muted-foreground">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Tham gia ngay
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
