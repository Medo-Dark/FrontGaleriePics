import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlaskService } from "../Services/flask.service";

@Component({
  selector: 'app-similars',
  templateUrl: './similars.component.html',
  styleUrls: ['./similars.component.css']
})
export class SimilarsComponent implements OnInit {


  // Create a map to store selected options for each image
  selectedOptionsMap: { [key: string]: { name: string; color: string; disabled: boolean } } = {};

  user: any;
  Similar: any = [];
  image: any;
  imageSrc: string = '';
  galleryImageUrl: string = '';
  value = 0;

  constructor(private router: Router, private route: ActivatedRoute, private FlaskSrv: FlaskService) { }

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
          { name: 'Highly relevant', color: 'green', disabled: false },
          { name: 'Relevant', color: 'green', disabled: false },
          { name: 'No opinion', color: 'blue', disabled: false},
          { name: 'Not relevant', color: 'red', disabled: false},
          { name: 'Highly not relevant', color: 'red', disabled: false},
        ];
      })
      console.log(this.Similar[0])
    }, (err) => {
      console.log("Facing err while trying to retrieve Similarities", err);
    });
  }

  // Use a unique identifier for each image (e.g., image.id) to track selected options
  selectOption(image: any,option:any): void {
    // Update the disabled property for other options of the same image
    image.option.forEach((opt:any) => {
      opt.disabled = opt !== option
    });
  }

}

