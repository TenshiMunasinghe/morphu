<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "inline-flex shrink-0 items-center justify-center gap-2 rounded-base border-2 border-border text-sm font-base whitespace-nowrap transition-all outline-none shadow-shadow disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground',
				destructive: 'bg-destructive text-white',
				outline: 'bg-secondary-background text-foreground',
				secondary: 'bg-secondary-background text-foreground',
				ghost: 'border-transparent shadow-none hover:bg-secondary-background hover:border-border hover:shadow-shadow',
				link: 'border-transparent shadow-none text-primary underline-offset-4 hover:underline hover:translate-x-0 hover:translate-y-0'
			},
			size: {
				default: 'h-10 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-9 gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-11 px-6 has-[>svg]:px-4',
				icon: 'size-10',
				'icon-sm': 'size-9',
				'icon-lg': 'size-11'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
