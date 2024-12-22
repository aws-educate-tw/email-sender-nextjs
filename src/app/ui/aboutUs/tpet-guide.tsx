import { ArrowDownTrayIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export default function TpetGuide() {
  return (
    <section id="tpet-guide" className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">How to use TPET?</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Overview of TPET</h3>
          <p className="text-lg text-gray-700 mb-4">
            TPET (Tailored Participation and Event Tool) automates custom email campaigns for
            events, including:
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {[
              "Registration confirmations",
              "Attendance verification",
              "Event reminders",
              "Certificates of participation",
            ].map((item, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-lg text-gray-700 mt-4">
            TPET reduces manual workload by 80%, saving significant time and cost.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Getting Started with TPET</h3>
          <ol className="list-decimal pl-5 text-lg text-gray-700 space-y-2">
            <li>Access the platform.</li>
            <li>Upload participant data.</li>
            <li>Customize templates and send emails.</li>
          </ol>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Resources</h3>
          <div className="flex space-x-4">
            <a
              href="/path-to-pdf"
              target="_blank"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Download PDF Guide
            </a>
            <a
              href="https://notion.so/link-to-page"
              target="_blank"
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Access Notion Page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
