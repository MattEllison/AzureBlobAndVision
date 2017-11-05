import { Picture } from './../../Models/Picture';
import { VisionApi } from './../service/visionapi';
import { autoinject } from 'aurelia-dependency-injection';
import { BloblStorage } from './../service/blobStorage';
import { bindable } from "aurelia-framework";
import { VisionResponse } from '../../Models/VisionResponse';
import { bindingMode } from 'aurelia-binding';

@autoinject
export class FormUpload {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) pictureloading;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) pictures;
    files;
    constructor(private blobStorage: BloblStorage, private visionAPI: VisionApi) {

    }

    filedropped(event) {
        event.preventDefault();
        this.dragging = false;
        this.files = event.dataTransfer.files;
        this.Submit();
    }
    dragging;
    dragOver(event) {
        event.preventDefault();
        this.dragging = true;
    }
    Submit() {
        this.pictureloading = true;
        this.blobStorage.SavePicture(this.files[0])
            .then((picture: Picture) => {
                this.visionAPI.processImage(picture.url).then((result: VisionResponse) => {
                    picture.caption = result.caption;
                    this.blobStorage.updateMetaDataForPicture(picture)
                        .then((picture: Picture) => {
                            this.pictures.push(picture);
                            this.pictureloading = false;

                        });
                })
            });
    }


}