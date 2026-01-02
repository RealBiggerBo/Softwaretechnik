import type { IApiCaller } from "./IApiCaller";

export class ApiCaller implements IApiCaller {
  TryLogin(user: string, pswd: string): { success: boolean; errorMsg: string } {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  GetUsers(): string[] {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  GetExportUrl(
    timeStart: string,
    timeEnd: string,
    preset: string,
    presetOverrides: string,
    fileformat: string,
  ): string {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  GetStatisticsPresets(): string[] {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  TryChangePassword(
    curPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): { success: boolean; errorMsg: string } {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
}
