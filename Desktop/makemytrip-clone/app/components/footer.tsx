import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const footerLinks = {
    support: [
      { title: "Forum support", href: "#" },
      { title: "Help Center", href: "#" },
      { title: "Live chat", href: "#" },
      { title: "How it works", href: "#" },
      { title: "Security", href: "#" },
      { title: "Privacy", href: "#" },
      { title: "Charges logs", href: "#" },
    ],
    company: [
      { title: "About Us", href: "#" },
      { title: "Community Blog", href: "#" },
      { title: "Jobs and Careers", href: "#" },
      { title: "Contact Us", href: "#" },
      { title: "Our Awards", href: "#" },
      { title: "Agencies", href: "#" },
    ],
    services: [
      { title: "Tour Guide", href: "#" },
      { title: "Tour Booking", href: "#" },
      { title: "Hotel Booking", href: "#" },
      { title: "Ticket Booking", href: "#" },
      { title: "Rental Services", href: "#" },
    ],
    legal: [
      { title: "Terms of Service", href: "#" },
      { title: "Privacy Policy", href: "#" },
      { title: "Cookies Policy", href: "#" },
      { title: "Data Processing", href: "#" },
      { title: "Data Policy", href: "#" },
      { title: "Refund Policy", href: "#" },
    ],
  }

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Top Bar with Logo and Phone */}
        <div className="flex justify-between items-center pb-12 border-b border-gray-800">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%201.33.34%E2%80%AFAM-hgsAvQr4Sm6c1nMLHLoIrDiulYc5Ct.png"
            alt="Easy2Trip"
            width={180}
            height={60}
            className="h-15"
          />
          <div className="flex items-center gap-2">
            <span>Need help? Call us</span>
            <span className="text-[#FFB700] text-xl font-bold">1-800-222-8888</span>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-5 gap-8 py-12">
          {/* Contact Us Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4 text-gray-400">
              <p>4517 Washington Ave. Manchester, Kentucky 39495</p>
              <p>Hours: 8:00 - 17:00, Mon - Sat</p>
              <p>support@travila.com</p>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Follow us</h4>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-red-500">
                  <Instagram className="w-6 h-6" />
                </Link>
                <Link href="#" className="hover:text-red-500">
                  <Facebook className="w-6 h-6" />
                </Link>
                <Link href="#" className="hover:text-red-500">
                  <Twitter className="w-6 h-6" />
                </Link>
                <Link href="#" className="hover:text-red-500">
                  <Youtube className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-400 hover:text-red-500">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-400 hover:text-red-500">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-400 hover:text-red-500">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-gray-400 hover:text-red-500">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400">
          <p>© 2025 Travila Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-red-500">
              Terms
            </Link>
            <Link href="#" className="hover:text-red-500">
              Privacy policy
            </Link>
            <Link href="#" className="hover:text-red-500">
              Legal notice
            </Link>
            <Link href="#" className="hover:text-red-500">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

