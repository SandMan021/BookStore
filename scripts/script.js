/*--------------Modalni prozor klikovi-------------*/
document.getElementById("nav_tribar").addEventListener("click", modalSakrij);
document.getElementById("modal_zaglavlje_img").addEventListener("click", modalSakrij);

if (document.title === "Moja knjižara") {
    document.getElementById("javaPretraga").addEventListener("click", upisiULocalStorageSlikaPretraga);
    document.getElementById("jsPretraga").addEventListener("click", upisiULocalStorageSlikaPretraga);
    document.getElementById("excelPretraga").addEventListener("click", upisiULocalStorageSlikaPretraga);
}

window.onload = () => {
    proveriVrednostiUlocalStorageU();
}
window.onscroll = () => {
    prikaziPoziciju();
};

document.getElementById("nav_korpa").addEventListener("click", redirectNaKorpu);
document.getElementById("klonKorpe").addEventListener("click", redirectNaKorpu);

function redirectNaKorpu() {
    window.location.href = "./MojaKorpa.html";
}

function modalSakrij() {
    document.getElementById("modal").classList.toggle("Prikazi");
    if (document.getElementById("modal").classList.contains("Prikazi")) {
        klonirajNodeKorpe();
    } else {
        document.getElementById("klonKorpe").innerHTML = ""
    }
}

function upisiULocalStorageSlikaPretraga(e) {
    var oblastKojaJeKliknuta;

    if (e.target.id === "javaPretraga") {
        oblastKojaJeKliknuta = "Java";
    } else if (e.target.id === "jsPretraga") {
        oblastKojaJeKliknuta = "Javascript";
    } else {
        oblastKojaJeKliknuta = "Excel VBA";
    }

    localStorage.setItem("oblastZaPretragu", oblastKojaJeKliknuta);
    window.location.href = "./Pretrazi.html";
}

// sticky nav
function prikaziPoziciju() {

    var topPozicija = document.getElementById("navWrapper").offsetTop;
    var visina = document.getElementById("navWrapper").offsetHeight;

    if (window.pageYOffset > (topPozicija + visina)) {
        document.getElementById("strelicaNaVrh").classList.add("Prikazi");
        document.getElementById("navWrapper").classList.add("NavTop");
        document.getElementById("imgKnjizara").classList.add("smanjiImgLogoaNaSkrol");
        document.getElementById("navID").classList.add("smanjipaddingeNava");


    } else {
        document.getElementById("strelicaNaVrh").classList.remove("Prikazi");
        document.getElementById("navWrapper").classList.remove("NavTop");
        document.getElementById("imgKnjizara").classList.remove("smanjiImgLogoaNaSkrol");
        document.getElementById("navID").classList.remove("smanjipaddingeNava");
    }
}

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

function klonirajNodeKorpe() {
    document.getElementById("klonKorpe").innerHTML = "";
    var noviDiv = document.createElement("DIV");
    noviDiv.id = "praznoMesto";

    var originalKorpa = document.getElementById("nav_korpa");

    var klonKorpe = originalKorpa.cloneNode(true);

    document.getElementById("klonKorpe").appendChild(noviDiv);
    document.getElementById("klonKorpe").appendChild(klonKorpe);

}
