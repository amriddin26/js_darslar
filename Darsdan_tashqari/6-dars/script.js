const on = document.querySelector('#but1');
const off = document.querySelector('#but2');
const i = document.querySelector('#lig');
const bColor = document.querySelector('.bColor');

bColor.addEventListener('input', bColorCor);
on.addEventListener('input', onCor);
off.addEventListener('input', offCor);

function onCor(){
    on.style.backgroundColor = bColor.value;
}
