document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    let userName = '';
    let numbers = [];
    let waitingForOperation = false;
    
    userInput.addEventListener('input', function() {
        sendBtn.disabled = userInput.value.trim() === '';
        sendBtn.classList.toggle('active', userInput.value.trim() !== '');
    });
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessage(message, 'user');
        userInput.value = '';
        sendBtn.disabled = true;
        sendBtn.classList.remove('active');
        
        setTimeout(() => {
            processUserMessage(message);
        }, 500);
    }
    
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        const avatar = document.createElement('div');
        avatar.className = `avatar ${sender}-avatar`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        
        messageContent.appendChild(messageDiv);
        messageContainer.appendChild(avatar);
        messageContainer.appendChild(messageContent);
        
        chatMessages.insertBefore(messageContainer, chatMessages.firstChild);
    }
    
    function processUserMessage(message) {
        if (waitingForOperation) {
            handleOperation(message);
            return;
        }
        
        if (message === '/start') {
            addMessage('Привет, меня зовут IThub bot, а как зовут тебя?', 'bot');
        } 
        else if (message.startsWith('/name:')) {
            userName = message.split(':')[1].trim();
            if (userName) {
                addMessage(`Привет ${userName}, приятно познакомиться. Я умею считать, введи числа которые надо посчитать (например: /number: 7, 9)`, 'bot');
            } else {
                addMessage('Пожалуйста, укажи имя после /name: (например: /name: Саша)', 'bot');
            }
        }
        else if (message.startsWith('/number:')) {
            const numbersStr = message.split(':')[1].trim();
            numbers = numbersStr.split(',').map(num => parseFloat(num.trim()));
            if (numbers.length === 2 && !numbers.some(isNaN)) {
                addMessage('Отлично! Теперь введи одно из действий: +, -, *, /', 'bot');
                waitingForOperation = true;
            } else {
                addMessage('Пожалуйста, введите два числа через запятую (например: /number: 5, 3)', 'bot');
            }
        }
        else if (message === '/stop') {
            addMessage('Всего доброго, если хочешь поговорить, пиши /start', 'bot');
            userName = '';
            numbers = [];
            waitingForOperation = false;
        }
        else {
            addMessage('Я не понимаю, введите другую команду! Доступные команды: /start, /name: [имя], /number: [числа], /stop', 'bot');
        }
    }
    
    function handleOperation(operation) {
        if (!['+', '-', '*', '/'].includes(operation)) {
            addMessage('Пожалуйста, введите одно из действий: +, -, *, /', 'bot');
            return;
        }
        
        let result;
        switch (operation) {
            case '+': result = numbers[0] + numbers[1]; break;
            case '-': result = numbers[0] - numbers[1]; break;
            case '*': result = numbers[0] * numbers[1]; break;
            case '/': result = numbers[0] / numbers[1]; break;
        }
        
        addMessage(`Результат: ${numbers[0]} ${operation} ${numbers[1]} = ${result}`, 'bot');
        addMessage('Хочешь посчитать ещё? Введи новые числа (например: /number: 10, 5)', 'bot');
        waitingForOperation = false;
    }
    
    // Приветственное сообщение
    setTimeout(() => {
        addMessage('Введите команду /start, для начала общения', 'bot');
    }, 500);
});
