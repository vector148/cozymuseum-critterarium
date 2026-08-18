const ICON_PATHS = {
  hall: (
    <>
      <path d="m3 8 9-5 9 5M3 9h18M2.5 21h19M5 9v9M9.5 9v9M14.5 9v9M19 9v9M4 18h16" />
    </>
  ),
  reading: (
    <>
      <path d="M3.5 5.5c3.2-.8 5.8.1 8.5 2.2v12c-2.7-2.1-5.3-3-8.5-2.2z" />
      <path d="M20.5 5.5c-3.2-.8-5.8.1-8.5 2.2v12c2.7-2.1 5.3-3 8.5-2.2z" />
    </>
  ),
  galleries: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <circle cx="16.5" cy="8" r="1.2" />
      <path d="m6.5 16 4-4 3 3 2.5-2.5 2 2" />
    </>
  ),
  fame: (
    <>
      <path d="m12 2.8 2.72 5.51 6.08.88-4.4 4.29 1.04 6.05L12 16.67l-5.44 2.86 1.04-6.05-4.4-4.29 6.08-.88z" />
    </>
  ),
  curatale: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
};

export default function MuseumNavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}
