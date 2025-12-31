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
        url: 'http://localhost:9090',
        realm: 'whatsapp-clone',
        clientId: 'whatsapp-clone',
      });
    }
    return this._keycloak;
  }

  async init() {
    const authenticated = await this.keyClock.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      redirectUri: 'http://localhost:4200'
    });
  }

  async login() {
    await this.keyClock.login({
      redirectUri: 'http://localhost:4200'
    });
  }

  get userId(): string {
    return this.keyClock?.tokenParsed?.sub as string;
  }

  get fullName(): string {
    return this.keyClock.tokenParsed?.['name'] as string;
  }

  async logout() {
    return this.keyClock.logout({
      redirectUri: 'http://localhost:4200'
    });
  }

  async accountManagement() {
    return this.keyClock.accountManagement();
  }

  async register() {
    try {
      // Use Keycloak JS library's register method which should handle URL construction correctly
      // This will redirect to Keycloak's registration page
      await this.keyClock.register({
        redirectUri: 'http://localhost:4200',
        locale: 'en'
      });
    }
    catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

}
