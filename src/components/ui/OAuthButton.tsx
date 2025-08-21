import Image from 'next/image';
import { signIn } from 'next-auth/react';
import React from 'react';

type Provider = 'google' | 'github';

interface OAuthButtonProps {
  provider: Provider;
  className?: string;
}

const providerConfig = {
  google: {
    label: 'Sign in with Google',
    logo: '/google-logo.svg',
  },
  github: {
    label: 'Sign in with GitHub',
    logo: '/github-mark.svg',
  },
};

export default function OAuthButton({ provider, className = '' }: OAuthButtonProps) {
  const config = providerConfig[provider];

  return (
    <button
      onClick={() => signIn(provider, { callbackUrl: "/dashboard" })}
      className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 border bg-[var(--card)] border-[var(--border)] text-[var(--text)] hover:border-[var(--card-hover-border)] ${className}`}
    >
      <Image
        src={config.logo}
        alt={`${provider} logo`}
        width={20}
        height={20}
      />
      <span className="text-sm font-medium">{config.label}</span>
    </button>
  );
}
