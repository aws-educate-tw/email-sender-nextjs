"use client";
import { useEffect, useState } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PageProps {
  params: {
    runId: string;
  };
}

interface rowDataType {
  [key: string]: string;
}

interface dataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  created_at: string;
  recipient_email: string;
  sender_local_part: string;
  status: string;
  spreadsheet_file_id: string;
  row_data: rowDataType;
  atatachment_file_ids: string[];
  is_generated_certficate: boolean;
  sender_username: string;
  display_name: string;
  sender_id: string;
  updated_at: string;
  sent_at: string;
  template_file_id: string;
  reply_to: string;
  email_id: string;
}

export default function Page({ params }: PageProps) {
  const [data, setData] = useState<dataType[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchFiles(10, null, null);
    // const intervalId = setInterval(() => {
    //   fetchFiles(10, null, null);
    // }, 3000);

    // return () => clearInterval(intervalId);
  }, []);

  const fetchFiles = async (
    limit: number,
    status: string | null,
    lastEvaluatedKey: string | null
  ) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs/${params.runId}/emails`);
      url.searchParams.append("limit", limit.toString());
      if (status) {
        url.searchParams.append("status", status);
      }
      if (lastEvaluatedKey) {
        url.searchParams.append("last_evaluated_key", lastEvaluatedKey);
      }

      const token = localStorage.getItem("access_token");
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Request failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setIsLoading(false);
      setData(result.data);
      console.log(result.data);
      setPreviousLastEvaluatedKey(result.previous_last_evaluated_key);
      setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
      setNextLastEvaluatedKey(result.next_last_evaluated_key);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      // setLoading
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Emails history</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Details of <strong>one of the runs </strong>is shown here.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-md">
            <table className="w-full bg-white rounded-md">
              <thead>
                <tr>
                  <th className="rounded-tl-md py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
                    Recipient Email
                  </th>
                  <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
                    BCC
                  </th>
                  <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
                    CC
                  </th>
                  <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
                    Status
                  </th>
                  <th className="rounded-tr-md py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index !== 0 ? "border-t border-gray-200" : ""
                    }`}
                  >
                    <td className="py-2 px-4 text-sm text-gray-700 font-bold">
                      {item.recipient_email}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-700">
                      {item.bcc.length === 0 ? (
                        <div className="flex flex-col justify-start text-gray-300">
                          NO BCC
                        </div>
                      ) : (
                        <div className="flex flex-col justify-start">
                          {item.bcc.map((email, idx) => (
                            <div
                              className={`py-1 ${
                                idx !== 0
                                  ? "border-dashed border-t-2 border-gray-200"
                                  : ""
                              }`}
                              key={idx}
                            >
                              {email}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-700">
                      {item.cc.length === 0 ? (
                        <div className="flex flex-col justify-start text-gray-300">
                          NO CC
                        </div>
                      ) : (
                        <div className="flex flex-col justify-start">
                          {item.cc.map((email, idx) => (
                            <div
                              className={`py-1 ${
                                idx !== 0
                                  ? "border-dashed border-t-2 border-gray-200"
                                  : ""
                              }`}
                              key={idx}
                            >
                              {email}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {item.status === "SUCCESS" ? (
                        <div className="bg-green-500 text-white text-sm p-1 rounded-full text-center">
                          {item.status}
                        </div>
                      ) : item.status === "FAILED" ? (
                        <div className="bg-red-500 text-white text-sm p-1 rounded-full text-center">
                          {item.status}
                        </div>
                      ) : (
                        <div className="bg-yellow-200 text-black text-sm p-1 rounded-full text-center">
                          {item.status}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-700">
                      {item.status === "SUCCESS" && item.sent_at ? (
                        convertToTaipeiTime(item.sent_at)
                      ) : item.status === "FAILED" ? (
                        <p className="text-red-500">This email is not sent.</p>
                      ) : (
                        <p className="text-yellow-400">
                          This email is on its way.
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end gap-8 pt-3 pb-1 px-2">
          <button
            className={`flex items-center gap-1 ${
              !currentLastEvaluatedKey
                ? "cursor-default text-gray-400"
                : "hover:text-gray-600 hover:underline"
            }`}
            onClick={() => {
              fetchFiles(10, null, previousLastEvaluatedKey);
            }}
            disabled={!currentLastEvaluatedKey}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <button
            className={`flex items-center gap-1 ${
              !nextLastEvaluatedKey
                ? "cursor-default text-gray-400"
                : "hover:text-gray-600 hover:underline"
            }`}
            onClick={() => {
              if (nextLastEvaluatedKey) {
                fetchFiles(10, null, nextLastEvaluatedKey);
              }
            }}
            disabled={!nextLastEvaluatedKey}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
