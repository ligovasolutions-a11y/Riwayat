'use client';

const RULES: { test: (pw: string) => boolean; label: string }[] = [
  { test: (pw) => pw.length >= 12, label: 'At least 12 characters' },
  { test: (pw) => /[a-z]/.test(pw), label: 'A lowercase letter' },
  { test: (pw) => /[A-Z]/.test(pw), label: 'An uppercase letter' },
  { test: (pw) => /[0-9]/.test(pw), label: 'A number' },
  { test: (pw) => /[^a-zA-Z0-9]/.test(pw), label: 'A symbol' },
];

export function isPasswordStrong(pw: string): boolean {
  return RULES.every((r) => r.test(pw));
}

export default function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="a-pw-rules">
      {RULES.map((r, i) => (
        <li key={i} className={r.test(password) ? 'ok' : ''}>{r.test(password) ? '✓' : '—'} {r.label}</li>
      ))}
    </ul>
  );
}
