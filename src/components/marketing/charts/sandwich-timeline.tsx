/* Sandwich attack timeline: front-run, target, back-run on a horizontal beat. */
export function SandwichTimeline() {
  return (
    <div className="lg-card relative h-[340px] p-6">
      <div className="lg-noise" />
      <div className="relative z-[3] flex h-full flex-col">
        <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          Sandwich execution · t = 0 → 1 block
        </div>

        <svg viewBox="0 0 400 220" className="mt-3 flex-1 w-full">
          <defs>
            <linearGradient id="laneg" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,209,102,.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Lane */}
          <line x1="20" x2="380" y1="110" y2="110" stroke="url(#laneg)" strokeWidth="2" />

          {/* Time ticks */}
          {[60, 140, 220, 300, 360].map((x, i) => (
            <g key={i}>
              <line x1={x} x2={x} y1="105" y2="115" stroke="rgba(255,255,255,.2)" />
              <text x={x} y="135" textAnchor="middle" fontSize="8"
                fill="rgba(255,255,255,.4)" letterSpacing="2">
                T{i}
              </text>
            </g>
          ))}

          {/* Target tx (victim) */}
          <g>
            <rect x="190" y="74" width="60" height="22" rx="6"
              fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.35)" />
            <text x="220" y="89" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.85)">
              TARGET
            </text>
            <line x1="220" y1="96" x2="220" y2="110" stroke="rgba(255,255,255,.4)" strokeDasharray="2 2" />
          </g>

          {/* Front-run */}
          <g>
            <rect x="100" y="158" width="70" height="22" rx="6"
              fill="rgba(255,209,102,.18)" stroke="#ffd166">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
            </rect>
            <text x="135" y="173" textAnchor="middle" fontSize="9" fill="#ffd166">
              FRONT-RUN
            </text>
            <line x1="135" y1="158" x2="135" y2="110" stroke="#ffd166" strokeDasharray="3 3" opacity="0.6" />
          </g>

          {/* Back-run */}
          <g>
            <rect x="270" y="158" width="70" height="22" rx="6"
              fill="rgba(255,90,60,.18)" stroke="#ff5a3c">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin="0.6s" repeatCount="indefinite" />
            </rect>
            <text x="305" y="173" textAnchor="middle" fontSize="9" fill="#ff5a3c">
              BACK-RUN
            </text>
            <line x1="305" y1="158" x2="305" y2="110" stroke="#ff5a3c" strokeDasharray="3 3" opacity="0.6" />
          </g>

          {/* Capture arrow */}
          <path d="M135 195 Q220 215 305 195" fill="none" stroke="rgba(255,209,102,.5)" strokeWidth="1.5" strokeDasharray="4 3">
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
          </path>
          <text x="220" y="210" textAnchor="middle" fontSize="8" fill="rgba(255,209,102,.8)" letterSpacing="2">
            CAPTURED Δ
          </text>
        </svg>
      </div>
    </div>
  );
}
