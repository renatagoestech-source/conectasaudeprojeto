// ==========================================
// CONECTA SAÚDE
// Sistema de Agendamento em UBS
// JavaScript
// ==========================================

// ------------------------------------------
// 1. DADOS DO SISTEMA
// ------------------------------------------

const estado = {
    usuario: null,
    ubs: null,
    especialidade: null,
    data: null,
    horario: null,
    mesAtual: new Date().getMonth(),
    anoAtual: new Date().getFullYear()
};


// UBS disponíveis
const UBS = [
    {
        nome: "UBS A",
        endereco: "Unidade Central",
        bairro: "Centro"
    },
    {
        nome: "UBS B",
        endereco: "Unidade Jardim",
        bairro: "Jardim Saúde"
    },
    {
        nome: "UBS C",
        endereco: "Unidade São José",
        bairro: "São José"
    },
    {
        nome: "UBS D",
        endereco: "Unidade Nova Esperança",
        bairro: "Nova Esperança"
    },
    {
        nome: "UBS E",
        endereco: "Unidade Boa Vista",
        bairro: "Boa Vista"
    }
];


// Especialidades
const especialidades = [
    {
        nome: "Clínico Geral",
        icone: "🩺",
        descricao: "Consultas e avaliação geral"
    },
    {
        nome: "Dentista",
        icone: "🦷",
        descricao: "Atendimento odontológico"
    },
    {
        nome: "Enfermeira",
        icone: "👩‍⚕️",
        descricao: "Cuidados e orientação"
    }
];


// 10 horários pela manhã
const horariosManha = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30"
];


// 10 horários pela tarde
const horariosTarde = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30"
];


// ------------------------------------------
// 2. FUNÇÃO PARA PEGAR ELEMENTOS DO HTML
// ------------------------------------------

function elemento(id) {
    return document.getElementById(id);
}


// ------------------------------------------
// 3. CONTROLE DAS TELAS
// ------------------------------------------

const telas = [
    "screenCadastro",
    "screenUBS",
    "screenEspecialidade",
    "screenAgenda",
    "screenConfirmacao"
];


function mostrarTela(nomeTela, etapa) {

    telas.forEach(function (tela) {

        const elementoTela = elemento(tela);

        if (elementoTela) {

            if (tela === nomeTela) {
                elementoTela.classList.remove("hidden");
            } else {
                elementoTela.classList.add("hidden");
            }

        }

    });


    // Atualiza os passos no topo
    const passos = document.querySelectorAll(".step");

    passos.forEach(function (passo) {

        const numero = Number(passo.dataset.step);

        passo.classList.remove("active");
        passo.classList.remove("done");

        if (numero === etapa) {
            passo.classList.add("active");
        }

        if (numero < etapa) {
            passo.classList.add("done");
        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ------------------------------------------
// 4. MENSAGENS DE ALERTA
// ------------------------------------------

function mostrarMensagem(texto, tipo = "error") {

    const caixa = elemento("alertBox");

    if (!caixa) {
        return;
    }

    caixa.textContent = texto;

    caixa.className = "alert " + tipo;

    caixa.classList.remove("hidden");


    setTimeout(function () {

        caixa.classList.add("hidden");

    }, 4000);
}


// ------------------------------------------
// 5. FORMATAÇÃO DO CELULAR
// ------------------------------------------

const campoCelular = elemento("celular");

if (campoCelular) {

    campoCelular.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "");

        valor = valor.substring(0, 11);


        if (valor.length > 10) {

            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3"
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4})$/,
                "($1) $2-$3"
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /^(\d{2})(\d{0,5})$/,
                "($1) $2"
            );

        }

        this.value = valor;

    });

}


// ------------------------------------------
// 6. CARTÃO SUS
// ------------------------------------------

const campoSUS = elemento("sus");

if (campoSUS) {

    campoSUS.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "");

        this.value = valor.substring(0, 15);

    });

}


// ------------------------------------------
// 7. CADASTRO DO USUÁRIO
// ------------------------------------------

const formularioCadastro = elemento("cadastroForm");

if (formularioCadastro) {

    formularioCadastro.addEventListener("submit", function (evento) {

        evento.preventDefault();


        const nome = elemento("nome").value.trim();

        const celular = elemento("celular")
            .value
            .replace(/\D/g, "");

        const sus = elemento("sus")
            .value
            .replace(/\D/g, "");


        // Validação do nome
        if (nome.split(/\s+/).length < 2) {

            mostrarMensagem(
                "Digite seu nome completo."
            );

            return;
        }


        // Validação do celular
        if (celular.length < 10) {

            mostrarMensagem(
                "Digite um número de celular válido."
            );

            return;
        }


        // Validação do cartão SUS
        if (sus.length < 10) {

            mostrarMensagem(
                "Digite um número de Cartão SUS válido."
            );

            return;
        }


        // Salva os dados
        estado.usuario = {
            nome: nome,
            celular: celular,
            sus: sus
        };


        // Atualiza saudação
        const usuarioBadge = elemento("userBadge");

        if (usuarioBadge) {

            usuarioBadge.textContent =
                "Olá, " + nome.split(" ")[0];

        }


        // Mostra as UBS
        criarListaUBS();


        mostrarTela(
            "screenUBS",
            2
        );

    });

}


// ------------------------------------------
// 8. CRIAR LISTA DE UBS
// ------------------------------------------

function criarListaUBS() {

    const area = elemento("ubsGrid");

    if (!area) {
        return;
    }


    area.innerHTML = "";


    UBS.forEach(function (ubs, indice) {

        const botao = document.createElement("button");

        botao.className = "ubs-card";


        botao.innerHTML = `
            <h3>🏥 ${ubs.nome}</h3>
            <p>${ubs.endereco}</p>
            <p>${ubs.bairro}</p>
        `;


        botao.addEventListener("click", function () {

            estado.ubs = UBS[indice];


            document
                .querySelectorAll(".ubs-card")
                .forEach(function (item) {

                    item.classList.remove("selected");

                });


            botao.classList.add("selected");


            criarEspecialidades();


            setTimeout(function () {

                mostrarTela(
                    "screenEspecialidade",
                    3
                );

            }, 200);

        });


        area.appendChild(botao);

    });

}


// ------------------------------------------
// 9. CRIAR ESPECIALIDADES
// ------------------------------------------

function criarEspecialidades() {

    const area = elemento("especialidades");

    if (!area) {
        return;
    }


    area.innerHTML = "";


    especialidades.forEach(function (especialidade, indice) {

        const botao = document.createElement("button");

        botao.className = "specialty";


        botao.innerHTML = `
            <div class="big">
                ${especialidade.icone}
            </div>

            <h3>
                ${especialidade.nome}
            </h3>

            <p>
                ${especialidade.descricao}
            </p>
        `;


        botao.addEventListener("click", function () {

            estado.especialidade =
                especialidades[indice];


            estado.data = null;

            estado.horario = null;


            const continuar =
                elemento("continueConfirm");

            if (continuar) {
                continuar.disabled = true;
            }


            const subtitulo =
                elemento("agendaSubtitle");


            if (subtitulo) {

                subtitulo.textContent =
                    estado.ubs.nome +
                    " • " +
                    estado.especialidade.nome;

            }


            criarCalendario();


            mostrarTela(
                "screenAgenda",
                4
            );

        });


        area.appendChild(botao);

    });

}


// ------------------------------------------
// 10. CALENDÁRIO
// ------------------------------------------

// Calcula a data da Páscoa
function calcularPascoa(ano) {

    const a = ano % 19;

    const b = Math.floor(ano / 100);

    const c = ano % 100;

    const d = Math.floor(b / 4);

    const e = b % 4;

    const f = Math.floor((b + 8) / 25);

    const g = Math.floor((b - f + 1) / 3);

    const h =
        (19 * a + b - d - g + 15) % 30;

    const i = Math.floor(c / 4);

    const k = c % 4;

    const l =
        (32 + 2 * e + 2 * i - h - k) % 7;

    const m =
        Math.floor((a + 11 * h + 22 * l) / 451);


    const mes =
        Math.floor(
            (h + l - 7 * m + 114) / 31
        ) - 1;


    const dia =
        ((h + l - 7 * m + 114) % 31) + 1;


    return new Date(
        ano,
        mes,
        dia
    );
}


// ------------------------------------------
// 11. FERIADOS
// ------------------------------------------

function ehFeriado(data) {

    const ano = data.getFullYear();

    const mes = data.getMonth();

    const dia = data.getDate();


    // Feriados nacionais com data fixa
    const feriadosFixos = [

        [0, 1],   // Confraternização Universal
        [3, 21],  // Tiradentes
        [4, 1],   // Dia do Trabalho
        [8, 7],   // Independência
        [9, 12],  // Nossa Senhora Aparecida
        [10, 2],  // Finados
        [10, 15], // Proclamação da República
        [11, 25]  // Natal

    ];


    for (const feriado of feriadosFixos) {

        if (
            feriado[0] === mes &&
            feriado[1] === dia
        ) {

            return true;

        }

    }


    // Datas móveis
    const pascoa = calcularPascoa(ano);


    const carnaval = new Date(
        pascoa.getTime() -
        47 * 24 * 60 * 60 * 1000
    );


    const sextaSanta = new Date(
        pascoa.getTime() -
        2 * 24 * 60 * 60 * 1000
    );


    const corpusChristi = new Date(
        pascoa.getTime() +
        60 * 24 * 60 * 60 * 1000
    );


    const datasMoveis = [
        carnaval,
        sextaSanta,
        corpusChristi
    ];


    return datasMoveis.some(function (dataMovel) {

        return (
            dataMovel.getMonth() === mes &&
            dataMovel.getDate() === dia
        );

    });

}


// ------------------------------------------
// 12. VERIFICAR SE DATA ESTÁ INDISPONÍVEL
// ------------------------------------------

function dataIndisponivel(data) {

    // Domingo
    if (data.getDay() === 0) {
        return true;
    }


    // Sábado
    if (data.getDay() === 6) {
        return true;
    }


    // Feriado
    if (ehFeriado(data)) {
        return true;
    }


    // Não permite datas anteriores a hoje
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);


    if (data < hoje) {
        return true;
    }


    return false;
}


// ------------------------------------------
// 13. TRANSFORMAR DATA EM TEXTO
// ------------------------------------------

function chaveData(data) {

    return (
        data.getFullYear() +
        "-" +
        String(data.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(data.getDate()).padStart(2, "0")
    );

}


// ------------------------------------------
// 14. PEGAR AGENDAMENTOS
// ------------------------------------------

function pegarAgendamentos(data) {

    const chave = chaveData(data);

    const dados =
        localStorage.getItem(
            "conecta_saude_agendamentos"
        );


    if (!dados) {
        return [];
    }


    const agendamentos =
        JSON.parse(dados);


    return agendamentos[chave] || [];

}


// ------------------------------------------
// 15. SALVAR AGENDAMENTO
// ------------------------------------------

function salvarAgendamentos(data, lista) {

    const chave = chaveData(data);


    const dados =
        localStorage.getItem(
            "conecta_saude_agendamentos"
        );


    let agendamentos = {};


    if (dados) {

        agendamentos =
            JSON.parse(dados);

    }


    agendamentos[chave] = lista;


    localStorage.setItem(
        "conecta_saude_agendamentos",
        JSON.stringify(agendamentos)
    );

}


// ------------------------------------------
// 16. CRIAR CALENDÁRIO
// ------------------------------------------

function criarCalendario() {

    const titulo = elemento("monthTitle");

    const calendario = elemento("calendar");


    if (!titulo || !calendario) {
        return;
    }


    const dataInicial = new Date(
        estado.anoAtual,
        estado.mesAtual,
        1
    );


    titulo.textContent =
        dataInicial.toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );


    const primeiroDia =
        dataInicial.getDay();


    const totalDias =
        new Date(
            estado.anoAtual,
            estado.mesAtual + 1,
            0
        ).getDate();


    calendario.innerHTML = "";


    // Espaços antes do primeiro dia
    for (
        let i = 0;
        i < primeiroDia;
        i++
    ) {

        const vazio =
            document.createElement("div");

        vazio.className = "day empty";

        calendario.appendChild(vazio);

    }


    // Dias do mês
    for (
        let dia = 1;
        dia <= totalDias;
        dia++
    ) {

        const data = new Date(
            estado.anoAtual,
            estado.mesAtual,
            dia
        );


        data.setHours(0, 0, 0, 0);


        const botao =
            document.createElement("button");


        botao.className = "day";


        botao.textContent = dia;


        if (dataIndisponivel(data)) {

            botao.classList.add("disabled");

            botao.disabled = true;

        } else {

            botao.classList.add("available");


            botao.addEventListener(
                "click",
                function () {

                    selecionarData(data);

                }
            );

        }


        if (ehFeriado(data)) {

            botao.classList.add("holiday");

        }


        if (
            estado.data &&
            chaveData(estado.data) ===
            chaveData(data)
        ) {

            botao.classList.add("selected");

        }


        calendario.appendChild(botao);

    }


    if (estado.data) {

        criarHorarios();

    }

}


// ------------------------------------------
// 17. SELECIONAR DATA
// ------------------------------------------

function selecionarData(data) {

    estado.data = data;

    estado.horario = null;


    const continuar =
        elemento("continueConfirm");


    if (continuar) {
        continuar.disabled = true;
    }


    criarCalendario();

    criarHorarios();

}


// ------------------------------------------
// 18. MUDAR MÊS
// ------------------------------------------

const botaoMesAnterior =
    elemento("prevMonth");


if (botaoMesAnterior) {

    botaoMesAnterior.addEventListener(
        "click",
        function () {

            estado.mesAtual--;


            if (estado.mesAtual < 0) {

                estado.mesAtual = 11;

                estado.anoAtual--;

            }


            criarCalendario();

        }
    );

}


const botaoProximoMes =
    elemento("nextMonth");


if (botaoProximoMes) {

    botaoProximoMes.addEventListener(
        "click",
        function () {

            estado.mesAtual++;


            if (estado.mesAtual > 11) {

                estado.mesAtual = 0;

                estado.anoAtual++;

            }


            criarCalendario();

        }
    );

}


// ------------------------------------------
// 19. CRIAR HORÁRIOS
// ------------------------------------------

function criarHorarios() {

    const areaManha =
        elemento("morningSlots");

    const areaTarde =
        elemento("afternoonSlots");

    const tituloData =
        elemento("selectedDateTitle");


    if (!estado.data) {
        return;
    }


    if (tituloData) {

        tituloData.textContent =
            estado.data.toLocaleDateString(
                "pt-BR",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long"
                }
            );

    }


    const agendamentos =
        pegarAgendamentos(
            estado.data
        );


    criarBotoesHorario(
        areaManha,
        horariosManha,
        agendamentos
    );


    criarBotoesHorario(
        areaTarde,
        horariosTarde,
        agendamentos
    );

}


// ------------------------------------------
// 20. BOTÕES DE HORÁRIO
// ------------------------------------------

function criarBotoesHorario(
    area,
    horarios,
    agendamentos
) {

    if (!area) {
        return;
    }


    area.innerHTML = "";


    horarios.forEach(function (horario) {

        const botao =
            document.createElement("button");


        botao.className = "slot";


        botao.textContent = horario;


        // Verifica se horário já está ocupado
        const ocupado =
            agendamentos.some(function (agendamento) {

                return (
                    agendamento.ubs ===
                    estado.ubs.nome &&

                    agendamento.especialidade ===
                    estado.especialidade.nome &&

                    agendamento.horario ===
                    horario
                );

            });


        if (ocupado) {

            botao.classList.add("full");

            botao.disabled = true;

            botao.textContent =
                horario + " • ocupado";

        } else {

            botao.addEventListener(
                "click",
                function () {

                    selecionarHorario(
                        horario
                    );

                }
            );

        }


        if (
            estado.horario === horario
        ) {

            botao.classList.add(
                "selected"
            );

        }


        area.appendChild(botao);

    });

}


// ------------------------------------------
// 21. SELECIONAR HORÁRIO
// ------------------------------------------

function selecionarHorario(horario) {

    estado.horario = horario;


    document
        .querySelectorAll(".slot")
        .forEach(function (botao) {

            botao.classList.remove(
                "selected"
            );

        });


    document
        .querySelectorAll(".slot")
        .forEach(function (botao) {

            if (
                botao.textContent
                    .startsWith(horario)
            ) {

                botao.classList.add(
                    "selected"
                );

            }

        });


    const continuar =
        elemento("continueConfirm");


    if (continuar) {

        continuar.disabled = false;

    }

}


// ------------------------------------------
// 22. CONFIRMAR AGENDAMENTO
// ------------------------------------------

const botaoConfirmar =
    elemento("continueConfirm");


if (botaoConfirmar) {

    botaoConfirmar.addEventListener(
        "click",
        function () {

            if (
                !estado.data ||
                !estado.horario
            ) {

                mostrarMensagem(
                    "Escolha uma data e um horário."
                );

                return;

            }


            const agendamentos =
                pegarAgendamentos(
                    estado.data
                );


            // Verifica novamente se o horário foi ocupado
            const horarioOcupado =
                agendamentos.some(
                    function (agendamento) {

                        return (
                            agendamento.ubs ===
                            estado.ubs.nome &&

                            agendamento.especialidade ===
                            estado.especialidade.nome &&

                            agendamento.horario ===
                            estado.horario
                        );

                    }
                );


            if (horarioOcupado) {

                mostrarMensagem(
                    "Esse horário acabou de ser ocupado. Escolha outro."
                );


                criarHorarios();

                return;

            }


            // Cria novo agendamento
            const novoAgendamento = {

                nome:
                    estado.usuario.nome,

                celular:
                    estado.usuario.celular,

                sus:
                    estado.usuario.sus,

                ubs:
                    estado.ubs.nome,

                especialidade:
                    estado.especialidade.nome,

                horario:
                    estado.horario,

                data:
                    chaveData(
                        estado.data
                    ),

                id:
                    Date.now()

            };


            agendamentos.push(
                novoAgendamento
            );


            salvarAgendamentos(
                estado.data,
                agendamentos
            );


            // Calcula posição na fila
            const posicaoFila =
                agendamentos.filter(
                    function (agendamento) {

                        return (
                            agendamento.ubs ===
                            estado.ubs.nome &&

                            agendamento.especialidade ===
                            estado.especialidade.nome
                        );

                    }
                ).length;


            mostrarConfirmacao(
                novoAgendamento,
                posicaoFila
            );


            mostrarTela(
                "screenConfirmacao",
                5
            );

        }
    );

}


// ------------------------------------------
// 23. MOSTRAR CONFIRMAÇÃO
// ------------------------------------------

function mostrarConfirmacao(
    agendamento,
    posicaoFila
) {

    const resumo =
        elemento("summary");


    if (resumo) {

        resumo.innerHTML = `

            <div>
                <span>Paciente</span>
                <strong>
                    ${escaparHTML(
                        agendamento.nome
                    )}
                </strong>
            </div>

            <div>
                <span>UBS</span>
                <strong>
                    ${agendamento.ubs}
                </strong>
            </div>

            <div>
                <span>Especialidade</span>
                <strong>
                    ${agendamento.especialidade}
                </strong>
            </div>

            <div>
                <span>Data</span>
                <strong>
                    ${formatarData(
                        estado.data
                    )}
                </strong>
            </div>

            <div>
                <span>Horário</span>
                <strong>
                    ${agendamento.horario}
                </strong>
            </div>

            <div>
                <span>Cartão SUS</span>
                <strong>
                    ${mascararSUS(
                        agendamento.sus
                    )}
                </strong>
            </div>

        `;

    }


    const fila =
        elemento("queuePosition");


    if (fila) {

        fila.textContent =
            posicaoFila + "º";

    }

}


// ------------------------------------------
// 24. FORMATAR DATA
// ------------------------------------------

function formatarData(data) {

    return data.toLocaleDateString(
        "pt-BR"
    );

}


// ------------------------------------------
// 25. MASCARAR CARTÃO SUS
// ------------------------------------------

function mascararSUS(numero) {

    if (!numero) {
        return "";
    }


    if (numero.length <= 4) {
        return numero;
    }


    return (
        "•••• •••• •••• " +
        numero.slice(-4)
    );

}


// ------------------------------------------
// 26. PROTEGER TEXTO HTML
// ------------------------------------------

function escaparHTML(texto) {

    return texto.replace(
        /[&<>"']/g,
        function (caractere) {

            const caracteres = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return caracteres[
                caractere
            ];

        }
    );

}


// ------------------------------------------
// 27. BOTÃO VOLTAR PARA CADASTRO
// ------------------------------------------

const voltarCadastro =
    elemento("backToCadastro");


if (voltarCadastro) {

    voltarCadastro.addEventListener(
        "click",
        function () {

            mostrarTela(
                "screenCadastro",
                1
            );

        }
    );

}


// ------------------------------------------
// 28. BOTÃO VOLTAR PARA UBS
// ------------------------------------------

const voltarUBS =
    elemento("backToUBS");


if (voltarUBS) {

    voltarUBS.addEventListener(
        "click",
        function () {

            mostrarTela(
                "screenUBS",
                2
            );

        }
    );

}


// ------------------------------------------
// 29. BOTÃO VOLTAR PARA ESPECIALIDADE
// ------------------------------------------

const voltarEspecialidade =
    elemento("backToEspecialidade");


if (voltarEspecialidade) {

    voltarEspecialidade.addEventListener(
        "click",
        function () {

            mostrarTela(
                "screenEspecialidade",
                3
            );

        }
    );

}


// ------------------------------------------
// 30. NOVO AGENDAMENTO
// ------------------------------------------

const novoAgendamento =
    elemento("newAppointment");


if (novoAgendamento) {

    novoAgendamento.addEventListener(
        "click",
        function () {

            estado.ubs = null;

            estado.especialidade = null;

            estado.data = null;

            estado.horario = null;


            mostrarTela(
                "screenUBS",
                2
            );

        }
    );

}


// ------------------------------------------
// 31. INICIALIZAÇÃO
// ------------------------------------------

criarListaUBS();

console.log(
    "Conecta Saúde iniciado com sucesso!"
);
