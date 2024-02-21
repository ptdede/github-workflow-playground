import { appendFile } from "fs/promises";
import { id } from "date-fns/locale";
import axios, { AxiosResponse } from "axios";
import { formatInTimeZone } from "date-fns-tz";

interface QuoteResponse {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string; // "2021-05-05"
  dateModified: string; // "2023-04-14"
}

const generateRandomQuotes = async () => {
  const quote = await axios
    .get<unknown, AxiosResponse<QuoteResponse>>(
      "https://api.quotable.io/random"
    )
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to gather data");
    });

  // Make sure we use Jakarta timezone,
  // Not Github action server timezone.
  const updatedAt = formatInTimeZone(
    new Date(),
    "Asia/Jakarta",
    "dd-MM-yyyy HH:mm:ss",
    { locale: id }
  );

  // append to end of quotes.md file
  await appendFile(
    "QUOTES.md",
    `[${updatedAt}]: ${quote.content} | by: ${quote.author}\n`
  );
};

generateRandomQuotes();
