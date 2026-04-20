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

export const allRegulations: StateRegulations[] = [
  colorado,
  wyoming,
  montana,
  idaho,
  arizona,
  newMexico,
  nevada,
  utah,
  oregon,
  washington,
] as StateRegulations[];

export function getStateBy(abbr: string): StateRegulations | undefined {
  const lower = abbr.toLowerCase();
  return allRegulations.find(s => s.abbreviation.toLowerCase() === lower);
}
