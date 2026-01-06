import type { IApiCaller } from "./IApiCaller";
const baseurl = "http://127.0.0.1:8000";

export class ApiCaller implements IApiCaller {
  async TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    try {
      const response = await fetch(`${baseurl}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          password: pswd1,
          password2: pswd2,
        }),
      });

      if (response.ok) {
        return { success: true, errorMsg: "Regstraition sucsess" };
      }

      return { success: false, errorMsg: "Regstraition failed" };
    } catch {
      return { success: false, errorMsg: "Network error" };
    }
  }
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
        return { success: true, errorMsg: "Login successful" };
      }

      return { success: false, errorMsg: "Login failed" };
    } catch {
      return { success: false, errorMsg: "Network error" };
    }
  }
  async GetUsers(): Promise<string[]> {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  async GetExportUrl(
    timeStart: string,
    timeEnd: string,
    preset: string,
    presetOverrides: string,
    fileformat: string,
  ): Promise<string> {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  async GetStatisticsPresets(): Promise<string[]> {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }
  async TryChangePassword(
    curPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    // TODO: Implement actual API call
    throw new Error("Method not implemented.");
  }

  async TryCreateCase(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TryCreateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TrySearchFall(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TrySearchAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TryUpdateFall(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TryUpdateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }
}
