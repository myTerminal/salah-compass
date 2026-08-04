/* global document */

const useData = data => {
    document.body.innerHTML += JSON.stringify(data.timings);
};

document.addEventListener(
    'DOMContentLoaded',
    () => {
        // Your code here, e.g., fetching timings.json
        fetch('/timings.json')
            .then(response => response.json())
            .then(useData)
            .catch(error => console.error(error));
    });   
