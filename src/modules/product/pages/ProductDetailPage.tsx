import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react";
import { productApi } from "@/modules/product/api/product.api";

type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  images: string[];
  image: string;
  category: string;
  brand?: string;
  sku?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  active: boolean;
};

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!slug) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      try {
        const response = await productApi.getBySlug(slug);
        setProduct(response.data as ProductDetail);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-8">Loading...</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-8">
          <p className="mb-4 text-lg font-semibold">Sản phẩm không tồn tại</p>
          <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:underline">
            <ArrowLeft className="size-4" />
            Quay về trang chủ
          </Link>
        </div>
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat("vi-VN").format(product.price) + "đ";
  const formattedCompare = product.compareAtPrice
    ? new Intl.NumberFormat("vi-VN").format(product.compareAtPrice) + "đ"
    : null;

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary">
          <ArrowLeft className="size-4" />
          Về trang chủ
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <img
              src={product.image || product.images[0]}
              alt={product.name}
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-widest text-secondary">{product.category}</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary">{product.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-secondary">
                <Star className="size-4 fill-current" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-slate-500">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
              {formattedCompare ? <span className="pb-1 text-sm text-slate-400 line-through">{formattedCompare}</span> : null}
            </div>

            {product.description ? <p className="leading-7 text-slate-600">{product.description}</p> : null}

            <div className="flex flex-wrap gap-3">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-secondary">
                <ShoppingCart className="size-4" />
                Add to cart
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold text-primary transition hover:bg-muted">
                <Heart className="size-4" />
                Wishlist
              </button>
            </div>

            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-primary">Brand</p>
                <p>{product.brand ?? "LUXE"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-primary">Stock</p>
                <p>{product.stock}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-primary">SKU</p>
                <p>{product.sku ?? "N/A"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-primary">Status</p>
                <p>{product.active ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
