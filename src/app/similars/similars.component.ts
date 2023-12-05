import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskService } from "../Services/flask.service";
import {SimilarityService} from '../Services/similarity.service'

@Component({
  selector: 'app-similars',
  templateUrl: './similars.component.html',
  styleUrls: ['./similars.component.css']
})
export class SimilarsComponent implements OnInit {


  counter = 0
  user: any;
  Similar: any = [];
  image: any;
  imageSrc: string = '';
  galleryImageUrl: string = '';
  value = 0;

  constructor(private router: Router, private route: ActivatedRoute, private FlaskSrv: FlaskService ,private SimSrv:SimilarityService) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const imageData = params['imageData'];
      const user = params['user'];
      if (imageData) {
        this.image = JSON.parse(imageData);
        this.user = JSON.parse(user);
      }
    });
    this.FlaskSrv.GetSimilarities(this.image.id, this.user._id).subscribe((res: any) => {
      this.Similar = res;
      this.Similar.forEach((obj:any)=>{
        obj.option = [
          { name: 'Highly relevant', color: 'dark-green',score:3, disabled: false },
          { name: 'Relevant', color: 'green',score:1, disabled: false },
          { name: 'No opinion', color: 'blue',score:0, disabled: false},
          { name: 'Not relevant', color: 'red',score:-1, disabled: false},
          { name: 'Highly not relevant', color: 'dark-red',score:-3, disabled: false},
        ];
      })
    }, (err) => {
      console.log("Facing err while trying to retrieve Similarities", err);
    });
  }

  // Use a unique identifier for each image (e.g., image.id) to track selected options
  selectOption(image: any,option:any): void {
    this.counter +=1
    // Update the disabled property for other options of the same image
    image.option.forEach((opt:any) => {
      opt.disabled = opt !== option
    });
    this.ScoreAction(option.score,image)
  }

  ScoreAction(score:any,image:any){
    switch (score) {
      case 3:
        // Code for 'Highly relevant'
        image.distance /=3
        break;
      case 1:
        // Code for 'Relevant'
        image.distance /=2
        break;
      case -1:
        // Code for 'Not relevant'
        image.distance *=2
        break;
      case -3:
        // Code for 'Highly not relevant'
        image.distance *=3
        break;
      default:
        // Code for handling other cases if needed
        console.log('Unknown score');
    }
  }
  FeedBack(){
    console.log("IN FEED")
    this.SimSrv.EditSimilarity(this.image.id,this.Similar).subscribe((res:any)=>{
      this.Similar = res
      this.Similar.forEach((obj:any)=>{
        obj.option = [
          { name: 'Highly relevant', color: 'dark-green',score:3, disabled: false },
          { name: 'Relevant', color: 'green',score:1, disabled: false },
          { name: 'No opinion', color: 'blue',score:0, disabled: false},
          { name: 'Not relevant', color: 'red',score:-1, disabled: false},
          { name: 'Highly not relevant', color: 'dark-red',score:-3, disabled: false},
        ];
      })
      this.counter = 0;

    },(err)=>{
      console.log("Err while trying to alter Similarity")
    })
  }
}

