// Invented titles and people for the demo mode. Everything is derived from the
// position in these lists, so the demo is the same on every run

type Text = [en: string, it: string];

const MOVIES: Text[] = [
  ["The Tin Orchard", "Il frutteto di latta"],
  ["Nine Letters to Verano", "Nove lettere a Verano"],
  ["Salt on the Antenna", "Sale sull'antenna"],
  ["The Cartographer's Debt", "Il debito del cartografo"],
  ["Paper Thunder", "Tuono di carta"],
  ["A Quiet Place for Comets", "Un posto quieto per comete"],
  ["Hotel Juniper Zero", "Hotel Ginepro Zero"],
  ["The Beekeeper of Orbit Six", "L'apicoltrice dell'orbita sei"],
  ["Velvet Harbor", "Porto di velluto"],
  ["Last Tram to Ombra", "Ultimo tram per Ombra"],
  ["The Museum of Lost Echoes", "Il museo degli echi perduti"],
  ["Copper Moon Heist", "Il colpo della luna di rame"],
  ["Seventeen Umbrellas", "Diciassette ombrelli"],
  ["The Glass Beekeeping Society", "La società delle api di vetro"],
  ["North of the Lantern", "A nord della lanterna"],
  ["Dust Waltz", "Valzer di polvere"],
  ["The Accidental Astronomer", "L'astronomo per caso"],
  ["Rooftop Republic", "La repubblica dei tetti"],
  ["Emerald Static", "Interferenza smeraldo"],
  ["The Violin That Remembered", "Il violino che ricordava"],
  ["Midnight at Platform Zero", "Mezzanotte al binario zero"],
  ["Sugar for the Minotaur", "Zucchero per il minotauro"],
  ["The Weather Thieves", "I ladri del tempo atmosferico"],
  ["Orchid Protocol", "Protocollo orchidea"],
  ["Three Days of Amber", "Tre giorni d'ambra"],
  ["The Lighthouse Auction", "L'asta del faro"],
  ["Pocket Full of Gravity", "Una tasca di gravità"],
  ["Cinder Carnival", "Carnevale di cenere"],
  ["The Understudy of Vienna Road", "La sostituta di via Vienna"],
  ["Tidewater Detectives", "Detective d'alta marea"],
  ["A Map for Sleepwalkers", "Una mappa per sonnambuli"],
  ["The Iron Gardener", "Il giardiniere di ferro"],
  ["Snowfall in Sector Blue", "Nevicata nel settore blu"],
  ["The Second Summer of Ida Crane", "La seconda estate di Ida Crane"],
  ["Parachutes for Beginners", "Paracadute per principianti"],
  ["The Long Goodnight of Mr. Pell", "La lunga buonanotte del signor Pell"],
];

const SERIES: Text[] = [
  ["Harbor & Finch", "Harbor & Finch"],
  ["The Night Bakers", "I panettieri della notte"],
  ["Station Larkspur", "Stazione Larkspur"],
  ["Small Kingdoms", "Piccoli regni"],
  ["The Bureau of Odd Hours", "L'ufficio delle ore strane"],
  ["Copperfield Lane 12", "Via Copperfield 12"],
  ["Deep Field", "Campo profondo"],
  ["The Understairs", "Il sottoscala"],
  ["Northern Frequency", "Frequenza del nord"],
  ["Marlow's Almanac", "L'almanacco di Marlow"],
  ["Glasshouse Rules", "Le regole della serra"],
  ["The Ferryman's Daughters", "Le figlie del traghettatore"],
];

const PEOPLE = [
  "Mara Vellini", "Tobias Quillon", "Ines Aldaro", "Ruben Straymark",
  "Nadia Corvane", "Elio Farrowdale", "Petra Lundmoss", "Osman Teller",
  "Giada Brunforte", "Wes Okonara", "Lucia Pennalba", "Hale Morrowind",
  "Dario Silvestrin", "Yumi Tanabrook", "Clara Westervane", "Ivo Castelnero",
  "Rosa Dunleigh", "Amir Solvane", "Bianca Torrelunga", "Felix Ardmoor",
  "Noor Hallemay", "Sandro Vespri", "Edith Crowmere", "Leo Marchfield",
];

const GENRES: [id: number, ...Text][] = [
  [28, "Action", "Azione"],
  [35, "Comedy", "Commedia"],
  [80, "Crime", "Crime"],
  [18, "Drama", "Dramma"],
  [14, "Fantasy", "Fantasy"],
  [27, "Horror", "Horror"],
  [9648, "Mystery", "Mistero"],
  [878, "Science Fiction", "Fantascienza"],
];

const WHO: Text[] = [
  ["A retired clockmaker", "Un orologiaio in pensione"],
  ["A runaway elder sister", "Una sorella maggiore in fuga"],
  ["The youngest pilot of the fleet", "La pilota più giovane della flotta"],
  ["A librarian with a perfect memory", "Una bibliotecaria dalla memoria perfetta"],
  ["An unlucky thief", "Una ladra sfortunata"],
  ["A small village choir", "Il coro di un piccolo paese"],
];
const DOES: Text[] = [
  ["finds a map that redraws itself every night", "segue una mappa che si ridisegna ogni notte"],
  ["inherits a lighthouse nobody can locate", "eredita un faro che nessuno riesce a trovare"],
  ["receives letters from a city that does not exist", "riceve lettere da una città che non esiste"],
  ["agrees to one last impossible delivery", "accetta un'ultima consegna impossibile"],
  ["wakes up in the wrong year", "si risveglia nell'anno sbagliato"],
];
const THEN: Text[] = [
  ["The way home has never looked so far.", "La via di casa non è mai sembrata così lontana."],
  ["Someone, however, was already there.", "Qualcuno, però, era già lì."],
  ["Every answer comes with a price.", "Ogni risposta ha un prezzo."],
  ["It all has to happen before the first snow.", "Tutto deve accadere prima della prima neve."],
  ["Friends and enemies turn out to be the same people.", "Amici e nemici si rivelano le stesse persone."],
];

export const at = <T>(list: readonly T[], i: number) => list[i % list.length];
export const lang = (locale: string) => (locale === "it" ? 1 : 0);

const words = (i: number, l: 0 | 1) =>
  `${at(WHO, i * 5 + 1)[l]} ${at(DOES, i * 3)[l]}. ${at(THEN, i * 7)[l]}`;

export interface DemoTitle {
  id: number;
  index: number;
  kind: "movie" | "tv";
  title: Text;
  overview: Text;
  genres: number[];
  date: string;
  votes: number;
  average: number;
  popularity: number;
  providers: number[];
  hasPoster: boolean;
  hasBackdrop: boolean;
  runtime: number;
  seasons: number;
  people: number[];
  hasTrailer: boolean;
}

function makeTitle(kind: "movie" | "tv", title: Text, index: number) {
  const n = kind === "movie" ? index : index + 50;
  // A few titles are incomplete on purpose, as they are on TMDB
  const gap = kind === "movie" ? index % 12 : index % 8;
  const isUpcoming = gap === 10;
  const result: DemoTitle = {
    id: (kind === "movie" ? 1001 : 2001) + index,
    index,
    kind,
    title,
    overview:
      gap === 5
        ? [words(n, 0), ""]
        : gap === 6
          ? ["", ""]
          : [words(n, 0), words(n, 1)],
    genres: [...new Set([at(GENRES, n)[0], at(GENRES, n * 3 + 1)[0]])],
    date: isUpcoming
      ? `2040-0${1 + (n % 9)}-15`
      : `${2026 - ((n * 7) % 34)}-${String(1 + ((n * 5) % 12)).padStart(2, "0")}-1${n % 9}`,
    votes: isUpcoming ? 0 : gap === 9 ? 4 : 40 + ((n * 137) % 9000),
    average: isUpcoming ? 0 : 5.6 + ((n * 13) % 34) / 10,
    popularity: 1000 - ((n * 29) % 97),
    providers: [1 + (n % 6), 1 + ((n * 5 + 2) % 6)],
    hasPoster: gap !== 7,
    hasBackdrop: gap !== 7 && gap !== 4,
    runtime: gap === 11 ? 45 : 82 + ((n * 11) % 70),
    seasons: 1 + (n % 5),
    people:
      gap === 11 ? [] : [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (n * 5 + k * 3) % PEOPLE.length),
    hasTrailer: gap % 3 !== 2,
  };
  return result;
}

export const movies = MOVIES.map((t, i) => makeTitle("movie", t, i));
export const series = SERIES.map((t, i) => makeTitle("tv", t, i));
export const titles = [...movies, ...series];

export const genres = GENRES;
export const people = PEOPLE.map((name, index) => ({
  id: 3001 + index,
  index,
  name,
  department: at(["Acting", "Acting", "Directing", "Acting", "Writing"], index),
  hasPhoto: index % 9 !== 4,
  // Full, missing, or English only
  biography: (index % 9 === 4
    ? ["", ""]
    : [
        `${name} is an invented person, made up for the demo of this site. ${words(index, 0)} ${"That is the plot of the film that made them famous, at least in this catalogue. ".repeat(4)}`,
        index % 5 === 3
          ? ""
          : `${name} è una persona inventata per la demo di questo sito. ${words(index, 1)} ${"È la trama del film che l'ha resa celebre, almeno in questo catalogo. ".repeat(4)}`,
      ]) as Text,
  birthday: `${1948 + ((index * 7) % 52)}-0${1 + (index % 9)}-1${index % 9}`,
}));

export const collection = {
  id: 4001,
  name: ["The Orchard Trilogy", "La trilogia del frutteto"] as Text,
  parts: [movies[0], movies[13], movies[31]],
};

export const keywords = [
  { id: 5001, name: "small town" },
  { id: 5002, name: "lost letter" },
  { id: 5003, name: "time" },
];
