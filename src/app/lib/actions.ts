"use server";

import { stat } from "fs";
import { request } from "http";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string(),
  display_name: z.string(),
  template_file_id: z.string(),
  spreadsheet_file_id: z.string(),
});

export async function submitForm(formData: FormData) {
  const data = formSchema.safeParse({
    subject: formData.get("subject") as string,
    display_name: formData.get("display_name") as string,
    template_file_id: formData.get("template_file_id") as string,
    spreadsheet_file_id: formData.get("spreadsheet_file_id") as string,
  });
  try {
    const response = await fetch(
      "https://diyf4tafbl.execute-api.ap-northeast-1.amazonaws.com/dev/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.data)
      }
    );
    if (!response.ok) {
      return {
        message: "The templateID or spreadsheetID is invalid",
      };
    }

    const result = await response.json();
    return {
      status: result.status,
      message: result.message,
      request_id: result.request_id,
      timestamp: result.timestamp,
      sqs_message_id: result.sqs_message_id,
    };
  } catch (error: any) {
    return {
      message: "Error: Failed to Send Form Data. Please try again.",
      error: error.message,
    };
  }
}
