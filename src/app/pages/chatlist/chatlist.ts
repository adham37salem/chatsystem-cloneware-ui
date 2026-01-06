import {Component, input, InputSignal, output} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {fakeAsync} from '@angular/core/testing';
import {DatePipe} from '@angular/common';
import {UserResponse} from '../../services/models/user-response';
import {UserService} from '../../services/services/user.service';
import {ChatService} from '../../services/services/chat.service';
import {KeyCloakService} from '../../utils/keycloak/key-cloak-service';

@Component({
  selector: 'app-chatlist',
  imports: [
    DatePipe
  ],
  templateUrl: './chatlist.html',
  styleUrl: './chatlist.css',
  providers: [DatePipe]
})
export class Chatlist {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact: boolean = false;
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();
  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private keyCloakService: KeyCloakService,
    private datePipe: DatePipe
  ) {}


  formatChatTimeStamp(value?: string): string {
    const date = this.parseDate(value);
    if (!date)
      return '';
    const now = new Date();
    if (this.isSameDay(date, now)) {
      return this.datePipe.transform(date, 'HH:mm') ?? '';
    }
    return this.datePipe.transform(date, 'dd.MM.yy') ?? '';
  }

  private isSameDay(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
  }

  private parseDate(value?: string): Date | null {
    if (!value)
      return null;
    // supports epoch milliseconds as string too
    if (/^\d+$/.test(value)) {
      const date = new Date(Number(value));
      return isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }


  searchContact() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.contacts = users;
        this.searchNewContact = true;
      }
    });
  }

  selectContact(contact: UserResponse) {
    const myId = this.keyCloakService.userId as string;
    const existing = this.chats().find(c =>
      (c.senderId === myId && myId && c.receiverId === contact.id) || (c.senderId === contact.id && c.receiverId === myId)
    );
    if (existing) {
      this.searchNewContact = false;
      this.chatSelected.emit(existing);
      return;
    }

    this.chatService.createChat({
      'sender-id': this.keyCloakService.userId as string,
      'receiver-id': contact.id as string,
    }).subscribe({
      next: (res) => {
        const chat: ChatResponse = {
          id: res.response,
          name: contact.firstName + ' ' + contact.lastName,
          senderId: this.keyCloakService.userId as string,
          receiverId: contact.id as string,
          recipientOnline: contact.online,
          lastMessageTime: contact.lastSeen,
        };
        if (!this.chats().some(c => c.id === chat.id)) {
          this.chats().unshift(chat);
        }
        this.searchNewContact = false;
        this.chatSelected.emit(chat);
      }
    });
  }

  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }

  wrapMessage(lastMessage: string | undefined) {
    if (lastMessage && lastMessage.length <= 20) {
      return lastMessage;
    }
    return lastMessage?.substring(0,17) + '...';
  }
}
