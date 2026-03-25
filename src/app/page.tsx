import Navbar from "@/components/Navbar";
import DashMain from "@/components/DashMain";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden flex flex-col bg-black">
      <Navbar />
      <div className="flex-1 relative">
        <DashMain />
      </div>
    </main>
  );
}
