const PUBLIC_VITE_KEYS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_ANON_KEY",
];

export function loadVitePublicEnvironment(root = process.cwd(), baseEnvironment = process.env) {
  const environment = {};
  for (const key of PUBLIC_VITE_KEYS) {
    const value = baseEnvironment[key];
    if (value) environment[key] = value;
  }
  return environment;
}
