import type { StateRegulations } from './regulationsTypes';

import colorado from '@/data/regulations/colorado.json';
import wyoming from '@/data/regulations/wyoming.json';
import montana from '@/data/regulations/montana.json';
import idaho from '@/data/regulations/idaho.json';
import arizona from '@/data/regulations/arizona.json';
import newMexico from '@/data/regulations/new-mexico.json';
import nevada from '@/data/regulations/nevada.json';
import utah from '@/data/regulations/utah.json';
import oregon from '@/data/regulations/oregon.json';
import washington from '@/data/regulations/washington.json';
import california from '@/data/regulations/california.json';
import southDakota from '@/data/regulations/south-dakota.json';

import pennsylvania from '@/data/regulations/pennsylvania.json';
import ohio from '@/data/regulations/ohio.json';
import illinois from '@/data/regulations/illinois.json';
import georgia from '@/data/regulations/georgia.json';
import michigan from '@/data/regulations/michigan.json';
import wisconsin from '@/data/regulations/wisconsin.json';
import kentucky from '@/data/regulations/kentucky.json';
import minnesota from '@/data/regulations/minnesota.json';
import mississippi from '@/data/regulations/mississippi.json';
import texas from '@/data/regulations/texas.json';
import iowa from '@/data/regulations/iowa.json';
import kansas from '@/data/regulations/kansas.json';

// Western (preference / bonus / random — multi-species), then eastern
// whitetail-focused. Sorted alphabetically inside each group.
export const allRegulations: StateRegulations[] = [
  arizona,
  california,
  colorado,
  idaho,
  montana,
  nevada,
  newMexico,
  oregon,
  southDakota,
  utah,
  washington,
  wyoming,
  georgia,
  illinois,
  iowa,
  kansas,
  kentucky,
  michigan,
  minnesota,
  mississippi,
  ohio,
  pennsylvania,
  texas,
  wisconsin,
] as StateRegulations[];

export function getStateBy(abbr: string): StateRegulations | undefined {
  const lower = abbr.toLowerCase();
  return allRegulations.find(s => s.abbreviation.toLowerCase() === lower);
}
