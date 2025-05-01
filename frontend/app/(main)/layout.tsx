import MainNav from "@/components/common/MainNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <div className="relative h-full w-full max-w-[1440px] mx-auto">
        <MainNav />
        <main className="h-full pt-[88px]">
          {children}
        </main>
      </div>
    </div>
  );
} 