const all = document.querySelector('.all');
const tLeft = document.querySelector('.tl');
const tRight = document.querySelector('.tr');
const bRight = document.querySelector('.br');
const bLeft = document.querySelector('.bl');
const bWidth = document.querySelector('.bw');
// For color
const borColor = document.querySelector('.bc');
const bColor = document.querySelector('.bgc');
// Right side
const block = document.querySelector('.block');
const text = document.querySelector('textarea');

// Events
all.addEventListener('input', allCor);
tLeft.addEventListener('input', tLeftCor);
tRight.addEventListener('input', tRightCor);
bRight.addEventListener('input', bRightCor);
bLeft.addEventListener('input', bLeftCor);
bWidth.addEventListener('input', bWidthCor);
borColor.addEventListener('input', borColorCor);
bColor.addEventListener('input', bColorCor);


// Function

function show(){
    text.innerHTML = `border-radius: ${tLeft.value}px,${tRight.value}px,${bRight.value}px,${bLeft.value}px `;
}

function allCor(){
    block.style.borderRadius = all.value + 'px';

    tLeft.value = all.value;
    tRight.value = all.value;
    bRight.value = all.value;
    bLeft.value = all.value;

    text.innerHTML = `border-radius: ${all.value}px`;
    show();
}

function tLeftCor(){
    block.style.borderTopLeftRadius = tLeft.value + 'px';
    show();
}

function tRightCor(){
    block.style.borderTopRightRadius = tRight.value + 'px';
    show();
}

function bRightCor(){
    block.style.borderBottomRightRadius = bRight.value + 'px';
    show();
}

function bLeftCor(){
    block.style.borderBottomLeftRadius = bLeft.value + 'px';
    show();
}

function bWidthCor(){
    block.style.borderWidth = bWidth.value + 'px';
}

function borColorCor(){
    block.style.borderColor = borColor.value;
}

function bColorCor(){
    block.style.backgroundColor = bColor.value;
}