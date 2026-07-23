export default function Logo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="10" y="13" width="12" height="6" rx="2" fill="currentColor" />
      <rect x="6" y="9" width="5" height="14" rx="2" fill="currentColor" />
      <rect x="1" y="12" width="4" height="8" rx="1.5" fill="currentColor" />
      <rect x="21" y="9" width="5" height="14" rx="2" fill="currentColor" />
      <rect x="27" y="12" width="4" height="8" rx="1.5" fill="currentColor" />
    </svg>
  );
}
