const box = document.querySelector('.box');
const i = document.querySelector('.fa-regular fa-lightbulb');
const bColor = document.querySelector('.bColor');

bColor.addEventListener('input', bColorCor);

function bColorCor(){
    box.style.backgroundColor = bColor.value;
}
