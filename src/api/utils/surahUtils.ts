/**
 * Utility functions for working with surah data
 */

/**
 * Get the list of all surahs (table of contents)
 */
export async function getAllSurahs() {
  // Server-side fetch implementation
  try {
    // This could be a direct database call, API request, or file system read
    // For example:
    // const response = await fetch('https://your-api.com/surahs', { cache: 'no-store' });
    // return await response.json();

    // If you already have a working implementation, you can likely keep it as is
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const json =  await response.json();
    return json.data.map((surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
    }) => ({
      id: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

/**
 * Get data for a specific surah by ID
 */
export const getSurahById = async (id: number) => {
  try {
    // In a real application, this might be a fetch call to an API
    const arabic = await fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`);
    const english = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`);
    const arabicJson = await arabic.json();
    const englishJson = await english.json();
    const response = {
      id: englishJson.data.number,
      name: englishJson.data.name,
      englishName: englishJson.data.englishName,
      englishNameTranslation: englishJson.data.englishNameTranslation,
      numberOfAyahs: englishJson.data.numberOfAyahs,
      ayahs: arabicJson.data.ayahs.map((ayah: {
        number: number;
        audio: string;
        text: string;
        numberInSurah: number;
      }) => ({
        id: ayah.number,
        audio: ayah.audio,
        text: ayah.text,
        numberInSurah: ayah.numberInSurah,
        translation: englishJson.data.ayahs.find((a: {
          number: number;
          text: string;
        }) => a.number === ayah.number)?.text || '',
      })),
    };
    return response;
  } catch (error) {
    console.error(`Error loading surah ${id}:`, error);
    return null;
  }
};

/**
 * Get a random verse from a specific surah
 */
export const getRandomVerseFromSurah = async (surahId: number) => {
  const surah = await getSurahById(surahId);
  if (!surah || !surah.ayahs || surah.ayahs.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * surah.ayahs.length);
  return surah.ayahs[randomIndex];
};

/**
 * Get a random word from a random verse from a specific surah
 */
export const getRandomWordFromSurah = async (surahId: number) => {
  const verse = await getRandomVerseFromSurah(surahId);
  if (!verse || !verse.words || verse.words.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * verse.words.length);
  return verse.words[randomIndex];
};
