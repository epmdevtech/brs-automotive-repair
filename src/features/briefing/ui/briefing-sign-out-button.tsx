import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutBriefing } from "../server/functions";
import { clearBriefingDraft } from "../domain/storage";

/**
 * Encerra a sessão do briefing.
 *
 * A sessão vive em um cookie do Supabase: sem esta ação o usuário não
 * consegue invalidá-la. O rascunho local também é apagado, porque ele guarda
 * dados comerciais confidenciais em `localStorage`.
 */ export function BriefingSignOutButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);

    try {
      await signOutBriefing();
    } catch {
      // Mesmo que o servidor falhe, a sessão local é encerrada.
    }

    clearBriefingDraft();
    setPending(false);
    void navigate({ to: "/login" });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      disabled={pending}
      onClick={() => void handleSignOut()}
    >
      <LogOut aria-hidden="true" />
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
