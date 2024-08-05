import { CalendarDays, Send, Clock } from "lucide-react";

export default function EmailHistoryCardSkeleton() {
  return (
    <div className="w-full hover:shadow-xl transition bg-white rounded-xl shadow-md overflow-hidden">
      <div className="animate-pulse">
        <div className="p-8">
          <div className="flex flex-col">
            <div className="uppercase tracking-wide text-lg text-black font-semibold mb-1">
              {/* subject name here */}
              <div className=" m-1 h-5 bg-slate-200 rounded-full col-span-2"></div>
            </div>
            <hr />
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1 flex py-4 gap-2 items-center">
                <div className="bg-sky-900 rounded-full p-1 border-2 border-sky-900">
                  {/* avatar here */}
                  <div className="h-8 w-8 bg-sky-900 rounded-full col-span-2"></div>
                </div>
                <div className="flex flex-col justify-start">
                  <div className="m-1 h-4 w-32 bg-slate-200 rounded-full col-span-2"></div>
                  <div className="m-1 h-3 w-24 bg-slate-200 rounded-full col-span-2"></div>
                </div>
              </div>
              <div className="flex-1 flex py-2 gap-2 items-center">
                <div className=" bg-sky-800 rounded-full p-1 border-2 border-sky-800">
                  {/* avatar here */}
                  <div className="h-8 w-8 bg-sky-800 rounded-full col-span-2"></div>
                </div>
                <div className="flex flex-col justify-start">
                  <div className="m-1 h-4 w-32 bg-slate-200 rounded-full col-span-2"></div>
                  <div className="m-1 h-3 w-24 bg-slate-200 rounded-full col-span-2"></div>
                </div>
              </div>
              <div className="flex-1 flex py-2 gap-2 items-center">
                <div className="bg-sky-700 rounded-full p-1 border-2 border-sky-700">
                  {/* avatar here */}
                  <div className="h-8 w-8 bg-sky-700 rounded-full col-span-2"></div>
                </div>
                <div className="animate-pulse flex flex-col justify-start">
                  <div className="m-1 h-4 w-32 bg-slate-200 rounded-full col-span-2"></div>
                  <div className="m-1 h-3 w-24 bg-slate-200 rounded-full col-span-2"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end pt-2 pl-3 gap-2 lg:flex-row lg:pt-8 lg:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {/* Loading icon here */}
                <CalendarDays size={20} />
                <p>Send at</p>
              </div>
              <div className="m-1 h-4 w-24 bg-slate-200 rounded-full col-span-2"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {/* Loading icon here */}
                <Send size={20} />
                <p>Sender</p>
              </div>
              <div className="m-1 h-4 w-16 bg-slate-200 rounded-full col-span-2"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {/* Loading icon here */}
                <Clock size={20} />
                <p>Status</p>
              </div>
              <div className="m-1 h-4 w-6 bg-slate-200 rounded-full col-span-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
