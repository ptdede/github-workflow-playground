import { readFile, writeFile } from "fs/promises";
import Mustache from "mustache";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import axios, { AxiosResponse } from "axios";
import { formatInTimeZone } from "date-fns-tz";

interface KPUResponse {
  ts: string;
  chart: {
    "100025": number;
    "100026": number;
    "100027": number;
    persen: number;
  };
}

const candidates = {
  1: "100025", // anies - muhaimin
  2: "100026", // prabowo - gibran
  3: "100027", // ganjar - mahfud
};

const generateReadme = async () => {
  const kpuData = await axios
    .get<unknown, AxiosResponse<KPUResponse>>(
      "https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json"
    )
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to gather data");
    });

  const template = await readFile("templates/readme.mustache", "utf8");

  // result is 2024-02-20 23:00:15
  const kpuDate = parse(kpuData.ts, "yyyy-MM-dd HH:mm:ss", new Date());
  const kpuUpdatedAt = format(kpuDate, "dd MMMM yyyy HH:mm:ss", { locale: id });

  // Make sure we use Jakarta timezone,
  // Not Github action server timezone.
  const updatedAt = formatInTimeZone(
    new Date(),
    "Asia/Jakarta",
    "dd MMMM yyyy HH:mm:ss",
    { locale: id }
  );

  const result = Mustache.render(template, {
    updatedAt,
    kpuUpdatedAt,
    percentage: kpuData.chart.persen,
    candidate1: kpuData.chart[candidates[1]],
    candidate2: kpuData.chart[candidates[2]],
    candidate3: kpuData.chart[candidates[3]],
  });

  // remove readme content, then update with the new one
  await writeFile("README.md", "");
  await writeFile("README.md", result);
};

generateReadme();
