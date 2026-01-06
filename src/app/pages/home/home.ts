import {Component, OnInit} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {ChatService} from '../../services/services/chat.service';
import {Chatlist} from '../chatlist/chatlist';
import {KeyCloakService} from '../../utils/keycloak/key-cloak-service';
import {MessageService} from '../../services/services/message.service';
import {MessageResponse} from '../../services/models/message-response';
import {Message} from 'postcss';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    Chatlist,
    DatePipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  chats: Array<ChatResponse> = [];
  selectedChat: ChatResponse = {};
  chatMessages: MessageResponse[] = [];
    ngOnInit(): void {
      this.getAllChats();
    }
    constructor(
      private chatService: ChatService,
      private keyClockService: KeyCloakService,
      private messageService: MessageService,
    ) {}
    getAllChats() {
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

    chatSelected(chatResponse: ChatResponse) {
      this.selectedChat = chatResponse;
      this.getAllChatMessages(chatResponse.id as string);
      this.setMessagesToSeen();
      // this.selectedChat.unreadCount = 0;
    }

    private getAllChatMessages(chatId: string) {
      this.messageService.getAllMessages({
        'chat-id': chatId,
      }).subscribe({
        next: (messages) => {
          this.chatMessages = messages;
        }
      });
    }

    isSelfMessage(message: MessageResponse) {
       return message.senderId === this.keyClockService.userId;
    }

    private setMessagesToSeen() {

    }

    uploadMedia(event: any) {

    }
}
