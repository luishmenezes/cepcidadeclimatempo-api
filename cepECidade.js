function setEndereco(enderecoText) {
    const enderecoContainer = document.getElementById('endereco');
    enderecoContainer.textContent = enderecoText;
}

function setClima(climaText) {
    const climaContainer = document.getElementById('clima');
    climaContainer.textContent = climaText;
}

function fetchEndereco() {
    const cep = document.getElementById('cepInput').value;
    const cepLimpo = cep.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cepLimpo.length !== 8) {
        setEndereco('Por favor, digite um CEP válido com 8 dígitos.');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                setEndereco('CEP não encontrado.');
            } else {
                setEndereco(`Rua ${data.logradouro} - ${data.localidade}, ${data.uf}`);
                fetchClima(data.localidade);
            }
        })
        .catch(error => {
            console.error('Falha ao buscar o endereço:', error);
            setEndereco('Erro ao carregar endereço.');
        });
}

function fetchClima(cidade) {
    const apiKey = '8c12f65456e6d11aa1f8c2d29c8a84f3';

    // Quando a requisição fetch é concluída, ela retorna uma resposta (response). 
    // O método .then() é usado para lidar com essa resposta. 
    // A função response.json() é chamada para converter o corpo da resposta de formato JSON para um objeto JavaScript. 
    // Isso também retorna uma promessa que é resolvida com o objeto JavaScript resultante.
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                setClima('Cidade não encontrada.');
            } else {
                setClima(`Clima em ${data.name}, ${data.sys.country}: 
                ${data.weather[0].description}. Temperatura: ${data.main.temp}°C. Umidade: 
                ${data.main.humidity}%.`);
            }
        })
        .catch(error => {
            console.error('Falha ao buscar informações do clima:', error);
            setClima('Erro ao carregar informações do clima.');
        });
}

// Adicionando um event listener para buscar endereço e clima quando o botão for clicado
document.getElementById('buscarEnderecoBtn').addEventListener('click', fetchEndereco);

// Opcional: Pode-se adicionar um event listener para permitir a busca pressionando Enter no campo de CEP
document.getElementById('cepInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        fetchEndereco();
    }
});
