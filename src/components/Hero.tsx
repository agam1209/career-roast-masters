import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-toxic/40 bg-toxic/5 text-toxic text-xs font-mono mb-6">
            <span className="size-2 rounded-full bg-toxic animate-pulse" />
            FURNACE STATUS: HOT — 12,847 résumés cremated this week
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
            Your career is{" "}
            <span className="inline-block animate-glitch text-gradient-hero">a joke.</span>
            <br />
            <span className="text-foreground/90">Let us write the </span>
            <span className="text-toxic">punchline.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Drop in your résumé, portfolio, or cringe LinkedIn post. Our cynical, world-class AI
            headhunter — with a PhD in sarcasm and zero patience — will incinerate it on demand.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
