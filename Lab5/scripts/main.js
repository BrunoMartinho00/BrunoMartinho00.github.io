let counter = 0;


document.querySelectorAll('button.color').forEach((button) => {
    button.addEventListener('click', () => {
        const cor = button.dataset.color;
        const text = document.getElementById('pintameText');
        if (text) text.style.color = cor;
    });
});

function changeColorInput() {
    const valor = document.getElementById("texto").value.trim().toLowerCase();

    const text = document.getElementById("escreveText");
    text.style.color = valor;

}

function count() {
    counter++;
    document.getElementById("contadorValor").textContent = counter;
}

function entrouArea() {
    const area = document.getElementById("areaRato");
    area.style.backgroundColor = "lightyellow";
    area.textContent = "O rato entrou!";
}

function saiuArea() {
    const area = document.getElementById("areaRato");
    area.style.backgroundColor = "transparent";
    area.textContent = "Passa o rato aqui!";
}

function mostrarPosicao(event) {
    document.getElementById("mensagem").textContent =
        `Posição do rato: X=${event.clientX}, Y=${event.clientY}`;
}

document.querySelector('form').onsubmit = (e) => {
    const valor = document.getElementById('texto')?.value.trim();
    document.body.style.backgroundColor = valor;
    return false;
};

document.querySelector("#palavra").onkeyup = () => {
    const randColor = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    document.querySelector("#palavra").style.backgroundColor = randColor;
};