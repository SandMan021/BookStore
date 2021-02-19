var nekiNizKojiJeStigaoSaAPIJA = [];
let NizKnjiga = [];

axios.get("http://poslovnainformatika.com/webprogramiranje/api/books"
).then(response => {
    nekiNizKojiJeStigaoSaAPIJA = response.data;
    console.log("Ovo je stiglo", nekiNizKojiJeStigaoSaAPIJA);
    prebaciMalaSlovaUVelika(nekiNizKojiJeStigaoSaAPIJA);
    proveriVrednostiUlocalStorageU();

    //ako je klik bio na neke od 3 slike, onda izvrsi pretragu po slikama
    //u suprotnom, regularno napuni listu knjiga
    if (localStorage.getItem("oblastZaPretragu") !== null) {
        staviUOblastVrednostIzLS();
        localStorage.removeItem("oblastZaPretragu");
    } else {
        napuniListuKnjiga(NizKnjiga);
    }
}).catch(error => {
    console.log(error.response);
});
//posto je prvo radjeno sa ugradjenim podacima, a kasnije povlaceno sa servera
//neophodno je prvo prekonvertovati polja u velika jer je tako koristeno u celom projektu
//a podaci sa servera stizu kao mala slova
function prebaciMalaSlovaUVelika(nekiNizKojiJeStigaoSaAPIJA) {
    for (let item of nekiNizKojiJeStigaoSaAPIJA) {
        let konvertovanaKnjiga = {
            "ISBN": item.isbn,
            "Naslov": item.naslov,
            "Oblast": item.oblast,
            "Autori": item.autori,
            "Jezik": item.jezik,
            "Godina izdanja": item.godinaizdanja,
            "Korice": item.korice,
            "Cena": parseInt(item.cena),
            "Opis": item.opis
        };
        NizKnjiga.push(konvertovanaKnjiga);
    }
    console.log(NizKnjiga, "niz knjiga");
}

document.getElementById("IzabraniNaslov").addEventListener("keydown", taster);
document.getElementById("IzabraniNaslov").addEventListener("input", filtrirajNasloveDD);
//modalni prozor
document.getElementById("zatvoriModalniDetaljnije").addEventListener("click", otvoriZatvoriModalniProzor);
document.getElementById("img_otvori_naslovi").addEventListener("click", napuniDDNaslov);
document.getElementById("modalDetaljnije").addEventListener("click", proveriModalniProzor);
document.getElementById("brisiTekstIzabraniNaslov").addEventListener("click", brisiTekstUNaslovu);
document.getElementById("cena").addEventListener("keydown", proveriUNosUCenu);
document.getElementById("pretraga_polja_trazi").addEventListener("click", izvrsiPretragu);
document.getElementById("otvaranjeListe").addEventListener("click", manipulisiSekcijuFilter);

function proveriModalniProzor(e) {
    console.log(e.target);
    if (e.target === document.getElementById("modalDetaljnije")) {
        otvoriZatvoriModalniProzor();
    }
}

function manipulisiSekcijuFilter() {
    if (document.getElementById("pretraga_polja").classList.contains("Prikazi")) {
        document.getElementById("pretraga_polja").classList.remove("Prikazi");
        document.getElementById("otvaranjeListe").classList.remove("Rotiraj");
    }
    else {
        document.getElementById("otvaranjeListe").classList.add("Rotiraj");
        document.getElementById("pretraga_polja").classList.add("Prikazi");
    }
}

function manipulisiDDnaslov() {
    //treba jos odraditi za prikazivanje selekcije i treba napraviti da X radi
    if (document.getElementById("pretraga_polja_naslov_dd").classList.contains("Prikazi")) {
        document.getElementById("pretraga_polja_naslov_dd").classList.remove("Prikazi");
        document.getElementById("img_otvori_naslovi").classList.remove("Rotiraj");
        document.getElementById("pretraga_polja_naslov_dd").innerHTML === ""
    }
    else {
        document.getElementById("img_otvori_naslovi").classList.add("Rotiraj");
        document.getElementById("pretraga_polja_naslov_dd").classList.add("Prikazi");
    }
}
function napuniDDNaslov() {
    upisiUDDNaslov(NizKnjiga);
}
function upisiUDDNaslov(NizKnjiga) {
    document.getElementById("pretraga_polja_naslov_dd").innerHTML = "";
    for (var item of NizKnjiga) {
        generisiUNaslovuNaOsnovuKucanja(item);
    }
    dodajListenereNaDDStavku(document.getElementById("pretraga_polja_naslov_dd"));

    manipulisiDDnaslov();
}
function taster(e) {
    if (e.code === "Escape") {
        document.getElementById("IzabraniNaslov").innerHTML = "";
        if (document.getElementById("pretraga_polja_naslov_dd").classList.contains("Prikazi")) {
            manipulisiDDnaslov()
        }
    }
}
function filtrirajNasloveDD(e) {
    var ukucaniTekst = e.target.innerHTML.toLowerCase();
    document.getElementById("pretraga_polja_naslov_dd").innerHTML = "";
    if (!document.getElementById("pretraga_polja_naslov_dd").classList.contains("Prikazi")) {
        manipulisiDDnaslov()
    }
    for (var item of NizKnjiga) {
        var maliItem = item.Naslov.toLowerCase();
        if (maliItem.includes(ukucaniTekst)) {
            generisiUNaslovuNaOsnovuKucanja(item);
        }
    }
    dodajListenereNaDDStavku(document.getElementById("pretraga_polja_naslov_dd"));
}
function generisiUNaslovuNaOsnovuKucanja(item) {
    var noviDiv = document.createElement("DIV");
    noviDiv.classList.add("stavka");
    noviDiv.innerHTML = item.Naslov;
    document.getElementById("pretraga_polja_naslov_dd").appendChild(noviDiv);
}
function brisiTekstUNaslovu() {
    if (document.getElementById("pretraga_polja_naslov_dd").classList.contains("Prikazi")) {
        manipulisiDDnaslov();
    }
    document.getElementById("IzabraniNaslov").innerHTML = "";
    deselektujStavkeNaslova();
}

function upisiUPoljeNaslov(e) {
    deselektujStavkeNaslova();
    document.getElementById("IzabraniNaslov").innerHTML = e.target.innerHTML;
    e.target.classList.add("SelektovanaStavka");
    manipulisiDDnaslov();
}

function deselektujStavkeNaslova() {
    var ddNaslova = document.getElementById("pretraga_polja_naslov_dd");
    var selektovanaStavka = ddNaslova.getElementsByClassName("SelektovanaStavka");
    if (selektovanaStavka.length > 0) {
        selektovanaStavka[0].classList.remove("SelektovanaStavka");
    }
}
function dodajListenereNaDDStavku(divZaManipulaciju) {
    var stavke = divZaManipulaciju.getElementsByClassName("stavka");
    for (var i = 0; i < stavke.length; i++) {
        if (divZaManipulaciju === document.getElementById("pretraga_polja_naslov_dd")) {
            stavke[i].addEventListener("click", upisiUPoljeNaslov);
        }
        if (divZaManipulaciju === document.getElementById("pretraga_polja_oblast_dd")) {
            stavke[i].addEventListener("click", upisiUPoljeOblast);
        }
        if (divZaManipulaciju === document.getElementById("pretraga_polja_jezik_dd")) {
            stavke[i].addEventListener("click", upisiUPoljeJezik);
        }
        if (divZaManipulaciju === document.getElementById("pretraga_polja_od_dd")) {
            stavke[i].addEventListener("click", upisiUPoljeGodinaOD);
        }
        if (divZaManipulaciju === document.getElementById("pretraga_polja_do_dd")) {
            stavke[i].addEventListener("click", upisiUPoljeGodinaDo);
        }
    }
}
//--------------------------------------OBLAST--------------------------
//napuni dd oblast proveri da li se javljaju iste oblasti, ako se ne javljaju puni poseban niz i od tog posebnog niza napuni divove
document.getElementById("img_otvori_oblast").addEventListener("click", napuniDDOblasti);

function manipulisiDDOblasti() {
    if (document.getElementById("pretraga_polja_oblast_dd").classList.contains("Prikazi")) {
        document.getElementById("pretraga_polja_oblast_dd").classList.remove("Prikazi");
        document.getElementById("img_otvori_oblast").classList.remove("Rotiraj");
    }
    else {
        document.getElementById("pretraga_polja_oblast_dd").classList.add("Prikazi");
        document.getElementById("img_otvori_oblast").classList.add("Rotiraj");
    }
}
function napuniDDOblasti() {
    if (document.getElementById("pretraga_polja_oblast_dd").innerHTML === "") {
        for (var item of NizKnjiga) {
            var nizOblasti = [];
            for (var item of NizKnjiga) {
                var postoji = false;
                for (i = 0; i < nizOblasti.length; i++) {
                    if (nizOblasti[i] === item.Oblast) {
                        postoji = true;
                    }
                }
                if (!postoji) {
                    nizOblasti.push(item.Oblast);
                }
            }
        }
        for (var oblast of nizOblasti) {
            var noviDiv = document.createElement("DIV");
            noviDiv.classList.add("stavka");
            noviDiv.innerHTML = oblast;
            document.getElementById("pretraga_polja_oblast_dd").appendChild(noviDiv);
        }
        dodajListenereNaDDStavku(document.getElementById("pretraga_polja_oblast_dd"));
    }
    manipulisiDDOblasti();
}

function upisiUPoljeOblast(e) {
    divOblastText = document.getElementById("oblast").getElementsByClassName("selektovanaOblast");

    if (divOblastText.length !== 0) {
        for (var i = 0; i < divOblastText.length; i++) {
            if (divOblastText[i].innerHTML === e.target.innerHTML) {
                e.target.classList.remove("SelektovanaStavka");
                document.getElementById("oblast").removeChild(divOblastText[i]);
                if (divOblastText.length === 0) {
                    manipulisiDDOblasti();
                }
                return;
            }
        }
    }

    noviSpan = document.createElement("SPAN");
    noviSpan.classList.add("selektovanaOblast")
    noviSpan.innerHTML = e.target.innerHTML;
    document.getElementById("oblast").appendChild(noviSpan);
    e.target.classList.add("SelektovanaStavka");
}
//-----------------------------------JEZIK--------------------------------------
//napuni dd jezike proveri da li ima istih jezika... isto kao i kod oblasti
document.getElementById("img_jezik_otvori").addEventListener("click", napuniDDJezik);

function manipulisiDDJezik() {
    //na klik strelice proveri sledece
    //da li je otvoren dd ako jeste isprazni ga sakrij ga okreni strelicu
    if (document.getElementById("pretraga_polja_jezik_dd").classList.contains("Prikazi")) {
        document.getElementById("pretraga_polja_jezik_dd").classList.remove("Prikazi");
        document.getElementById("img_jezik_otvori").classList.remove("Rotiraj");
    }
    else {
        document.getElementById("pretraga_polja_jezik_dd").classList.add("Prikazi");
        document.getElementById("img_jezik_otvori").classList.add("Rotiraj");
    }
}
function napuniDDJezik() {
    if (document.getElementById("pretraga_polja_jezik_dd").innerHTML === "") {
        var nizJezika = [];
        for (var item of NizKnjiga) {
            var postoji = false;
            for (i = 0; i < nizJezika.length; i++) {
                if (nizJezika[i] === item.Jezik) {
                    postoji = true;
                }
            }
            if (!postoji) {
                nizJezika.push(item.Jezik);
            }
        }
        for (var jezik of nizJezika) {
            var noviDiv = document.createElement("DIV");
            noviDiv.classList.add("stavka");
            noviDiv.innerHTML = jezik;
            document.getElementById("pretraga_polja_jezik_dd").appendChild(noviDiv);
        }
        dodajListenereNaDDStavku(document.getElementById("pretraga_polja_jezik_dd"));
    }
    manipulisiDDJezik();
}

function upisiUPoljeJezik(e) {
    divJezikText = document.getElementById("jezik").getElementsByClassName("selektovanaOblast");

    if (divJezikText.length !== 0) {
        for (var i = 0; i < divJezikText.length; i++) {
            if (divJezikText[i].innerHTML === e.target.innerHTML) {
                e.target.classList.remove("SelektovanaStavka");
                document.getElementById("jezik").removeChild(divJezikText[i]);
                if (divJezikText.length === 0) {
                    manipulisiDDJezik();
                }
                return;
            }
        }
    }

    noviSpan = document.createElement("SPAN");
    noviSpan.classList.add("selektovanaOblast")
    noviSpan.innerHTML = e.target.innerHTML;
    document.getElementById("jezik").appendChild(noviSpan);
    e.target.classList.add("SelektovanaStavka");
}
//--------------------------------------CENA----------------------------------------------
function proveriUNosUCenu(e) {
    if (isNaN(String.fromCharCode(e.which)) && e.code !== "Backspace") {
        e.preventDefault();
    }
}
//---------------------------------GODINA--------------------------------------------------
//godine OD dd
document.getElementById("img_godine_od").addEventListener("click", napuniDDOD);

var godineLimitDonji = 0;
var godineLimitGornji = 0;

function napuniDDOD() {
    document.getElementById("pretraga_polja_do_dd").innerHTML = "";
    if (document.getElementById("pretraga_polja_od_dd").innerHTML === "") {
        var nizGodinaOd = [];
        for (var item of NizKnjiga) {
            var postoji = false;
            for (i = 0; i < nizGodinaOd.length; i++) {
                if (nizGodinaOd[i] === item["Godina izdanja"]) {
                    postoji = true;
                }
            }
            if (!postoji) {
                nizGodinaOd.push(item["Godina izdanja"]);
            }
        }
        nizGodinaOd.sort();
        if (godineLimitGornji !== 0) {
            for (var godina of nizGodinaOd) {
                if (godina <= godineLimitGornji) {
                    upisiOdgovarajucuOD(godina);
                }
            }
        } else {
            for (var godina of nizGodinaOd) {
                upisiOdgovarajucuOD(godina);
            }
        }
        dodajListenereNaDDStavku(document.getElementById("pretraga_polja_od_dd"));
    }
    manipulisiDDOD();
}
function upisiOdgovarajucuOD(godina) {
    var noviDiv = document.createElement("DIV");
    noviDiv.classList.add("stavka");
    noviDiv.innerHTML = godina;
    document.getElementById("pretraga_polja_od_dd").appendChild(noviDiv);
}
function manipulisiDDOD() {
    if (document.getElementById("pretraga_polja_od_dd").classList.contains("Prikazi")) {
        document.getElementById("pretraga_polja_od_dd").classList.remove("Prikazi");
        document.getElementById("img_godine_od").classList.remove("Rotiraj");
    }
    else {
        document.getElementById("pretraga_polja_od_dd").classList.add("Prikazi");
        document.getElementById("img_godine_od").classList.add("Rotiraj");
    }
}

function upisiUPoljeGodinaOD(e) {
    deselektujStavkeGodinaOD();

    var divGodinaODText = document.getElementById("odBox");
    godineLimitDonji = e.target.innerHTML;
    if (divGodinaODText.innerHTML !== "") {
        if (divGodinaODText.innerHTML === e.target.innerHTML) {
            e.target.classList.remove("SelektovanaStavka");
            divGodinaODText.innerHTML = "";
            manipulisiDDOD();
            return;
        }
    }
    document.getElementById("odBox").innerHTML = e.target.innerHTML;
    e.target.classList.add("SelektovanaStavka");
    manipulisiDDOD();

}
function deselektujStavkeGodinaOD() {
    var ddGodinaOD = document.getElementById("pretraga_polja_od_dd");
    var selektovanaStavka = ddGodinaOD.getElementsByClassName("SelektovanaStavka");
    if (selektovanaStavka.length > 0) {
        selektovanaStavka[0].classList.remove("SelektovanaStavka");
    }
}
//godine DO dd
document.getElementById("img_godine_do").addEventListener("click", napuniDDDo);

function napuniDDDo() {
    document.getElementById("pretraga_polja_od_dd").innerHTML = "";
    if (document.getElementById("pretraga_polja_do_dd").innerHTML === "") {
        var nizGodinaOd = [];
        for (var item of NizKnjiga) {
            var postoji = false;
            for (i = 0; i < nizGodinaOd.length; i++) {
                if (nizGodinaOd[i] === item["Godina izdanja"]) {
                    postoji = true;
                }
            }
            if (!postoji) {
                nizGodinaOd.push(item["Godina izdanja"]);
            }
        }
        nizGodinaOd.sort().reverse();
        if (godineLimitDonji !== 0) {
            for (var godina of nizGodinaOd) {
                if (godina >= godineLimitDonji) {
                    upisiOdgovarajucuDO(godina);
                }
            }
        } else {
            for (var godina of nizGodinaOd) {
                upisiOdgovarajucuDO(godina);
            }
        }
        dodajListenereNaDDStavku(document.getElementById("pretraga_polja_do_dd"));
    }
    manipulisiDDDo();
}
function upisiOdgovarajucuDO(godina) {
    var noviDiv = document.createElement("DIV");
    noviDiv.classList.add("stavka");
    noviDiv.innerHTML = godina;
    document.getElementById("pretraga_polja_do_dd").appendChild(noviDiv);
}
function manipulisiDDDo() {
    if (document.getElementById("pretraga_polja_do_dd").classList.contains("Prikazi")) {
        document.getElementById("pretraga_polja_do_dd").classList.remove("Prikazi");
        document.getElementById("img_godine_do").classList.remove("Rotiraj");
    }
    else {
        document.getElementById("pretraga_polja_do_dd").classList.add("Prikazi");
        document.getElementById("img_godine_do").classList.add("Rotiraj");
    }
}

function upisiUPoljeGodinaDo(e) {
    deselektujStavkeGodinaDo();

    var divGodinaDOText = document.getElementById("doBox");
    godineLimitGornji = e.target.innerHTML;
    if (divGodinaDOText.innerHTML !== "") {
        if (divGodinaDOText.innerHTML === e.target.innerHTML) {
            e.target.classList.remove("SelektovanaStavka");
            divGodinaDOText.innerHTML = "";
            manipulisiDDDo();
            return;
        }
    }

    document.getElementById("doBox").innerHTML = e.target.innerHTML;
    e.target.classList.add("SelektovanaStavka");
    manipulisiDDDo();
}

function deselektujStavkeGodinaDo() {
    var ddGodinaOD = document.getElementById("pretraga_polja_do_dd");
    var selektovanaStavka = ddGodinaOD.getElementsByClassName("SelektovanaStavka");
    if (selektovanaStavka.length > 0) {
        selektovanaStavka[0].classList.remove("SelektovanaStavka");
    }
}
//---------------------------------FILTER-----------------------------------------
function izvrsiPretragu() {
    var selektovaniNaslov;
    var selektovaneOblasti = [];
    var selektovaniJezici = [];
    var NizKnjigaKojeZadovoljavajuFilter = [];
    var selektovanaCena;
    var godinaOd;
    var godinaDo;

    //pokupi sve vrednosti iz polja filtera
    selektovaniNaslov = pokupiVrednostIzNaslova();
    selektovanaCena = pokupiVrednostIzCene();
    selektovaneOblasti = pokupiVrednostIzOblasti();
    godinaOd = pokupiVrednostIzGodineOd();
    godinaDo = pokupiVrednostIzGodineDo();
    selektovaniJezici = pokupiVrednostIzJezika();

    //ako nista nije popunjeno, nemoj filtrirati
    if (selektovaniNaslov === "" && selektovaneOblasti.length === 0 && selektovaniJezici.length === 0 && selektovanaCena === "" && godinaOd === "" && godinaDo === "") {
        napuniListuKnjiga(NizKnjiga);
        return;
    }
    //pokupi vrednost iz polja naslova i ako ima push ga u novi niz
    if (selektovaniNaslov !== "") {
        for (var item of NizKnjiga) {
            if (item.Naslov === selektovaniNaslov) {
                NizKnjigaKojeZadovoljavajuFilter.push(item);
                break;
            }
        }
    }
    //logika if-ova i filtera je sledeca
    //kaskadno se spustaj kroz svaki if koji proverava sva polja pre sebe
    //ako su polja pre njega prazna, a on sam nije prodji kroz ceo niz podataka
    //i gurni ih u niz koji ce na kraju metode biti prosledjen metodi za ispis
    //ako se utvrdi da u poljima pre tebe ima nesto ili si ti sam prazan
    //predji na else
    if (selektovaniNaslov === "" && selektovaneOblasti.length !== 0) {
        for (var i = 0; i < selektovaneOblasti.length; i++) {
            for (var item of NizKnjiga) {
                if (selektovaneOblasti[i] === item.Oblast) {
                    NizKnjigaKojeZadovoljavajuFilter.push(item);
                }
            }
        }
    } else {
        //proveri da li si prazan jer postoji mogucnost da si ti isto prazan kao i polja pre tebe
        //kada si vec dosao ovde, znaci da je ili neko polje pre tebe puno ili si ti sam prazan
        //ako imas nesto u sebi (selektovano je nesto u tvom polju), a polja pre tebe su puna, radi sledece u suprotnom zanemari filtriranje po svom kriterijumu
        //ako imas nesto u sebi radi sledece
        if (selektovaneOblasti !== undefined && selektovaneOblasti.length > 0) {
            //zato sto ces ici u metodu koja ce smanjiti velicinu podatke koji su prethodno filtrirani (NizKnjigaKojeZadovoljavajuFilter) smesti u privremeni niz
            var privremeniNiz = NizKnjigaKojeZadovoljavajuFilter;
            //prodji kroz ceo NizKnjigaKojeZadovoljavajuFilter 
            for (var i = 0; i < NizKnjigaKojeZadovoljavajuFilter.length; i++) {
                //indikator koristi da bi iskakao iz unutrasnje petlje
                var nalaziSeUNizu = false;
                //prodji kroz sve sto se nalazi u tebi i ako se poklopi vec izfiltrirana knjiga sa tobom
                //znaci da zadovoljava kriterijum filtriranja po tebi
                for (var y = 0; y < selektovaneOblasti.length; y++) {
                    if (NizKnjigaKojeZadovoljavajuFilter[i].Oblast == selektovaneOblasti[y]) {
                        nalaziSeUNizu = true;
                        break;
                    }
                }
                //ako je indikator false, znaci da knjiga koja se vrti u velikoj petlji
                //ne odgovara kriterijumu filtriranja i treba je ukliniti
                if (!nalaziSeUNizu) {
                    privremeniNiz = ukloniIzNizaNaOsnovuISBN(privremeniNiz[i], privremeniNiz);
                    i--;
                }
            }
            //na kraju kada si sve izbacio sto ne zadovoljava kriterijum filtriranja, 
            //u NizKnjigaKojeZadovoljavajuFilter smesti privremeni niz
            if (privremeniNiz !== undefined && privremeniNiz.length > 0) {
                NizKnjigaKojeZadovoljavajuFilter = privremeniNiz;
            }
        }
    }
    //proveri vrednosti u selektovani jezik
    if (selektovaniNaslov === "" && selektovaneOblasti.length === 0 && selektovaniJezici.length !== 0) {
        for (var i = 0; i < selektovaniJezici.length; i++) {
            for (var item of NizKnjiga) {
                if (selektovaniJezici[i] === item.Jezik) {
                    NizKnjigaKojeZadovoljavajuFilter.push(item);
                }
            }
        }
    } else {
        if (selektovaniJezici !== undefined && selektovaniJezici.length > 0) {
            var privremeniNiz = NizKnjigaKojeZadovoljavajuFilter;
            for (var i = 0; i < NizKnjigaKojeZadovoljavajuFilter.length; i++) {
                var nalaziSeUNizu = false;
                for (var y = 0; y < selektovaniJezici.length; y++) {
                    if (NizKnjigaKojeZadovoljavajuFilter[i].Jezik == selektovaniJezici[y]) {
                        nalaziSeUNizu = true;
                        break;
                    }
                }
                if (!nalaziSeUNizu) {
                    privremeniNiz = ukloniIzNizaNaOsnovuISBN(privremeniNiz[i], privremeniNiz);
                    i--;
                }
            }
            if (privremeniNiz !== undefined && privremeniNiz.length > 0) {
                NizKnjigaKojeZadovoljavajuFilter = privremeniNiz;
            }
        }
    }
    //proveri vrednosti u selektovana cena
    if (selektovaniNaslov === "" && selektovaneOblasti.length === 0 && selektovaniJezici.length === 0 && selektovanaCena !== "") {
        for (var item of NizKnjiga) {
            if (item.Cena <= parseInt(selektovanaCena)) {
                NizKnjigaKojeZadovoljavajuFilter.push(item);
            }
        }
    } else {
        if (selektovanaCena !== "") {
            var privremeniNiz = NizKnjigaKojeZadovoljavajuFilter;
            for (var i = 0; i < NizKnjigaKojeZadovoljavajuFilter.length; i++) {
                if (NizKnjigaKojeZadovoljavajuFilter[i].Cena <= parseInt(selektovanaCena)) {
                    //ne radi nista
                } else {
                    privremeniNiz = ukloniIzNizaNaOsnovuISBN(privremeniNiz[i], privremeniNiz);
                    i--;
                }
            }
            if (privremeniNiz !== undefined && privremeniNiz.length > 0) {
                NizKnjigaKojeZadovoljavajuFilter = privremeniNiz;
            }
        }
    }
    //proveri vrednosti u godina od
    if (selektovaniNaslov === "" && selektovaneOblasti.length === 0 && selektovaniJezici.length === 0 && selektovanaCena === "" && godinaOd !== "") {
        for (var item of NizKnjiga) {
            if (parseInt(item["Godina izdanja"]) >= parseInt(godinaOd)) {
                NizKnjigaKojeZadovoljavajuFilter.push(item);
            }
        }
    } else {
        if (godinaOd !== "") {
            var privremeniNiz = NizKnjigaKojeZadovoljavajuFilter;
            for (var i = 0; i < NizKnjigaKojeZadovoljavajuFilter.length; i++) {
                if (NizKnjigaKojeZadovoljavajuFilter[i]["Godina izdanja"] >= parseInt(godinaOd)) {
                    //ne radi nista
                } else {
                    privremeniNiz = ukloniIzNizaNaOsnovuISBN(privremeniNiz[i], privremeniNiz);
                    i--;
                }
            }
            if (privremeniNiz !== undefined && privremeniNiz.length > 0) {
                NizKnjigaKojeZadovoljavajuFilter = privremeniNiz;
            }
        }
    }
    //proveri vrednosti u godina do
    if (selektovaniNaslov === "" && selektovaneOblasti.length === 0 && selektovaniJezici.length === 0 && selektovanaCena === "" && godinaOd === "" && godinaDo !== "") {
        for (var item of NizKnjiga) {
            if (parseInt(item["Godina izdanja"]) <= parseInt(godinaDo)) {
                NizKnjigaKojeZadovoljavajuFilter.push(item);
            }
        }
    } else {
        if (godinaDo !== "") {
            var privremeniNiz = NizKnjigaKojeZadovoljavajuFilter;
            for (var i = 0; i < NizKnjigaKojeZadovoljavajuFilter.length; i++) {
                if (NizKnjigaKojeZadovoljavajuFilter[i]["Godina izdanja"] <= parseInt(godinaDo)) {
                    //ne radi nista
                } else {
                    privremeniNiz = ukloniIzNizaNaOsnovuISBN(privremeniNiz[i], privremeniNiz);
                    i--;
                }
            }
            if (privremeniNiz !== undefined && privremeniNiz.length > 0) {
                NizKnjigaKojeZadovoljavajuFilter = privremeniNiz;
            }
        }
    }
    //prosledjuje se metodi napuniListuKnjiga niz koji zadovoljava trazene Kriterijume
    napuniListuKnjiga(NizKnjigaKojeZadovoljavajuFilter);
}
function pokupiVrednostIzNaslova() {
    var naslov = document.getElementById("IzabraniNaslov").innerHTML;
    for (var item of NizKnjiga) {
        if (item.Naslov === naslov) {
            return naslov;
        }
    }
    return naslov;
}
function pokupiVrednostIzOblasti() {
    var nizOblasti = document.getElementById("oblast").getElementsByClassName("selektovanaOblast");
    var pushUOblast = [];
    for (var i = 0; i < nizOblasti.length; i++) {
        pushUOblast.push(nizOblasti[i].innerHTML);
    }
    return pushUOblast;
}
function pokupiVrednostIzJezika() {
    var nizJezika = document.getElementById("jezik").getElementsByClassName("selektovanaOblast");
    var pushUJezike = [];
    for (var i = 0; i < nizJezika.length; i++) {
        pushUJezike.push(nizJezika[i].innerHTML);
    }
    return pushUJezike;
}
function pokupiVrednostIzCene() {
    var cena = document.getElementById("cena").innerHTML;
    return cena;
}
function pokupiVrednostIzGodineOd() {
    var godinaOd = document.getElementById("odBox").innerHTML;
    return godinaOd;
}
function pokupiVrednostIzGodineDo() {
    var godinaDo = document.getElementById("doBox").innerHTML;
    return godinaDo;
}
function ukloniIzNizaNaOsnovuISBN(item, niz) {
    for (var i = 0; i < niz.length; i++) {
        if (niz[i] === item) {
            niz.splice(i, 1);
        }
    }
    return niz;
}
//------------------------------------------NAPUNI KNJIGE--------------------------------
function napuniListuKnjiga(NizKnjigaPretraga) {
    document.getElementById("content_wrapper_Knjige").innerHTML = "";
    if (NizKnjigaPretraga !== undefined && NizKnjigaPretraga.length > 0) {
        for (var item of NizKnjigaPretraga) {

            var tekst = String(item.Opis);
            var opis = tekst.slice(0, 200);
            opis += "...";

            document.getElementById("content_wrapper_Knjige").innerHTML += `
            <div class="knjigaKartica">
                <div class="wraperSlikaOpis">
                    <div id="knjigaKarticaWrapper">
                        <div id="KnjigeIMG"><img src="`+ item.Korice + `" alt="Slika knjige"></div>
                        <div id="knjigeKarticaWrapperZaglavlje">
                            <div id="KnjgeAutori">`+ item.Autori + `</div>
                            <div id="KnjigeNaslov">`+ item.Naslov + `</div>
                            <div id="KnjigeGodina">`+ item["Godina izdanja"] + `</div>
                            <div class="nevidljivOpisDugme">
                                <div>`+ opis + `</div>
                                <div class="wrapDugme">
                                    <div class="btnDetaljnije" data-ISBN="` + item.ISBN + `">
                                        <img src="./img/Detaljnije.svg" alt="Detaljnije">
                                        <span>Detaljnije</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="opisIdugmeNaMobilnom">
                     <div id="KnjigeOpis">`+ opis + `</div>
                     <div class="wrapDugme">
                     <div class="btnDetaljnije" data-ISBN="` + item.ISBN + `">
                     <img src="./img/Detaljnije.svg" alt="Detaljnije">
                     <span>Detaljnije</span>
                    </div>
                    </div>
                </div>
                </div>
                <div class="wrapperDugmadiKarticaKnjiga">
                    <div id="KnjigeCena">`+ item.Cena + `,00` + `
                        <span>RSD</span></div>
                    <div class="KnjigeStaviUKorpu" data-ISBN=`+ item.ISBN + `><img src="./img/Korpa.svg" alt="Korpa">
                        <span>Stavi u korpu</span>
                    </div>
                </div>
            </div>`
        }
        dodajListenereNaDetaljnije();
        dodajLitenerNaStaviUKorpu();
    } else {
        document.getElementById("content_wrapper_Knjige").innerHTML = `
        <div id="nijednaKnjiga">
            <div id="nijednaKnjigaText">Nemamo takvu knjigu :(</div>
            <img src="./img/teleskop.svg">
        </div>`;
    }
}

function dodajListenereNaDetaljnije() {
    nizDugmadiDetaljnije = document.getElementsByClassName("btnDetaljnije");

    //dodeli svakom dugmetu detlajnije event listener
    for (var i = 0; i < nizDugmadiDetaljnije.length; i++) {
        nizDugmadiDetaljnije[i].addEventListener("click", prikaziDetalje);
    }
}

function dodajLitenerNaStaviUKorpu() {
    nizDugmadiStaviUKorpu = document.getElementsByClassName("KnjigeStaviUKorpu");
    //dodeli svakom dugmetu stavi u korpu listener
    for (var i = 0; i < nizDugmadiStaviUKorpu.length; i++) {
        nizDugmadiStaviUKorpu[i].addEventListener("click", staviUkorpu);
    }
}

//definisi dve promenljive koje su zaduzene za korpu i koje ce se svuda pozivati za proveru iznosa
//pozivaju se u vise razlicitih metoda i zato su izdvojene
var nizKnjigaUkorpi = [];
var ukupnaVrednostKnjigaUKorpi = 0;

//poziva se u window onload, prvo proveri da li ima nesto u local storageu 
//ako ima nemoj promenljive ostavljati prazne nego ih napuni sa podacima iz ls
//ukoliko local storage nije prazan u hederu ce se upisati podaci koji su u ls
function proveriVrednostiUlocalStorageU() {
    if (localStorage.getItem("nizKnjiga") !== null) {
        nizKnjigaUkorpi = JSON.parse(localStorage.getItem("nizKnjiga"));
        ukupnaVrednostKnjigaUKorpi = parseInt(localStorage.getItem("vrednostKnjigaUkorpi"));
        upisiUheaderKorpa();
    }
}

//dugme stavi u korpu knjiga
function staviUkorpu(e) {
    // svakako pushuj u niz data atribut i upisi i u ls
    nizKnjigaUkorpi.push(e.target.getAttribute("data-ISBN"));
    localStorage.setItem("nizKnjiga", JSON.stringify(nizKnjigaUkorpi));

    //za konkretan isbn koje je dovucen iz data atributa (nizKnjigaUkorpi.length - 1)
    // dovuci podatke o konkretnoj knjzi
    //promenljivoj ukupnaVrednostKnjigaUKorpi dodaj vrednost cene konkretne knjige
    //to sve evidentiraj u local storage
    knjiga = vratiPodatkeNizKnjigaISBN(nizKnjigaUkorpi[nizKnjigaUkorpi.length - 1]);
    ukupnaVrednostKnjigaUKorpi += knjiga.Cena;
    localStorage.setItem("vrednostKnjigaUkorpi", ukupnaVrednostKnjigaUKorpi);

    // nakon svega toga osvezi prikaz hedera sa podacima o broju knjiga u korpi
    upisiUheaderKorpa();
}

function upisiUheaderKorpa() {
    document.getElementById("vrednosti_brojKnjiga").innerHTML = nizKnjigaUkorpi.length;
    document.getElementById("vrednosti_iznos").innerHTML = ukupnaVrednostKnjigaUKorpi;
}

//dugme detaljnije knjiga
function prikaziDetalje(e) {
    //izbuci data-ISBN i na osnovu njega popuni modalni
    var objekatKnjige = vratiPodatkeNizKnjigaISBN(e.target.getAttribute("data-ISBN"));

    //napuni gornji deo modalnog prozora
    document.getElementById("modalKnjigaKarticaWrapper").innerHTML = `
    <div id="modalWrapperIMGNaslovTekst">
    <div id="modalKnjigeIMG"><img src="`+ objekatKnjige.Korice + `" alt="Slika knjige"></div>
    <div id="modalKnjigeKarticaWrapperZaglavlje">
        <div id="modalKnjgeAutori">`+ objekatKnjige.Autori + `</div>
        <div id="modalKnjigeNaslov">`+ objekatKnjige.Naslov + `</div>
        <div id="modalKnjigeGodina">`+ objekatKnjige["Godina izdanja"] + `</div>
    </div>
    </div>
    <div id="modalCena">
        <div id="modalCenaIznos">
            <span id="modalCenaIznosKonkretan">` + objekatKnjige.Cena + `</span>
            <span class="textSiveBoje">RSD</span>
        </div>
         <div id="modalStaviUKorpu" data-ISBN=`+ objekatKnjige.ISBN + `>
            <img src="./img/Korpa.svg">
            <span>Stavi u korpu</span>
        </div>
    </div>`;

    //podaci za detaljnije i opis dugmad se moraju puniti ovde kako bi se prosledili data atributi i kako ne bi morao da se
    //radi jos jedan upit u set podataka
    document.getElementById("DetaljnijeOpis").innerHTML = `
    <span class="modalniDugmadAktivno" id="modalniDetalji" data-ISBN="`+ objekatKnjige.ISBN + `" data-Oblast="` + objekatKnjige.Oblast + `"
    data-Jezik="`+ objekatKnjige.Jezik + `">Detalji</span>
    <span id="modalniOpis" data-opis="`+ objekatKnjige.Opis + `">Opis</span>`

    //ovde se puni prvo prozor detaljnije sa podacima
    document.getElementById("DetaljnijePodaci").innerHTML = `
    <div id="detaljnijePodaciNaslovi">
        <span>ISBN</span> 
        <span>Oblast</span> 
        <span>Jezik</span> 
    </div>
    <div id="detaljnijePodaciInformacije">
        <span>`+ objekatKnjige.ISBN + `</span>
        <span>` + objekatKnjige.Oblast + `</span>
        <span>`+ objekatKnjige.Jezik + `</span> 
    </div>`

    napuniDonjiDeoModalnogSaPodacima(objekatKnjige);
    document.getElementById("modalniOpis").addEventListener("click", napuniDonjiDeoModalnogOpis);
    document.getElementById("modalniDetalji").addEventListener("click", napuniDonjiDeoModalnogSaPodacima);
    document.getElementById("modalStaviUKorpu").addEventListener("click", staviUkorpu);

    //napuni donji deo modalnog prozora sa izlistanim podacima
    otvoriZatvoriModalniProzor();
}

function napuniDonjiDeoModalnogOpis() {
    document.getElementById("DetaljnijePodaci").innerHTML = document.getElementById("modalniOpis").getAttribute("data-opis");
    aktivnoOpis();
}

function napuniDonjiDeoModalnogSaPodacima() {
    podaciIzAtributa = document.getElementById("modalniDetalji");

    document.getElementById("DetaljnijePodaci").innerHTML = `
    <div id="detaljnijePodaciNaslovi">
        <span>ISBN</span> 
        <span>Oblast</span> 
        <span>Jezik</span> 
    </div>
    <div id="detaljnijePodaciInformacije">
        <span>`+ podaciIzAtributa.getAttribute("data-ISBN") + `</span>
        <span>`+ podaciIzAtributa.getAttribute("data-Oblast") + `</span>
        <span>`+ podaciIzAtributa.getAttribute("data-Jezik") + `</span> 
    </div>`;

    aktivnoDetaljnije();
}

function otvoriZatvoriModalniProzor() {
    document.getElementById("modalDetaljnije").classList.toggle("PrikaziVisibility");
}

//u zavisnosti od potrebe poziva se klasa aktivno jednom od dugmadi u modalnom prozoru
//pri tome se gasi klasa aktivno u drugom dugmetu u modalnom prozoru
function aktivnoOpis() {
    document.getElementById("modalniOpis").classList.add("modalniDugmadAktivno");
    document.getElementById("modalniDetalji").classList.remove("modalniDugmadAktivno");
}
function aktivnoDetaljnije() {
    document.getElementById("modalniOpis").classList.remove("modalniDugmadAktivno");
    document.getElementById("modalniDetalji").classList.add("modalniDugmadAktivno");
}

//upisi u oblast kao da je selektovana stavka
//klasicno pozovi pretragu
function staviUOblastVrednostIzLS() {
    document.getElementById("oblast").innerHTML = `<span class="selektovanaOblast">` + localStorage.getItem("oblastZaPretragu") + `</span>`;
    izvrsiPretragu();
}

//vrati podatke iz niza na osnovu ISBN
function vratiPodatkeNizKnjigaISBN(isbn) {
    for (item of NizKnjiga) {
        if (item.ISBN === isbn) {
            return item;
        }
    }
}