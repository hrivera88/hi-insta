document.getElementById('close').addEventListener('click', () => {
    let modal = document.getElementById('exitChatSession');
    if (modal.classList.contains('show')) {
        return;
    } else {
        modal.classList.add('show');
    }
});
document.getElementById('exitChatModal').addEventListener('click', () => {
    let modal = document.getElementById('exitChatSession');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
    } else {
        return;
    }
});
document.getElementById('cancelExitChatButton').addEventListener('click', () => {
    let modal = document.getElementById('exitChatSession');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
    } else {
        return;
    }
});