import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: ReactNode; description?: string; actions?: ReactNode }) {
  return (
    <div className="liquid-glass mb-6 flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-2 text-[10px] uppercase tracking-[0.25em] text-gold"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-serif text-3xl font-semibold md:text-4xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2 max-w-2xl text-sm text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>
      {actions}
    </div>
  );
}
