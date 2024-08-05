import { convertToTaipeiTime } from "@/lib/utils/dataUtils";

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

export default function EmailDetailsTable({ data }: { data: dataType[] }) {
  return (
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
          {data.map((item: dataType, index: number) => (
            <tr
              key={index}
              className={`${index !== 0 ? "border-t border-gray-200" : ""}`}
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
                  <p className="text-yellow-400">This email is on its way.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
