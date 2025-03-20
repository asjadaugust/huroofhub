import { Ayah } from "./Ayah";

export interface Surah {
    id: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    ayahs?: Ayah[];
  }