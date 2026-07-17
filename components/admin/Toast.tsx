'use client';

export default function Toast({ message }: { message: { text: string; error?: boolean } | null }) {
  return (
    <div className={`a-toast${message ? ' show' : ''}${message?.error ? ' error' : ''}`}>
      {message?.text || ''}
    </div>
  );
}
