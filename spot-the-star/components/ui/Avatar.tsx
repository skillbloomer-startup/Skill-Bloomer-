import type { Avatar as A } from "@/lib/types";

const SKIN = ["#f6d7c3", "#eac0a0", "#d49a72", "#b47a51", "#8d5a3b", "#5e3a26"];
const HAIR = ["#1b1410", "#4a2f1d", "#8a5a2b", "#b8892f", "#9aa0a6", "#c2410c"];
const BG = ["#22e4ff", "#8b5cff", "#ff3ea5", "#b6ff3b", "#ffb020", "#38bdf8"];

/** Procedural, illustrated avatar — intentionally not a photo. */
export default function Avatar({ a, size = 64, blind = false, label }: { a: A; size?: number; blind?: boolean; label?: string }) {
  const id = `av${a.skin}${a.hair}${a.bg}${size}`;
  if (blind)
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label ?? "Anonymous candidate"}>
        <rect width="100" height="100" rx="50" fill="#1a1e3d" />
        <circle cx="50" cy="40" r="17" fill="#3a3f6b" />
        <path d="M18 92c4-20 18-28 32-28s28 8 32 28" fill="#3a3f6b" />
        <text x="50" y="47" textAnchor="middle" fontSize="18" fill="#9aa3c7" fontFamily="monospace">?</text>
      </svg>
    );
  const skin = SKIN[a.skin % 6];
  const hair = HAIR[a.hairColor % 6];
  const bg = BG[a.bg % 6];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label ?? "Illustrated avatar"}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg} stopOpacity=".9" />
          <stop offset="1" stopColor="#11142b" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="100" height="100" fill={`url(#${id})`} />
        {/* back hair */}
        {(a.hair === "long" || a.hair === "wavy") && <path d="M24 44c0-22 52-22 52 0v34H24z" fill={hair} />}
        {a.hair === "hijab" && <path d="M20 50c0-30 60-30 60 0v50H20z" fill={BG[(a.bg + 2) % 6]} opacity=".95" />}
        {/* shoulders */}
        <path d="M14 104c4-22 20-30 36-30s32 8 36 30" fill="#1f2448" />
        <path d="M40 74h20v8c0 4-20 4-20 0z" fill={skin} />
        {/* head */}
        <ellipse cx="50" cy="47" rx="18" ry="21" fill={skin} />
        {a.hair === "hijab" && <path d="M30 42c2-18 38-18 40 0-4-8-12-12-20-12s-16 4-20 12z" fill={BG[(a.bg + 2) % 6]} />}
        {/* front hair */}
        {a.hair === "short" && <path d="M32 42c0-16 36-18 36 0-6-6-12-8-18-8s-12 2-18 8z" fill={hair} />}
        {a.hair === "long" && <path d="M31 46c-1-20 39-22 38 0-6-10-14-12-19-12s-13 2-19 12z" fill={hair} />}
        {a.hair === "wavy" && <path d="M31 44c0-18 38-20 38 0-4-4-8-6-10-3-3-4-8-5-10-2-3-3-8-3-10 0-3-2-6 0-8 5z" fill={hair} />}
        {a.hair === "curly" && (
          <g fill={hair}>
            {[34, 41, 48, 55, 62, 66, 31].map((x, i) => (
              <circle key={i} cx={x} cy={i === 5 || i === 6 ? 40 : 30 + (i % 2) * 2} r="7" />
            ))}
          </g>
        )}
        {a.hair === "bun" && (
          <g fill={hair}>
            <circle cx="50" cy="22" r="8" />
            <path d="M32 44c0-18 36-18 36 0-6-8-12-10-18-10s-12 2-18 10z" />
          </g>
        )}
        {a.hair === "turban" && <path d="M30 40c0-20 40-20 40 0 0 4-4 2-20 2s-20 2-20-2z M44 26l12 0 -6 8z" fill={BG[(a.bg + 1) % 6]} />}
        {/* face */}
        <circle cx="43" cy="49" r="1.8" fill="#11142b" />
        <circle cx="57" cy="49" r="1.8" fill="#11142b" />
        <path d="M44 58c3 3 9 3 12 0" stroke="#11142b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {a.accessory === "glasses" && (
          <g stroke="#11142b" strokeWidth="1.6" fill="none">
            <circle cx="43" cy="49" r="5" />
            <circle cx="57" cy="49" r="5" />
            <path d="M48 49h4" />
          </g>
        )}
        {a.accessory === "beard" && <path d="M34 54c2 14 10 18 16 18s14-4 16-18c-4 6-10 8-16 8s-12-2-16-8z" fill={hair} opacity=".9" />}
        {a.accessory === "earrings" && (
          <g fill="#ffb020">
            <circle cx="32" cy="56" r="2" />
            <circle cx="68" cy="56" r="2" />
          </g>
        )}
      </g>
    </svg>
  );
}
