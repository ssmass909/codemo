import { action, makeObservable, observable } from "mobx";

class HeaderStore {
  registerModalOpen = false;
  loginModalOpen = false;

  constructor() {
    makeObservable(this, {
      registerModalOpen: observable,
      loginModalOpen: observable,
      setRegisterModalOpen: action,
      setLoginModalOpen: action,
    });
  }

  setRegisterModalOpen = (newValue: boolean) => {
    console.log("invoked!");
    this.registerModalOpen = newValue;
  };

  setLoginModalOpen = (newValue: boolean) => {
    this.loginModalOpen = newValue;
  };
}

export default HeaderStore;
