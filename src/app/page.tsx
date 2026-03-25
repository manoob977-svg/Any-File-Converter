import Navbar from "@/components/Navbar";
import DashMain2D from "@/components/DashMain2D";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden flex flex-col bg-[#fcfcfd]">
      <Navbar />
      <div className="flex-1 relative">
        <DashMain2D />
      </div>
    </main>
  );
}
