const random = Math.floor(Math.random() * 10 + 1);
console.log(random);

let game = true;
let raqam = 6;
let sana = 0;

while (game){
    if (sana == raqam) {
        alert('Game Over');
    }
}

const answer = +prompt("1 dan 10 gacha raqam kiriting");

if (isNaN(answer)) {
   alert("Iltimos Faqad Raqam  Kiriting" + count);
} else if (answer == '') {
    alert("Oynani To'ldirig");
} else if (answer > 10 || answer < 1) {
    alert("1 Dan 10 Gacha Raqam Kiriting");
} else if (random > answer) {
    alert("Sizning Javobingiz Biroz Kichik");
} else if (random < answer) {
    alert("Sizning Javobingiz Biroz Katta");
} else if (answer === random) {
    alert("Tabriklaymiz Siz Yudingiz " + random)
}