import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, RefreshCcw, ShieldCheck, ShoppingCart, Headphones, Truck, User, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { homeApi } from "@/modules/home/api/home.api";
import { tokenStore } from "@/modules/auth/store/token.store";
import { cn } from "@/shared/lib/utils";

type ProductCard = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  tags: string[];
};

type HomePageResponse = {
  hero: { title: string; description: string; ctaPrimary: string; ctaSecondary: string; image: string };
  banners: { id: string; imageUrl: string; order: number }[];
  navigation: { label: string; href: string }[];
  featuredProducts: ProductCard[];
  benefits: { title: string; description: string }[];
};

const emptyHomeData: HomePageResponse = {
  hero: { title: "", description: "", ctaPrimary: "", ctaSecondary: "", image: "" },
  banners: [],
  navigation: [],
  featuredProducts: [],
  benefits: []
};

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + "đ";

export const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState<HomePageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const isLoggedIn = Boolean(tokenStore.get());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await homeApi.getHome();
        setData({
          ...emptyHomeData,
          ...(response.data as Partial<HomePageResponse>),
          banners: (response.data?.banners ?? []) as HomePageResponse["banners"],
          navigation: (response.data?.navigation ?? []) as HomePageResponse["navigation"],
          featuredProducts: (response.data?.featuredProducts ?? []) as HomePageResponse["featuredProducts"],
          benefits: (response.data?.benefits ?? []) as HomePageResponse["benefits"]
        });
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  useEffect(() => {
    if (!data?.banners?.length) return;
    const timer = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % data.banners.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [data?.banners]);

  const currentBanner = useMemo(() => {
    if (!data?.banners?.length) return null;
    return data.banners[activeBanner % data.banners.length];
  }, [activeBanner, data?.banners]);

  if (loading || !data) {
    return <main className="min-h-screen bg-[#f7f9fb] p-8">Loading...</main>;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f9fb] text-[#191c1e]">
      <header className={cn("sticky top-0 z-50 h-20 w-full border-b border-transparent transition-all duration-300", scrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-[#ffffffcc] shadow-sm backdrop-blur")}>
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 md:px-16">
          <div className="text-3xl font-bold tracking-tighter text-primary">LUXE</div>
          <nav className="hidden items-center gap-6 md:flex">
            {data.navigation?.map((item, index) => (
              <a key={item.label} href={item.href} className={cn("pb-1 text-base font-semibold transition-colors duration-200", index === 0 ? "border-b-2 border-secondary text-secondary" : "text-slate-500 hover:text-primary")}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="transition-all duration-200 hover:scale-105 hover:text-secondary"><Search className="size-5 text-primary" /></button>
            <Link to={isLoggedIn ? "/profile" : "/login"} className="transition-all duration-200 hover:scale-105 hover:text-secondary" aria-label="Profile"><User className="size-5 text-primary" /></Link>
            <button className="relative transition-all duration-200 hover:scale-105 hover:text-secondary"><ShoppingCart className="size-5 text-primary" /><span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">2</span></button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pt-4 md:px-8 md:pt-6">
        <div className="relative mx-auto h-[420px] max-w-[1440px] overflow-hidden rounded-[28px] shadow-2xl md:h-[640px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/55 via-primary/20 to-transparent" />
          <img
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{ transform: "scale(1.02)" }}
            alt="Luxury banner"
            src={currentBanner?.imageUrl || data.hero.image}
          />
        </div>
        {data.banners.length > 1 ? (
          <>
            <button onClick={() => setActiveBanner((current) => (current - 1 + data.banners.length) % data.banners.length)} className="absolute left-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 p-3 text-primary shadow-lg backdrop-blur transition-transform duration-200 hover:scale-105 hover:bg-white">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => setActiveBanner((current) => (current + 1) % data.banners.length)} className="absolute right-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 p-3 text-primary shadow-lg backdrop-blur transition-transform duration-200 hover:scale-105 hover:bg-white">
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-5 md:px-16">
        <div className="flex justify-center gap-2">
          {data.banners?.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setActiveBanner(index)}
              className={cn("h-2 rounded-full transition-all duration-300 ease-out", index === activeBanner ? "w-10 bg-secondary" : "w-2 bg-slate-300 hover:bg-slate-400")}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low py-20">
        <div className="mx-auto max-w-[1440px] px-4 md:px-16">
          <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-3 text-3xl font-semibold tracking-tight text-primary md:text-4xl">Featured Products</h2>
              <p className="text-base text-slate-500">Những sản phẩm nổi bật trong tuần này</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {data.featuredProducts?.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative aspect-[4/4.2] overflow-hidden bg-slate-50">
                  <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
                  <div className="absolute right-4 top-4 space-y-2 translate-x-12 transition-transform duration-300 group-hover:translate-x-0">
                    <button className="flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition-colors hover:bg-secondary hover:text-white"><Heart className="size-4" /></button>
                    <button className="flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition-colors hover:bg-secondary hover:text-white"><Eye className="size-4" /></button>
                  </div>
                  {product.isNew ? <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">New</span> : null}
                  {product.discountPercent ? <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">-{product.discountPercent}%</span> : null}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-1 text-secondary">
                    <span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span>
                    <span className="ml-1 text-xs text-slate-500">({product.reviewCount})</span>
                  </div>
                  <h4 className="mb-1 text-lg font-semibold text-primary">{product.name}</h4>
                  <p className="mb-4 text-sm text-slate-500">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.compareAtPrice ? <span className="text-xs text-slate-400 line-through">{formatPrice(product.compareAtPrice)}</span> : null}
                      <span className="text-xl font-semibold text-primary">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-colors hover:bg-secondary">
                      <ShoppingCart className="size-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-0 border-y border-outline-variant px-4 py-20 md:grid-cols-4 md:px-16">
        {data.benefits?.map((benefit, index) => {
          const Icon = [ShieldCheck, Truck, RefreshCcw, Headphones][index] ?? ShieldCheck;
          return (
            <div key={benefit.title} className={cn("flex flex-col items-center p-6 text-center", index > 0 && "md:border-l md:border-outline-variant")}>
              <Icon className="mb-4 size-10 text-secondary" />
              <h5 className="mb-2 text-sm font-semibold text-primary">{benefit.title}</h5>
              <p className="text-sm text-slate-500">{benefit.description}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
};
