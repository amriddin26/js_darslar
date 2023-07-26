const slider = document.querySelector('.slider');
const img = document.querySelector('#imgg');
// buttons
const prev = document.querySelector('#btn1');
const next = document.querySelector('#btn2');

let count = 0;

function removeAcotive() {
    for (let i = 0; i < imgg.length; i++) {
        imgg[i].classList.remove('active');
    }
}

prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSilde);

// NextSilde Function

function nextSilde() {
    removeAcotive();
    count++;
    if (count === imgg.length) {
        count = 0;
    }
    imgg[count].classList.add('active');
}

// PrevSilde Function

function prevSlide() {
    removeAcotive();

    if (count === 0) {
        count = imgg.length;
    }
    count--;
    imgg[count].classList.add('active');
}