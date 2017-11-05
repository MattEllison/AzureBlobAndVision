import { bindingMode } from 'aurelia-binding';
import { BloblStorage } from './../service/blobStorage';
import { bindable, autoinject } from 'aurelia-framework';

@autoinject
export class UploadedPicture {
  @bindable pic;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) pictures;
  constructor(private blobStorage: BloblStorage) {

  }
  DeleteImage(pic) {
    this.blobStorage
      .DeleteImage(pic)
      .then(() => {
        let index = this.pictures.indexOf(pic);
        this.pictures.splice(index, 1);
      });
  }

}

