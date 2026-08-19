import AppShell from "@/app/ui/app-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
