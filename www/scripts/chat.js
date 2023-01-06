
window.onload = function () {
    var chatbox = document.querySelector('.chatbox'),
        chatboxTitle = document.querySelector('.chatbox__title'),
        chatboxTitleClose = document.querySelector('.chatbox__title__close');

    chatboxTitle.addEventListener('click', function () {
        chatbox.classList.toggle('chatbox--tray');
    });

    chatboxTitleClose.addEventListener('click', function (e) {
        e.stopPropagation();
        chatbox.classList.add('chatbox--closed');
    });

    chatbox.addEventListener('transitionend', function () {
        if (chatbox.classList.contains('chatbox--closed')) chatbox.remove();
    });
};