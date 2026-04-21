'use client'

import { Input } from '@/components/ui/input'

type DisplayNameFormProps = {
  value: string
  onChange: (name: string) => void
}

export default function DisplayNameForm({ value, onChange }: DisplayNameFormProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Display Name</h3>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
