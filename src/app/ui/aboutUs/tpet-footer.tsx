import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function TpetFooter() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              <a href="mailto:devteam@awseducate.com" className="text-blue-400 hover:underline">
                devteam@awseducate.com
              </a>
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition duration-300"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/yourprofile"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition duration-300"
              >
                LinkedIn
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
