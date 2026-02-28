import { ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface PromoBanner1Props {
  className?: string;
}

const PromoBanner1 = ({ className }: PromoBanner1Props) => {
  return (
    <div
      className={cn("w-full text-white", className)}
      style={{ background: "var(--promo-banner)" }}
    >
      <a
        href="https://github.com/dobyte/due-doudizhu-desc"
        target="_blank"
        rel="noopener noreferrer"
        className="container flex items-center justify-center gap-2 py-2 text-sm transition-opacity hover:opacity-80"
      >
        <Sparkles className="size-4 shrink-0" />
        <p>
          <span className="font-semibold"></span>
          <span>基于 due - 商业级斗地主游戏服务器实战项目 - check it out!</span>
        </p>
        <ArrowRight className="size-4 shrink-0" />
      </a>
    </div>
  );
};

export { PromoBanner1 };
