import { useEffect, useState } from 'react'
import Button from '../../../components/ui/Button'
import { copyText } from '../../../lib/format'

export default function CopyButton({ text, variant = 'secondary', className = '' }: { text: string; variant?: 'primary' | 'secondary' | 'ghost'; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 1800)
    return () => clearTimeout(t)
  }, [state])

  async function handle() {
    try {
      await copyText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <>
      <Button variant={variant} onClick={handle} className={className}>
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
      </Button>
      <span className="sr-only" role="status">{state === 'copied' ? 'Prompt copied to clipboard' : state === 'failed' ? 'Copy failed' : ''}</span>
    </>
  )
}
