// Acessando modal
var modal = document.getElementById("adicionar-bolsa-modal");

// botão abrir modal
var btn_modal_open = document.getElementById("myBtn");

// botão fechar modal
var btn_modal_close = document.getElementsByClassName("close")[0];

// evento abrir modal
btn_modal_open.onclick = function() {
    modal.style.display = "block";
}

// evento fechar modal
btn_modal_close.onclick = function() {
    modal.style.display = "none";
}

// evento fechar modal com clique em área externa
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
