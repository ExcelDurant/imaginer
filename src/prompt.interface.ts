export interface Prompt {
    id:string;
    text:string;
    user:string;
    isPaid:boolean;
    status:string;
    images:string[];
    failed:boolean;
    isCompleted:boolean;
    createdAt:any;
    paidAt:any;
}