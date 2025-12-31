import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {
  private _keycloak: Keycloak | undefined;

  constructor() {}
  get keyClock() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:8000',
        realm: 'whatsapp-clone',
        clientId: 'whatsapp-clone-app',
      });
    }
    return this._keycloak;
  }

  async init() {
    const authenticated = await this.keyClock.init({
      onLoad: 'login-required',
    });
  }

  async login() {
    await this.keyClock.login();
  }

  get userId(): string {
    return this.keyClock?.tokenParsed?.sub as string;
  }

  get fullName(): string {
    return this.keyClock.tokenParsed?.['name'] as string;
  }

  async logout() {
    return this.keyClock.login({
      redirectUri: 'http://localhost:4200'
    });
  }

  async accountManagement() {
    return this.keyClock.accountManagement();
  }


}
