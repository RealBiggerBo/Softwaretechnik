export interface IApiCaller {
  GetUsers(): string[];
}

export class MockApiCaller implements IApiCaller {
  private users: string[] = ["Alf", "Horst", "James"];

  GetUsers(): string[] {
    //check current user rights -> done in backend
    return this.users;
  }
}
