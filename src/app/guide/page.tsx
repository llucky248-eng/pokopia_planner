"use client";

import { useState } from "react";
import { GUIDE_SECTIONS } from "@/data/guide-data";
import Card from "@/components/ui/Card";

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState(GUIDE_SECTIONS[0].id);
  const section = GUIDE_SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-sky-deep mb-2">Pokopia Guide</h1>
      <p className="text-sm text-text-secondary mb-6">
        Everything you need to know about building your dream island.
        Data sourced from Serebii, Nintendo Life, and community guides.
      </p>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GUIDE_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeSection === s.id
                ? "bg-sky-deep text-white shadow-md"
                : "bg-surface text-text-secondary hover:bg-cloud-soft shadow"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">{section.icon}</span>
          <h2 className="text-xl font-bold text-sky-deep">{section.title}</h2>
        </div>
        {section.content.map((entry, i) => (
          <Card key={i} className="hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-text-primary mb-2">{entry.heading}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{entry.text}</p>
          </Card>
        ))}
      </div>

      {/* Sources */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-bold text-text-secondary mb-2">Sources</h3>
        <ul className="text-xs text-text-secondary space-y-1">
          <li>Serebii.net &mdash; Pokemon Pokopia Cloud Islands, Habitats, Building Kits</li>
          <li>Nintendo Life &mdash; Walkthrough, Tips &amp; Tricks, Dream Island Guide</li>
          <li>Nintendo Support &mdash; Official Cloud Island Guide</li>
          <li>Game8 &mdash; Cloud Island Guide, Habitat Dex, Beginner&apos;s Guide</li>
          <li>Screen Rant &mdash; Beginner Tips, Materials Guide</li>
          <li>Community guides &mdash; PokopiaCenter, PokopiaHabitats, Dexerto</li>
        </ul>
      </div>
    </div>
  );
}
