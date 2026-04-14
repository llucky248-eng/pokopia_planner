import pkg from "../../../package.json";

export default function Footer() {
  return (
    <footer className="relative z-10 text-center py-6 text-text-secondary text-sm">
      <p>Pokopia Planner &mdash; Plan your dream cloud island</p>
      <p className="text-xs mt-1 opacity-70">v{pkg.version}</p>
    </footer>
  );
}
