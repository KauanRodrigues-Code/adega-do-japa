export default function SectionHead({ kicker, lines, accent, text, children }: { kicker: string; lines: [string, string]; accent?: 0 | 1; text: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[.25em] text-japa-orange">{kicker}</p>
      <h2 className="mt-3 text-[clamp(2.4rem,9vw,4.5rem)] font-normal uppercase leading-[.95]">
        <span className={accent === 0 ? "text-japa-gold" : ""}>{lines[0]}</span><br />
        <span className={accent === 1 ? "text-japa-gold" : ""}>{lines[1]}</span>
      </h2>
      <p className="mt-4 max-w-md text-white/70">{text}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
