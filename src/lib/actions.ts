"use server";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  display_name: z.string().min(1, "Display name is required"),
  template_file_id: z.string().min(1, "Template file ID is required"),
  spreadsheet_file_id: z.string().min(1, "Spreadsheet file ID is required"),
  recipient_source: z.string().min(1, "Recipient source is required"),
  sender_local_part: z.string().optional(),
  reply_to: z.string().email("Invalid email address").optional(),
  bcc: z.array(z.string().email("Invalid email address")).optional(),
  cc: z.array(z.string().email("Invalid email address")).optional(),
  attachment_file_ids: z.array(z.string()).optional(),
  is_generate_certificate: z.boolean().optional(),
});

const loginSchema = z.object({
  account: z.string().min(1, "Account is required"),
  password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z
  .object({
    account: z.string().min(1, "Account is required"),
    new_password: z.string().min(1, "Password is required"),
    session: z.string().optional(),
    verification_code: z.string().optional(),
  })
  .refine(data => data.session || data.verification_code, {
    message: "Either session or verification code must be provided",
    path: ["session", "verification_code"], // Optional path for the error message
  });

const webhookFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  display_name: z.string().min(1, "Display name is required"),
  template_file_id: z.string().min(1, "Template file ID is required"),
  is_generate_certificate: z.boolean(),
  reply_to: z.string().email("Invalid email address"),
  sender_local_part: z.string(),
  attachment_file_ids: z.array(z.string()),
  bcc: z.array(z.string().email("Invalid email address")),
  cc: z.array(z.string().email("Invalid email address")),
  surveycake_link: z.string(),
  hash_key: z.string().min(1, "Hash key is required"),
  iv_key: z.string().min(1, "IV key is required"),
  webhook_name: z.string().min(1, "Webhook name is required"),
  webhook_type: z.string().min(1, "Webhook type is required"),
});

export async function submitForm(data: string, access_token: string) {
  const parsedData = JSON.parse(data);
  const validation = formSchema.safeParse(parsedData);
  if (!validation.success) {
    return {
      status: "error",
      message: "Validation failed",
      errors: validation.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message,
      })),
    };
  }

  try {
    // console.log("data", validation.data);
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/send-email`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(validation.data),
    });

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
  // console.log("validation", validation);

  if (!validation.success) {
    return {
      message: "Validation failed",
      errors: validation.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message,
      })),
    };
  }
  // console.log(parsedData);
  // console.log("validation", validation);
  try {
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/auth/login`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    const result = await response.json();
    // console.log("response", result);
    if (result.challengeName === "NEW_PASSWORD_REQUIRED") {
      return {
        message: result.message,
        challengeName: result.challengeName,
        session: result.session,
        challengeParameters: result.challengeParameters,
      };
    } else {
      return {
        message: result.message,
        access_token: result.access_token,
      };
    }
  } catch (error: any) {
    return {
      status: "error",
      message: "Error: Failed to Login. Please try again.",
      error: error.message,
    };
  }
}

export async function submitChangePassword(data: string) {
  const parsedData = JSON.parse(data);
  const validation = changePasswordSchema.safeParse(parsedData);
  // console.log("validation", validation);

  if (!validation.success) {
    return {
      message: "Validation failed",
      errors: validation.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message,
      })),
    };
  }
  // console.log(parsedData);
  console.log("validation", validation);

  try {
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/auth/change-password`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    const result = await response.json();
    console.log("result", result);
    return {
      message: result.message,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Error: Failed to Change Password. Please try again.",
      error: error.message,
    };
  }
}

export async function submitWebhookForm(data: string, access_token: string) {
  const parsedData = JSON.parse(data);
  const validation = webhookFormSchema.safeParse(parsedData);
  if (!validation.success) {
    return {
      status: "error",
      message: "Validation failed",
      errors: validation.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message,
      })),
    };
  }

  try {
    console.log("data", validation.data);
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/webhook`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(validation.data),
    });

    // Deal with the error response
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API responded with an error:", errorResponse);
      return {
        status: "error",
        message: errorResponse.message || "Failed to create webhook.",
      };
    }

    // Deal with the success response
    const result = await response.json();
    return {
      status: "success",
      message: result.message || "Webhook created successfully.",
      data: {
        webhook_id: result.webhook_id,
        webhook_url: result.webhook_url,
      },
    };
  } catch (error: any) {
    console.error("Error during API call:", error);
    return {
      status: "error",
      message: "An unexpected error occurred while creating the webhook.",
      debugInfo: error.message,
    };
  }
}

export async function fetchWebhookList(
  access_token: string,
  params: {
    webhook_type: "surveycake" | "slack";
    limit?: number;
    page?: number;
    sort_order?: "ASC" | "DESC";
  }
) {
  try {
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/webhooks`);

    // 必要參數
    url.searchParams.append("webhook_type", params.webhook_type);

    // 可選參數
    if (params.limit) {
      url.searchParams.append("limit", params.limit.toString());
    }
    if (params.page) {
      url.searchParams.append("page", params.page.toString());
    }
    if (params.sort_order) {
      url.searchParams.append("sort_order", params.sort_order);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      status: "success",
      ...result,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to fetch webhook list",
      error: error.message,
    };
  }
}

export async function fetchWebhookDetails(access_token: string, webhookId: string) {
  try {
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/webhooks/${webhookId}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      status: "success",
      ...result,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: "Failed to fetch webhook details",
      error: error.message,
    };
  }
}

// export async function checkLoginStatus () {
//   const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
//   const url = new URL(`${base_url}/auth/is-logged-in`);
//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: "include",
//     });

//     const result = await response.json();
//     console.log('log in or not', result);
//     return result.loggedIn;
//   } catch (error) {
//     console.error('Failed to check login status:', error);
//     return false;
//   }
// };
