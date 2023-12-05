import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FlaskService} from "../Services/flask.service";

interface Image {
  id:string
  src: string;
  alt: string;
  themeId:string;
  moment:any;
  histogram:any;
  dominant:any;
  selected: boolean;
}

@Component({
  selector: 'app-similars',
  templateUrl: './similars.component.html',
  styleUrls: ['./similars.component.css']
})
export class SimilarsComponent implements OnInit {
  images: Image[] = [];
  user :any
  ThemeImages : Image [] = [];
  Similar : any = []
  image: any;
  imageSrc:string='';
  galleryImageUrl: string = '';
  value=0;

  constructor(private router: Router, private route: ActivatedRoute,private FlaskSrv:FlaskService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const imageData = params['imageData'];
      const user = params['user']
      if (imageData) {
        this.image = JSON.parse(imageData);
        this.user = JSON.parse(user);
      }
    });
    this.FlaskSrv.GetSimilarities(this.image.id,this.user._id).subscribe((res:any)=>{
      this.Similar = res
      console.log(res)
    },(err)=>{
      console.log("Facing err while trying to retrieve Similarities",err)
    })
  }
  toggleImageSelection(image: Image): void {
    image.selected = !image.selected;
  }
}
