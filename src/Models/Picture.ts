  

export class Picture {
    filename: any;
    caption: string;
    name;
    url;
    isNotCat(){
        return !this.caption.toLocaleLowerCase().includes("cat");
    }
}