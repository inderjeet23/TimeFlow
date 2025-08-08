
import Link from 'next/link'

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Upgrade Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8">Welcome to the Pro plan. You can now create unlimited invoices.</p>
        <Link href="/" className="btn-primary">
          Back to Invoice Generator
        </Link>
      </div>
    </div>
  )
}
