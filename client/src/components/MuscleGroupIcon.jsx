const ICONS = {
  CHEST: (
    <>
      <rect x="20" y="44" width="24" height="6" rx="2" fill="currentColor" />
      <rect x="22" y="50" width="3" height="8" fill="currentColor" />
      <rect x="39" y="50" width="3" height="8" fill="currentColor" />
      <rect x="16" y="26" width="32" height="6" rx="2" fill="currentColor" />
      <rect x="8" y="20" width="6" height="18" rx="2" fill="currentColor" />
      <rect x="2" y="24" width="5" height="10" rx="1.5" fill="currentColor" />
      <rect x="50" y="20" width="6" height="18" rx="2" fill="currentColor" />
      <rect x="57" y="24" width="5" height="10" rx="1.5" fill="currentColor" />
    </>
  ),
  BACK: (
    <>
      <path
        d="M12 20 L32 28 L52 20"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="32" y1="28" x2="32" y2="44" stroke="currentColor" strokeWidth="4" />
      <rect x="24" y="46" width="16" height="14" rx="2" fill="currentColor" />
    </>
  ),
  SHOULDERS: (
    <>
      <rect x="16" y="8" width="32" height="6" rx="2" fill="currentColor" />
      <rect x="8" y="4" width="6" height="14" rx="2" fill="currentColor" />
      <rect x="50" y="4" width="6" height="14" rx="2" fill="currentColor" />
      <path
        d="M24 42 L19 14"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 42 L45 14"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="24" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="50" r="5" fill="currentColor" />
      <line x1="32" y1="55" x2="32" y2="60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  BICEPS: (
    <>
      <line x1="20" y1="44" x2="44" y2="20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="18" cy="46" r="8" fill="currentColor" />
      <circle cx="46" cy="18" r="8" fill="currentColor" />
    </>
  ),
  TRICEPS: (
    <>
      <line x1="22" y1="16" x2="42" y2="16" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="16" x2="32" y2="36" stroke="currentColor" strokeWidth="4" />
      <path
        d="M22 34 L32 48 L42 34"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  LEGS: (
    <>
      <rect x="16" y="12" width="32" height="6" rx="2" fill="currentColor" />
      <rect x="8" y="8" width="6" height="14" rx="2" fill="currentColor" />
      <rect x="50" y="8" width="6" height="14" rx="2" fill="currentColor" />
      <line x1="32" y1="18" x2="32" y2="38" stroke="currentColor" strokeWidth="5" />
      <path
        d="M26 38 L22 49 L26 60"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M38 38 L42 49 L38 60"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  CORE: (
    <>
      <circle cx="14" cy="30" r="5" fill="currentColor" />
      <line x1="19" y1="32" x2="46" y2="32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="19" y1="32" x2="17" y2="44" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="46" y1="32" x2="50" y2="46" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  CARDIO: (
    <>
      <path
        d="M32 46 C20 36, 12 28, 16 18 C19 10, 28 10, 32 18 C36 10, 45 10, 48 18 C52 28, 44 36, 32 46 Z"
        fill="currentColor"
      />
      <path
        d="M14 30 L22 30 L26 22 L32 38 L36 26 L40 30 L50 30"
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  FULL_BODY: (
    <>
      <circle cx="32" cy="14" r="6" fill="currentColor" />
      <line x1="32" y1="20" x2="32" y2="38" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="24" x2="14" y2="10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="24" x2="50" y2="10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="38" x2="16" y2="56" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="38" x2="48" y2="56" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  OTHER: (
    <>
      <rect x="20" y="29" width="24" height="6" rx="2" fill="currentColor" />
      <circle cx="16" cy="32" r="9" fill="currentColor" />
      <circle cx="48" cy="32" r="9" fill="currentColor" />
    </>
  ),
};

export default function MuscleGroupIcon({ muscleGroup, className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {ICONS[muscleGroup] ?? ICONS.OTHER}
    </svg>
  );
}
