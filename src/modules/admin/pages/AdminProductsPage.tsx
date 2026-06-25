import { useEffect, useMemo, useState } from 'react';
import { authApi } from '@/modules/auth/api/auth.api';
import { bannerApi } from '@/modules/banner/api/banner.api';
import { productApi } from '@/modules/product/api/product.api';
import type { CurrentUser } from '@/modules/auth/types/auth.types';
import { tokenStore } from '@/modules/auth/store/token.store';

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  active: boolean;
};

type FormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  discountPercent: string;
  image: string;
  imageFile: File | null;
  category: string;
  stock: string;
  rating: string;
  reviewCount: string;
  isFeatured: boolean;
  isNew: boolean;
  active: boolean;
};

type Banner = {
  id: string;
  imageUrl: string;
  active: boolean;
  order: number;
};

type BannerForm = {
  id?: string;
  image: string;
  imageFile: File | null;
  order: string;
  active: boolean;
};

const emptyForm = (): FormState => ({
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAtPrice: '',
  discountPercent: '',
  image: '',
  imageFile: null,
  category: '',
  stock: '0',
  rating: '0',
  reviewCount: '0',
  isFeatured: false,
  isNew: false,
  active: true
});

const emptyBannerForm = (): BannerForm => ({
  image: '',
  imageFile: null,
  order: '0',
  active: true
});

export const AdminProductsPage = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerForm, setBannerForm] = useState<BannerForm>(emptyBannerForm());
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSaving, setBannerSaving] = useState(false);

  const isAdmin = user?.role === 'admin';

  const load = async () => {
    const [meRes, productsRes] = await Promise.all([
      authApi.getMe(),
      productApi.list({ limit: 100 })
    ]);
    setUser(meRes.data as CurrentUser);
    setItems((productsRes.data.items ?? []) as Product[]);
    const bannerRes = await bannerApi.list();
    setBanners((bannerRes.data.items ?? []) as Banner[]);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const sortedItems = useMemo(() => items, [items]);

  const editProduct = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: String(product.price),
      compareAtPrice: String(product.compareAtPrice ?? ''),
      discountPercent: String(product.discountPercent ?? ''),
      image: product.image,
      imageFile: null,
      category: product.category,
      stock: String(product.stock),
      rating: String(product.rating),
      reviewCount: String(product.reviewCount),
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      active: product.active
    });
  };

  const reset = () => setForm(emptyForm());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      setError(null);
      const payload = new FormData();
      payload.append('name', form.name);
      if (form.slug) payload.append('slug', form.slug);
      if (form.description) payload.append('description', form.description);
      payload.append('price', String(Number(form.price)));
      if (form.compareAtPrice) payload.append('compareAtPrice', String(Number(form.compareAtPrice)));
      if (form.discountPercent) payload.append('discountPercent', String(Number(form.discountPercent)));
      if (form.imageFile) payload.append('image', form.imageFile);
      else if (form.image) payload.append('image', form.image);
      payload.append('category', form.category);
      payload.append('stock', String(Number(form.stock)));
      payload.append('rating', String(Number(form.rating)));
      payload.append('reviewCount', String(Number(form.reviewCount)));
      payload.append('isFeatured', String(form.isFeatured));
      payload.append('isNew', String(form.isNew));
      payload.append('active', String(form.active));

      if (form.id) {
        await productApi.update(form.id, payload);
      } else {
        await productApi.create(payload);
      }

      await load();
      reset();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await productApi.remove(id);
    await load();
  };

  const editBanner = (banner: Banner) => {
    setBannerForm({
      id: banner.id,
      image: banner.imageUrl,
      imageFile: null,
      order: String(banner.order),
      active: banner.active
    });
  };

  const resetBanner = () => setBannerForm(emptyBannerForm());

  const submitBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerSaving(true);
    try {
      setBannerError(null);
      const payload = new FormData();
      if (bannerForm.imageFile) payload.append('image', bannerForm.imageFile);
      else if (bannerForm.image) payload.append('imageUrl', bannerForm.image);
      payload.append('order', bannerForm.order);
      payload.append('active', String(bannerForm.active));

      if (bannerForm.id) {
        await bannerApi.update(bannerForm.id, payload);
      } else {
        await bannerApi.create(payload);
      }

      await load();
      resetBanner();
    } catch (err: any) {
      setBannerError(err?.response?.data?.message ?? 'Unable to save banner');
    } finally {
      setBannerSaving(false);
    }
  };

  const removeBanner = async (id: string) => {
    await bannerApi.remove(id);
    await load();
  };

  if (loading) return <main className="p-8">Loading...</main>;
  if (!isAdmin) return <main className="p-8">Forbidden</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Products</h1>
      {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <section className="mb-10 rounded-2xl border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Homepage Banners</h2>
        </div>
        {bannerError ? <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{bannerError}</div> : null}
        <form onSubmit={submitBanner} className="mb-6 grid gap-4 md:grid-cols-2">
          <input type="file" accept="image/*" onChange={(e) => setBannerForm((p) => ({ ...p, imageFile: e.target.files?.[0] ?? null }))} className="rounded border px-3 py-2 md:col-span-2" />
          <input placeholder="Image URL fallback" value={bannerForm.image} onChange={(e) => setBannerForm((p) => ({ ...p, image: e.target.value }))} className="rounded border px-3 py-2 md:col-span-2" />
          <input placeholder="Order" type="number" value={bannerForm.order} onChange={(e) => setBannerForm((p) => ({ ...p, order: e.target.value }))} className="rounded border px-3 py-2" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={bannerForm.active} onChange={(e) => setBannerForm((p) => ({ ...p, active: e.target.checked }))} /> Active</label>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" disabled={bannerSaving} className="rounded bg-primary px-4 py-2 text-white">{bannerSaving ? 'Saving...' : bannerForm.id ? 'Update Banner' : 'Create Banner'}</button>
            <button type="button" onClick={resetBanner} className="rounded border px-4 py-2">Reset</button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <div key={banner.id} className="overflow-hidden rounded-xl border">
              <img src={banner.imageUrl} alt="Banner" className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => editBanner(banner)} className="rounded border px-3 py-1">Edit</button>
                  <button type="button" onClick={() => removeBanner(banner.id)} className="rounded border border-red-300 px-3 py-1 text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={submit} className="mb-8 grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="rounded border px-3 py-2" />
        <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, imageFile: e.target.files?.[0] ?? null }))} className="rounded border px-3 py-2 md:col-span-2" />
        <input placeholder="Image URL fallback" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="rounded border px-3 py-2 md:col-span-2" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="rounded border px-3 py-2 md:col-span-2" />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Compare At Price" type="number" value={form.compareAtPrice} onChange={(e) => setForm((p) => ({ ...p, compareAtPrice: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Discount %" type="number" value={form.discountPercent} onChange={(e) => setForm((p) => ({ ...p, discountPercent: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Rating" type="number" step="0.1" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} className="rounded border px-3 py-2" />
        <input placeholder="Review Count" type="number" value={form.reviewCount} onChange={(e) => setForm((p) => ({ ...p, reviewCount: e.target.value }))} className="rounded border px-3 py-2" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm((p) => ({ ...p, isNew: e.target.checked }))} /> New</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} /> Active</label>
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={saving} className="rounded bg-primary px-4 py-2 text-white">{saving ? 'Saving...' : form.id ? 'Update' : 'Create'}</button>
          <button type="button" onClick={reset} className="rounded border px-4 py-2">Reset</button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.stock}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => editProduct(item)} className="rounded border px-3 py-1">Edit</button>
                    <button onClick={() => remove(item.id)} className="rounded border border-red-300 px-3 py-1 text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
