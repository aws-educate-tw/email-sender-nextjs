import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Instagram, Mail } from "lucide-react";

export default function TpetFooter() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="flex items-center mb-4">
              <a
                href="mailto:awseducate.cloudambassador@gmail.com"
                className="flex items-center gap-2 hover:text-neutral-100"
              >
                <Mail className="w-5 h-5" />
                awseducate.cloudambassador@gmail.com
              </a>
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/awseducatestdambtw?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                className="flex items-center gap-2 hover:text-neutral-100 transition duration-300"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Acknowledgments</h2>
            <p className="text-gray-300">
              We extend our heartfelt gratitude to our founding members and ambassadors for their
              invaluable contributions to our community.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AWS Educate Ambassadors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
