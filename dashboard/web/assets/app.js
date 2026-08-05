/* global document */

const mountMarker = ([label, mark, time]) => {
    document.querySelector('#scale').innerHTML += `
<div class='marker' data-event="${label}" style='top: ${mark}%'>${label} (${time})</div>
`;
};

const calculateMinutes = time => {
    const [hours, minutes] = time.split(':');
    return +hours * 60 + +minutes;
};

const getElapsedMinutes = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const elapsedMinutes = (now - midnight) / 60000;

    return Math.floor(elapsedMinutes);
};

const updatePointer = markers => {
    const elapsedMinutes = getElapsedMinutes();
    const elapsedPercentage = elapsedMinutes / 14.00;

    document.getElementById('pointer').style.height = `${elapsedPercentage}%`;

    markers.forEach(
        ([label, mark]) => {
            const markerElement = document.querySelector(`[data-event=${label}]`);

            if (elapsedPercentage > mark) {
                document.querySelector('.marker.current')?.classList.remove('current');
                markerElement.classList.add('past');
                markerElement.classList.add('current');
            } else {
                markerElement.classList.add('future');
            }
        }
    );
};

const useData = data => {
    const timings = data.timings;

    const markers = [
        ['Fajr', calculateMinutes(timings['Fajr']) / 14.40, timings['Fajr']],
        ['Dhuhr', calculateMinutes(timings['Dhuhr']) / 14.40, timings['Dhuhr']],
        ['Asr', calculateMinutes(timings['Asr']) / 14.40, timings['Asr']],
        ['Maghrib', calculateMinutes(timings['Maghrib']) / 14.40, timings['Maghrib']],
        ['Isha', calculateMinutes(timings['Isha']) / 14.40, timings['Isha']]
    ];

    markers.forEach(m => { mountMarker(m); });

    updatePointer(markers);
    window.setInterval(
        () => { updatePointer(markers); },
        60 * 1000
    );
};

document.addEventListener(
    'DOMContentLoaded',
    () => {
        fetch('/timings.json')
            .then(response => response.json())
            .then(useData)
            .catch(error => console.error(error));
    }
);
