export function Avatar({ text }: { text: string }) {
  return (
    <span className="avatar" aria-hidden>
      {text}
    </span>
  );
}
