import type { FilterOption } from "./FilterOption";
import type { Preset } from "./Preset";
import type { PresetItemListElement } from "./StatisticsTypes";
import type { Query } from "./Query";
import type { QueryOutput } from "./StatisticOutput";

export interface IApiCaller {
  TryExportStatistic(
    title: string,
    format: string,
  ): Promise<{
    success: boolean;
    errorMsg: string;
    url: string;
    filename: string;
  }>;

  TryUpdateStatisticPreset(
    type: "Fall" | "Anfrage",
    title: string,
    preset: Preset,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryCreateStatisticPreset(
    type: "Fall" | "Anfrage",
    title: string,
    preset: Preset,
  ): Promise<{ success: boolean; errorMsg: string }>;

  GetStatisticsData(preset: Preset): Promise<{
    success: boolean;
    errorMsg: string;
    results: QueryOutput[];
  }>;

  GetUsers(): Promise<{
    success: boolean;
    errorMsg: string;
    json: {
      id: number;
      username: string;
      date_joined: string;
      role: string;
    }[];
  }>;

  RegisterNewUser(
    username: string,
    password: string,
    password2: string,
  ): Promise<{ success: boolean; errorMsg: string }>;
  DeleteUser(id: number): Promise<{ success: boolean; errorMsg: string }>;
  ChangeUserRole(
    id: number,
    newRole: "base_user" | "extended_user" | "admin_user",
  ): Promise<{ success: boolean; errorMsg: string }>;
  ResetUserPassword(
    id: number,
    newPswd: string,
  ): Promise<{ success: boolean; errorMsg: string }>;

  GetStatisticsPresetList(): Promise<PresetItemListElement[]>;

  GetStatisticsPreset(
    title: string,
  ): Promise<{ success: boolean; errorMsg: string; preset: Preset }>;

  TryChangePassword(
    curPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryLogin(
    user: string,
    pswd: string,
  ): Promise<{ success: boolean; errorMsg: string }>;

  GetCurrentUserRights(): Promise<{
    success: boolean;
    errorMsg: string;
    json: {
      id: number;
      username: string;
      role: "base_user" | "extended_user" | "admin_user";
      last_request_id: number | null;
      last_case_id: number | null;
    };
  }>;

  PingSession(): Promise<boolean>;

  Logout(): void;

  TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryCreateFall(
    newCase: any,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TryCreateAnfrage(
    newAnfrage: any,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TrySearchFall(
    caseToSearch: FilterOption[],
  ): Promise<{ success: boolean; errorMsg: string; searchResult: unknown }>;

  TrySearchAnfrage(
    anfrageToSearch: FilterOption[],
  ): Promise<{ success: boolean; errorMsg: string; searchResult: unknown }>;

  TrySearchAnfrageByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TrySearchFallByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TryUpdateFall(
    fallToUpdate: any,
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryUpdateAnfrage(
    anfrageToUpdate: any,
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryDeleteFall(id: number): Promise<{ success: boolean; errorMsg: string }>;

  TryDeleteAnfrage(id: number): Promise<{ success: boolean; errorMsg: string }>;

  GetAnfrageJson(
    id?: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  GetFallJson(
    id?: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  GetLastAnfrage(): Promise<{ success: boolean; errorMsg: string; json: any }>;

  GetLastFall(): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TryCreateNewDataRecordFall(
    updatedRecord: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryCreateNewDataRecordAnfrage(
    updatedRecord: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  SetLastAnfrage(id: number): Promise<{ success: boolean; errorMsg: string }>;

  SetLastFall(id: number): Promise<{ success: boolean; errorMsg: string }>;
}

export class MockApiCaller implements IApiCaller {
  TryUpdateStatisticPreset(
    type: "Fall" | "Anfrage",
    title: string,
    preset: Preset,
  ): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }
  TryExportStatistic(
    _title: string,
    _format: "csv" | "xlsx" | "pdf",
  ): Promise<{
    success: boolean;
    errorMsg: string;
    url: string;
    filename: string;
  }> {
    return Promise.resolve({
      success: true,
      errorMsg: "",
      url: "/mock/stats/export.csv",
      filename: "export.csv",
    });
  }
  TryCreateStatisticPreset(
    type: "Fall" | "Anfrage",
    title: string,
    preset: Preset,
  ): Promise<{ success: boolean; errorMsg: string }> {
    throw new Error("Method not implemented.");
  }
  async GetStatisticsData(preset: Preset): Promise<{
    success: boolean;
    errorMsg: string;
    results: QueryOutput[];
  }> {
    await new Promise((r) => setTimeout(r, 2000));
    return Promise.resolve({
      success: true,
      errorMsg: "",
      results: [
        {
          queryTitle: "Durchschnittsalter in Stadt Leipzig",
          outputs: [
            {
              displayAction: "Average",
              displayActionTitle: "Durchschnittsalter",
              output: {
                alter: 0.0,
              },
            },
            {
              displayAction: "Average",
              displayActionTitle: "Durchschnittsalter",
              output: {
                alter: 0.0,
              },
            },
          ],
        },
        {
          queryTitle: "Wohnorte (alle)",
          outputs: [
            {
              displayAction: "CountCategorized",
              displayActionTitle: "Anzahl je Wohnort",
              output: {},
            },
          ],
        },
      ],
    });
  }
  GetStatisticsPreset(
    title: string,
  ): Promise<{ success: boolean; errorMsg: string; preset: Preset }> {
    const data = {
      id: 11,
      title: "Hallo",
      payload: {
        globalFilterOptions: [
          {
            type: "DateRangeFilter",
            fieldId: 2,
            minValue: "2026-02-18",
            maxValue: "2026-02-21",
          },
        ],
        queries: [
          { queryTitle: "Test", displayActions: [], filterOptions: [] },
          { queryTitle: "Titel", displayActions: [], filterOptions: [] },
        ],
        globalRecordType: "Anfrage",
      },
      updated_at: "2026-02-18T09:07:06.396296+00:00",
    };
    const payload = data?.payload ?? {};
    const preset: Preset = {
      globalFilterOptions: Array.isArray(payload.globalFilterOptions)
        ? (payload.globalFilterOptions as FilterOption[])
        : [],
      queries: Array.isArray(payload.queries)
        ? (payload.queries as Query[])
        : [],
    };
    return Promise.resolve({ success: true, errorMsg: "", preset });
  }
  Logout(): void {
    throw new Error("Method not implemented.");
  }
  async TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    if (pswd1 == pswd2) {
      return { success: true, errorMsg: "" };
    }
    return { success: false, errorMsg: "Registration Faild" };
  }
  async TryLogin(
    user: string,
    pswd: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    if (user == "test" && pswd == "test") {
      return { success: true, errorMsg: "" };
    } else {
      return { success: false, errorMsg: "Login failed" };
    }
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
    return {
      success: true,
      errorMsg: "",
      json: {
        id: 1,
        username: "superuse",
        role: "admin_user",
        last_request_id: -1,
        last_case_id: -1,
      },
    };
  }
  private users: string[] = ["Alf", "Horst", "James"];
  private storedPassword: string = "secret123";

  async PingSession(): Promise<boolean> {
    return true; // Mock: Session ist immer aktiv
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
    //check current user rights -> done in backend
    return {
      success: true,
      errorMsg: "",
      json: [
        {
          id: 1,
          username: "superuser",
          date_joined: "2026-01-02T17:21:19.189201Z",
          role: "admin",
        },
      ],
    };
  }
  async RegisterNewUser(
    username: string,
    password: string,
    password2: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "not supported in MockApi" };
  }
  async DeleteUser(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "not supported in MockApi" };
  }
  async ChangeUserRole(
    id: number,
    newRole: "base_user" | "extended_user" | "admin_user",
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "not supported in MockApi" };
  }
  async ResetUserPassword(
    id: number,
    newPswd: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "not supported in MockApi" };
  }

  async GetStatisticsPresetList(): Promise<PresetItemListElement[]> {
    return [
      { id: 1, title: "Preset 1", type: "Anfrage", updated_at: "Heute" },
      { id: 2, title: "Preset 2", type: "Fall", updated_at: "Heute" },
      { id: 3, title: "Preset 3", type: "Anfrage", updated_at: "Heute" },
    ];
  }

  async TryChangePassword(
    curPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    // 1. Check current password
    if (curPswd !== this.storedPassword) {
      return {
        success: false,
        errorMsg: "Current password is incorrect",
      };
    }

    // 2. Check new password confirmation
    if (newPswd !== newPswdCtrl) {
      return {
        success: false,
        errorMsg: "New passwords do not match",
      };
    }

    // 3. Basic password rules
    if (newPswd.length < 8) {
      return {
        success: false,
        errorMsg: "New password must be at least 8 characters long",
      };
    }

    // 4. Prevent reusing the same password
    if (newPswd === curPswd) {
      return {
        success: false,
        errorMsg: "New password must be different from the current password",
      };
    }

    // ✅ If we reach here, the change is valid
    // (persist password here in real code)
    this.storedPassword = newPswd;
    return {
      success: true,
      errorMsg: "",
    };
  }
  async TryCreateFall(
    newCase: any,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    return { success: false, errorMsg: "Not implemented in mock!", json: null };
  }

  async TryCreateAnfrage(
    newAnfrage: any,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    return { success: false, errorMsg: "Not implemented in mock!", json: null };
  }

  async TrySearchFall(): Promise<{
    success: boolean;
    errorMsg: string;
    searchResult: unknown;
  }> {
    return {
      success: false,
      errorMsg: "Not implemented in mock!",
      searchResult: {},
    };
  }

  async TrySearchAnfrage(): Promise<{
    success: boolean;
    errorMsg: string;
    searchResult: unknown;
  }> {
    return {
      success: false,
      errorMsg: "Not implemented in mock!",
      searchResult: {},
    };
  }

  async TryUpdateFall(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryUpdateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryDeleteFall(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryDeleteAnfrage(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async GetAnfrageJson(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    return { success: false, errorMsg: "Not implemented in mock!", json: "" };
  }

  async GetFallJson(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    return { success: false, errorMsg: "Not implemented in mock!", json: "" };
  }

  async TrySearchAnfrageByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    void id;
    return { success: false, errorMsg: "Not implemented in mock!", json: null };
  }

  async TrySearchFallByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }> {
    void id;
    return { success: false, errorMsg: "Not implemented in mock!", json: null };
  }

  async GetLastAnfrage(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    return { success: false, errorMsg: "Not implemented in mock!", json: null };
  }

  async GetLastFall(): Promise<{
    success: boolean;
    errorMsg: string;
    json: any;
  }> {
    return { success: false, errorMsg: "Not implemented in mock!", json: null };
  }

  async TryCreateNewDataRecordFall(
    updatedRecord: any,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryCreateNewDataRecordAnfrage(
    updatedRecord: any,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async SetLastAnfrage(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async SetLastFall(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }
}
