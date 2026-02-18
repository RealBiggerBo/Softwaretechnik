import type { FilterOption } from "./FilterOption";
import type { IApiCaller } from "./IApiCaller";
import type { Preset } from "./Preset";
import type { PresetItemListElement } from "./StatisticsTypes";

const baseurl = "http://127.0.0.1:8000";
const headers = new Headers();
headers.set("Content-Type", "application/json");
const authToken = sessionStorage.getItem("authToken");
if (authToken) {
  headers.set("Authorization", `token ${authToken}`);
}

export class ApiCaller implements IApiCaller {
  async TryExportStatistic(
    title: string,
    format: "csv" | "xlsx" | "pdf",
  ): Promise<{
    success: boolean;
    errorMsg: string;
    url: string;
    filename: string;
  }> {
    let downloadUrl = "";
    let filename = "";
    const body = { presetTitle: title, FileFormat: format };

    const res = await this.SendApiCall(
      "/api/stats/presets/export",
      "POST",
      true,
      JSON.stringify(body),
      "Export konnte nicht gestartet werden.",
      async (response: Response) => {
        const data = await response.json().catch(() => ({}));
        downloadUrl =
          typeof data?.download_url === "string" ? data.download_url : "";
        filename = typeof data?.filename === "string" ? data.filename : "";
      },
    );
    downloadUrl = "http://localhost:8000" + downloadUrl;
    return { ...res, url: downloadUrl, filename };
  }

  async TryCreateStatisticPreset(
    type: "Fall" | "Anfrage",
    title: string,
    preset: Preset,
  ): Promise<{ success: boolean; errorMsg: string }> {
    preset.PresetTitle = title;
    preset.globalRecordType = type;
    const res = await this.SendApiCall(
      `/api/stats/presets/create`,
      "POST",
      true,
      JSON.stringify(preset),
      "Vorlage konnte nicht erstellt werden.",
    );
    return res;
  }

  async GetStatisticsPreset(
    title: string,
  ): Promise<{ success: boolean; errorMsg: string; preset: Preset }> {
    let preset: Preset = {
      globalFilterOptions: [],
      queries: [],
    };

    const body = { PresetTitle: title };

    const res = await this.SendApiCall(
      "/api/stats/presets/get",
      "POST",
      true,
      JSON.stringify(body),
      "Vorlage konnte nicht geladen werden.",
      async (response) => {
        const data = await response.json();
        const payload = data?.payload ?? {};

        preset = {
          globalFilterOptions: Array.isArray(payload.globalFilterOptions)
            ? payload.globalFilterOptions
            : [],
          queries: Array.isArray(payload.queries) ? payload.queries : [],
        };
      },
    );
    console.log(res);

    return { ...res, preset };
  }

  Logout(): void {
    headers.delete("Authorization");
    sessionStorage.removeItem("authToken");
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
          sessionStorage.setItem("authToken", data.token);
        }),
    );
  }
  async GetCurrentUserRights(): Promise<{
    success: boolean;
    errorMsg: string;
    json: {
      id: number;
      username: string;
      role: "base_user" | "extended_user" | "admin_user";
      last_request_id: number | null;
      last_case_id: number | null;
    };
  }> {
    let result: any = null;

    const res = await this.SendApiCall(
      `/api/auth/me/`,
      "GET",
      true,
      undefined,
      "Anfrage fehlgeschlagen.",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, json: result };
  }
  async GetUsers(): Promise<{
    success: boolean;
    errorMsg: string;
    json: {
      id: number;
      username: string;
      date_joined: string;
      role: string;
    }[];
  }> {
    let result: any = null;

    const res = await this.SendApiCall(
      `/api/auth/admin/users/`,
      "GET",
      true,
      undefined,
      "Anfrage fehlgeschlagen.",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, json: result };
  }
  async RegisterNewUser(
    username: string,
    password: string,
    password2: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    const passwordObject = {
      username: username,
      password: password,
      password2: password2,
    };

    return await this.SendApiCall(
      `/api/auth/admin/users/register/`,
      "POST",
      true,
      JSON.stringify(passwordObject),
      "Anfrage fehlgeschlagen.",
    );
  }
  async DeleteUser(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return await this.SendApiCall(
      `/api/auth/admin/users/` + id + `/delete/`,
      "DELETE",
      true,
      undefined,
      "Löschen fehlgeschlagen.",
    );
  }
  async ChangeUserRole(
    id: number,
    newRole: "base_user" | "extended_user" | "admin_user",
  ): Promise<{ success: boolean; errorMsg: string }> {
    return await this.SendApiCall(
      `/api/auth/admin/users/` + id + `/role/`,
      "POST",
      true,
      JSON.stringify({ role: newRole }),
      "Berechtigungsänderung fehlgeschlagen.",
    );
  }

  async ResetUserPassword(
    id: number,
    newPswd: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return await this.SendApiCall(
      `/api/auth/admin/users/` + id + `/reset-password/`,
      "POST",
      true,
      JSON.stringify({ new_password: newPswd }),
      "Zurücksetzen des Passworts fehlgeschlagen.",
    );
  }

  async GetStatisticsPresetList(): Promise<PresetItemListElement[]> {
    let presets: PresetItemListElement[] = [];

    await this.SendApiCall(
      "/api/stats/presets",
      "GET",
      true,
      undefined,
      "Vorlagen konnten nicht geladen werden.",
      async (response) => {
        const data = await response.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        presets = items.map((item: any) => ({
          id: Number(item?.id),
          title: String(item?.title ?? ""),
          type: String(item?.recordType ?? ""),
          updated_at: String(item?.updated_at ?? ""),
        }));
      },
    );

    return presets;
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

  async TryCreateFall(
    caseToCreate: any,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    let result: any = null;
    const res = await this.SendApiCall(
      "/api/data/data/fall",
      "POST",
      true,
      JSON.stringify(caseToCreate),
      "Erstellen fehlgeschlagen",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, json: result };
  }

  async TryCreateAnfrage(
    anfrageToCreate: any,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    let result: any = null;
    const res = await this.SendApiCall(
      "/api/data/data/anfrage",
      "POST",
      true,
      JSON.stringify(anfrageToCreate),
      "Erstellen fehlgeschlagen",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, json: result };
  }

  async TrySearchFall(
    caseToSearch: FilterOption[],
  ): Promise<{ success: boolean; errorMsg: string; searchResult: unknown }> {
    let searchObject = { recordType: "Fall", filterOptions: caseToSearch };
    let result: unknown;
    const res = await this.SendApiCall(
      "/api/search/execute",
      "POST",
      true,
      JSON.stringify(searchObject),
      "Suche fehlgeschlagen",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, searchResult: result };
  }

  async TrySearchAnfrage(
    anfrageToSearch: FilterOption[],
  ): Promise<{ success: boolean; errorMsg: string; searchResult: unknown }> {
    const searchObject = {
      recordType: "Anfrage",
      filterOptions: anfrageToSearch,
    };
    let result: unknown;
    const res = await this.SendApiCall(
      "/api/search/execute",
      "POST",
      true,
      JSON.stringify(searchObject),
      "Suche fehlgeschlagen",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, searchResult: result };
  }

  async TrySearchAnfrageByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    let result: any = null;

    const res = await this.SendApiCall(
      `/api/data/search/anfrage?id=${id}`,
      "GET",
      true,
      undefined,
      "Suche fehlgeschlagen.",
      async (response) => {
        result = await response.json();
      },
    );
    return { ...res, json: result };
  }

  async TrySearchFallByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    let result: any = null;

    const res = await this.SendApiCall(
      `/api/data/search/fall?id=${id}`,
      "GET",
      true,
      undefined,
      "Suche fehlgeschlagen.",
      async (response) => {
        result = await response.json();
      },
    );

    return { ...res, json: result };
  }

  async TryUpdateFall(
    fallToUpdate: any,
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      `/api/data/data/fall?id=${id}`,
      "PUT",
      true,
      JSON.stringify(fallToUpdate),
      "Aktualisierung fehlgeschlagen",
    );
  }

  async TryUpdateAnfrage(
    anfrageToUpdate: any,
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      `/api/data/data/anfrage?id=${id}`,
      "PUT",
      true,
      JSON.stringify(anfrageToUpdate),
      "Aktualisierung fehlgeschlagen",
    );
  }

  async TryDeleteFall(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      `/api/data/data/fall?id=${id}`,
      "DELETE",
      true,
      undefined,
      "Löschen fehlgeschlagen",
    );
  }

  async TryDeleteAnfrage(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return this.SendApiCall(
      `/api/data/data/anfrage?id=${id}`,
      "DELETE",
      true,
      undefined,
      "Löschen fehlgeschlagen",
    );
  }

  async PingSession(): Promise<boolean> {
    //TODO: use 'SendApiCall' instead of 'request'
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

  async GetAnfrageJson(id?: number): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    let result: any = null;
    const idPath = id ? "?id=" + id : "";
    const res = await this.SendApiCall(
      //"/api/data/data_record/anfrage?id=3",
      "/api/data/data_record/anfrage" + idPath,
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

  async GetFallJson(id?: number): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    let result: any = null;
    const idPath = id ? "?id=" + id : "";
    const res = await this.SendApiCall(
      "/api/data/data_record/fall" + idPath,
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

  async GetLastAnfrage(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    return { success: false, errorMsg: "Not implemented!", json: null };
  }

  async GetLastFall(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    return { success: false, errorMsg: "Not implemented", json: null };
  }

  async TryCreateNewDataRecordFall(
    updatedRecord: any,
  ): Promise<{ success: boolean; errorMsg: string }> {
    const res = this.SendApiCall(
      "/api/data/data_record/fall",
      "POST",
      true,
      JSON.stringify(updatedRecord),
      "Speicherung der Änderungen Fehlgeschlagen!",
    );
    if ((await res).success) {
      alert("Erfolgreich gespeichert!");
    }
    return res;
  }

  async TryCreateNewDataRecordAnfrage(
    updatedRecord: any,
  ): Promise<{ success: boolean; errorMsg: string }> {
    const res = this.SendApiCall(
      "/api/data/data_record/anfrage",
      "POST",
      true,
      JSON.stringify(updatedRecord),
      "Speicherung der Änderungen Fehlgeschlagen!",
    );
    if ((await res).success) {
      alert("Erfolgreich gespeichert!");
    }
    return res;
  }

  async SetLastAnfrage(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented!" };
  }

  async SetLastFall(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented!" };
  }

  private async SendApiCall(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    includeCredentials: boolean,
    body: any,
    fallbackErrorMsg: string,
    successAction?: (response: Response) => Promise<void>,
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
    } catch (error) {
      console.log(error);
      return { success: false, errorMsg: "Netzwerk Fehler" };
    }
  }
}
