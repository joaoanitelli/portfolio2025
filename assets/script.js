document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector('.content');

    // Carrega o HTML primeiro
    fetch('http://127.0.0.1:5500/pages/home.html')
        .then(r => r.text())
        .then(r => {
            content.innerHTML = r;
            
            // AGORA executa os efeitos após o HTML ser carregado
            startTypewriterEffect();
            setTimeout(startCounters, 2500);
        });

    // Função do efeito de digitação
    function startTypewriterEffect() {
        const text = 'Olá, eu sou o <span class="text-purple">João Artero</span> :)';
        const typewriterElement = document.getElementById('typewriter');
        const cursor = document.querySelector('.cursor');

        // Verifica se os elementos existem
        if (!typewriterElement || !cursor) {
            console.error('Elementos do typewriter não encontrados!');
            return;
        }

        let index = 0;
        let currentText = '';

        function typeWriter() {
            if (index < text.length) {
                if (text[index] === '<') {
                    let tagEnd = text.indexOf('>', index);
                    if (tagEnd !== -1) {
                        currentText += text.substring(index, tagEnd + 1);
                        index = tagEnd + 1;
                    }
                } else {
                    currentText += text[index];
                    index++;
                }

                typewriterElement.innerHTML = currentText;
                setTimeout(typeWriter, 40);
            } else {
                setTimeout(() => {
                    cursor.style.opacity = '0';
                }, 2000);
            }
        }

        setTimeout(typeWriter, 400);
    }

    // Função do contador
    function startCounters() {
        const counters = document.querySelectorAll('[data-count]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1500;
            const increment = target / (duration / 16);

            let current = 0;
            counter.classList.add('counting');

            function updateCounter() {
                current += increment;

                if (current < target) {
                    const displayValue = Math.floor(current).toLocaleString('pt-BR');
                    counter.textContent = displayValue + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    const finalValue = target.toLocaleString('pt-BR');
                    counter.textContent = finalValue + suffix;
                    counter.classList.remove('counting');
                }
            }

            updateCounter();
        });
    }

    /* Menu */

    const liAbout = document.getElementById('li-about');

    liAbout.addEventListener('click',()=> {
        content.innerHTML = '';
        liAbout.classList.add('active')
    })
});
