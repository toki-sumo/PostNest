import Image from 'next/image';
import { signIn } from 'next-auth/react';
import React from 'react';

type Provider = 'google' | 'github';

interface OAuthButtonProps {
  provider: Provider;
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

export default function OAuthButton({ provider }: OAuthButtonProps) {
  const config = providerConfig[provider];

  return (
    <button
      onClick={() => signIn(provider, { callbackUrl: "/dashboard" })}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2"
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
