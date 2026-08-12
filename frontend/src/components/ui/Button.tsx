import type { HTMLAttributes, ReactNode } from 'react'

type ButtonProps = {
  variant?: 'primary' | 'ghost'
  as?: 'button' | 'a'
  href?: string
  type?: 'button' | 'submit' | 'reset'
  target?: string
  rel?: string
  disabled?: boolean
  children: ReactNode
} & HTMLAttributes<HTMLElement>

const base =
  'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-primary focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  ghost: 'bg-transparent text-ink border border-line hover:bg-line/40',
}

export function Button({
  variant = 'primary',
  as = 'button',
  href,
  type = 'button',
  target,
  rel,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim()

  if (as === 'a') {
    return (
      <a href={href} target={target} rel={rel} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
