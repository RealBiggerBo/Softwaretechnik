export interface IApiCaller {
  GetUsers(): Promise<{
    success: boolean;
    errorMsg: string;
    json: {
      id: number;
      username: string;
      is_active: boolean;
      is_staff: boolean;
      date_joined: string;
    }[];
  }>;

  GetExportUrl(
    timeStart: string,
    timeEnd: string,
    preset: string,
    presetOverrides: string,
    fileformat: string,
  ): Promise<string>;
  GetStatisticsPresets(): Promise<string[]>;

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
      roles: ("base_user" | "extended_user" | "admin_user")[];
    };
  }>;

  PingSession(): Promise<boolean>;

  Logout(): void;

  TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryCreateCase(newCase: any): Promise<{ success: boolean; errorMsg: string }>;

  TryCreateAnfrage(
    newAnfrage: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TrySearchFall(
    caseToSearch: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TrySearchAnfrage(
    anfrageToSearch: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TrySearchAnfrageByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TrySearchFallByID(
    id: number,
  ): Promise<{ success: boolean; errorMsg: string; json: any }>;

  TryUpdateFall(
    fallToUpdate: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  TryUpdateAnfrage(
    anfrageToUpdate: any,
  ): Promise<{ success: boolean; errorMsg: string }>;

  GetAnfrageJson(): Promise<{ success: boolean; errorMsg: string; json: any }>;

  GetFallJson(): Promise<{ success: boolean; errorMsg: string; json: any }>;

  GetLastAnfrage(): Promise<{ success: boolean; errorMsg: string; json: any }>;

  GetLastFall(): Promise<{ success: boolean; errorMsg: string; json: any }>;
}

export class MockApiCaller implements IApiCaller {
  Logout(): void {
    throw new Error("Method not implemented.");
  }
  async TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }> {
    void user;
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
      roles: ("base_user" | "extended_user" | "admin_user")[];
    };
  }> {
    return {
      success: true,
      errorMsg: "",
      json: { id: 1, username: "superuse", roles: ["admin_user"] },
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
      is_active: boolean;
      is_staff: boolean;
      date_joined: string;
    }[];
  }> {
    //check current user rights -> done in backend
    return {
      success: true,
      errorMsg: "",
      json: [
        {
          id: 1,
          username: "superuse",
          is_active: true,
          is_staff: true,
          date_joined: "2026-01-02T17:21:19.189201Z",
        },
      ],
    };
  }

  async GetStatisticsPresets(): Promise<string[]> {
    return [
      "Statische Angaben zu den Fachberatungstellen Sexulaisierte Gewalt",
      "Alle Statisische Angaben die Wir haben",
      "Preset 3",
    ];
  }

  async GetExportUrl(
    timeStart: string,
    timeEnd: string,
    preset: string,
    presetOverrides: string,
    fileformat: string,
  ): Promise<string> {
    console.log(timeStart, timeEnd, preset, presetOverrides, fileformat);
    return "/test.csv";
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
  async TryCreateCase(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryCreateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TrySearchFall(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TrySearchAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryUpdateFall(): Promise<{ success: boolean; errorMsg: string }> {
    return { success: false, errorMsg: "Not implemented in mock!" };
  }

  async TryUpdateAnfrage(): Promise<{ success: boolean; errorMsg: string }> {
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
}
