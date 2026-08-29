"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) =>
        setLanguage(e.target.value as "en" | "hy" | "ru")
      }
      className="
        w-full
        rounded-2xl
        border border-white/10
        bg-white/5
        px-4 py-3
        text-sm text-slate-300
        outline-none
        transition
        hover:bg-white/10
      "
    >
      <option className="bg-slate-900" value="en">
        🇬🇧 English
      </option>

      <option className="bg-slate-900" value="hy">
        🇦🇲 Հայերեն
      </option>

      <option className="bg-slate-900" value="ru">
        🇷🇺 Русский
      </option>
    </select>
  );
}