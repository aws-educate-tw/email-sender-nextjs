import ProtectedLayout from "@/app/ui/protected-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
