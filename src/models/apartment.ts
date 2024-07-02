export interface IApartmentDto {
    rooms:number;
    name:string;
    price:number;
    description:string;
}

export interface IApartment extends IApartmentDto {
    id:string;
}