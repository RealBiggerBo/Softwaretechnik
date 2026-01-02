import type { IApiCaller } from "./IApiCaller";
const baseurl = "http://127.0.0.1:8000";

export class ApiCaller implements IApiCaller {
  async TryLogin(
    user: string,
    pswd: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    try {
      const response = await fetch(`${baseurl}/api/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user, password: pswd }),
      });

      if (response.ok) {
        return { success: true, errorMsg: "Login failed" };
      }

      return { success: false, errorMsg: "Login failed" };
    } catch {
      return { success: false, errorMsg: "Network error" };
    }
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
