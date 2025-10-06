let counter = 0;

function redButton() {
    const text = document.getElementById("pintameText");
    text.style.color = "red";
}

function greenButton() {
    const text = document.getElementById("pintameText");
    text.style.color = "green";
}

function blueButton() {
    const text = document.getElementById("pintameText");
    text.style.color = "blue";
}

function resetColor() {
    const text = document.getElementById("pintameText");
    text.style.color = "black";
}

function changeColorInput() {
    const valor = document.getElementById("texto").value.trim().toLowerCase();

    const text = document.getElementById("escreveText");
    text.style.color = valor;

}

function count() {
    counter++;
    document.getElementById("contador").textContent = "Cliques: " + counter;
}

function imagemGrande() {
    const img = document.getElementById("foto");
    img.style.transform = "scale(1.2)";
    img.style.transition = "0.3s";
}

function imagemNormal() {
    const img = document.getElementById("foto");
    img.style.transform = "scale(1)";
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

function destacarHeader() {
    document.querySelector("header").style.backgroundColor = "darkred";
}

function normalHeader() {
    document.querySelector("header").style.backgroundColor = "black";
}

function mudarFooter() {
    const footer = document.querySelector("footer");
    footer.style.backgroundColor = "darkgreen";
    footer.querySelector("p").textContent = "Rodapé alterado por duplo clique!";
}

function mostrarPosicao(event) {
    document.getElementById("mensagem").textContent =
        `Posição do rato: X=${event.clientX}, Y=${event.clientY}`;
}
