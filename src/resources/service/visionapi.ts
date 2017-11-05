import { Picture } from './../../Models/Picture';
import { VisionResponse } from './../../Models/VisionResponse';
import { HttpClient } from "aurelia-http-client";

export class VisionApi {
    httpClient;
    subscriptionKey = "311f1c6de3f946e68713e6ca28c580d7";
    azureVisionAnalyzerAPI = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=description"
    constructor() {

        this.httpClient = new HttpClient().configure(x => {
            x.withHeader('Ocp-Apim-Subscription-Key', this.subscriptionKey);
        });
    }
    processImage(imageURL) {
        console.log("Processing image", imageURL);

        return this.httpClient.post(this.azureVisionAnalyzerAPI, {
            url: imageURL
        }).then((result) => {
            console.log("I did get a result", result);
            return new VisionResponse(JSON.parse(result.response));
        })
    }

 

}