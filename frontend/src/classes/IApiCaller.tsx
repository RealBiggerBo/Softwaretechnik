export interface IApiCaller {
  GetUsers(): Promise<string[]>;
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
  TryRegister(
    user: string,
    pswd1: string,
    pswd2: string,
  ): Promise<{ success: boolean; errorMsg: string }>;
}

export class MockApiCaller implements IApiCaller {
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
  private users: string[] = ["Alf", "Horst", "James"];
  private storedPassword: string = "secret123";

  async GetUsers(): Promise<string[]> {
    //check current user rights -> done in backend
    return this.users;
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
}
