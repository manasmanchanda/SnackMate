import { useState } from 'react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { ProductForm } from '@/components/ProductForm';
import { ProductThumb } from '@/components/ProductCard';
import { EmptyState, ErrorNotice, LoadingBlock, PageHeader, SignInPrompt, SourceBadge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { createProduct, deleteProduct, updateProduct, uploadProductImage } from '@/lib/productApi';
import type { ProductInput } from '@/lib/productModel';
import { navigate, useRoute } from '@/lib/router';
import { useProducts } from '@/lib/useProducts';

type Tab = 'new' | 'mine';

export function AddProductPage() {
  const { user, loading: authLoading } = useAuth();
  const { params } = useRoute();
  const editId = params.get('edit');
  const [tab, setTab] = useState<Tab>('new');

  if (authLoading) return <LoadingBlock label="Checking your account..." />;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <PageHeader eyebrow="Add your product" title="Add a snack that is not listed yet" />
        <div className="mt-8">
          <SignInPrompt message="Sign in to add a product. Your submissions are saved to your account, and you can edit or delete them at any time." />
        </div>
      </div>
    );
  }

  if (editId) return <EditProductView productId={editId} userId={user.id} />;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Add your product"
        title="Add a packaged snack"
        description="Copy the details from the pack. Leave any box empty if the information is not shown. SnackMate will not guess missing values. Products you add are marked as added by a parent."
      />
      <div className="inline-flex gap-1 rounded-full bg-cream-200 p-1" role="tablist">
        {(['new', 'mine'] as Tab[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={tab === option}
            onClick={() => setTab(option)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === option ? 'bg-white text-mint-900 shadow-soft' : 'text-ink-700 hover:text-ink-900'}`}
          >
            {option === 'new' ? 'Add new product' : 'My submitted products'}
          </button>
        ))}
      </div>
      {tab === 'new' ? (
        <div className="card p-6 sm:p-10">
          <NewProductForm userId={user.id} />
        </div>
      ) : (
        <MyProducts userId={user.id} />
      )}
    </div>
  );
}

function NewProductForm({ userId }: { userId: string }) {
  const save = async (input: ProductInput, file: File | null) => {
    const image_url = file ? await uploadProductImage(userId, file) : null;
    const created = await createProduct({ ...input, image_url });
    navigate(`/product/${created.id}`);
  };

  return <ProductForm initial={null} submitLabel="Save product" onSubmit={save} />;
}

function EditProductView({ productId, userId }: { productId: string; userId: string }) {
  const { products, loading, error, reload } = useProducts();
  const product = products.find((p) => p.id === productId) ?? null;

  if (loading) return <LoadingBlock label="Loading product..." />;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorNotice message={error} /></div>;
  if (!product || product.created_by !== userId || product.source !== 'user_submitted') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="You cannot edit this product" description="Only products you added can be edited here." action={<a href="#/add-product" className="btn-primary">Back to my products</a>} />
      </div>
    );
  }

  const save = async (input: ProductInput, file: File | null) => {
    const image_url = file ? await uploadProductImage(userId, file) : input.image_url;
    await updateProduct(product.id, { ...input, image_url });
    await reload();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Edit your product" title={`Edit ${product.name}`} description="Your changes are saved to the product catalogue as soon as you press Save." />
      <div className="card p-6 sm:p-10">
        <ProductForm initial={product} submitLabel="Save changes" onSubmit={save} onCancel={() => navigate('/add-product')} />
      </div>
    </div>
  );
}

function MyProducts({ userId }: { userId: string }) {
  const { products, loading, error, reload } = useProducts();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const mine = products.filter((p) => p.created_by === userId && p.source === 'user_submitted');

  const remove = async (id: string) => {
    setBusyId(id);
    setActionError(null);
    try {
      await deleteProduct(id);
      setConfirmingId(null);
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'The product could not be deleted. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingBlock label="Loading your products..." />;
  if (error) return <ErrorNotice message={error} />;

  if (mine.length === 0) {
    return (
      <EmptyState title="You have not added any products yet" description="Once you add a snack, it appears here and in the catalogue for other parents to find." action={<button type="button" onClick={() => navigate('/add-product')} className="btn-primary"><PlusCircle className="h-4 w-4" />Add a product</button>} />
    );
  }

  return (
    <div className="space-y-4">
      {actionError && <ErrorNotice message={actionError} />}
      {mine.map((product) => (
        <article key={product.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <ProductThumb product={product} className="h-20 w-20 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <a href={`#/product/${product.id}`} className="font-display text-lg font-semibold text-ink-900 hover:text-mint-800">{product.name}</a>
            <p className="text-sm text-ink-700">{product.brand ?? 'Brand not provided'} - {product.category}</p>
            <div className="mt-2"><SourceBadge source={product.source} /></div>
          </div>
          {confirmingId === product.id ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => remove(product.id)} disabled={busyId === product.id} className="btn-danger">
                <Trash2 className="h-4 w-4" /> {busyId === product.id ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button type="button" onClick={() => setConfirmingId(null)} className="btn-secondary">Keep it</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => navigate(`/add-product?edit=${product.id}`)} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button type="button" onClick={() => setConfirmingId(product.id)} className="btn-danger">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
