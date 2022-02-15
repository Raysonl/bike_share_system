import { makeAutoObservable } from "mobx";

export interface Self {
  userId: string;
  userName: string;
  description: string; // bio, 1-2048
  createdTime: Date;
  lastLoginTime: Date;
  gender: number;
  balance: number;
  phone: string;
  status: number;
  exp: number;
  authority: number;
}
export class AppStore {
  user?: Self;
  token?: string;
  isInitialized?: boolean;
  notificationType = 0; // TODO declare `notificationType` as enum
  searchKeyword = "";
  pushToken?: { token: string; vendor: string };

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: Self) {
    this.user = user;
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  setIsInitialized() {
    this.isInitialized = true;
  }

  get isGuest(): boolean {
    return !!this.isInitialized && !this.user;
  }
}

export const appStore = new AppStore();
