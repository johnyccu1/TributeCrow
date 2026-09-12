// =============================================================================
// SoundCloud Widget API - Control Personalizat de Volum
// =============================================================================

// 'DOMContentLoaded' asteapta ca structura HTML a paginii sa fie complet descarcata si
// construita in memorie (in arborele DOM). Astfel, suntem siguri ca elementele HTML
// (iframe-ul, slider-ul, eticheta) exista deja cand incercam sa le selectam prin JS.
document.addEventListener('DOMContentLoaded', () => {

    // 1. document.getElementById('id') cauta in HTML elementul unic cu id-ul specificat:
    // Selectam iframe-ul care gazduieste playerul SoundCloud:
    const iframe = document.getElementById('sc-widget');

    // Selectam input-ul de tip 'range' (cursorul glisant) prin care utilizatorul alege volumul:
    const volumeSlider = document.getElementById('volume-slider');

    // Selectam span-ul in care scriem textul procentual (ex: "70%"):
    const volumeLabel = document.getElementById('volume-label');

    // 2. Clauza de siguranta (Guard Clause):
    // Verificam daca:
    // - !iframe: iframe-ul lipseste cumva din pagina;
    // - !volumeSlider: slider-ul nu a fost gasit;
    // - typeof SC === 'undefined': scriptul extern 'api.js' de la SoundCloud nu s-a incarcat
    //   (de exemplu, din cauza unui adblocker sau lipsa conexiunii la internet).
    // Daca oricare lipseste, oprim functia cu 'return' pentru a preveni erori in consola.
    if (!iframe || !volumeSlider || typeof SC === 'undefined') {
        return;
    }

    // 3. Initializam obiectul Widget din biblioteca SoundCloud:
    // SC.Widget(iframe) creeaza o punte de comunicare sigura (prin postMessage)
    // intre pagina noastra si playerul SoundCloud aflat in interiorul iframe-ului.
    const widget = SC.Widget(iframe);

    // 4. widget.bind asculta un eveniment intern trimis de playerul SoundCloud:
    // 'SC.Widget.Events.READY' se declanseaza cand playerul a terminat de incarcat audio engine-ul
    // si este gata sa primeasca comenzi (play, volum, pauza etc.).
    widget.bind(SC.Widget.Events.READY, () => {
        // volumeSlider.value preia valoarea initiala setata in HTML (in cazul nostru: 70).
        // widget.setVolume(valoare) accepta numere intre 0 (mut) si 100 (volum maxim).
        widget.setVolume(volumeSlider.value);
    });

    // 5. Adaugam un ascultator de evenimente pe slider:
    // Evenimentul 'input' se declanseaza continuu, in timp real, in fiecare milisecunda
    // in care utilizatorul trage cursorul (spre deosebire de 'change' care se declanseaza
    // abia cand utilizatorul da drumul la click).
    volumeSlider.addEventListener('input', (event) => {
        // event.target este elementul care a declansat evenimentul (slider-ul).
        // .value este valoarea curenta a cursorului (intre 0 si 100).
        const val = event.target.value;

        // textContent actualizeaza textul din span cu valoarea noua urmata de simbolul '%':
        volumeLabel.textContent = `${val}%`;

        // Transmitem in timp real noul nivel de volum catre playerul SoundCloud:
        widget.setVolume(val);
    });
});

/*
================================================================================
REFERINTE UTILE SI DOCUMENTATIE PENTRU INCEPATORI:
================================================================================
1. MDN - document.addEventListener():
   https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   (Cum ascultam actiuni sau evenimente pe elemente HTML)

2. MDN - Evenimentul 'DOMContentLoaded':
   https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
   (De ce asteptam incarcarea arborelui DOM inainte de rularea codului)

3. MDN - document.getElementById():
   https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
   (Cum gasim un element din HTML dupa atributul sau id)

4. MDN - Evenimentul 'input' vs 'change':
   https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
   (Diferenta intre actualizarea in timp real si actualizarea la eliberarea mouse-ului)

5. MDN - Elementul HTML <input type="range">:
   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
   (Proprietatile min, max, value si functionarea sliderelor native)

6. Documentatia Oficiala SoundCloud Widget API (inclusiv setVolume / getVolume):
   https://developers.soundcloud.com/docs/api/html5-widget
   (Ghidul oficial care explica metoda setVolume(volume) cu valori de la 0 la 100
   si evenimentul SC.Widget.Events.READY)
================================================================================
*/
