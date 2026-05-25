export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-headline-md font-bold text-stitch-primary">Nearlooc</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Discover the best deals near you
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant">
          {children}
        </div>
      </div>
    </main>
  );
}
