import { autoinject } from 'aurelia-dependency-injection';
import { Picture } from './../../Models/Picture';
import { HttpClient } from 'aurelia-http-client';
  
@autoinject
export class BloblStorage {
    pictureContainer = "https://catstorageorix.blob.core.windows.net/temp";
    sharedKeyInfo = "sv=2017-04-17&ss=bfqt&srt=sco&sp=rwdlacup&se=2017-11-24T20:50:05Z&st=2017-11-04T12:50:05Z&spr=https&sig=lTzCFbApWqiRXlCJ6RHSim9BP2GsYMucxtVGxssxfWg%3D";

    constructor(private httpClient:HttpClient){

    }
    SavePicture(file) {

        let client = new HttpClient().configure(x => {
            x.withHeader('x-ms-blob-type', 'BlockBlob');
        });

        return client.put(`${this.pictureContainer}/${file.name}?${this.sharedKeyInfo}`, file).then((response) => {
            let newPic = new Picture();
            newPic.filename = file.name;
            newPic.url = `${this.pictureContainer}/${file.name}`;
            return newPic;
        })
    }

    updateMetaDataForPicture(image: Picture) {
        console.log("Meta data update", image);
        let client = new HttpClient().configure(x => {
            x.withHeader('x-ms-blob-type', 'BlockBlob');
        });

        console.log("Vision response", image)
        return client.createRequest(`${this.pictureContainer}/${image.filename}?comp=metadata&${this.sharedKeyInfo}`)
            .withHeader('x-ms-meta-caption', image.caption)
            .asPut()
            .send()
            .then(() => image);
    }



    GetPictures() {
        
        let client = new HttpClient().configure(x => {
            //        ajaxRequest.setRequestHeader('x-ms-blob-type', 'BlockBlob');
            x.withHeader('Content-Type', 'application/json');
        });


        let url = `${this.pictureContainer}?restype=container&comp=list&${this.sharedKeyInfo}`
        console.log("Container Emails",url);
        return client.get(url).then((result) => {
            let pictures = new Array<Picture>();
            console.log("Getting Pics", result);
            var oParser = new DOMParser();
            var oDOM = oParser.parseFromString(result.response, "text/xml");
            console.log(oDOM);
            var blobs = oDOM.getElementsByTagName("Blob")
            for (var index = 0; index < blobs.length; index++) {
                console.log("Blob",blobs[index]);
                let name = blobs[index].getElementsByTagName("Name")[0].innerHTML;


                let newResult = new Picture();
                newResult.caption = name;
                newResult.name = name;
                newResult.url = `${this.pictureContainer}/${name}`;
                newResult.filename = name;
                pictures.push(newResult);

            }
            return pictures;


        })
    }

    GetBlobCaption(filename) {
        let client = new HttpClient();
        console.log("Blob url ", `${this.pictureContainer}/${filename}?${this.sharedKeyInfo}`);
        return client.get(`${this.pictureContainer}/${filename}?${this.sharedKeyInfo}`).then((result) => {
            return result.headers['headers']['x-ms-meta-caption'].value;
        })
    }


    DeleteImage(picture:Picture){
        return this.httpClient
        .delete(`${picture.url}?${this.sharedKeyInfo}`);
        

    }
}