import { PenLine } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 py-8">
            {/* Footer */}
            
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <PenLine className="h-5 w-5" />
              <span className="font-bold">ThoughtCloud</span>
            </div>
            
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} ThoughtCloud. All rights reserved.</div>
          </div>
        </div>
      
    </footer>
  )
}
