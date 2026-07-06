import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
	"inline-flex items-center rounded-full px-[22px] py-[7px] font-bold text-body-sm tracking-[0.02em]",
	{
		variants: {
			variant: {
				solid: "bg-brand text-white",
				outline: "border-[1.5px] border-brand text-brand",
				mint: "bg-mint-100 text-mint-800",
				soft: "bg-brand-50 text-brand-700",
				ghost: "border border-white/40 bg-white/10 text-white",
			},
		},
		defaultVariants: { variant: "solid" },
	},
);

export const Badge = ({
	variant,
	className,
	...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) => (
	<span className={cn(badgeVariants({ variant }), className)} {...props} />
);
