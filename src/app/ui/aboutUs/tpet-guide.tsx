import { Download, BookOpenText } from "lucide-react";
import { Mail, Calendar, Bell, Award } from "lucide-react";

export default function TpetGuide() {
  return (
    <section id="tpet-guide" className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">How to use TPET?</h2>
      <div className="space-y-8">
        {/* Overview Section */}
        <div>
          <h3 className="text-2xl font-semibold text-sky-950">Overview of TPET</h3>
          <p className="text-lg text-gray-700 my-3">
            TPET (Tailored Participation and Event Tool) automates custom email campaigns for
            events, including:
          </p>
          <ul className="text-xl grid grid-cols-1 gap-4 md:grid-cols-2">
            <li className="flex items-center text-gray-700 p-4 gap-2 bg-blue-100 rounded-lg shadow-md">
              <Mail className="w-6 h-6 text-blue-500" />
              Registration confirmations
            </li>
            <li className="flex items-center text-gray-700 p-4 gap-2 bg-yellow-100 rounded-lg shadow-md">
              <Calendar className="w-6 h-6 text-yellow-500" />
              Attendance verification
            </li>
            <li className="flex items-center text-gray-700 p-4 gap-2 bg-red-100 rounded-lg shadow-md">
              <Bell className="w-6 h-6 text-red-500" />
              Event reminders
            </li>
            <li className="flex items-center text-gray-700 p-4 gap-2 bg-green-100 rounded-lg shadow-md">
              <Award className="w-6 h-6 text-green-500" />
              Certificates of participation
            </li>
          </ul>
          <div className="flex flex-col md:flex-row justify-evenly py-20 gap-20 md:gap-0">
            <div className="flex flex-col justify-center items-center">
              <p className="text-9xl flex w-full justify-center text-sky-950">80%</p>
              <p className="text-lg text-gray-700">TPET reduces workload by 80%.</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-9xl flex w-full justify-center text-sky-950">$1.5</p>
              <p className="text-lg text-gray-700">TPET costs 1.5$USD (avg.) per month.</p>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div>
          <h3 className="text-2xl font-semibold text-sky-950 mb-4">Getting Started with TPET</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl">
            <a
              href="/aws-educate-tpet-guide.pdf"
              target="_blank"
              download
              className="flex gap-2 p-4 items-center bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
            >
              <Download className="w-6 h-6 mr-2" />
              Download PDF Guide
            </a>
            <a
              href="https://aws-educate-tw.notion.site/AWS-Educate-TPET-4682e862471a4998bb52b7972f026077"
              target="_blank"
              className="flex gap-2 p-4 items-center bg-sky-950 text-white rounded-lg shadow-md hover:bg-sky-800 transition duration-300"
            >
              <BookOpenText className="w-6 h-6 mr-2" />
              Checkout out Notion Page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
