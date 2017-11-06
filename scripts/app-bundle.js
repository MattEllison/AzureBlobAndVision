var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-dependency-injection", "./resources/service/blobStorage", "./resources/service/visionapi"], function (require, exports, aurelia_dependency_injection_1, blobStorage_1, visionapi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(blobStorage, visionAPI) {
            this.blobStorage = blobStorage;
            this.visionAPI = visionAPI;
            this.pictures = new Array();
        }
        App.prototype.attached = function () {
            var _this = this;
            this.blobStorage
                .GetPictures()
                .then(function (pictures) {
                console.log("Got pics", pictures);
                pictures.forEach(function (picture) {
                    _this.blobStorage.GetBlobCaption(picture.filename).then(function (caption) {
                        console.log("Caption", caption);
                        picture.caption = caption;
                        _this.pictures.push(picture);
                    });
                });
            });
        };
        App = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [blobStorage_1.BloblStorage, visionapi_1.VisionApi])
        ], App);
        return App;
    }());
    exports.App = App;
});



define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});



define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});



define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});



define('Models/Picture',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Picture = (function () {
        function Picture() {
        }
        Picture.prototype.isNotCat = function () {
            return !this.caption.toLocaleLowerCase().includes("cat");
        };
        return Picture;
    }());
    exports.Picture = Picture;
});



define('Models/VisionResponse',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VisionResponse = (function () {
        function VisionResponse(response) {
            this.caption = response.description.captions[0].text;
            this.name = this.caption = response.description.captions[0].text;
        }
        return VisionResponse;
    }());
    exports.VisionResponse = VisionResponse;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/form-upload',["require", "exports", "./../service/visionapi", "aurelia-dependency-injection", "./../service/blobStorage", "aurelia-framework", "aurelia-binding"], function (require, exports, visionapi_1, aurelia_dependency_injection_1, blobStorage_1, aurelia_framework_1, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormUpload = (function () {
        function FormUpload(blobStorage, visionAPI) {
            this.blobStorage = blobStorage;
            this.visionAPI = visionAPI;
        }
        FormUpload.prototype.filedropped = function (event) {
            event.preventDefault();
            this.dragging = false;
            this.files = event.dataTransfer.files;
            this.Submit();
        };
        FormUpload.prototype.dragOver = function (event) {
            event.preventDefault();
            this.dragging = true;
        };
        FormUpload.prototype.Submit = function () {
            var _this = this;
            this.pictureloading = true;
            this.blobStorage.SavePicture(this.files[0])
                .then(function (picture) {
                _this.visionAPI.processImage(picture.url).then(function (result) {
                    picture.caption = result.caption;
                    _this.blobStorage.updateMetaDataForPicture(picture)
                        .then(function (picture) {
                        _this.pictures.push(picture);
                        _this.pictureloading = false;
                    });
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], FormUpload.prototype, "pictureloading", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], FormUpload.prototype, "pictures", void 0);
        FormUpload = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [blobStorage_1.BloblStorage, visionapi_1.VisionApi])
        ], FormUpload);
        return FormUpload;
    }());
    exports.FormUpload = FormUpload;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/uploaded-picture',["require", "exports", "aurelia-binding", "./../service/blobStorage", "aurelia-framework"], function (require, exports, aurelia_binding_1, blobStorage_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UploadedPicture = (function () {
        function UploadedPicture(blobStorage) {
            this.blobStorage = blobStorage;
        }
        UploadedPicture.prototype.DeleteImage = function (pic) {
            var _this = this;
            this.blobStorage
                .DeleteImage(pic)
                .then(function () {
                var index = _this.pictures.indexOf(pic);
                _this.pictures.splice(index, 1);
            });
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], UploadedPicture.prototype, "pic", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], UploadedPicture.prototype, "pictures", void 0);
        UploadedPicture = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [blobStorage_1.BloblStorage])
        ], UploadedPicture);
        return UploadedPicture;
    }());
    exports.UploadedPicture = UploadedPicture;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/service/blobStorage',["require", "exports", "aurelia-dependency-injection", "./../../Models/Picture", "aurelia-http-client"], function (require, exports, aurelia_dependency_injection_1, Picture_1, aurelia_http_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BloblStorage = (function () {
        function BloblStorage(httpClient) {
            this.httpClient = httpClient;
            this.pictureContainer = "https://catstorageorix.blob.core.windows.net/temp";
            this.sharedKeyInfo = "sv=2017-04-17&ss=bfqt&srt=sco&sp=rwdlacup&se=2017-11-24T20:50:05Z&st=2017-11-04T12:50:05Z&spr=https&sig=lTzCFbApWqiRXlCJ6RHSim9BP2GsYMucxtVGxssxfWg%3D";
        }
        BloblStorage.prototype.SavePicture = function (file) {
            var _this = this;
            this.httpClient.configure(function (x) {
                x.withHeader('x-ms-blob-type', 'BlockBlob');
            });
            return this.httpClient.put(this.pictureContainer + "/" + file.name + "?" + this.sharedKeyInfo, file).then(function (response) {
                var newPic = new Picture_1.Picture();
                newPic.filename = file.name;
                newPic.url = _this.pictureContainer + "/" + file.name;
                return newPic;
            });
        };
        BloblStorage.prototype.updateMetaDataForPicture = function (image) {
            console.log("Meta data update", image);
            var client = new aurelia_http_client_1.HttpClient().configure(function (x) {
                x.withHeader('x-ms-blob-type', 'BlockBlob');
            });
            console.log("Vision response", image);
            return client.createRequest(this.pictureContainer + "/" + image.filename + "?comp=metadata&" + this.sharedKeyInfo)
                .withHeader('x-ms-meta-caption', image.caption)
                .asPut()
                .send()
                .then(function () { return image; });
        };
        BloblStorage.prototype.GetPictures = function () {
            var _this = this;
            this.httpClient.configure(function (x) {
                x.withHeader('Content-Type', 'application/json');
            });
            var url = this.pictureContainer + "?restype=container&comp=list&" + this.sharedKeyInfo;
            console.log("Container Emails", url);
            return this.httpClient.get(url).then(function (result) {
                var pictures = new Array();
                console.log("Getting Pics", result);
                var oParser = new DOMParser();
                var oDOM = oParser.parseFromString(result.response, "text/xml");
                console.log(oDOM);
                var blobs = oDOM.getElementsByTagName("Blob");
                for (var index = 0; index < blobs.length; index++) {
                    console.log("Blob", blobs[index]);
                    var name_1 = blobs[index].getElementsByTagName('Name')[0].textContent;
                    console.log("Name", name_1);
                    var newResult = new Picture_1.Picture();
                    newResult.caption = name_1;
                    newResult.name = name_1;
                    newResult.url = _this.pictureContainer + "/" + name_1;
                    newResult.filename = name_1;
                    pictures.push(newResult);
                }
                return pictures;
            });
        };
        BloblStorage.prototype.GetBlobCaption = function (filename) {
            console.log("Blob url ", this.pictureContainer + "/" + filename + "?" + this.sharedKeyInfo);
            return this.httpClient.get(this.pictureContainer + "/" + filename + "?comp=metadata&" + this.sharedKeyInfo).then(function (result) {
                console.log("Caption result", result);
                if (typeof (result.headers['headers']['x-ms-meta-caption']) == "object") {
                    return result.headers['headers']['x-ms-meta-caption'].value;
                }
                else {
                    return "";
                }
            });
        };
        BloblStorage.prototype.DeleteImage = function (picture) {
            return this.httpClient
                .delete(picture.url + "?" + this.sharedKeyInfo);
        };
        BloblStorage = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient])
        ], BloblStorage);
        return BloblStorage;
    }());
    exports.BloblStorage = BloblStorage;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/service/visionapi',["require", "exports", "./../../Models/VisionResponse", "aurelia-http-client", "aurelia-framework"], function (require, exports, VisionResponse_1, aurelia_http_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VisionApi = (function () {
        function VisionApi(httpClient) {
            var _this = this;
            this.httpClient = httpClient;
            this.subscriptionKey = "311f1c6de3f946e68713e6ca28c580d7";
            this.azureVisionAnalyzerAPI = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=description";
            this.httpClient.configure(function (x) {
                x.withHeader('Ocp-Apim-Subscription-Key', _this.subscriptionKey);
            });
        }
        VisionApi.prototype.processImage = function (imageURL) {
            console.log("Processing image", imageURL);
            return this.httpClient.post(this.azureVisionAnalyzerAPI, {
                url: imageURL
            }).then(function (result) {
                console.log("I did get a result", result);
                return new VisionResponse_1.VisionResponse(JSON.parse(result.response));
            });
        };
        VisionApi = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient])
        ], VisionApi);
        return VisionApi;
    }());
    exports.VisionApi = VisionApi;
});



define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"./resources/elements/form-upload\"></require><require from=\"./resources/elements/uploaded-picture\"></require><h1 style=\"text-align:center\">Cat Verfication Page</h1><form-upload pictures.bind=\"pictures\" pictureloading.bind=\"pictureloading\"></form-upload><div id=\"pictures\"><div class=\"picture\" repeat.for=\"pic of pictures\"><uploaded-picture pictures.bind=\"pictures\" pic.bind=\"pic\"></uploaded-picture></div><div class=\"picture\" if.bind=\"pictureloading\"><img src=\"../loading.gif\" alt=\"\"></div></div><style>#pictures{display:flex;flex-wrap:wrap}#pictures .picture{padding:10px;width:250px}</style></template>"; });
define('text!resources/elements/form-upload.html', ['module'], function(module) { module.exports = "<template><form class=\"box has-advanced-upload\" dragover.trigger=\"dragOver($event)\" dragleave.trigger=\"dragging = false\" drop.trigger=\"filedropped($event)\"><div class=\"box__input ${dragging ? 'dragging':''}\"><input change.delegate=\"Submit()\" class=\"box__file\" type=\"file\" name=\"file\" id=\"file\" files.bind=\"files\" single><label for=\"file\"><i class=\"fa fa-upload fa-5x\"></i><div if.bind=\"dragging\">Let go to upload!</div><div else><div><strong>Click here to upload</strong> <span class=\"box__dragndrop\">or drag it here</span></div></div></label></div></form><style>.box__file{display:none}.box__input{background-color:#fff;outline:2px dashed #000;padding:50px;text-align:center}.box__input.dragging{background-color:#f0f8ff}label{font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande','Lucida Sans',Arial,sans-serif;font-size:200%;cursor:pointer}label i{opacity:.2}</style></template>"; });
define('text!resources/elements/uploaded-picture.html', ['module'], function(module) { module.exports = "<template class.bind=\"pic.isNotCat() ? 'IsNotCat':'IsCat'\"><div class=\"Delete\"><a click.delegate=\"DeleteImage(pic)\" href=\"#\" style=\"float:right\">Delete</a></div><div><div><img class=\"pic\" width=\"250px\" src.bind=\"pic.url\"> <img class=\"wrong\" if.bind=\"pic.isNotCat()\" width=\"250px\" src=\"../../../wrong.png\"></div><div class=\"caption\">${pic.caption}</div></div><style if.bind=\"pic.isNotCat\">.IsNotCat .Delete{padding-bottom:20px}.IsNotCat .pic{position:absolute}.IsNotCat img{position:relative;opacity:.4;height:150px}.IsNotCat .caption{padding-top:20px}</style></template>"; });
//# sourceMappingURL=app-bundle.js.map