var nekiNizKojiJeStigaoSaAPIJA = [];
let NizKnjiga = [];
axios.get("http://poslovnainformatika.com/webprogramiranje/api/books"
).then(response => {
    nekiNizKojiJeStigaoSaAPIJA = response.data;
    console.log("Ovo je stiglo", nekiNizKojiJeStigaoSaAPIJA);
    prebaciMalaSlovaUVelika(nekiNizKojiJeStigaoSaAPIJA);
    proveriVrednostiUlocalStorageU();
    upisiUMojaKorpaUkupanIznosZaPlacanje();
    popuniPodatkeOKnjigamaUKorpi();
}).catch(error => {
    console.log(error.response);
});
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

document.getElementById("zatvoriModalniDetaljnije").addEventListener("click", otvoriZatvoriModalniProzor);

var nizKnjigaUkorpi = [];
var ukupnaVrednostKnjigaUKorpi = 0;
//objasnjenje metoda proveriVrednostiUlocalStorageU i upisiUheaderKorpa u knjige.js
function proveriVrednostiUlocalStorageU() {
    if (localStorage.getItem("nizKnjiga") !== null) {
        nizKnjigaUkorpi = JSON.parse(localStorage.getItem("nizKnjiga"));
        ukupnaVrednostKnjigaUKorpi = parseInt(localStorage.getItem("vrednostKnjigaUkorpi"));
        upisiUheaderKorpa();
    }
}
function upisiUheaderKorpa() {
    document.getElementById("vrednosti_brojKnjiga").innerHTML = nizKnjigaUkorpi.length;
    document.getElementById("vrednosti_iznos").innerHTML = ukupnaVrednostKnjigaUKorpi;
}

document.getElementById("modalDetaljnije").addEventListener("click", proveriModalniProzor);

function proveriModalniProzor(e) {
    console.log(e.target);
    if (e.target === document.getElementById("modalDetaljnije")) {
        otvoriZatvoriModalniProzor();
    }
}

function upisiUMojaKorpaUkupanIznosZaPlacanje() {
    document.getElementById("samIznos").innerHTML = ukupnaVrednostKnjigaUKorpi;
    klonirajNodeIznosa();
}

function popuniPodatkeOKnjigamaUKorpi() {

    if (nizKnjigaUkorpi.length === 0) {
        document.getElementById("content_wrapper_knjigeUKorpi").innerHTML = `<div id="text_korpa_prazna">Korpa je prazna, stavi neke knjige u korpu :)</div>`;

    } else {
        document.getElementById("content_wrapper_knjigeUKorpi").innerHTML = "";

        var nizIspisanihKnjiga = [];

        for (var i = 0; i < nizKnjigaUkorpi.length; i++) {
            //proveri autore koliko ih ima jer neke knjige nemaju 2 i 3 autora

            var brojacKolicineKnjiga = 0;
            for (var y = 0; y < nizKnjigaUkorpi.length; y++) {
                if (nizKnjigaUkorpi[i] === nizKnjigaUkorpi[y]) {
                    brojacKolicineKnjiga++;
                }
            }
            var knjiga = vratiPodatkeNizKnjigaISBN(nizKnjigaUkorpi[i]);
            var cenaKnjigaNaOsnovuKomada = parseInt(brojacKolicineKnjiga) * knjiga.Cena;

            var tekst = String(knjiga.Opis);
            var opis = tekst.slice(0, 200);
            opis += "...";

            let indikatorPostoji = false;

            for (z = 0; z < nizIspisanihKnjiga.length; z++) {
                //console.log(isbnKjige[z].getAttribute("data-ISBN"));
                if (nizKnjigaUkorpi[i] === nizIspisanihKnjiga[z]) {
                    indikatorPostoji = true;
                    break;
                }
            }
            if (!indikatorPostoji) {
                generisiHTMLStringKNjige(knjiga, opis, brojacKolicineKnjiga, cenaKnjigaNaOsnovuKomada);
                nizIspisanihKnjiga.push(knjiga.ISBN);
            } else {
                continue;
            }
        }
        dodajListenereNaDetaljnije();
        dodajListenereNaUkloniIzKorpe();
        dodajListenereNaPlusIMinus();
    }
}

function dodajListenereNaPlusIMinus() {
    nizDugmadiPlus = document.getElementsByClassName("plusevi");

    for (var i = 0; i < nizDugmadiPlus.length; i++) {
        nizDugmadiPlus[i].addEventListener("click", povecajBrojKnjiga);
    }
    var nizDugmadiMinus = document.getElementsByClassName("minusi");
    for (var i = 0; i < nizDugmadiMinus.length; i++) {
        nizDugmadiMinus[i].addEventListener("click", smanjiBrojKnjiga);
    }
}

function povecajBrojKnjiga(e) {
    var knjigaPovecanjeISBN = e.target.getAttribute("data-ISBN");
    var knjigaPovecanje = vratiPodatkeNizKnjigaISBN(knjigaPovecanjeISBN);

    var divZaManipulaciju = vratiKarticuKnjige(knjigaPovecanjeISBN);

    var trenutnaKolicina = parseInt(divZaManipulaciju.getElementsByClassName("samiKomad")[0].innerHTML);
    var trenutnaUkupnaCena = parseInt(divZaManipulaciju.getElementsByClassName("ukupanIznosSvihKnjigaElementSamIznos")[0].innerHTML);

    divZaManipulaciju.getElementsByClassName("samiKomad")[0].innerHTML = trenutnaKolicina + 1;
    divZaManipulaciju.getElementsByClassName("ukupanIznosSvihKnjigaElementSamIznos")[0].innerHTML = knjigaPovecanje.Cena + trenutnaUkupnaCena;

    nizKnjigaUkorpi.push(knjigaPovecanjeISBN);
    ukupnaVrednostKnjigaUKorpi = parseInt(ukupnaVrednostKnjigaUKorpi) + parseInt(knjigaPovecanje.Cena);

    upisiNovePodatkeULocalStorage(nizKnjigaUkorpi, ukupnaVrednostKnjigaUKorpi);
    upisiUheaderKorpa();
    upisiUMojaKorpaUkupanIznosZaPlacanje();
}
function smanjiBrojKnjiga(e) {
    var knjigaSmanjenjeISBN = e.target.getAttribute("data-ISBN");
    var knjigaSmanjenje = vratiPodatkeNizKnjigaISBN(knjigaSmanjenjeISBN);

    var divZaManipulaciju = vratiKarticuKnjige(knjigaSmanjenjeISBN);

    var trenutnaKolicina = parseInt(divZaManipulaciju.getElementsByClassName("samiKomad")[0].innerHTML);
    var trenutnaUkupnaCena = parseInt(divZaManipulaciju.getElementsByClassName("ukupanIznosSvihKnjigaElementSamIznos")[0].innerHTML);

    if (trenutnaKolicina <= 1) {
        return;
    } else {
        divZaManipulaciju.getElementsByClassName("samiKomad")[0].innerHTML = trenutnaKolicina - 1;
        divZaManipulaciju.getElementsByClassName("ukupanIznosSvihKnjigaElementSamIznos")[0].innerHTML = trenutnaUkupnaCena - knjigaSmanjenje.Cena;

        for (var i = 0; i < nizKnjigaUkorpi.length; i++) {
            if (nizKnjigaUkorpi[i] === knjigaSmanjenjeISBN) {
                nizKnjigaUkorpi.splice(i, 1);
                break;
            }
        }

        ukupnaVrednostKnjigaUKorpi = parseInt(ukupnaVrednostKnjigaUKorpi) - parseInt(knjigaSmanjenje.Cena);

        upisiNovePodatkeULocalStorage(nizKnjigaUkorpi, ukupnaVrednostKnjigaUKorpi);
        upisiUheaderKorpa();
        upisiUMojaKorpaUkupanIznosZaPlacanje();
    }
}

function upisiNovePodatkeULocalStorage(noviNizKnjigaUKorpi, novaVrednostKnjigaUKorpi) {
    localStorage.setItem("nizKnjiga", JSON.stringify(noviNizKnjigaUKorpi));
    localStorage.setItem("vrednostKnjigaUkorpi", novaVrednostKnjigaUKorpi);
}

function vratiKarticuKnjige(knjigaISBN) {
    var nizKarticaKnjiga = document.getElementsByClassName("moja_korpa_Knjiga_wrapper");

    for (var i = 0; i < nizKarticaKnjiga.length; i++) {
        if (nizKarticaKnjiga[i].getAttribute("data-ISBN") === knjigaISBN) {
            return nizKarticaKnjiga[i];
        }
    }
}

function generisiHTMLStringKNjige(knjiga, opis, brojacKolicineKnjiga, cenaKnjigaNaOsnovuKomada) {
    document.getElementById("content_wrapper_knjigeUKorpi").innerHTML += `
    <div class="moja_korpa_Knjiga_wrapper" data-ISBN="`+ knjiga.ISBN + `">
    <div class="knjigaKarticaKorpa">
        <div id="knjigaKarticaWrapper">
            <div id="KnjigeIMG"><img src="`+ knjiga.Korice + `" alt="Slika knjige"></div>
            <div id="knjigeKarticaWrapperZaglavlje">
                <div id="KnjgeAutori">`+ knjiga.Autori + `</div>
                <div id="KnjigeNaslov">`+ knjiga.Naslov + `</div>
                <div id="KnjigeGodina">`+ knjiga["Godina izdanja"] + `</div>
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
        <div class="mojaKorpaKnjigeOpisDetaljnijeMobilni">
        <div id="KnjigeOpis">`+ opis + `</div>
        <div class="btnDetaljnije" data-ISBN="` + knjiga.ISBN + `">
            <img src="./img/Detaljnije.svg" alt="Detaljnije">
            <span>Detaljnije</span>
        </div>
        </div>
    </div>
    <div class="korpa_knjiga_dugmad">
        <div id="dugmad_iznosi">
            <span id="dugmad_iznosi_cena_knjige">`+ knjiga.Cena + `</span>
            <span> RSD</span>
        </div>
        <div id="dugmad_plus_minus_komadi">
            <div id="plus_minus_slike">
                <span><img src="./img/Povecaj kolicinu.svg" class="plusevi" data-ISBN="`+ knjiga.ISBN + `"></span>
                <span><img src="./img/Smanji kolicinu.svg" class="minusi" data-ISBN="`+ knjiga.ISBN + `"></span>
            </div>
            <div id="broj_komada">
                <span class="samiKomad">`+ brojacKolicineKnjiga + `</span>
                <span> kom</span>
            </div>
        </div>
        <div class="izbaciIzKorpeWrapper">
        <div class="izbaci_iz_korpe" data-ISBN="`+ knjiga.ISBN + `" data-UKUPNO="` + cenaKnjigaNaOsnovuKomada + `">
            <span id="izbaci_iz_korpe_text">Izbaci iz korpe</span>
            <span><img src="./img/Brisi iz korpe.svg"></span>
        </div>
        </div>
        <div class="ukupanIznosWrapper">
        <div class="ukupanIznosSvihKnjigaElement">
            <span class="ukupanIznosSvihKnjigaElementSamIznos">`+ cenaKnjigaNaOsnovuKomada + `</span>
            <span>RSD</span>
        </div>
        </div>
    </div>
</div>
    `;
}

function dodajListenereNaDetaljnije() {
    nizDugmadiDetaljnije = document.getElementsByClassName("btnDetaljnije");

    //dodeli svakom dugmetu detlajnije event listener
    for (var i = 0; i < nizDugmadiDetaljnije.length; i++) {
        nizDugmadiDetaljnije[i].addEventListener("click", prikaziDetalje);
    }
}

function prikaziDetalje(e) {
    //izbuci data-ISBN i na osnovu njega popuni modalni
    var objekatKnjige = vratiPodatkeNizKnjigaISBN(e.target.getAttribute("data-ISBN"));

    var brojacKolicineKnjigaUKorpi = 0;
    for (var y = 0; y < nizKnjigaUkorpi.length; y++) {
        if (nizKnjigaUkorpi[y] === objekatKnjige.ISBN) {
            brojacKolicineKnjigaUKorpi++;
        }
    }

    var cenaKnjigaNaOsnovuKomadaModal = parseInt(brojacKolicineKnjigaUKorpi) * objekatKnjige.Cena;

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
         <div id="modalukloniIzKorpe" data-ISBN="`+ objekatKnjige.ISBN + `" data-UKUPNO="` + cenaKnjigaNaOsnovuKomadaModal + `">
         <span>Izbaci iz korpe</span>   
         <img src="./img/Brisi iz korpe.svg">    
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
    document.getElementById("modalukloniIzKorpe").addEventListener("click", zavrsniModalni);

    //napuni donji deo modalnog prozora sa izlistanim podacima
    otvoriZatvoriModalniProzor();
}
function zavrsniModalni(e) {
    ukloniIzKorpe(e);
    otvoriZatvoriModalniProzor();
}

function otvoriZatvoriModalniProzor() {
    document.getElementById("modalDetaljnije").classList.toggle("PrikaziVisibility");
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

function aktivnoDetaljnije() {
    document.getElementById("modalniOpis").classList.remove("modalniDugmadAktivno");
    document.getElementById("modalniDetalji").classList.add("modalniDugmadAktivno");
}

function aktivnoOpis() {
    document.getElementById("modalniOpis").classList.add("modalniDugmadAktivno");
    document.getElementById("modalniDetalji").classList.remove("modalniDugmadAktivno");
}

function napuniDonjiDeoModalnogOpis() {
    document.getElementById("DetaljnijePodaci").innerHTML = document.getElementById("modalniOpis").getAttribute("data-opis");
    aktivnoOpis();
}

//vrati podatke iz niza na osnovu ISBN
function vratiPodatkeNizKnjigaISBN(isbn) {
    for (item of NizKnjiga) {
        if (item.ISBN === isbn) {
            return item;
        }
    }
}

function dodajListenereNaUkloniIzKorpe() {
    nizDugmadiUklniIzKorpe = document.getElementsByClassName("izbaci_iz_korpe");

    for (var i = 0; i < nizDugmadiUklniIzKorpe.length; i++) {
        nizDugmadiUklniIzKorpe[i].addEventListener("click", ukloniIzKorpe);
    }
}

function ukloniIzKorpe(e) {
    let knjigaKojaTrebaDaSeUkloni = e.target.getAttribute("data-ISBN");

    knjiga = vratiPodatkeNizKnjigaISBN(knjigaKojaTrebaDaSeUkloni);
    //console.log(knjigaKojaTrebaDaSeUkloni);
    var i = 0;
    //nesto ovde ne valja
    while (i < nizKnjigaUkorpi.length) {
        if (nizKnjigaUkorpi[i] === knjigaKojaTrebaDaSeUkloni) {
            nizKnjigaUkorpi.splice(i, 1);
        } else {
            ++i;
        }
    }
    //upisi u local storage novi niz bez elemenata koji su uklonjeni
    localStorage.setItem("nizKnjiga", JSON.stringify(nizKnjigaUkorpi));

    var divPodaci = vratiKarticuKnjige(knjigaKojaTrebaDaSeUkloni);

    var ukupnaCena = parseInt(divPodaci.getElementsByClassName("ukupanIznosSvihKnjigaElementSamIznos")[0].innerHTML);

    let cenaKojaTrebaDaSeUmanji = vratiKarticuKnjige(knjigaKojaTrebaDaSeUkloni);
    ukupnaVrednostKnjigaUKorpi = parseInt(ukupnaVrednostKnjigaUKorpi) - parseInt(ukupnaCena);

    localStorage.setItem("vrednostKnjigaUkorpi", ukupnaVrednostKnjigaUKorpi);

    popuniPodatkeOKnjigamaUKorpi();
    upisiUheaderKorpa();
    upisiUMojaKorpaUkupanIznosZaPlacanje();
    //otvoriZatvoriModalniProzor();
}


function upisiUheaderKorpa() {
    document.getElementById("vrednosti_brojKnjiga").innerHTML = nizKnjigaUkorpi.length;
    document.getElementById("vrednosti_iznos").innerHTML = ukupnaVrednostKnjigaUKorpi;
}

function klonirajNodeIznosa() {
    document.getElementById("posle_knjiga_uKorpi").innerHTML = "";
    var noviDiv = document.createElement("DIV");
    noviDiv.id = "prazno";

    var originalKasa = document.getElementById("moja_korpa_Kasa");
    var originalIznos = document.getElementById("moja_kopra_Iznos");

    var klonKase = originalKasa.cloneNode(true);
    var klonIznos = originalIznos.cloneNode(true);

    document.getElementById("posle_knjiga_uKorpi").appendChild(noviDiv);
    document.getElementById("posle_knjiga_uKorpi").appendChild(klonKase);
    document.getElementById("posle_knjiga_uKorpi").appendChild(klonIznos);
}