// ================================
// CONFIGURAÇÕES — edite aqui
// ================================
const TOTAL_NUMEROS = 50;          // quantidade de números da rifa
const SEU_WHATSAPP = "5500000000000"; // EDITE: seu número com DDI+DDD, só números (ex: 5521999998888)

// ================================
// Estado (guardado no navegador de cada visitante)
// ================================
const STORAGE_KEY = "cha-rifa-numeros-reservados";

function getReservados() {
  const dados = localStorage.getItem(STORAGE_KEY);
  return dados ? JSON.parse(dados) : {};
}

function salvarReservado(numero, nome) {
  const reservados = getReservados();
  reservados[numero] = nome;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservados));
}

// ================================
// Monta a grade de números
// ================================
const grid = document.getElementById("numberGrid");
const reservados = getReservados();

for (let i = 1; i <= TOTAL_NUMEROS; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.dataset.numero = i;

  if (reservados[i]) {
    btn.disabled = true;
    btn.title = "Este número já foi escolhido";
  } else {
    btn.addEventListener("click", () => abrirModal(i));
  }

  grid.appendChild(btn);
}

// ================================
// Modal de confirmação
// ================================
const modalOverlay = document.getElementById("modalOverlay");
const modalNumber = document.getElementById("modalNumber");
const closeModalBtn = document.getElementById("closeModal");
const form = document.getElementById("raffleForm");

let numeroSelecionado = null;

function abrirModal(numero) {
  numeroSelecionado = numero;
  modalNumber.textContent = numero;
  modalOverlay.classList.remove("hidden");
}

function fecharModal() {
  modalOverlay.classList.add("hidden");
  form.reset();
}

closeModalBtn.addEventListener("click", fecharModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModal();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("guestName").value.trim();
  const telefone = document.getElementById("guestPhone").value.trim();

  // Salva a reserva neste navegador
  salvarReservado(numeroSelecionado, nome);

  // Desabilita o botão do número na tela
  const botao = grid.querySelector(`button[data-numero="${numeroSelecionado}"]`);
  if (botao) {
    botao.disabled = true;
    botao.title = "Este número já foi escolhido";
  }

  // Monta mensagem pronta pro WhatsApp, pra confirmar o pagamento
  const mensagem = encodeURIComponent(
    `Oi! Sou ${nome} e escolhi o número ${numeroSelecionado} no chá rifa. Já vou fazer o Pix e te mando o comprovante por aqui!`
  );
  const linkWhatsapp = `https://wa.me/${SEU_WHATSAPP}?text=${mensagem}`;

  fecharModal();
  window.open(linkWhatsapp, "_blank");
});

// ================================
// Copiar chave Pix
// ================================
const copyPixBtn = document.getElementById("copyPix");
const pixKeyEl = document.getElementById("pixKey");

copyPixBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(pixKeyEl.textContent.trim());
    copyPixBtn.textContent = "Copiado!";
    setTimeout(() => (copyPixBtn.textContent = "Copiar"), 1800);
  } catch (err) {
    alert("Não foi possível copiar automaticamente. Copie manualmente: " + pixKeyEl.textContent);
  }
});
