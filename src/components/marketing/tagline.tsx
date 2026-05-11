/* Tagline component: characters reveal letter-by-letter using lg-tagline. */
export function Tagline({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="lg-tagline-letter"
          style={{
            animationDelay: `${0.6 + i * 0.025}s`,
            whiteSpace: ch === " " ? "pre" : undefined,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
