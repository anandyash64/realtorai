import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-cloud">
      <Header />
      <main className="px-4 py-16">
        <AuthForm mode="forgot" />
      </main>
    </div>
  );
}
