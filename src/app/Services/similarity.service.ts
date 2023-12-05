import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class SimilarityService {

  constructor(private http:HttpClient) { }

  EditSimilarity(ImageId:string,SimSet:any){
    return this.http.put(`http://127.0.0.1:3000/similar/${ImageId}`,
      {SimSet:SimSet})
  }
}
