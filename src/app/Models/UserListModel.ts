export class UserListModel{
    total_count : number  = 0;
    items : item[] = [];
}
class item {
    login : string = "";
    avatar_url : string = "";
    constructor() {}
}