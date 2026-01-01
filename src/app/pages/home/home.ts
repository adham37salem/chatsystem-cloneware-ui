import {Component, OnInit} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {ChatService} from '../../services/services/chat.service';
import {Chatlist} from '../chatlist/chatlist';

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
    constructor(private chatService: ChatService) {}
    private getAllChats() {
      this.chatService.getChatsByReceiver()
        .subscribe(chats => {
          this.chats = chats;
        })
    }

}
