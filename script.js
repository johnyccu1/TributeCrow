// =============================================================================
// SoundCloud Widget API - Control Personalizat de Volum
// =============================================================================

// 'DOMContentLoaded' asteapta ca structura HTML a paginii sa fie complet descarcata si
// construita in memorie (in arborele DOM). Astfel, suntem siguri ca elementele HTML
// (iframe-ul, slider-ul, eticheta) exista deja cand incercam sa le selectam prin JS.
document.addEventListener('DOMContentLoaded', () => {

    // 1. Selectam elementele din pagina:
    const iframe = document.getElementById('sc-widget');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeLabel = document.getElementById('volume-label');

    // Daca elementele HTML de baza lipsesc din DOM, oprim executia:
    if (!iframe || !volumeSlider) {
        return;
    }

    let widget = null;

    // 2. Ascultatorul pentru slider este activat IMEDIAT:
    // Chiar daca scriptul SoundCloud are intarziere pe retea, slider-ul si textul
    // procentual (ex: "70%") vor reactiona instant la miscarea cursorului.
    volumeSlider.addEventListener('input', (event) => {
        const val = event.target.value;

        if (volumeLabel) {
            volumeLabel.textContent = `${val}%`;
        }

        // Daca widget-ul SoundCloud a fost deja initializat, actualizam volumul audio:
        if (widget) {
            try {
                widget.setVolume(val);
            } catch (err) {
                console.warn('Nu s-a putut trimite volumul catre SoundCloud:', err);
            }
        }
    });

    // 3. Functie de initializare sigura a playerului SoundCloud:
    function initSoundCloud() {
        if (typeof SC === 'undefined' || !SC.Widget) {
            return false;
        }

        try {
            widget = SC.Widget(iframe);

            // Setam volumul cand playerul este gata initial:
            widget.bind(SC.Widget.Events.READY, () => {
                widget.setVolume(volumeSlider.value);
            });

            // IMPORTANT: Multe browsere reseteaza volumul la 100% cand porneste piesa.
            // Ascultam si evenimentul PLAY pentru a reaplica valoarea aleasa pe slider:
            widget.bind(SC.Widget.Events.PLAY, () => {
                widget.setVolume(volumeSlider.value);
            });

            return true;
        } catch (e) {
            console.error('Eroare la initializarea SoundCloud Widget:', e);
            return false;
        }
    }

    // 4. Incercam initializarea imediata; daca biblioteca api.js intarzie pe retea,
    // reincercam la intervale scurte (polling) pana cand SC devine disponibil:
    if (!initSoundCloud()) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (initSoundCloud() || attempts >= 20) {
                clearInterval(checkInterval);
            }
        }, 200);
    }
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
