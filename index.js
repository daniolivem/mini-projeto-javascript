// Abre o modal de criação de tarefas
function abrirModal() {
    overlay.classList.add('active') // Adiciona a classe 'active' ao overlay para exibi-lo
    criarTarefa.classList.add('active') // Adiciona a classe 'active' ao modal de criação de tarefa
}

// Fecha o modal de criação de tarefas
function fecharModal() {
    overlay.classList.remove('active') // Remove a classe 'active' do overlay para ocultá-lo
    criarTarefa.classList.remove('active') // Remove a classe 'active' do modal de criação de tarefa
}

// Busca as tarefas no servidor e as insere na lista
function buscarTarefas() {
    fetch('http://localhost:3000/tarefas') // Faz uma requisição GET ao servidor
        .then(res => res.json()) // Converte a resposta para JSON
        .then(res =>{
            inserirTarefas(res); // Chama a função para exibir as tarefas na interface
        })
} 
buscarTarefas(); // Executa a busca de tarefas ao carregar a página

// Insere as tarefas na lista da interface
function inserirTarefas(listaDeTarefas) {
   if(listaDeTarefas.length > 0){
        lista.innerHTML = "" // Limpa a lista antes de inserir as tarefas
        listaDeTarefas.map(tarefa => {
            lista.innerHTML += `
                <li>
                    <h5>${tarefa.titulo}</h5> <!-- Exibe o título da tarefa -->
                    <p>${tarefa.descricao}</p> <!-- Exibe a descrição da tarefa -->
                    <div class="actions">
                        <box-icon name='trash' size="sm" onclick="deletarTarefa('${tarefa.id}')"></box-icon> 
                        <!-- Ícone de lixeira para excluir a tarefa -->
                    </div>
                </li>
            `;
        })
   } 
}

// Cria uma nova tarefa no servidor
function novaTarefa(){
    event.preventDefault(); // Impede o comportamento padrão do formulário

    let tarefa = {
        titulo: titulo.value, // Obtém o título da tarefa do campo de entrada
        descricao: descricao.value // Obtém a descrição da tarefa do campo de entrada
    }

    fetch('http://localhost:3000/tarefas', {
        method: "POST", // Define o método como POST para criar uma nova tarefa
        headers: {
            "Content-Type": "application/json" // Especifica o formato da requisição
        },
        body: JSON.stringify(tarefa) // Converte o objeto de tarefa em JSON e o envia
    })
    .then(res => res.json())
    .then(res => {
        fecharModal(); // Fecha o modal após criar a tarefa
        buscarTarefas(); // Atualiza a lista de tarefas na interface
        let form = document.querySelector('#criarTarefa form');
        form.reset(); // Limpa os campos do formulário
    })
} 

// Deleta uma tarefa do servidor com base no ID
function deletarTarefa(id) {
    fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "DELETE", // Define o método como DELETE para remover a tarefa
    })
    .then(res => res.json())
    .then(res => {
        alert("Tarefa deletada com sucesso!"); // Exibe um alerta ao usuário
        buscarTarefas(); // Atualiza a lista de tarefas após a exclusão
    })
}

// Filtra as tarefas da lista com base na busca do usuário
function pesquisarTarefa() {
    let lis =  document.querySelectorAll('ul li'); // Obtém todos os itens da lista
    if(busca.value.length > 0) { // Verifica se há texto no campo de busca
        lis.forEach(li => {
            if(!li.children[1].innerText.includes(busca.value)){ // Verifica se a descrição contém o termo buscado
                li.classList.add('hidden'); // Oculta os itens que não correspondem à busca
            } else {
                li.classList.remove('hidden'); // Exibe os itens que correspondem à busca
            }
        })
    } else { 
        lis.forEach(li => {
            li.classList.remove('hidden'); // Se o campo de busca estiver vazio, exibe todos os itens da lista
        })    
    }
}
