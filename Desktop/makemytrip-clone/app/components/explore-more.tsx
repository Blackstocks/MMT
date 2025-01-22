import { ChevronDown } from "lucide-react"
import Image from "next/image"

export function ExploreMore() {
  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
        <ChevronDown className="w-4 h-4" />
        <span className="text-sm font-medium">Explore More</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { title: "Where2Go", desc: "" },
          { title: "How2Go", desc: "Find routes to anywhere", badge: "new" },
          { title: "MakeMyTrip ICICI Credit Card", desc: "Never-expiring rewards & big benefits" },
          { title: "MICE", desc: "Offsites, Events & Meetings" },
          { title: "Gift Cards", desc: "" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 flex items-center gap-3 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
          >
            <Image src="/placeholder.svg" alt={item.title} width={40} height={40} className="w-10 h-10" />
            <div className="text-left">
              <div className="text-sm font-medium flex items-center gap-2">
                {item.title}
                {item.badge && (
                  <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded">{item.badge}</span>
                )}
              </div>
              {item.desc && <div className="text-xs text-gray-500">{item.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

