const apiKeyInput = document.getElementById('apiKey') ;
const gameSelect = document.getElementById('gameSelect') ;
const questionInput = document.getElementById('questionInput') ;
const askButton = document.getElementById('askButton') ;
const form = document.getElementById('form') ;
const aiResponse = document.getElementById('aiResponse') ;

const markedownToHtml = (text) => { const converter = new showdown.Converter()
    return converter.makeHtml(text) 
}

// AIzaSyBc-dCL7cdH4ly2wbclVUHqDz3WbEAL-sQ

const perguntaIA = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey} ` ;   
    const pergunta = `## Especialidade
    você é um especialista em ${game} e deve responder as perguntas sobre o jogo.

    ## Tarefas
    voce deve responder as perguntas sobre o jogo ${game} de forma clara e objetiva, sem enrolação.
    
    ## Regras
    se voce nao souber a resposta, diga que não sabe.
    considere a data atual ${new Date().toLocaleDateString('pt-BR')}.
    nunca responda com "não sei" ou "não tenho certeza", sempre busque a resposta correta.

    ## Resposta
    economize a resposta, evite respostas longas e complexas.
    responda em markdown.
    nao faça perguntas de volta, apenas responda a pergunta do usuário.
    nao de saudaçoes ou agradecimentos, apenas responda a pergunta do usuário.

    ## Exemplo de resposta
    pergunta do usuario: ${question}
` ; 
    const contents = [{
        role: 'user',
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    //chamada da API
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
    },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json() 
    return data.candidates[0].content.parts[0].text 
}

const enviarFormulario = async (event) => {
    event.preventDefault() ; //impedir o envio do formulário//
    const apiKey = apiKeyInput.value ;
    const game = gameSelect.value ;
    const question = questionInput.value ; 

    if(apiKey == "" || game == "" || question == "") {
        alert("Por favor, preencha todos os campos.") ;
        return ;
    }

    askButton.disabled = true ;
    askButton.textContent = "perguntando..." ;
    askButton.classList.add('loading') ;

    try { 
        // Perguntar para a IA
      const text = await perguntaIA(question, game, apiKey)
      aiResponse.querySelector('.response-content').innerHTML = markedownToHtml(text) ;
      aiResponse.classList.remove('hidden') ;
    } catch (error) {
        console.log ("Erro ao enviar a pergunta:", error) ;
    } finally {
        askButton.disabled = false ;
        askButton.textContent = "Perguntar" ;
        askButton.classList.remove('loading') ;
    }
}
form.addEventListener('submit', enviarFormulario )