import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/logo.svg" alt="Nearlooc" width={160} height={41} priority />
          <p className="mt-3 text-body-sm text-on-surface-variant text-center">
            Discover the best deals near you
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant sm:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
