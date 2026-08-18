const ICON_PATHS = {
  galleries: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <circle cx="16.5" cy="8" r="1.2" />
      <path d="m6.5 16 4-4 3 3 2.5-2.5 2 2" />
    </>
  ),
  fame: <path d="m12 2.8 2.72 5.51 6.08.88-4.4 4.29 1.04 6.05L12 16.67l-5.44 2.86 1.04-6.05-4.4-4.29 6.08-.88z" />,
};

export default function MuseumNavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}
