export class MessageModel{
    message:string;
    author:string;
    author_id:number;
    offer_id:number;
    offer_origin:string;
    foto:string;
    id:number;
    

    constructor(message:string ='', author:string='', author_id:number=0, offer_id:number=0,foto:string ='',offer_origin='',id:number=0){
        this.message = message;
        this.author = author;
        this.author_id = author_id;
        this.offer_id = offer_id;
        this.offer_origin = offer_origin;
        this.foto=foto;
        this.id=id;
    }
}