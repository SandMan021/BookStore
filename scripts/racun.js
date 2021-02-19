
var nekiNizKojiJeStigaoSaAPIJA = [];
let NizKnjiga = [];
axios.get("http://poslovnainformatika.com/webprogramiranje/api/books"
).then(response => {
    nekiNizKojiJeStigaoSaAPIJA = response.data;
    console.log("Ovo je stiglo", nekiNizKojiJeStigaoSaAPIJA);
    prebaciMalaSlovaUVelika(nekiNizKojiJeStigaoSaAPIJA);
    proveriVrednostiUlocalStorageU();
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


document.getElementById("racunbtnPlati").addEventListener("click", platiRacun);

function popuniPodatkeOKnjigamaUKorpi() {

    if (nizKnjigaUkorpi.length === 0) {
        document.getElementById("content_wrapper_racunIPodaci").innerHTML = `<div id="text_racun_prazan">Nemaš sta da platiš, stavi nešto u korpu :)</div>`;

    } else {
        document.getElementById("racunIPodaciStavkeWrapperKnjiga").innerHTML = "";

        var nizIspisanihKnjiga = [];

        for (var i = 0; i < nizKnjigaUkorpi.length; i++) {
            var brojacKolicineKnjiga = 0;
            for (var y = 0; y < nizKnjigaUkorpi.length; y++) {
                if (nizKnjigaUkorpi[i] === nizKnjigaUkorpi[y]) {
                    brojacKolicineKnjiga++;
                }
            }

            var knjiga = vratiPodatkeNizKnjigaISBN(nizKnjigaUkorpi[i]);
            var cenaKnjigaNaOsnovuKomada = parseInt(brojacKolicineKnjiga) * knjiga.Cena;

            let indikatorPostoji = false;

            for (z = 0; z < nizIspisanihKnjiga.length; z++) {
                //console.log(isbnKjige[z].getAttribute("data-ISBN"));
                if (nizKnjigaUkorpi[i] === nizIspisanihKnjiga[z]) {
                    indikatorPostoji = true;
                    break;
                }
            }

            if (!indikatorPostoji) {
                generisiHTMLStringKNjige(knjiga, brojacKolicineKnjiga, cenaKnjigaNaOsnovuKomada);
                nizIspisanihKnjiga.push(knjiga.ISBN);
            } else {
                continue;
            }
        }
        upisiUkupno();
    }
}
function upisiUkupno() {
    document.getElementById("ukupnoZaPlatitiIznos").innerHTML = ukupnaVrednostKnjigaUKorpi;
}

function generisiHTMLStringKNjige(knjiga, brojacKolicineKnjiga, cenaKnjigaNaOsnovuKomada) {
    document.getElementById("racunIPodaciStavkeWrapperKnjiga").innerHTML += `
    <div class="racunknjigaKartica">
    <div id="racunknjigaKarticaWrapper">
        <div id="racunKnjigeIMG"><img src="`+ knjiga.Korice + `" alt="Slika knjige"></div>
        <div id="knjigeKarticaWrapperZaglavlje">
            <div id="KnjgeAutori">`+ knjiga.Autori + `</div>
            <div id="KnjigeNaslov">`+ knjiga.Naslov + `</div>
            <div id="KnjigeGodina">`+ knjiga["Godina izdanja"] + `</div>
        </div>
    </div>
    <div id="podaciPorudzbinaCenaKolicina">
        <div id="racunBrojKomada">
            <span class="racunTextSivi">Broj komada:</span>
            <span class="racunTextBold">`+ brojacKolicineKnjiga + `</span>
            <span class="racunTextSivi">kom</span>
        </div>
        <div id="racunCenaPoKomadu">
            <span class="racunTextSivi">Cena po komadu:</span>
            <span class="racunTextBold">`+ knjiga.Cena + `</span>
            <span class="racunTextSivi">RSD</span>
        </div>
    </div>
</div>
    `;
}

function platiRacun() {
    if (proveriVrednostUPoljimaKupca()) {
        ocistiVrednostiULocalStoregu();
        document.getElementById("content_wrapper_racunIPodaci").innerHTML = `<div id="text_racun_zabelezeno">Vaša porudžbina je zabeležena!</div>`;
    } else {
        document.getElementById("racunTekstObavestenja").innerHTML = `<span class="racunCrveniText">Molimo Vas da popunite sva polja, kako bi ste mogli da poručite knjige!</span>`;
        document.getElementById("racunTekstObavestenja").classList.add("Prikazi");
    }
}

function ocistiVrednostiULocalStoregu() {
    var noviNizKnjigaUKorpi = [];
    novaVrednostKnjigaUKorpi = 0;
    localStorage.setItem("nizKnjiga", JSON.stringify(noviNizKnjigaUKorpi));
    localStorage.setItem("vrednostKnjigaUkorpi", novaVrednostKnjigaUKorpi);

    proveriVrednostiUlocalStorageU();
    upisiUheaderKorpa();
    upisiUkupno();
}

function proveriVrednostUPoljimaKupca() {
    if (document.getElementById("ime").innerHTML !== "" &&
        document.getElementById("prezime").innerHTML !== "" &&
        document.getElementById("adresa").innerHTML !== "" &&
        document.getElementById("email").innerHTML !== "" &&
        document.getElementById("telefon").innerHTML !== ""
    ) {
        return true;
    } else {
        return false;
    }
}

function vratiPodatkeNizKnjigaISBN(isbn) {
    for (item of NizKnjiga) {
        if (item.ISBN === isbn) {
            return item;
        }
    }
}
