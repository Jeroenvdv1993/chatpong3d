
export class SelectedCard{
    image: any | null = null;
    ulID: string | null = null;
    ulIndex: number | null = null;
    empty(): void{
        this.image = null;
        this.ulID = null;
        this.ulIndex = null;
    }
}