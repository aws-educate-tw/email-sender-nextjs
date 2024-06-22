"use server";

import { z } from "zod";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  display_name: z.string().min(1, "Display name is required"),
  template_file_id: z.string().min(1, "Template file ID is required"),
  spreadsheet_file_id: z.string().min(1, "Spreadsheet file ID is required"),
});

export async function submitForm(formData: FormData) {
  const data = formSchema.safeParse({
    subject: formData.get("subject") as string,
    display_name: formData.get("display_name") as string,
    template_file_id: formData.get("template_file_id") as string,
    spreadsheet_file_id: formData.get("spreadsheet_file_id") as string,
  });

  if (!data.success) {
    return {
      status: "error",
      message: "Validation failed",
      errors: data.error.errors,
    };
  }
  try {
    console.log("data", data.data);
    const response = await fetch(
      "https://58a66niby9.execute-api.ap-northeast-1.amazonaws.com/dev/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.data)
      }
    );

    const result = await response.json();
    // console.log(result); 
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
