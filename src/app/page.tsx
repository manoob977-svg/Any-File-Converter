import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <footer className="py-20 text-center text-gray-500 text-sm border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} AnyConv. Built for ultimate productivity.</p>
        </div>
      </footer>
    </main>
  );
}
