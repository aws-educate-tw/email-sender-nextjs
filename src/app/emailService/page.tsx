import { Suspense } from "react";
import EmailService from "@/app/ui/emailService/email-service";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <EmailService />
    </Suspense>
  );
}
