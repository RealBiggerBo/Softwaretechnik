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

    try {
      const response = await this.request("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          username: user,
          password: pswd1,
          password2: pswd2,
        }),
      });

      if (response.ok) {
        return { success: true, errorMsg: "Registratition Erfolgreich" };
      }

      return { success: false, errorMsg: "Registratition Fehlgeschlagen" };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
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

    try {
      const response = await this.request("/api/auth/login/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username: user, password: pswd }),
      });

      if (response.ok) {
        response.json().then((data) => {
          headers.set("Authorization", `token ${data.token}`);
        });
        return { success: true, errorMsg: "Login Erfolgreich" };
      }
      return { success: false, errorMsg: "Login Fehlgeschlagen" };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
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
    try {
      const response = await this.request("/api/auth/change-password/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          old_password: curPswd,
          new_password: newPswd,
          new_password2: newPswdCtrl,
        }),
      });

      if (response.ok) {
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.detail || "Passwortänderung fehlgeschlagen";

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
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
    try {
      const response = await this.request("/api/data/save/fall", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(caseToCreate),
      });

      if (response.ok) {
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.detail || "Erstellen fehlgeschlagen";

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
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
    try {
      const response = await this.request("/api/data/save/anfrage", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(anfrageToCreate),
      });

      if (response.ok) {
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.detail || "Erstellen fehlgeschlagen";

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
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

    try {
      const response = await this.request("/api/data/fall/search", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(caseToSearch),
      });

      if (response.ok) {
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.detail || "Suche fehlgeschlagen";

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
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

    try {
      const response = await this.request("/api/data/anfrage/search", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(anfrageToSearch),
      });

      if (response.ok) {
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.detail || "Suche fehlgeschlagen";

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
  }

  async TryUpdateFall(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async TryUpdateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }

  async PingSession(): Promise<boolean> {
  const response = await this.request("/api/auth/ping/", {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    this.Logout();
    window.location.href = "/login";
    return false;
  }

  return true;
}

  async SendApiCall(
    url: string,
    method: "GET" | "POST" | "PUT",
    includeCredentials: boolean,
    body: string,
    fallbackErrorMsg: string,
    successAction?: (response: Response) => void,
  ): Promise<{ success: boolean; errorMsg: string }> {
    try {
      const response = await this.request(url, {
        method: method,
        credentials: includeCredentials ? "include" : undefined,
        body: body,
      });

      if (response.ok) {
        if (successAction != undefined) successAction(response);
        return { success: true, errorMsg: "" };
      }

      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error || fallbackErrorMsg;

      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
  }
}
