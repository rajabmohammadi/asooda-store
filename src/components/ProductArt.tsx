import type { ProductShape } from "@/data/catalog";

/**
 * Lightweight SVG pack-shot placeholder (product only, no faces).
 * Swap for real WebP photos of stock (~30–60 KB) once available.
 */
export function ProductArt({ shape, color, label, className }: { shape: ProductShape; color: string; label?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={label} className={className}>
      <defs>
        <linearGradient id={`g-${shape}-${color.slice(1)}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="106" rx="30" ry="4" fill="#000" opacity=".07" />
      <Shape shape={shape} color={color} />
      <Shape shape={shape} color={`url(#g-${shape}-${color.slice(1)})`} />
    </svg>
  );
}

function Shape({ shape, color }: { shape: ProductShape; color: string }) {
  const cap = "#2b2b2b";
  const isGloss = color.startsWith("url");
  const c = (fallback: string) => (isGloss ? color : fallback);

  switch (shape) {
    case "bottle":
      return (
        <g>
          <rect x="52" y="14" width="16" height="14" rx="2" fill={c(cap)} />
          <rect x="38" y="28" width="44" height="76" rx="10" fill={color} />
          {!isGloss && <rect x="44" y="54" width="32" height="22" rx="3" fill="#fff" opacity=".85" />}
        </g>
      );
    case "tube":
      return (
        <g>
          <path d="M40 14h40l-4 70H44Z" fill={color} />
          <rect x="46" y="84" width="28" height="20" rx="3" fill={c(cap)} />
          {!isGloss && <rect x="48" y="36" width="24" height="26" rx="3" fill="#fff" opacity=".8" />}
        </g>
      );
    case "jar":
      return (
        <g>
          <rect x="30" y="46" width="60" height="16" rx="4" fill={c(cap)} />
          <rect x="32" y="60" width="56" height="44" rx="8" fill={color} />
          {!isGloss && <rect x="42" y="72" width="36" height="16" rx="3" fill="#fff" opacity=".8" />}
        </g>
      );
    case "lipstick":
      return (
        <g>
          <path d="M50 22 70 16v26H50Z" fill={color} />
          <rect x="46" y="42" width="28" height="18" rx="2" fill={c("#c9a24a")} />
          <rect x="44" y="60" width="32" height="44" rx="4" fill={c(cap)} />
        </g>
      );
    case "compact":
      return (
        <g>
          <ellipse cx="60" cy="76" rx="38" ry="24" fill={c(cap)} />
          <ellipse cx="60" cy="72" rx="34" ry="20" fill={color} />
          {!isGloss && <ellipse cx="60" cy="72" rx="24" ry="13" fill="#fff" opacity=".25" />}
        </g>
      );
    case "pump":
      return (
        <g>
          <path d="M52 10h22v6H60v8h-8Z" fill={c(cap)} />
          <rect x="50" y="24" width="20" height="10" rx="2" fill={c(cap)} />
          <rect x="38" y="34" width="44" height="70" rx="8" fill={color} />
          {!isGloss && <rect x="45" y="56" width="30" height="22" rx="3" fill="#fff" opacity=".8" />}
        </g>
      );
    case "spray":
      return (
        <g>
          <rect x="48" y="10" width="24" height="16" rx="4" fill={c(cap)} />
          <rect x="54" y="26" width="12" height="8" fill={c("#9e9e9e")} />
          <path d="M34 50c0-10 8-16 26-16s26 6 26 16v46a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8Z" fill={color} />
          {!isGloss && <rect x="44" y="62" width="32" height="20" rx="3" fill="#fff" opacity=".75" />}
        </g>
      );
    case "pencil":
      return (
        <g transform="rotate(-35 60 60)">
          <rect x="54" y="18" width="12" height="70" rx="2" fill={color} />
          <path d="M54 88h12l-6 16Z" fill={c("#e8c9a0")} />
          <path d="M58 98h4l-2 6Z" fill={c(cap)} />
          <rect x="54" y="14" width="12" height="6" rx="1" fill={c("#bdbdbd")} />
        </g>
      );
    case "dropper":
      return (
        <g>
          <rect x="54" y="6" width="12" height="16" rx="6" fill={c(cap)} />
          <rect x="50" y="22" width="20" height="14" rx="2" fill={c("#c9a24a")} />
          <rect x="40" y="36" width="40" height="68" rx="8" fill={color} />
          {!isGloss && <rect x="46" y="58" width="28" height="22" rx="3" fill="#fff" opacity=".8" />}
        </g>
      );
    case "razor":
      return (
        <g transform="rotate(-20 60 60)">
          <rect x="36" y="14" width="48" height="16" rx="5" fill={c("#cfd8dc")} />
          <rect x="40" y="18" width="40" height="3" fill={c("#90a4ae")} />
          <rect x="54" y="30" width="12" height="74" rx="6" fill={color} />
        </g>
      );
  }
}
