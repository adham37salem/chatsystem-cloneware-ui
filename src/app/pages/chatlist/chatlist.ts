import {Component, input, InputSignal} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';

@Component({
  selector: 'app-chatlist',
  imports: [],
  templateUrl: './chatlist.html',
  styleUrl: './chatlist.css',
})
export class Chatlist {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
}
