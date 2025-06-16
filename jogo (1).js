let energia = 100;
let saude = 100;
let nivel = 1;
let semana = 1;
let usouTadalafila = false;
let usouAnabolizante = false;
let jogoAtivo = true;
let log = [];
let dificuldade = "normal";

const desafiosSemana = {
  1: { energia: 110, saude: 100 },
  2: { energia: 130, saude: 120 },
  3: { energia: 150, saude: 130 }
};

function atualizarInterface(msg) {
  if (!jogoAtivo) return;
  energia = Math.min(energia, 200);
  saude = Math.min(saude, 200);

  document.getElementById("energia").textContent = energia;
  document.getElementById("saude").textContent = saude;
  document.getElementById("nivel").textContent = nivel;
  document.getElementById("semana").textContent = semana;
  document.getElementById("mensagem").textContent = msg;
  document.getElementById("barraEnergia").value = energia;
  document.getElementById("barraSaude").value = saude;
  atualizarHistorico();

  if (saude <= 0) {
    jogoAtivo = false;
    if (usouAnabolizante) {
      mostrarDerrota("💀 Você perdeu! O uso de anabolizantes afetou gravemente sua saúde.");
    } else if (usouTadalafila) {
      mostrarDerrota("💀 Você perdeu! O uso de tadalafila sem orientação causou problemas sérios à sua saúde.");
    } else {
      mostrarDerrota("💀 Você perdeu por exaustão física.");
    }
    return;
  }

  if (nivel >= 3 && energia >= 200) {
    jogoAtivo = false;
    mostrarVitoria();
  }
}

function mostrarDerrota(texto) {
  document.getElementById("mensagem").textContent = texto;
  document.getElementById("resultadoFinal").innerHTML = `<h2 style="color:red;">DERROTA</h2><p>${texto}</p>`;
  desabilitarBotoes();
}

function mostrarVitoria() {
  let taxaVida = 100;
  if (usouAnabolizante) taxaVida -= 5;
  if (usouTadalafila) taxaVida -= 5;
  let pontuacao = energia + saude;
  let tabela = `
    <h2 style="color:green;">🏆 VITÓRIA!</h2>
    <p>Você alcançou o nível intermediário com alta energia!</p>
    <table>
      <tr><th>Indicador</th><th>Valor</th></tr>
      <tr><td>Taxa de Vida</td><td>${taxaVida}%</td></tr>
      <tr><td>Pontuação Final</td><td>${pontuacao}</td></tr>
    </table>
    <p style="color:#c0392b;">${
      taxaVida < 100
        ? "⚠️ O uso de substâncias reduziu sua qualidade de vida!"
        : "✅ Parabéns! Você manteve uma saúde excelente!"
    }</p>
  `;
  document.getElementById("resultadoFinal").innerHTML = tabela;
  desabilitarBotoes();
}

function desabilitarBotoes() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = true);
  document.getElementById("btnReiniciar").style.display = "inline-block";
}

function subirNivel() {
  if (energia >= 120 && saude >= 120) {
    nivel++;
    log.push(`📈 Subiu para o nível ${nivel}!`);
    atualizarInterface("🎉 Você subiu de nível!");
  }
}

function registrarAcao(texto) {
  log.push(`Semana ${semana}: ${texto}`);
}

function atualizarHistorico() {
  const lista = document.getElementById("logAcoes");
  lista.innerHTML = log.map(item => `<li>${item}</li>`).join("");
}

function exercicioCasa() {
  if (!jogoAtivo) return;
  let ganho = Math.floor(Math.random() * 10 + 5);
  let perda = Math.floor(Math.random() * 6 + 5);
  saude += ganho;
  energia -= perda;
  registrarAcao(`🏠 Exercício em Casa (+${ganho} saúde, -${perda} energia)`);
  subirNivel();
  atualizarInterface("🏠 Você treinou em casa!");
}

function usarStrava() {
  if (!jogoAtivo) return;
  let ganho = Math.floor(Math.random() * 11 + 10);
  energia += ganho;
  let perdeuSaude = false;
  if (Math.random() < 0.5) {
    let perda = Math.floor(Math.random() * 6 + 5);
    saude -= perda;
    perdeuSaude = perda;
  }
  registrarAcao(`🏃 Strava (+${ganho} energia${perdeuSaude ? `, -${perdeuSaude} saúde` : ""})`);
  subirNivel();
  atualizarInterface("🏃 Você correu com o Strava!");
}

function usarAnabolizante() {
  if (!jogoAtivo) return;
  energia += 5;
  saude -= 8;
  usouAnabolizante = true;
  registrarAcao("💉 Usou Anabolizante (+5 energia, -8 saúde)");
  subirNivel();
  atualizarInterface("💉 Você usou anabolizante.");
}

function usarTadalafila() {
  if (!jogoAtivo) return;
  const ganho = dificuldade === "difícil" ? 15 : 20;
  const perda = dificuldade === "difícil" ? 40 : 30;
  energia += ganho;
  saude -= perda;
  usouTadalafila = true;
  registrarAcao(`💊 Usou Tadalafila (+${ganho} energia, -${perda} saúde)`);
  subirNivel();
  atualizarInterface("💊 Você tomou tadalafila.");
}

function descansar() {
  if (!jogoAtivo) return;
  energia += 15;
  saude += 10;
  registrarAcao("😴 Descansou (+15 energia, +10 saúde)");
  subirNivel();
  atualizarInterface("😴 Você descansou.");
}

function encerrarSemana() {
  if (!jogoAtivo) return;
  semana++;
  const meta = desafiosSemana[semana] || { energia: 140, saude: 140 };
  if (energia >= meta.energia && saude >= meta.saude) {
    registrarAcao("✅ Meta personalizada da semana alcançada!");
    atualizarInterface("✅ Você atingiu o desafio da semana!");
  } else {
    registrarAcao("⚠️ Meta semanal falhou.");
    atualizarInterface("⚠️ Você falhou no desafio semanal.");
  }
}

function reiniciarJogo() {
  energia = 100;
  saude = 100;
  nivel = 1;
  semana = 1;
  usouTadalafila = false;
  usouAnabolizante = false;
  jogoAtivo = true;
  log = [];
  document.getElementById("resultadoFinal").innerHTML = "";
  document.getElementById("btnReiniciar").style.display = "none";
  document.querySelectorAll("button").forEach(btn => btn.disabled = false);
  atualizarInterface("Faça escolhas saudáveis!");
}

// Salvar e carregar do localStorage
function salvarEstado() {
  const estado = { energia, saude, nivel, semana, usouTadalafila, usouAnabolizante, log };
  localStorage.setItem("desafioFitness", JSON.stringify(estado));
}

function carregarEstado() {
  const estadoSalvo = localStorage.getItem("desafioFitness");
  if (estadoSalvo) {
    const estado = JSON.parse(estadoSalvo);
    energia = estado.energia;
    saude = estado.saude;
    nivel = estado.nivel;
    semana = estado.semana;
    usouTadalafila = estado.usouTadalafila;
    usouAnabolizante = estado.usouAnabolizante;
    log = estado.log || [];
    jogoAtivo = true;
    atualizarInterface("Jogo carregado!");
  }
}

window.onload = () => {
  carregarEstado();
  atualizarInterface("Faça escolhas saudáveis!");
};
setInterval(salvarEstado, 5000);