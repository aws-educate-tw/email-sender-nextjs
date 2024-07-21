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

const loginSchema = z.object({
  account: z.string().min(1, "Account is required"),
  password: z.string().min(1, "Password is required"),
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
    // console.log("data", validation.data);
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/send-email`);
    const response = await fetch(
      url.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data)
      }
    );

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
      status: "error",
      message: "Error: Failed to Send Form Data. Please try again.",
      error: error.message,
    };
  }
}

export async function submitLogin(data: string) {
  const parsedData = JSON.parse(data);
  const validation = loginSchema.safeParse(parsedData);
  console.log("validation", validation);

  if (!validation.success) {
    return {
      message: "Validation failed",
      errors: validation.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    };
  }
  // console.log(parsedData);
  console.log("validation", validation);
  try {
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/auth/login`);
    const response = await fetch(
      url.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data)
      }
    );

    const result = await response.json();
    // console.log("response", result);
    return {
      message: result.message,
    }
  } catch (error: any) {
    return {
      status: "error",
      message: "Error: Failed to Login. Please try again.",
      error: error.message,
    };
  }
}