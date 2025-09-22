import { LandingPage } from "../components/LandingPage";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <LandingPage />
    </div>
  );
}
