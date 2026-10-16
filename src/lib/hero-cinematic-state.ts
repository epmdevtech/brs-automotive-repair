/**
 * Módulo de estado volátil da sessão em memória para a abertura cinematográfica do Hero (SPEC-067).
 * Não persiste em sessionStorage/localStorage para respeitar as diretrizes de performance e SSR.
 * false no SSR e na primeira hidratação do cliente; true após a primeira execução na rota "/".
 */
let hasPlayedHeroIntro = false;

export function getHasPlayedHeroIntro(): boolean {
  return hasPlayedHeroIntro;
}

export function setHasPlayedHeroIntro(val: boolean): void {
  hasPlayedHeroIntro = val;
}

export function resetHeroIntroState(): void {
  hasPlayedHeroIntro = false;
}
