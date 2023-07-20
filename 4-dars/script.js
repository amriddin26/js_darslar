const h1 = document.querySelector('h1');
const input = document.querySelector('.inp');
const start = document.querySelector('#Bun');
const res = document.querySelector('#Bun1');
const text = document.querySelector('.op');
const span = document.querySelector('.sp')
const h2 = document.querySelector('h2')


const random = Math.floor(Math.random() * 10 + 1 );

console.log(random);

function show(){
    game.onclick = span;

    if (show > random){
        span.innerText = "6"

    }

}


function game() {
    const ans = +input.value;

    if (isNaN(ans)) {
        text.innerText = "Iltimos Faqad Raqam Kiriting";
        text.style.color = 'seagreen';
    } else if (ans == '') {
        text.innerText = "oynani to'ldiring";
        text.style.color = "red";
    } else if (ans > 10 || ans < 1) {
        text.innerText = "1 Dan 10 Gacha raqamni Kiritig";
        text.style.color = 'rgb(123, 20, 226)';
    } else if (ans > random) {
        text.innerText = "Javobingiz Biroz Katta";
        text.style.color = 'red';
    } else if (ans < random) {
        text.innerText = "Javobingiz Biroz Kichik";
        text.style.color = 'blue';
    } else if (ans === random) {
        text.innerText = "TABRIKLAYMIZ    SIZ    YUDINGIZ 🎉✨🎆🎉";
        text.style.color = 'royalblue';
        text.style.FontSize = '40px';
        text.style.fontWeight = 'bold';
        start.style.display = 'none';
        res.style.display = 'inline-block';
    }
}

function reload() {
    document.location.reload();
}

res.onclick = reload;

start.onclick = game;