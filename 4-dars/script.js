const h1 = document.querySelector('h1');
const input = document.querySelector('inp');
const start = document.querySelector('#Btn');
const res = document.querySelector('#Btn1');
const text = document.querySelector('.out');

const random = Math.floor(Math.random() * 10 + 1 );

console.log(random);

function game(){
    const ans = +input.value;

    if (isNaN(ans)){
        text.innerText = "Iltimos Faqad Raqam Kiriting";
        text.style.color = 'red';
    } else if (ans == ''){
        text.innerText = "oynani to'ldiring";
        text.style.color = "red";
    } else if (ans > 10 || ans < 1){
        text.innerText = "1 Dan 10 Gacha raqamni Kiritig";
        text.style.color = 'rgb(123, 20, 226)';
    } else if (ans > random){
        text.innerText = "Javobingiz Biroz Katta";
        text.style.color = 'red';
    }
}