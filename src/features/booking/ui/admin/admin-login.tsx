import type { AdminUser } from "../../domain/auth";
import { AuthSplitLayout } from "./auth-split-layout";
import { LoginForm } from "./login-form";

export interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  demo?: boolean;
}

/**
 * Componente principal da tela de autenticação administrativa (/login).
 * Integra o layout Split-Screen de alta fidelidade visual com o formulário
 * operacional Zod + React Hook Form.
 */
export function AdminLogin({ onLoginSuccess, demo = true }: AdminLoginProps) {
  return (
    <AuthSplitLayout>
      <LoginForm onLoginSuccess={onLoginSuccess} demo={demo} />
    </AuthSplitLayout>
  );
}
