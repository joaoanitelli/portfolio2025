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

    const homeContent = fetch('http://127.0.0.1:5500/pages/home.html')
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

    const liMenu = document.querySelectorAll('.li-menu');



    liMenu.forEach(item => {
        item.addEventListener('click', () => {
            liMenu.forEach(item => {
                item.classList.remove('active')
            })
            if (item.id === 'li-home') {
                fetch('http://127.0.0.1:5500/pages/home.html')
                    .then(r => r.text())
                    .then(r => {
                        content.innerHTML = r;

                        // AGORA executa os efeitos após o HTML ser carregado
                        startTypewriterEffect();
                        setTimeout(startCounters, 2500);
                    });
            } else if (item.id === 'li-experience') {
    function initializeCarousel(containerSelector, trackSelector, leftArrowSelector, rightArrowSelector, indicatorSelector, cardSelector, itemWidth = 380, gap = 32) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const track = container.querySelector(trackSelector);
        const leftArrow = container.querySelector(leftArrowSelector);
        const rightArrow = container.querySelector(rightArrowSelector);
        const indicators = container.querySelectorAll(indicatorSelector);
        const cards = track.querySelectorAll(cardSelector);

        if (!track || !leftArrow || !rightArrow || cards.length === 0) return;

        track.style.animation = 'none';
        track.style.transform = 'translateX(0px)';
        track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';

        let currentPosition = 0;
        let currentIndex = 0;
        let isTransitioning = false;
        let alreadyMovedRight = false;

        const moveDistance = itemWidth + gap;
        const totalItems = cards.length / 2; // metade pois há duplicação para loop

        function updateLeftArrowVisibility() {
            if (currentIndex === 0 && !alreadyMovedRight) {
                leftArrow.style.visibility = 'hidden';
            } else {
                leftArrow.style.visibility = 'visible';
            }
        }

        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        function moveCarousel(direction) {
            if (isTransitioning) return;
            isTransitioning = true;

            if (direction === 'right') {
                currentIndex++;
                currentPosition -= moveDistance;
                alreadyMovedRight = true;

                if (currentIndex >= totalItems) {
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentPosition = 0;
                        currentIndex = 0;
                        track.style.transform = 'translateX(0px)';
                        alreadyMovedRight = false;
                        updateLeftArrowVisibility();
                        setTimeout(() => {
                            track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                            isTransitioning = false;
                        }, 50);
                    }, 500);
                } else {
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 500);
                }
            } else if (direction === 'left') {
                if (currentIndex === 0) {
                    track.style.transition = 'none';
                    currentIndex = totalItems - 1;
                    currentPosition = -(currentIndex * moveDistance);
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                        isTransitioning = false;
                    }, 50);
                } else {
                    currentIndex--;
                    currentPosition += moveDistance;
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 500);
                }
            }
            updateIndicators();
            updateLeftArrowVisibility();
        }

        leftArrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
                leftArrow.classList.add('clicked');
                setTimeout(() => {
                    leftArrow.classList.remove('clicked');
                }, 300);
                moveCarousel('left');
            }
        });

        rightArrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
                rightArrow.classList.add('clicked');
                setTimeout(() => {
                    rightArrow.classList.remove('clicked');
                }, 300);
                moveCarousel('right');
            }
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!isTransitioning) {
                    const targetPosition = -(index * moveDistance);
                    currentPosition = targetPosition;
                    currentIndex = index;
                    track.style.transform = `translateX(${currentPosition}px)`;
                    updateIndicators();
                    updateLeftArrowVisibility();
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && !isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    leftArrow.click();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    rightArrow.click();
                }
            }
        });

        updateIndicators();
        updateLeftArrowVisibility();
    }

    fetch('http://127.0.0.1:5500/pages/experience.html')
        .then(r => r.text())
        .then(r => {
            content.innerHTML = r;
            setTimeout(function () {
                // Inicializa carrossel de eventos/conferências
                initializeCarousel(
                    '.events-carousel-container',
                    '.events-carousel-track',
                    '.events-arrow-left',
                    '.events-arrow-right',
                    '.events-indicator',
                    '.event-card',
                    380, 32
                );
                // Inicializa carrossel de certificados/cursos (se existir)
                initializeCarousel(
                    '.certificates-carousel-container',
                    '.certificates-carousel-track',
                    '.certificates-arrow-left',
                    '.certificates-arrow-right',
                    '.certificates-indicator',
                    '.event-card', // ou '.certificate-card' se preferir separar
                    380, 32
                );
            }, 200);
        });
}


            else if (item.id === 'li-projects') {
                fetch('http://127.0.0.1:5500/pages/cards.html').then(r => r.text()).then(r => content.innerHTML = r)
            } else if (item.id === 'li-videos') {

                fetch('http://127.0.0.1:5500/pages/videos.html').then(r => r.text()).then(r => content.innerHTML = r)
            } else {
                content.innerHTML = '';
            }
            item.classList.add('active')
        })
    })


















});
