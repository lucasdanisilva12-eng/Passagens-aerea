const prompt = require('prompt-sync')();

class Companhia {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
    }
}

class Trecho {
    constructor(id, companhia, origem, destino, valor) {
        this.id = id;
        this.companhia = companhia;
        this.origem = origem;
        this.destino = destino;
        this.valor = valor;
    }
}

class Sistema {
    constructor() {
        this.companhias = [];
        this.trechos = [];
        this._proximoIdCompanhia = 1;
        this._proximoIdTrecho = 1;
    }

    pausar() {
        console.log("\n-------------------------------------------");
        prompt("Pressione ENTER para continuar...");
        console.clear();
    }

    // ─── COMPANHIAS ────────────────────────────────────────────

    cadastrarCompanhia(nome) {
        const nova = new Companhia(this._proximoIdCompanhia++, nome);
        this.companhias.push(nova);
        console.log(`\n✅ Companhia "${nova.nome}" cadastrada com ID ${nova.id}.`);
    }

    listarCompanhias() {
        if (this.companhias.length === 0) {
            console.log("\n⚠️  Nenhuma companhia cadastrada.");
            return;
        }
        console.log("\n--- Companhias Cadastradas ---");
        this.companhias.forEach(c => {
            console.log(`  [${c.id}] ${c.nome}`);
        });
    }

    editarCompanhia(id, novoNome) {
        const companhia = this.companhias.find(c => c.id === id);
        if (!companhia) {
            console.log(`\n❌ Companhia com ID ${id} não encontrada.`);
            return;
        }
        const nomeAntigo = companhia.nome;
        companhia.nome = novoNome;
        console.log(`\n✅ Companhia atualizada: "${nomeAntigo}" → "${novoNome}".`);
    }

    excluirCompanhia(id) {
        const index = this.companhias.findIndex(c => c.id === id);
        if (index === -1) {
            console.log(`\n❌ Companhia com ID ${id} não encontrada.`);
            return;
        }
        const nome = this.companhias[index].nome;

        // Remove trechos vinculados
        const trechosRemovidos = this.trechos.filter(t => t.companhia.id === id).length;
        this.trechos = this.trechos.filter(t => t.companhia.id !== id);

        this.companhias.splice(index, 1);
        console.log(`\n✅ Companhia "${nome}" excluída.`);
        if (trechosRemovidos > 0) {
            console.log(`   ⚠️  ${trechosRemovidos} trecho(s) vinculado(s) também foram removidos.`);
        }
    }

    // ─── TRECHOS ───────────────────────────────────────────────

    cadastrarTrecho(idCompanhia, origem, destino, valor) {
        const companhia = this.companhias.find(c => c.id === idCompanhia);
        if (!companhia) {
            console.log(`\n❌ Companhia com ID ${idCompanhia} não encontrada.`);
            return;
        }
        const novo = new Trecho(this._proximoIdTrecho++, companhia, origem, destino, valor);
        this.trechos.push(novo);
        console.log(`\n✅ Trecho [${novo.id}] ${origem} → ${destino} (R$ ${valor.toFixed(2)}) cadastrado para "${companhia.nome}".`);
    }

    listarTrechos() {
        if (this.trechos.length === 0) {
            console.log("\n⚠️  Nenhum trecho cadastrado.");
            return;
        }
        console.log("\n--- Trechos Cadastrados ---");
        this.trechos.forEach(t => {
            console.log(`  [${t.id}] ${t.origem} → ${t.destino} | R$ ${t.valor.toFixed(2)} | Companhia: ${t.companhia.nome}`);
        });
    }

    listarTrechosPorCompanhia() {
        this.listarCompanhias();
        if (this.companhias.length === 0) return;

        const id = parseInt(prompt("ID da companhia: "));
        const companhia = this.companhias.find(c => c.id === id);
        if (!companhia) {
            console.log(`\n❌ Companhia com ID ${id} não encontrada.`);
            return;
        }

        const trechos = this.trechos.filter(t => t.companhia.id === id);
        if (trechos.length === 0) {
            console.log(`\n⚠️  Nenhum trecho cadastrado para "${companhia.nome}".`);
            return;
        }

        console.log(`\n--- Trechos de "${companhia.nome}" ---`);
        trechos.forEach(t => {
            console.log(`  [${t.id}] ${t.origem} → ${t.destino} | R$ ${t.valor.toFixed(2)}`);
        });
    }

    editarTrecho(id, origem, destino, valor) {
        const trecho = this.trechos.find(t => t.id === id);
        if (!trecho) {
            console.log(`\n❌ Trecho com ID ${id} não encontrado.`);
            return;
        }
        trecho.origem = origem;
        trecho.destino = destino;
        trecho.valor = valor;
        console.log(`\n✅ Trecho [${id}] atualizado: ${origem} → ${destino} | R$ ${valor.toFixed(2)}.`);
    }

    excluirTrecho(id) {
        const index = this.trechos.findIndex(t => t.id === id);
        if (index === -1) {
            console.log(`\n❌ Trecho com ID ${id} não encontrado.`);
            return;
        }
        const t = this.trechos[index];
        this.trechos.splice(index, 1);
        console.log(`\n✅ Trecho [${id}] ${t.origem} → ${t.destino} excluído.`);
    }
}

// ─── MENU PRINCIPAL ────────────────────────────────────────────

const sistema = new Sistema();
let opcao = -1;

console.clear();
console.log("\n===========================================");
console.log("    BEM-VINDO AO SISTEMA DE PASSAGENS      ");
console.log("===========================================");

while (opcao !== 0) {
    console.log("\n---- MENU ----");
    console.log("1 - Gerenciar Companhias");
    console.log("2 - Gerenciar Trechos");
    console.log("3 - Visualizar Trechos");
    console.log("0 - Sair");
    console.log("-------------------------\n");

    opcao = parseInt(prompt("Escolha uma opção: "));

    switch (opcao) {

        case 1:
            console.log("\n---- COMPANHIAS ----");
            console.log("1 - Cadastrar");
            console.log("2 - Listar");
            console.log("3 - Editar");
            console.log("4 - Excluir");
            const opcaoCompanhia = parseInt(prompt("Escolha: "));

            switch (opcaoCompanhia) {
                case 1:
                    const nomeCompanhia = prompt("Nome da companhia: ");
                    sistema.cadastrarCompanhia(nomeCompanhia);
                    break;
                case 2:
                    sistema.listarCompanhias();
                    break;
                case 3:
                    sistema.listarCompanhias();
                    if (sistema.companhias.length > 0) {
                        const idCompanhiaEditar = parseInt(prompt("ID da companhia para editar: "));
                        const novoNomeCompanhia = prompt("Novo nome: ");
                        sistema.editarCompanhia(idCompanhiaEditar, novoNomeCompanhia);
                    }
                    break;
                case 4:
                    sistema.listarCompanhias();
                    if (sistema.companhias.length > 0) {
                        const idCompanhiaExcluir = parseInt(prompt("ID da companhia para excluir: "));
                        sistema.excluirCompanhia(idCompanhiaExcluir);
                    }
                    break;
            }
            sistema.pausar();
            break;

        case 2:
            console.log("\n---- TRECHOS ----");
            console.log("1 - Cadastrar");
            console.log("2 - Editar");
            console.log("3 - Excluir");
            const opcaoTrecho = parseInt(prompt("Escolha: "));

            switch (opcaoTrecho) {
                case 1:
                    if (sistema.companhias.length === 0) {
                        console.log("\n⚠️ Cadastre uma companhia antes de adicionar trechos.");
                    } else {
                        sistema.listarCompanhias();
                        const idCompanhiaTrecho = parseInt(prompt("ID da companhia: "));
                        const origemTrecho = prompt("Cidade de origem: ");
                        const destinoTrecho = prompt("Cidade de destino: ");
                        const valorTrecho = parseFloat(prompt("Valor do trecho: R$ "));
                        sistema.cadastrarTrecho(idCompanhiaTrecho, origemTrecho, destinoTrecho, valorTrecho);
                    }
                    break;
                case 2:
                    sistema.listarTrechos();
                    if (sistema.trechos.length > 0) {
                        const idTrechoEditar = parseInt(prompt("ID do trecho para editar: "));
                        const novaOrigem = prompt("Nova origem: ");
                        const novoDestino = prompt("Novo destino: ");
                        const novoValor = parseFloat(prompt("Novo valor: R$ "));
                        sistema.editarTrecho(idTrechoEditar, novaOrigem, novoDestino, novoValor);
                    }
                    break;
                case 3:
                    sistema.listarTrechos();
                    if (sistema.trechos.length > 0) {
                        const idTrechoExcluir = parseInt(prompt("ID do trecho para excluir: "));
                        sistema.excluirTrecho(idTrechoExcluir);
                    }
                    break;
            }
            sistema.pausar();
            break;

        case 3:
            console.log("\n---- VISUALIZAR ----");
            console.log("1 - Todos os trechos");
            console.log("2 - Por companhia");
            const opcaoVisualizacao = parseInt(prompt("Escolha: "));

            if (opcaoVisualizacao === 1) sistema.listarTrechos();
            else if (opcaoVisualizacao === 2) sistema.listarTrechosPorCompanhia();

            sistema.pausar();
            break;

        case 0:
            console.log("\nFinalizando o sistema... Até logo!\n");
            break;

        default:
            console.log("\n⚠️ Opção inválida! Tente novamente.");
            sistema.pausar();
            break;
    }
}