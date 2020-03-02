export class Field{
    ////////////
    // Values //
    ////////////
    playerHeader: HTMLElement | null;
    handUL: HTMLElement | null;
    deckSpan: HTMLElement | null;
    playzoneUL: HTMLElement | null;
    energyzoneUL: HTMLElement | null;
    discardpileSpan: HTMLElement | null;
    handLengthSpan: HTMLElement | null;
    playLengthSpan: HTMLElement | null;
    energyLengthSpan: HTMLElement | null;


    /////////////////
    // Constructor //
    /////////////////
    constructor(
        playerHeader: string, 
        handUL: string, 
        deckSpan: string,
        playzoneUL: string,
        energyzoneUL: string,
        discardpileSpan: string,
        handLengthSpan: string,
        playLengthSpan: string,
        energyLengthSpan: string){
            this.playerHeader = document.getElementById(playerHeader);
            this.handUL = document.getElementById(handUL);
            this.deckSpan = document.getElementById(deckSpan);
            this.playzoneUL = document.getElementById(playzoneUL);
            this.energyzoneUL = document.getElementById(energyzoneUL);
            this.discardpileSpan = document.getElementById(discardpileSpan);
            this.handLengthSpan = document.getElementById(handLengthSpan);
            this.playLengthSpan = document.getElementById(playLengthSpan);
            this.energyLengthSpan = document.getElementById(energyLengthSpan);
    };

    setPlayerHeader(innerText: string){
        if(this.playerHeader !== null){
            this.playerHeader.innerText = innerText;
        }
    }

    setDeckSpan(innerText: string){
        if(this.deckSpan !== null){
            this.deckSpan.innerText = innerText;
        }
    }

    setDiscardpileSpan(innerText: string){
        if(this.discardpileSpan !== null){
            this.discardpileSpan.innerText = innerText;
        }
    }

    setHandLengthSpan(innerText: string){
        if(this.handLengthSpan !== null){
            this.handLengthSpan.innerText = innerText;
        }
    }

    setPlayLengthSpan(innerText: string){
        if(this.playLengthSpan !== null){
            this.playLengthSpan.innerText = innerText;
        }
    }

    setEnergyLengthSpan(innerText: string){
        if(this.energyLengthSpan !== null){
            this.energyLengthSpan.innerText = innerText;
        }
    }

    clearHandUL(){
        this.clearUL(this.handUL);
    }
    clearPlayzoneUL(){
        this.clearUL(this.playzoneUL);
    }
    clearEnergyzoneUL(){
        this.clearUL(this.energyzoneUL);
    }

    clearUL(UL: HTMLElement | null){
        if(UL !== null){
            while(UL.firstChild){
                UL.removeChild(UL.firstChild);
            }
        }
    }
}