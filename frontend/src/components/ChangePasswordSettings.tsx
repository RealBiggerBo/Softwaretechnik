import type { IApiCaller } from "../classes/IApiCaller";
import PasswordInput from "../components/PasswordInput";

interface Props {
  caller: IApiCaller;
}
//Generiert den Change Password bereich in den Einstellungen
function ChangePasswordSettings({ caller }: Props) {
  return (
    <form className="passwordChangeForm">
      <PasswordInput label="Altes Passwort" id="oldPassword" />
      <PasswordInput label="Neues Passwort" id="newPassword" />
      <PasswordInput
        label="Neues Passwort (Kontrolle)"
        id="newPasswordControl"
      />
      <button id="submit" className="passwordChangeSubmitBtn">
        Passwort ändern
      </button>
    </form>
  );
}

export default ChangePasswordSettings;
