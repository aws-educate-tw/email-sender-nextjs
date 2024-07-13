"use server";

import { z } from "zod";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  display_name: z.string().min(1, "Display name is required"),
  template_file_id: z.string().min(1, "Template file ID is required"),
  spreadsheet_file_id: z.string().min(1, "Spreadsheet file ID is required"),
  attachment_file_ids: z.array(z.string()),
  is_generate_certificate: z.boolean(),
});

export async function submitForm(data: string) {
  const parsedData = JSON.parse(data);
  const validation = formSchema.safeParse(parsedData);

  if (!validation.success) {
    return {
      status: "error",
      message: "Validation failed",
      errors: validation.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  try {
    console.log("data", validation.data);
    return {
      status: "success",
      message: "Form data is valid",
    }
    // const base_url = "https://api.tpet.awseducate.systems/dev";
    // const url = new URL(`${base_url}/send-email`);
    // const response = await fetch(
    //   url.toString(),
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(validation.data)
    //   }
    // );

    // const result = await response.json();
    // return {
    //   status: result.status,
    //   message: result.message,
    //   request_id: result.request_id,
    //   timestamp: result.timestamp,
    //   sqs_message_id: result.sqs_message_id,
    // };
  } catch (error: any) {
    return {
      status: "error",
      message: "Error: Failed to Send Form Data. Please try again.",
      error: error.message,
    };
  }
}