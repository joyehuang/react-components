'use client'

import { useState } from 'react'

type CopyButtonProps = {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="copy-button absolute right-3 top-3"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
