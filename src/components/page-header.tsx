import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: ReactNode; description?: string; actions?: ReactNode }) {
  return (
    <div className="liquid-glass mb-5 flex flex-col gap-2 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-gold"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-serif text-xl font-semibold leading-tight tracking-tight text-gold break-words sm:text-2xl md:text-[28px]"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gold/70"
          >
            {description}
          </motion.p>
        )}
      </div>
      {actions}
    </div>
  );
}
