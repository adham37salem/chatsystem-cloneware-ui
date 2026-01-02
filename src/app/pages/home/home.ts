import {Component, OnInit} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {ChatService} from '../../services/services/chat.service';
import {Chatlist} from '../chatlist/chatlist';
import {KeyCloakService} from '../../utils/keycloak/key-cloak-service';

@Component({
  selector: 'app-home',
  imports: [
    Chatlist
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  chats: Array<ChatResponse> = [];
    ngOnInit(): void {
      this.getAllChats();
    }
    constructor(private chatService: ChatService, private keyClockService: KeyCloakService) {}
    private getAllChats() {
      this.chatService.getChatsByReceiver()
        .subscribe(chats => {
          this.chats = chats;
        })
    }

    async logout() {
      await this.keyClockService.logout();
    }

    async userProfile() {
      await this.keyClockService.accountManagement();
    }

}
