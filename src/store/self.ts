import { runInAction } from "mobx";
import { Self } from "./app";
import { appStore } from "./app";

export const setSelfToStore = (selfResponse: Self & { token: string }) => {
  runInAction(() => {
    appStore.setIsInitialized();
    appStore.setUser(selfResponse);
  });
};
