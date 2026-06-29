"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import type { CuratedImage } from "@/lib/images";

export type Article = {
  title: string;
  excerpt: string;
  category: string;
  tone: "primary" | "accent" | "success" | "warning";
  author: string;
  date: string;
  readingTime: number;
  image: CuratedImage;
};

/** Artículo destacado con parallax muy ligero en la imagen al hacer scroll. */
export function FeaturedArticle({ article }: { article: Article }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-9%", "9%"]);

  return (
    <Link
      ref={ref}
      href="#"
      className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
    >
      {/* Capa de imagen sobredimensionada para el parallax. */}
      <motion.div className="absolute inset-x-0 -inset-y-[9%]" style={{ y }}>
        <SmartImage
          image={article.image}
          sizes="(max-width: 1024px) 100vw, 66vw"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
      <span className="absolute left-5 top-5">
        <Badge tone={article.tone}>{article.category}</Badge>
      </span>

      <div className="relative z-10 p-6 text-white sm:p-8">
        <h3 className="max-w-2xl text-balance font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-on-photo sm:text-3xl">
          {article.title}
        </h3>
        <p className="mt-2 max-w-xl text-pretty text-sm text-white/85">{article.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
          <span className="font-medium text-white">{article.author}</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {article.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTime} min
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-white">
            Leer artículo
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
