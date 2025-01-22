import { ChevronDown, User } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-red-600 py-4">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Image src="/placeholder.svg" alt="MakeMyTrip" width={120} height={36} className="h-9 w-auto" />

          {/* Center Navigation */}
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="text-white text-sm gap-2 hover:bg-red-700">
              <Image src="/placeholder.svg" alt="Property" width={20} height={20} className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">List Your Property</div>
                <div className="text-xs opacity-80">Grow your business!</div>
              </div>
            </Button>
            <Button variant="ghost" className="text-white text-sm gap-2 hover:bg-red-700">
              <Image src="/placeholder.svg" alt="myBiz" width={20} height={20} className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Introducing myBiz</div>
                <div className="text-xs opacity-80">Business Travel Solution</div>
              </div>
            </Button>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white text-sm gap-1 hover:bg-red-700">
              <Image src="/placeholder.svg" alt="Trips" width={16} height={16} className="w-4 h-4" />
              My Trips
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-white text-sm gap-1 hover:bg-red-700">
              <div className="w-5 h-5 rounded-full bg-red-300 flex items-center justify-center text-xs">T</div>
              Hi Traveller
              <ChevronDown className="w-4 h-4" />
            </Button>
            <select className="bg-transparent text-white text-sm border-none">
              <option>IN | ENG</option>
            </select>
            <select className="bg-transparent text-white text-sm border-none">
              <option>INR</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}

