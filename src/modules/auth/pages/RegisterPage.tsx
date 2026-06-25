import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Phone,
  User,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { OtpInput } from "@/shared/components/ui/otp-input";
import { cn } from "@/shared/lib/utils";

const BRAND_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAvW6M2vvfbmg7VZkTJeOzEkZkzyFf7LrWuNYmjW4v7cAnIcAOLmvNyadq3r7gMN1MM0GklPwZAJJ-lsIFWSIRYubs3BB9R4Mzkmwcl0okpyqJAM2LRsTFNaYHUmnFo6uRaWzj7qAANdDlcDyFdH_RdRKN21ZqISMDBAthreZIrpvIV7c_JeH4oGndQtOeSopMkQE9bCxY6BCWP9zJTzkjf5hk8W-5WL1VWOrEdpue0Xf9M3Kkt8tx3CxgH2riLEwTm0uDvYd9HiZQ";

const registerSchema = z
  .object({
    fullname: z.string().min(1, "Vui lòng nhập họ và tên"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    terms: z
      .boolean()
      .refine((v) => v === true, {
        message: "Bạn cần đồng ý với điều khoản dịch vụ",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(registerSchema) });

  const onRegisterSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await authApi.register({
        email: values.email,
        password: values.password,
      });
      setEmail(values.email);
      setStep("verify");
      toast.success("Mã OTP đã được gửi đến email của bạn.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  });

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(email, otp);
      toast.success("Xác thực thành công! Bạn có thể đăng nhập ngay.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Mã OTP không đúng hoặc đã hết hạn.",
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full overflow-hidden antialiased">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <section className="relative hidden overflow-hidden bg-primary lg:flex lg:w-1/2">
          <img
            alt="LUXE Branding"
            className="absolute inset-0 h-full w-full object-cover contrast-[110%] grayscale-[18%]"
            src={BRAND_IMAGE}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/35 to-primary/70" />
          <div className="relative z-10 flex w-full flex-col justify-between p-16 text-white">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">LUXE</h1>
              <p className="mt-4 max-w-md text-lg leading-8 text-white/85">
                Kiến tạo trải nghiệm mua sắm tinh gọn, sang trọng và đủ cá tính để
                tạo dấu ấn riêng cho mỗi khách hàng.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-1 w-12 bg-secondary" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/90">
                  Premium Membership
                </span>
              </div>
              <div className="max-w-md rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm leading-6 text-white/90">
                  “Một tài khoản LUXE là cánh cửa vào những bộ sưu tập giới hạn,
                  ưu đãi sớm và hành trình mua sắm có gu hơn.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center overflow-y-auto bg-background px-6 py-10 lg:w-1/2 lg:px-10 lg:py-14">
          <div className="w-full max-w-[520px] space-y-8">
            <div className="lg:hidden">
              <h1 className="text-5xl font-bold tracking-tighter text-primary">
                LUXE
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tạo tài khoản để bắt đầu trải nghiệm mua sắm cao cấp.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:p-8">
              {step === "verify" ? (
                <div className="space-y-7">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                      Xác thực
                    </span>
                    <h2 className="text-[32px] font-semibold leading-tight text-primary">
                      Nhập mã OTP
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Chúng tôi đã gửi mã 6 số đến{" "}
                      <span className="font-medium text-foreground">{email}</span>.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={onVerifySubmit}>
                    <OtpInput value={otp} onChange={setOtp} />

                    <Button
                      className={cn(
                        "w-full bg-primary py-6 text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:opacity-90",
                      )}
                      type="submit"
                      disabled={otp.length !== 6 || loading}
                    >
                      {loading && <Loader2 className="size-4 animate-spin" />}
                      Xác nhận
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("register");
                        setOtp("");
                      }}
                      className="block w-full text-center text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      Quay lại đăng ký
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-7">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                      Tạo tài khoản
                    </span>
                    <h2 className="text-[32px] font-semibold leading-tight text-primary">
                      Chào mừng đến với LUXE
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Đăng ký để nhận ưu đãi thành viên, thông báo mới và trải nghiệm
                      mua sắm tinh tế hơn.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={onRegisterSubmit}>
                    <div className="space-y-1.5">
                      <Label htmlFor="fullname">Họ và tên</Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="fullname"
                          className="h-12 border-border bg-white pl-12"
                          placeholder="Nguyễn Văn A"
                          {...register("fullname")}
                        />
                      </div>
                      {errors.fullname && (
                        <p className="text-xs text-destructive">
                          {errors.fullname.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          className="h-12 border-border bg-white pl-12"
                          placeholder="example@luxe.vn"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          className="h-12 border-border bg-white pl-12"
                          placeholder="0901 234 567"
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          className="h-12 border-border bg-white pl-12 pr-12"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary"
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

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          className="h-12 border-border bg-white pl-12"
                          type="password"
                          placeholder="••••••••"
                          {...register("confirmPassword")}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                      <input
                        id="terms"
                        type="checkbox"
                        className="mt-1 size-4 rounded border-border text-primary focus:ring-primary"
                        {...register("terms")}
                      />
                      <label
                        htmlFor="terms"
                        className="text-xs leading-relaxed text-muted-foreground"
                      >
                        Tôi đồng ý với{" "}
                        <a
                          className="font-semibold text-primary hover:underline"
                          href="#"
                        >
                          Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a
                          className="font-semibold text-primary hover:underline"
                          href="#"
                        >
                          Chính sách bảo mật
                        </a>{" "}
                        của LUXE.
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-xs text-destructive">
                        {errors.terms.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-secondary py-6 text-sm font-semibold uppercase tracking-[0.28em] text-secondary-foreground shadow-lg shadow-secondary/10 transition-all hover:bg-[hsl(28,100%,23%)] hover:shadow-md"
                    >
                      {loading && <Loader2 className="size-4 animate-spin" />}
                      Đăng ký ngay
                    </Button>
                  </form>

                  <div className="border-t border-border/70 pt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Đã có tài khoản?{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-secondary hover:underline"
                      >
                        Đăng nhập
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
