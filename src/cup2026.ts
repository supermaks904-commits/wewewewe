// @ts-nocheck
/**
 * Russian Cup 2026 format (RPL Path & Regions Path)
 */

export const CUP_FINAL_VENUE = 'Лужники (Москва)';

export function getCupFinalVenue(): string {
  return CUP_FINAL_VENUE;
}

export function initCup2026(
  season: string,
  rplTeams: any[],
  fnlTeams: any[],
  secondLeagueTeams: any[],
  mediaTeams: any[],
  uidFn: () => string,
  options?: any
): { cupState: any; fixtures: any[] } {
  const groups: Record<string, any[]> = {
    A: [],
    B: [],
    C: [],
    D: []
  };

  const rpl = [...(rplTeams || [])];
  const keys = ['A', 'B', 'C', 'D'];
  rpl.forEach((t, i) => {
    const gKey = keys[i % 4];
    groups[gKey].push({
      id: t.id,
      name: t.name,
      logo: t.logo,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
    });
  });

  const cupState = {
    season,
    format: 'rpl_and_regions',
    stage: 'groups',
    groups,
    playoffRpl: {},
    regionsRounds: []
  };

  return { cupState, fixtures: [] };
}

export function recalculateCupGroups(cupState: any, fixtures: any[]): void {
  if (!cupState?.groups || !Array.isArray(fixtures)) return;
  // reset points
  for (const group of Object.values(cupState.groups)) {
    if (Array.isArray(group)) {
      for (const t of group) {
        t.p = 0;
        t.w = 0;
        t.d = 0;
        t.l = 0;
        t.gf = 0;
        t.ga = 0;
        t.pts = 0;
      }
    }
  }

  for (const f of fixtures) {
    if (f.comp !== 'cup' || f.status !== 'done') continue;
    const hg = Number(f.hg) || 0;
    const ag = Number(f.ag) || 0;

    for (const group of Object.values(cupState.groups)) {
      const hTeam = (group as any[]).find(x => x.id === f.home);
      const aTeam = (group as any[]).find(x => x.id === f.away);
      if (hTeam && aTeam) {
        hTeam.p++;
        aTeam.p++;
        hTeam.gf += hg;
        hTeam.ga += ag;
        aTeam.gf += ag;
        aTeam.ga += hg;
        if (hg > ag) {
          hTeam.w++;
          hTeam.pts += 3;
          aTeam.l++;
        } else if (hg < ag) {
          aTeam.w++;
          aTeam.pts += 3;
          hTeam.l++;
        } else {
          hTeam.d++;
          aTeam.d++;
          hTeam.pts += 1;
          aTeam.pts += 1;
        }
      }
    }
  }
}

export function drawNextRegionsRound(cupState: any, roundNumber: number, roundFx?: any[], uidFn?: () => string): any[] {
  return [];
}
