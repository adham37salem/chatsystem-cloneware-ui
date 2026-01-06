import {Component, OnInit} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {ChatService} from '../../services/services/chat.service';
import {Chatlist} from '../chatlist/chatlist';
import {KeyCloakService} from '../../utils/keycloak/key-cloak-service';
import {MessageService} from '../../services/services/message.service';
import {MessageResponse} from '../../services/models/message-response';
import {Message} from 'postcss';
import {DatePipe} from '@angular/common';
import {EmojiData, emojis} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {PickerComponent} from '@ctrl/ngx-emoji-mart';
import {FormsModule} from '@angular/forms';
import {MessageRequest} from '../../services/models/message-request';

@Component({
  selector: 'app-home',
  imports: [
    Chatlist,
    DatePipe,
    PickerComponent,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  chats: Array<ChatResponse> = [];
  selectedChat: ChatResponse = {};
  chatMessages: MessageResponse[] = [];
  showEmojis: boolean = false;
  messageContent: string = '';

  ngOnInit(): void {
    this.getAllChats();
  }

  constructor(
    private chatService: ChatService,
    private keyClockService: KeyCloakService,
    private messageService: MessageService,
  ) {
  }

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
    this.messageService.setMessageToSeen({
      'chat-id': this.selectedChat.id as string,
    }).subscribe({
      next: () => {
        // this.selectedChat.unreadCount = 0;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  uploadMedia(event: any) {

  }

  onSelectEmoji(emojiSelected: any) {
    /* Embed the emoji in the message content */
    const emoji: EmojiData = emojiSelected.emoji;
    this.messageContent += emoji.native;
  }

  keyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }
  onClick() {
    this.setMessagesToSeen();
  }

  sendMessage() {
    if (this.messageContent || this.messageContent.trim() !== '') {
      const messageRequest: MessageRequest = {
        chatId: this.selectedChat.id as string,
        content: this.messageContent,
        type: 'TEXT',
        senderId: this.getSenderId(),
        receiverId: this.getReceiverId()
      }
      this.messageService.saveMessage({
        body: messageRequest,
      }).subscribe({
        next: () => {
          const message: MessageResponse ={
            senderId: this.getSenderId(),
            receiverId: this.getReceiverId(),
            content: this.messageContent,
            type: 'TEXT',
            state: 'SENT',
            createdAt: new Date().toDateString(),
          };

          this.selectedChat.lastMessage = this.messageContent;
          this.chatMessages.push(message);
          this.messageContent = '';
          this.showEmojis = false;

        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  private getSenderId() {
    if (this.selectedChat.senderId === this.keyClockService.userId) {
      return this.selectedChat.senderId as string;
    }
    else {
      return this.selectedChat.receiverId as string;
    }
  }

  private getReceiverId() {
    if (this.selectedChat.receiverId === this.keyClockService.userId) {
      return this.selectedChat.receiverId as string;
    }
    else {
      return this.selectedChat.senderId as string;
    }
  }
}
