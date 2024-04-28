"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  email_title: z.string(),
  template_file_id: z.string(),
  spreadsheet_id: z.string(),
});

export async function submitForm(formData: FormData) {
  const data = formSchema.safeParse({
    email_title: formData.get("email_title"),
    template_file_id: formData.get("template_file_id"),
    spreadsheet_id: formData.get("spreadsheet_id"),
  });
  if (!data.success) {
    throw new Error("Invalid form data");
  }
  const queryParams = new URLSearchParams(data.data).toString();
  try {
    // console.log(
    //   `https://yo5206a7p0.execute-api.ap-northeast-1.amazonaws.com/default/email-service-dev-sendEmail?${queryParams}`
    // );
    const response = await fetch(
      `https://yo5206a7p0.execute-api.ap-northeast-1.amazonaws.com/default/email-service-dev-sendEmail?${queryParams}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      return {
        message: "The templateID or spreadsheetID is invalid",
      };
    }
    return {
      message: "You have successfully sent the emails",
      status: response.status,
    };
  } catch (error: any) {
    return {
      message: "Error: Failed to Send Form Data. Please try again.",
      error: error.message,
    };
  }
}
