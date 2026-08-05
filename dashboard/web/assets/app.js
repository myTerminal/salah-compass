/* global document */

const mountMarker = ([label, type, mark, time]) => {
    document.querySelector('#scale').innerHTML += `
<div class='marker ${type}' data-event="${label}" style='top: ${mark}%'>
  <span>${label} (${time})</span>
</div>
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
        ([label, type, mark]) => {
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

    const timeNowElement = document.getElementById('time-now');

    timeNowElement.innerHTML = new Date().toLocaleTimeString(
        'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }
    );
};

const useData = data => {
    const timings = data.timings;

    console.log(timings);

    const markers = [
        ['Midnight', 'event', calculateMinutes(timings['Midnight']) / 14.40, timings['Midnight']],
        ['Lastthird', 'event', calculateMinutes(timings['Lastthird']) / 14.40, timings['Lastthird']],
        ['Imsak', 'event', calculateMinutes(timings['Imsak']) / 14.40, timings['Imsak']],
        ['Fajr', 'prayer', calculateMinutes(timings['Fajr']) / 14.40, timings['Fajr']],
        ['Sunrise', 'event', calculateMinutes(timings['Sunrise']) / 14.40, timings['Sunrise']],
        ['Dhuhr', 'prayer', calculateMinutes(timings['Dhuhr']) / 14.40, timings['Dhuhr']],
        ['Asr', 'prayer', calculateMinutes(timings['Asr']) / 14.40, timings['Asr']],
        ['Maghrib', 'prayer', calculateMinutes(timings['Maghrib']) / 14.40, timings['Maghrib']],
        ['Isha', 'prayer', calculateMinutes(timings['Isha']) / 14.40, timings['Isha']],
        ['Firstthird', 'event', calculateMinutes(timings['Firstthird']) / 14.40, timings['Firstthird']]
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
