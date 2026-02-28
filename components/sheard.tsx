import React from "react";
import { cn } from "@/lib/utils";

export function BorderSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "-translate-x-1/2 pointer-events-none absolute left-1/2 w-screen border-t border-dashed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DashedLines({
  width = 20,
  height = 50,
  x = 10,
  className,
  ...props
}: React.ComponentProps<"svg">) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none size-full stroke-border", className)}
      {...props}
    >
      <pattern
        height={height}
        id={id}
        patternUnits="userSpaceOnUse"
        width={width}
        x={x}
      >
        <path d={`M.5 0 V${height}`} fill="none" strokeDasharray={2.5} />
      </pattern>
      <rect fill={`url(#${id})`} height="100%" strokeWidth={0} width="100%" />
    </svg>
  );
}

export type LinkItemType = {
	label: string;
	href: string;
	icon: React.ReactNode;
	description?: string;
};

export function LinkItem({
	label,
	description,
	icon,
	className,
	href,
	...props
}: React.ComponentProps<"a"> & LinkItemType) {
	return (
		<a
			className={cn("flex items-center gap-x-2", className)}
			href={href}
			{...props}
		>
			<div
				className={cn(
					"flex aspect-square size-12 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
					"[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='size-'])]:text-foreground"
				)}
			>
				{icon}
			</div>
			<div className="flex flex-col items-start justify-center">
				<span className="font-medium">{label}</span>
				<span className="line-clamp-2 text-muted-foreground text-xs">
					{description}
				</span>
			</div>
		</a>
	);
}
