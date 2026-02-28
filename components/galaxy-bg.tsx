"use client";

import dynamic from "next/dynamic";

const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

export function GalaxyBackground() {
	return (
		<>
			<div className="pointer-events-none absolute inset-0 overflow-hidden dark:hidden">
<LiquidEther
  colors={["#F0F9FF", "#E0F2FE", "#BAE6FD"]}
  autoDemo
  autoSpeed={0.28}
  autoIntensity={1.3}
  mouseForce={14}
  resolution={0.6}
/>
			</div>
			<div className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
				<Galaxy transparent />
			</div>
		</>
	);
}
