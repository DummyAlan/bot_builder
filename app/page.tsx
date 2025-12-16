import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <main className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 
              className="text-5xl font-bold text-[#22d3ee] mb-4"
              style={{ textShadow: '0 0 30px rgba(34, 211, 238, 0.6)' }}
            >
              Shipping Instruction Portal
            </h1>
            <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
              Streamline your shipping documentation process with automated PDF extraction 
              and intelligent data processing
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#18181b] border border-[#22d3ee]/20 rounded-xl p-6 hover:border-[#22d3ee]/40 transition-all">
              <div className="text-[#22d3ee] text-3xl mb-3">📄</div>
              <h3 className="text-lg font-semibold text-[#fafafa] mb-2">PDF Upload</h3>
              <p className="text-sm text-[#a1a1aa]">
                Drag and drop your shipping instruction PDFs for instant processing
              </p>
            </div>
            
            <div className="bg-[#18181b] border border-[#a855f7]/20 rounded-xl p-6 hover:border-[#a855f7]/40 transition-all">
              <div className="text-[#a855f7] text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Auto Extract</h3>
              <p className="text-sm text-[#a1a1aa]">
                AI-powered extraction of shipping data from standard formats
              </p>
            </div>
            
            <div className="bg-[#18181b] border border-[#22c55e]/20 rounded-xl p-6 hover:border-[#22c55e]/40 transition-all">
              <div className="text-[#22c55e] text-3xl mb-3">✓</div>
              <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Validate & Submit</h3>
              <p className="text-sm text-[#a1a1aa]">
                Review, edit, and submit validated data to IRIS API
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Link 
              href="/si-upload"
              className="inline-block px-8 py-4 bg-[#22d3ee] text-[#000000] text-lg font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#22d3ee]/50"
            >
              Upload Shipping Instruction →
            </Link>
          </div>

          {/* Info Section */}
          <div className="mt-16 text-sm text-[#a1a1aa]">
            <p>
              Powered by Next.js 15 with AI-driven document processing
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
