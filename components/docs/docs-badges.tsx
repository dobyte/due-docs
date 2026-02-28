import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  DownloadIcon,
  BookOpenIcon,
  ScaleIcon,
  ShieldCheckIcon,
  PercentIcon,
  StarIcon,
  TagIcon,
  GitForkIcon,
  GitPullRequestIcon,
  CircleDotIcon,
} from "lucide-react";

type DocsBadgeItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
};

const badges: DocsBadgeItem[] = [
  {
    label: "Build Passing",
    href: "https://github.com/dobyte/due/actions",
    icon: <CheckCircleIcon />,
    variant: "default",
  },
  {
    label: "Go Reference",
    href: "https://pkg.go.dev/github.com/dobyte/due",
    icon: <BookOpenIcon />,
    variant: "secondary",
  },
  {
    label: "MIT License",
    href: "https://opensource.org/licenses/MIT",
    icon: <ScaleIcon />,
    variant: "secondary",
  },
  {
    label: "Go Report",
    href: "https://goreportcard.com/report/github.com/dobyte/due",
    icon: <ShieldCheckIcon />,
    variant: "secondary",
  },
  {
    label: "Coverage 17.4%",
    href: "https://github.com/dobyte/due",
    icon: <PercentIcon />,
    variant: "outline",
  },
  {
    label: "Awesome Go",
    href: "https://github.com/avelino/awesome-go",
    icon: <StarIcon />,
    variant: "default",
  },
  {
    label: "Release",
    href: "https://github.com/dobyte/due/releases",
    icon: <TagIcon />,
    variant: "outline",
  },
  {
    label: "Downloads",
    href: "https://github.com/dobyte/due",
    icon: <DownloadIcon />,
    variant: "outline",
  },
  {
    label: "Pull Requests",
    href: "https://github.com/dobyte/due/pulls",
    icon: <GitPullRequestIcon />,
    variant: "outline",
  },
  {
    label: "Issues",
    href: "https://github.com/dobyte/due/issues",
    icon: <CircleDotIcon />,
    variant: "outline",
  },
  {
    label: "Forks",
    href: "https://github.com/dobyte/due/network/members",
    icon: <GitForkIcon />,
    variant: "outline",
  },
  {
    label: "Stars",
    href: "https://github.com/dobyte/due/stargazers",
    icon: <StarIcon />,
    variant: "outline",
  },
];

export function DocsBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Badge key={badge.label} variant={badge.variant} asChild>
          <Link href={badge.href} target="_blank" rel="noopener noreferrer">
            {badge.icon}
            {badge.label}
          </Link>
        </Badge>
      ))}
    </div>
  );
}
