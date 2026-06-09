export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
}

