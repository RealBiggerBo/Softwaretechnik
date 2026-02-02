import type { IApiCaller } from "./IApiCaller";
import { Anfrage } from "./Anfrage";
import { Case } from "./Case";

const baseurl = "http://127.0.0.1:8000";
const headers = new Headers();
headers.set("Content-Type", "application/json");

export class ApiCaller implements IApiCaller {
  Logout(): void {
    headers.delete("Authorization");
  }
  private async request(path: string, init: RequestInit): Promise<Response> {
    return fetch(`${baseurl}${path}`, { ...init, headers });
  }

  async TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    const registerObject = {
      username: user,
      password: pswd1,
      password2: pswd2,
    };
    return this.SendApiCall(
      "/api/auth/register/",
      "POST",
      false,
      JSON.stringify(registerObject),
      "Registrierung fehlgeschlagen",
    );
  }
  async TryLogin(
    user: string,
    pswd: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    const loginObject = { username: user, password: pswd };
    return this.SendApiCall(
      "/api/auth/login/",
      "POST",
      true,
      JSON.stringify(loginObject),
      "Login fehlgeschlagen",
      (response) =>
        response.json().then((data) => {
          headers.set("Authorization", `token ${data.token}`);
        }),
    );
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
    const passwordObject = {
      old_password: curPswd,
      new_password: newPswd,
      new_password2: newPswdCtrl,
    };

    return this.SendApiCall(
      "/api/auth/change-password/",
      "POST",
      true,
      JSON.stringify(passwordObject),
      "Passwortänderung fehlgeschlagen",
    );
  }

  async TryCreateCase(
    caseToCreate: Case,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      "/api/data/save/fall",
      "POST",
      true,
      JSON.stringify(caseToCreate),
      "Erstellen fehlgeschlagen",
    );
  }

  async TryCreateAnfrage(
    anfrageToCreate: Anfrage,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      "/api/data/save/anfrage",
      "POST",
      true,
      JSON.stringify(anfrageToCreate),
      "Erstellen fehlgeschlagen",
    );
  }

  async TrySearchFall(
    caseToSearch: Case,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      "/api/data/fall/search",
      "POST",
      true,
      JSON.stringify(caseToSearch),
      "Suche fehlgeschlagen",
    );
  }

  async TrySearchAnfrage(
    anfrageToSearch: Anfrage,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      "/api/data/anfrage/search",
      "POST",
      true,
      JSON.stringify(anfrageToSearch),
      "Suche fehlgeschlagen",
    );
  }

  async TryUpdateFall(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TryUpdateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  private async SendApiCall(
    url: string,
    method: "GET" | "POST" | "PUT",
    includeCredentials: boolean,
    body: any,
    fallbackErrorMsg: string,
    successAction?: (response: Response) => void | Promise<void>,
  ): Promise<{ success: boolean; errorMsg: string }> {
    try {
      const response = await this.request(url, {
        method: method,
        credentials: includeCredentials ? "include" : undefined,
        body: body,
      });

      if (response.ok) {
        if (successAction != undefined) await successAction(response);
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error || fallbackErrorMsg;

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
  }

  async GetAnfrageJson(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    let result: any = null;

    const res = await this.SendApiCall(
      "/api/data/data_record/anfrage?id=2",
      "GET",
      true,
      undefined,
      "Seite konnte nicht geladen werden.",
      async (response) => {
        result = await response.json();
      },
    );

    return { ...res, json: result };
  }

  async GetFallJson(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    let result: any = null;

    const res = await this.SendApiCall(
      "/api/data/data_record/fall?id=1",
      "GET",
      true,
      undefined,
      "Seite konnte nicht geladen werden.",
      async (response) => {
        result = await response.json();
      },
    );

    return { ...res, json: result };
  }
}
