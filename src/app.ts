import { BloblStorage } from './resources/service/blobStorage';
import { Picture } from './Models/Picture';
import { VisionResponse } from './Models/VisionResponse';
import { VisionApi } from './resources/service/visionapi';

//import { StorageServiceClient } from '~azure-storage/lib/common/common';
//import { createBlobServiceAnonymous } from "azure-storage";


import { HttpClient } from "aurelia-http-client";

export class App {
  blobStorage: BloblStorage;
  message = 'Hello World!';
  files;
  //blobUrl = "https://catstorageorix.blob.core.windows.net/temp/small-kitten-meowing2.jpg?sv=2017-04-17&ss=bfqt&srt=sco&sp=rwdlacup&se=2017-11-04T20:50:05Z&st=2017-11-04T12:50:05Z&spr=https&sig=mdbAJAV5j9l7h3Fa1nP1Nl%2Bu1f6uwGDv1GidxPCxdfo%3D";
  pictures: Array<Picture> = new Array<Picture>();
  visionAPI: VisionApi;
  constructor() {
    this.visionAPI = new VisionApi();
    this.blobStorage = new BloblStorage();
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

  NewName() {
    return `https://catstorageorix.blob.core.windows.net/temp/${this.files[0].name}?sv=2017-04-17&ss=bfqt&srt=sco&sp=rwdlacup&se=2017-11-04T20:50:05Z&st=2017-11-04T12:50:05Z&spr=https&sig=mdbAJAV5j9l7h3Fa1nP1Nl%2Bu1f6uwGDv1GidxPCxdfo%3D`;
  }

  MetaDataHeader() {
    return `https://catstorageorix.blob.core.windows.net/temp/`
  }

  Submit() {

    this.blobStorage.SavePicture(this.files[0])
      .then((picture) => {
        let url = `https://catstorageorix.blob.core.windows.net/temp/${picture.filename}`;
        this.visionAPI.processImage(url).then((result: VisionResponse) => {
          picture.caption = result.caption;
          this.blobStorage.updateMetaDataForPicture(picture)
            .then((picture: Picture) => {
              this.pictures.push(picture);
            });
        })


      });

    // let client = new HttpClient().configure(x => {
    //   x.withHeader('x-ms-blob-type', 'BlockBlob');
    // });

    // client.put(this.NewName(), this.files[0])
    //   .then(data => {
    //     let url = `https://catstorageorix.blob.core.windows.net/temp/${this.files[0].name}`;
    //     this.visionAPI.processImage(url).then((result: Picture) => {
    //       result.filename = this.files[0].name;
    //       this.blobStorage.updateMetaDataForPicture(result);

    //       // console.log("Vision response", result)
    //       // client.createRequest(`${url}?comp=metadata`)
    //       //   .withHeader('x-ms-meta-caption', result.caption)
    //       //   .asPut()
    //       //   .send();
    //     });

    //     this.blobStorage.GetPictures().then((result) => {
    //       this.pictures = result;
    //     });
    //   });







    console.log("Submitted Again");



  }
}
