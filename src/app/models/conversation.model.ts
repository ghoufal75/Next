export interface Conversation{
  _id : string;
  users : any[];
  messages : any[];
  conversationPic : string;
  unreadMessages ?: number
}
