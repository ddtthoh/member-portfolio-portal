/* Animated SVG flow showing transactions falling into mempool, getting reordered, and exiting as a block. */
export function MempoolFlow() {
  const N = 8;
  return (
    <div className="lg-card relative h-[340px] p-6">
      <div className="lg-noise" />
      <div className="relative z-[3] flex h-full flex-col">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          <span>Mempool · live</span>
          <span className="text-gold">block #N+1</span>
        </div>
        <svg viewBox="0 0 400 240" className="mt-3 flex-1 w-full">
          <defs>
            <linearGradient id="txg" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#ff5a3c" />
            </linearGradient>
            <filter id="glw" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* Mempool zone */}
          <rect x="20" y="20" width="240" height="100" rx="10"
            fill="rgba(255,255,255,.02)" stroke="rgba(255,209,102,.25)" strokeDasharray="4 4" />
          <text x="30" y="38" fill="rgba(255,255,255,.5)" fontSize="9"
            letterSpacing="3" textAnchor="start">MEMPOOL</text>

          {/* Block zone */}
          <rect x="290" y="60" width="90" height="120" rx="10"
            fill="rgba(255,209,102,.06)" stroke="rgba(255,209,102,.5)" />
          <text x="335" y="78" fill="rgba(255,209,102,.85)" fontSize="9"
            letterSpacing="3" textAnchor="middle">BLOCK</text>

          {/* Animated tx particles */}
          {Array.from({ length: N }).map((_, i) => {
            const dur = 4 + (i % 3);
            const delay = (i * 0.5).toFixed(2);
            const startY = 50 + (i % 4) * 18;
            return (
              <g key={i}>
                <rect width="14" height="6" rx="2" fill="url(#txg)" filter="url(#glw)">
                  <animateMotion
                    dur={`${dur}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                    path={`M40 ${startY} Q150 ${startY - 20} 260 ${startY + 20} Q310 ${startY + 30} 335 120`}
                  />
                  <animate attributeName="opacity" values="0;1;1;0"
                    dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                </rect>
              </g>
            );
          })}

          {/* Output bars */}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i}
              x={302} y={92 + i * 14} width={66} height={6} rx="2"
              fill="url(#txg)" opacity={0.25 + i * 0.12}
            >
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur="3s"
                begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </rect>
          ))}
        </svg>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-foreground/55">
          <div><span className="text-gold">Visibility</span> mempool stream</div>
          <div><span className="text-gold">Ordering</span> gas + priority</div>
          <div><span className="text-gold">Inclusion</span> block sealed</div>
        </div>
      </div>
    </div>
  );
}
