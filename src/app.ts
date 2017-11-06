import { autoinject } from 'aurelia-dependency-injection';
import { BloblStorage } from './resources/service/blobStorage';
import { Picture } from './Models/Picture';
import { VisionResponse } from './Models/VisionResponse';
import { VisionApi } from './resources/service/visionapi';
import { HttpClient } from "aurelia-http-client";



@autoinject
export class App {
  files;
  pictures: Array<Picture> = new Array<Picture>();

  constructor(private blobStorage: BloblStorage, private visionAPI: VisionApi) {

  }

  attached() {
    this.blobStorage
      .GetPictures()
      .then(pictures => {
        console.log("Got pics", pictures)
        pictures.forEach(picture => {
          this.blobStorage.GetBlobCaption(picture.filename).then(caption => {
            console.log("Caption",caption);
            picture.caption = caption;
            this.pictures.push(picture);
          });
        });


      });
  }

}
