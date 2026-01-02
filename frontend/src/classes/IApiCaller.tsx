export interface IApiCaller {
  GetUsers(): string[];
  GetExportUrl(
    timeStart: string,
    timeEnd: string,
    preset: string,
    presetOverrides: string,
    fileformat: string,
  ): string;
  GetStatisticsPresets(): string[];
}

export class MockApiCaller implements IApiCaller {
  private users: string[] = ["Alf", "Horst", "James"];

  GetUsers(): string[] {
    //check current user rights -> done in backend
    return this.users;
  }

  GetStatisticsPresets(): string[] {
    return [
      "Statische Angaben zu den Fachberatungstellen Sexulaisierte Gewalt",
      "Alle Statisische Angaben die Wir haben",
      "Preset 3",
    ];
  }

  GetExportUrl(
    timeStart: string,
    timeEnd: string,
    preset: string,
    presetOverrides: string,
    fileformat: string,
  ): string {
    return "/test.csv";
  }
}
