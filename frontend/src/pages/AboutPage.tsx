import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">About Tracktion</h1>
      <p className="text-xl mb-8">Your personal habit tracking assistant</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  )
}

