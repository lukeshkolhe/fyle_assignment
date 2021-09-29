import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  url = "https://api.github.com/";

  constructor(private http: HttpClient) { }
  
  getUserList(key: string, perPage: number, currentPage: number){
    return this.http.get(this.url + "search/users?q=" + key + "&per_page="+ perPage + "&page=" + currentPage);
  }
  getUserDetails(userName: string){
    return this.http.get(this.url + "users/" + userName);
  }
 getRepos(userName: string, perPage: number, currentPage: number){
    return this.http.get(this.url + "users/" + userName + "/repos?per_page="+ perPage + "&page=" + currentPage);
  }
getTopics(url : string){
  return this.http.get(url);
}
}
