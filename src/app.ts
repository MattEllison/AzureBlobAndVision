import { autoinject } from 'aurelia-dependency-injection';
import { BloblStorage } from './resources/service/blobStorage';
import { Picture } from './Models/Picture';
import { VisionResponse } from './Models/VisionResponse';
import { VisionApi } from './resources/service/visionapi';
import { HttpClient } from "aurelia-http-client";



@autoinject
export class App {
  files;
  //blobUrl = "https://catstorageorix.blob.core.windows.net/temp/small-kitten-meowing2.jpg?sv=2017-04-17&ss=bfqt&srt=sco&sp=rwdlacup&se=2017-11-04T20:50:05Z&st=2017-11-04T12:50:05Z&spr=https&sig=mdbAJAV5j9l7h3Fa1nP1Nl%2Bu1f6uwGDv1GidxPCxdfo%3D";
  pictures: Array<Picture> = new Array<Picture>();

  constructor(private blobStorage: BloblStorage, private visionAPI: VisionApi) {
    this.blobStorage
      .GetPictures()
      .then((pictures) => {
        console.log("Got pics", pictures)
        pictures.forEach(picture => {
          this.blobStorage.GetBlobCaption(picture.filename).then(caption => {
            picture.caption = caption;
            this.pictures.push(picture);
          });
        });


      });
  }
  


}
