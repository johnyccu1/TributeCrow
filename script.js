// SoundCloud Widget API - Control Volum
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('sc-widget');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeLabel = document.getElementById('volume-label');

    if (!iframe || !volumeSlider || typeof SC === 'undefined') {
        return;
    }

    const widget = SC.Widget(iframe);

    // Când widget-ul este inițializat complet
    widget.bind(SC.Widget.Events.READY, () => {
        // Setează volumul inițial din slider (ex: 70)
        widget.setVolume(volumeSlider.value);
    });

    // Când utilizatorul mișcă slider-ul de volum
    volumeSlider.addEventListener('input', (event) => {
        const val = event.target.value;
        volumeLabel.textContent = `${val}%`;
        widget.setVolume(val);
    });
});
