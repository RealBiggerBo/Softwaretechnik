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
  TryChangePassword(
    curPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): { success: boolean; errorMsg: string };
  TryLogin(user: string, pswd: string): { success: boolean; errorMsg: string };
}

export class MockApiCaller implements IApiCaller {
  TryLogin(user: string, pswd: string): { success: boolean; errorMsg: string } {
    throw new Error("Method not implemented.");
  }
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
    console.log(timeStart, timeEnd, preset, presetOverrides, fileformat);
    return "/test.csv";
  }

  TryChangePassword(
    curPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): { success: boolean; errorMsg: string } {
    const storedPassword = "secret123"; // example

    // 1. Check current password
    if (curPswd !== storedPassword) {
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

    return {
      success: true,
      errorMsg: "",
    };
  }
}
