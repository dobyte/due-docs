// https://motion-primitives.com/docs/infinite-slider

import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";

type Testimonial = {
	quote: string;
	image: string;
	name: string;
	role: string;
	company?: string;
};

const testimonials: Testimonial[] = [
	{
		quote:
			"Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.",
		image: "https://github.com/shadcn.png",
		name: "Shadcn",
		role: "Founder",
		company: "Shadcn UI",
	},
	{
		quote:
			"Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.",
		image: "https://github.com/rauchg.png",
		name: "Guillermo Rauch",
		role: "CEO",
		company: "Vercel",
	},

	{
		quote:
			"I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
		image: "https://unavatar.io/x/elonmusk",
		name: "Elon Musk",
		role: "CEO",
		company: "X.com",
	},
	{
		quote:
			"We just acquired Efferd for 3 gazillion dollars. We're calling it iEfferd. It's our best product yet.",
		image: "https://unavatar.io/x/tim_cook",
		name: "Tim Cook",
		role: "CEO",
		company: "Apple",
	},
	{
		quote:
			"I'm considering shipping Efferd components with Prime delivery. 2-day shipping on beautiful UIs? Done.",
		image: "https://unavatar.io/x/JeffBezos",
		name: "Jeff Bezos",
		role: "Founder",
		company: "Amazon",
	},
	{
		quote:
			"We're rewriting OpenAI's entire frontend in Efferd. The AGI told us it's the only logical choice.",
		image: "https://unavatar.io/x/sama",
		name: "Sam Altman",
		role: "CEO",
		company: "OpenAI",
	},
	{
		quote:
			"We processed 100 petabytes of data to find the perfect UI library. The algorithm returned 'Efferd' with 99.9% confidence.",
		image: "https://unavatar.io/x/sundarpichai",
		name: "Sundar Pichai",
		role: "CEO",
		company: "Google",
	},
	{
		quote:
			"Our links might 404 sometimes, but thanks to Efferd, at least the 404 page looks absolutely stunning.",
		image: "https://github.com/steven-tey.png",
		name: "Steven Tey",
		role: "Founder",
		company: "Dub.co",
	},
	{
		quote:
			"It's so fast, I finished my UI sprint before my next meeting even started. Open source for the win.",
		image: "https://unavatar.io/x/peer_rich",
		name: "Peer Richelsen",
		role: "Co-Founder",
		company: "Cal.com",
	},
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
	return (
		<section className="relative py-10">
			<div className="mx-auto max-w-5xl">
				<div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
					<h2 className="font-bold text-3xl tracking-tighter lg:text-4xl">
						他们选择了我们
					</h2>
					<p className="text-center text-muted-foreground text-sm">
						以及，为什么
					</p>
				</div>

				<div
					className={cn(
						"mt-10 flex max-h-160 justify-center gap-6 overflow-hidden",
						"mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
					)}
				>
					<InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
						{firstColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
					<InfiniteSlider
						className="hidden md:block"
						direction="vertical"
						speed={50}
						speedOnHover={25}
					>
						{secondColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
					<InfiniteSlider
						className="hidden lg:block"
						direction="vertical"
						speed={35}
						speedOnHover={17}
					>
						{thirdColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
				</div>
			</div>
		</section>
	);
}

function TestimonialsCard({
	testimonial,
	className,
	...props
}: React.ComponentProps<"figure"> & {
	testimonial: Testimonial;
}) {
	const { quote, image, name, role, company } = testimonial;
	return (
		<figure
			className={cn(
				"w-full max-w-xs rounded-3xl border bg-card p-8 shadow-foreground/10 shadow-lg dark:bg-card/20",
				className
			)}
			{...props}
		>
			<blockquote>{quote}</blockquote>
			<figcaption className="mt-5 flex items-center gap-2">
				<Avatar className="size-8 rounded-full">
					<AvatarImage alt={`${name}'s profile picture`} src={image} />
					<AvatarFallback>{name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<cite className="font-medium not-italic leading-5 tracking-tight">
						{name}
					</cite>
					<span className="text-muted-foreground text-sm leading-5 tracking-tight">
						{role} {company && `, ${company}`}
					</span>
				</div>
			</figcaption>
		</figure>
	);
}
