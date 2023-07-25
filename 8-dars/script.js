const slider = document.querySelector('.slider');
const img = document.querySelector('img');
// buttons
const prev = document.querySelector('#btn1');
const next = document.querySelector('#btn2');

let count = 0;

function removeAcotive() {
    for (let i = 0; i < img.length; i++) {
        img[i].classList.remove('active');
    }
}

prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSilde);

// NextSilde Function

function nextSilde() {
    removeAcotive();
    count++;
    if (count === img.length) {
        count = 0;
    }
    img[count].classList.add('active');
}

// PrevSilde Function

function prevSlide() {
    removeAcotive();

    if (count === 0) {
        count = img.length;
    }
    count--;
    img[count].classList.add('active');
}