const recintos = {
    numero: [1, 2, 3, 4, 5],
    bioma: ['savana', 'floresta', ['savana', 'rio'], 'rio', 'savana'],
    tamanho_total: [10, 5, 7, 8, 9],
    animais_existentes: [[3, 'macaco'], [0, ''], [1, 'gazela'], [0, ''], [1, 'leao']]
};

const animais = {
    nome: ['leao', 'leopardo', 'crocodilo', 'macaco', 'gazela', 'hipopotamo'],
    tamanho: [3, 2, 3, 1, 2, 4],
    bioma: ['savana', 'savana', 'rio', ['savana', 'floresta'], 'savana', ['savana', 'rio']],
    dieta: ['carnivoro', 'carnivoro', 'carnivoro', 'herbivoro', 'herbivoro', 'herbivoro']
};



class RecintosZoo {
    // Suas funções anteriores permanecem as mesmas...
    static regra_hipopotamo(bioma_recinto) {
        if (Array.isArray(bioma_recinto) && bioma_recinto.includes('savana') && bioma_recinto.includes('rio')) {
            // se o bioma for savana e rio, o hipopotamo pode dividir com outra especie
            return true;
        } else {
            // caso contrário o hipopotamo so deve ficar sozinho ou com outros hipopotamos
            return false;
        }
    }

    static regra_macaco(especie_no_recinto, quantidade) {
        // verifica se existe alguma espécie no recinto
        if (especie_no_recinto === '' && quantidade <= 1) {
            return false;
        } else {
            return true;
        }
    }

    static regra_carnivoros(animal, especie_no_recinto) {
        // se houver especie no recinto, verifica se é da mesma especie do animal carnivoro a ser alocado
        if (especie_no_recinto) {
            return especie_no_recinto.toLowerCase() === animal.toLowerCase();
        }
        return true;
    }

    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é válido dentre os determinados
        if (!animais.nome.includes(animal.toLowerCase())) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        // Verifica se a quantidade é válida, precisando ser um número inteiro positivo maior que zero
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        let animalIndex = animais.nome.indexOf(animal.toLowerCase());
        let tamanho = animais.tamanho[animalIndex];
        let bioma = animais.bioma[animalIndex];
        let dieta = animais.dieta[animalIndex];

        let recintos_compativeis = [];
        // percorre o dicionario pegando os valores  
        for (let i = 0; i < recintos.numero.length; i++) {
            let tamanho_total_recinto = recintos.tamanho_total[i];
            let bioma_recinto = recintos.bioma[i];
            let ocupacao_atual = recintos.animais_existentes[i][0];
            let especie_no_recinto = recintos.animais_existentes[i][1];

            let bioma_compativel;
            if (Array.isArray(bioma_recinto)) {
                bioma_compativel = Array.isArray(bioma) ? bioma.some(b => bioma_recinto.includes(b)) : bioma_recinto.includes(bioma);
            } else {
                bioma_compativel = bioma === bioma_recinto || (Array.isArray(bioma) && bioma.includes(bioma_recinto));
            }

            if (animal.toLowerCase() === 'hipopotamo' && especie_no_recinto !== '') {
                bioma_compativel = RecintosZoo.regra_hipopotamo(bioma_recinto);
            }

            if (animal.toLowerCase() === 'macaco' && bioma_compativel) {
                bioma_compativel = RecintosZoo.regra_macaco(especie_no_recinto, quantidade);
            }

            if ((dieta === 'carnivoro' || ['leao', 'leopardo', 'crocodilo'].includes(especie_no_recinto)) && bioma_compativel) {
                bioma_compativel = RecintosZoo.regra_carnivoros(animal, especie_no_recinto);
            }

            if (bioma_compativel && ocupacao_atual + quantidade * tamanho <= tamanho_total_recinto) {
                let espaco_livre;
                if (animal.toLowerCase() !== especie_no_recinto && especie_no_recinto !== '') {
                    espaco_livre = tamanho_total_recinto - (ocupacao_atual + (quantidade * tamanho)) - 1;
                } else {
                    espaco_livre = tamanho_total_recinto - (ocupacao_atual + (quantidade * tamanho));
                }
                let resposta = `Recinto ${recintos.numero[i]} (espaço livre: ${espaco_livre} total: ${tamanho_total_recinto})`;
                recintos_compativeis.push(resposta);
            }
        }

        if (recintos_compativeis.length > 0) {
            // Retorna um objeto com os recintos viáveis
            return { erro: null, recintosViaveis: recintos_compativeis };
        } else {
            // Se nenhum recinto for viável, retorna a mensagem de erro
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    }
}

export { RecintosZoo as RecintosZoo };

//console.log(new RecintosZoo().analisaRecintos('MACACO', 2));


