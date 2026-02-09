import { Sidebar } from "@/components/layout/sidebar";
import { ToastProvider } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="bg-[#f5f6f8] flex h-screen overflow-hidden relative">
        {/* Decorative background blobs for liquid glass */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-100/25 blur-3xl" />
        </div>
        <Sidebar />
        <main className="flex-1 overflow-hidden relative z-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
