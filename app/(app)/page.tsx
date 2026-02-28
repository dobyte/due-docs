import Link from "next/link";
import { BorderSeparator } from "@/components/sheard";
import { TestimonialsSection } from "@/components/tweets";
import { FeatureSection } from "@/components/feature-section";
import { GalaxyBackground } from "@/components/galaxy-bg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, BookOpenIcon } from "lucide-react";

export default function Page() {
return (
		<section className="w-full">
			{/* Top Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
			>
				<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
			</div>

			<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-30">
				<GalaxyBackground />

				<Link
					className={cn(
						"relative z-10 group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
					href="/docs/framework/actor"
				>
					<RocketIcon className="size-3 text-muted-foreground" />
					<span className="text-xs">现已支持 Actor 模型！</span>
					<span className="block h-5 border-l" />

					<ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
				</Link>

				<h1
					className={cn(
						"relative z-10 fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl",
						"text-shadow-[0_0px_50px_theme(--color-foreground/.2)]"
					)}
				>
					性能，理所当然 <br/> 
				</h1>

				<p className="relative z-10 fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
					分布式游戏服务器框架 <br /> 由 Go 驱动
				</p>

				<div className="relative z-10 fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<Button className="rounded-full" size="lg" variant="secondary" asChild>
						<Link href="/docs">
							<BookOpenIcon data-icon="inline-start" />{" "}
							进一步了解
						</Link>
					</Button>
					<Button className="rounded-full" size="lg" asChild>
						<Link href="/docs/guide/quick-start">
							立即升级{" "}
							<ArrowRightIcon data-icon="inline-end" />
						</Link>
					</Button>
				</div>
			</div>

			<BorderSeparator />

			<div className="cpx py-10">
				<FeatureSection />
			</div>

			<BorderSeparator />

			<TestimonialsSection />
		</section>
	);
}
