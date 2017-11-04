

export class VisionResponse {
    constructor(response) {
        this.caption = response.description.captions[0].text;
        this.name = this.caption = response.description.captions[0].text;
    }
    caption: string;
    name;
}