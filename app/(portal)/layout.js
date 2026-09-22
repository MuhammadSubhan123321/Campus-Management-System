import Sidebar from "@/components/Sidebar";
import AIChat from "@/components/AIChat";

export default function PortalLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>

      <AIChat />
    </div>
  );
}