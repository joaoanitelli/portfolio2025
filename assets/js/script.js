document.addEventListener('DOMContentLoaded', function () {


    if (window.location.pathname !== '/') {
        window.location.replace('/');
        return;
    }


    const content = document.querySelector('.content');

    fetch('./pages/home.html')
        .then(r => r.text())
        .then(r => {
            content.innerHTML = r;

            startTypewriterEffect();
            setTimeout(startCounters, 2500);
        });

    const homeContent = fetch('./pages/home.html')
        .then(r => r.text())
        .then(r => {
            content.innerHTML = r;
            document.querySelector('.main').classList.add('animated')
            startTypewriterEffect();
            setTimeout(startCounters, 2500);
        });


    function startTypewriterEffect() {
        const text = 'Olá, eu sou o <span class="text-purple">João Artero</span> :)';
        const typewriterElement = document.getElementById('typewriter');
        const cursor = document.querySelector('.cursor');

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


    function updateBreadcrumb(page) {
        const breadcrumb = document.querySelector('.breadcrumb');
        let html = `<a href="/" class="breadcrumb-home">Início</a>`;
        if (page && page !== 'home') {
            html += `<span class="breadcrumb-separator">›</span>`;
            html += `<span class="breadcrumb-current">${capitalize(page)}</span>`;
        }
        breadcrumb.innerHTML = html;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }



    const liMenu = document.querySelectorAll('.li-menu');



    liMenu.forEach(item => {
        item.addEventListener('click', () => {
            liMenu.forEach(item => {
                item.classList.remove('active')
            })

            // let path = '/';
            // if (item.id === 'li-home') path = '/';
            // else if (item.id === 'li-experience') path = '/sobre-mim';
            // else if (item.id === 'li-projects') path = '/projetos';
            // else if (item.id === 'li-videos') path = '/videos';
            // history.pushState({ page: path }, '', path);

            if (item.id === 'li-home') {
                updateBreadcrumb('home')
                fetch('./pages/home.html')
                    .then(r => r.text())
                    .then(r => {
                        content.innerHTML = r;
                        document.querySelector('.main').classList.add('animated')

                        startTypewriterEffect();
                        setTimeout(startCounters, 2500);
                    });
            } else if (item.id === 'li-experience') {
                updateBreadcrumb('Sobre Mim');
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
                    const totalItems = cards.length / 2;

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

                fetch('./pages/experience.html')
                    .then(r => r.text())
                    .then(r => {
                        content.innerHTML = r;
                        document.querySelector('.main').classList.add('animated')
                        setTimeout(function () {

                            initializeCarousel(
                                '.events-carousel-container',
                                '.events-carousel-track',
                                '.events-arrow-left',
                                '.events-arrow-right',
                                '.events-indicator',
                                '.event-card',
                                380, 32
                            );
                            initializeCarousel(
                                '.certificates-carousel-container',
                                '.certificates-carousel-track',
                                '.certificates-arrow-left',
                                '.certificates-arrow-right',
                                '.certificates-indicator',
                                '.event-card',
                                380, 32
                            );
                        }, 200);
                    });
            }


            else if (item.id === 'li-projects') {
                updateBreadcrumb('Projetos');
                function initializeFilter() {
                    var resultsCount = document.getElementById('resultsCount');
                    var cards = document.querySelectorAll('.project-card');
                    var filtros = document.querySelectorAll('.tech-filter');
                    filtros[0].classList.add('active');
                    var cardsVisiveis = Array.from(cards).filter(card => card.style.display !== 'none');
                    resultsCount.innerText = cardsVisiveis.length;


                    cards.forEach((card, idx) => {
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, 100 + idx * 100);
                    });

                    filtros.forEach(item => {
                        item.addEventListener('click', () => {
                            filtros.forEach(filtro => filtro.classList.remove('active'));
                            item.classList.add('active');
                            var filtro = item.innerText.toLowerCase();


                            cards.forEach(card => {
                                card.style.display = 'none';
                                card.classList.remove('animated');
                            });


                            let delay = 0;
                            cards.forEach(card => {
                                var arrayTag = Array.from(card.querySelectorAll('.tech-tag')).some(tag => tag.innerText.toLowerCase() == filtro);
                                if (filtro == 'todos' || arrayTag) {
                                    card.style.display = 'block';
                                    setTimeout(() => {
                                        card.classList.add('animated');
                                    }, 100 + delay * 100);
                                    delay++;
                                }
                            });

                            cardsVisiveis = Array.from(cards).filter(card => card.style.display !== 'none');
                            resultsCount.innerText = cardsVisiveis.length;
                        });
                    });
                }


                fetch('./pages/cards.html').then(r => r.text()).then(r => {
                    content.innerHTML = r
                    document.querySelector('.main').classList.add('animated')
                    initializeFilter()
                })
            } else if (item.id === 'li-videos') {
                updateBreadcrumb('Vídeos');

                function initializeVideos() {

                    const YOUTUBE_CONFIG = {
                        API_KEY: 'AIzaSyCIT2o8vksHYQRSVD0TtcPzp_L44Uwcghw',
                        CHANNEL_ID: 'UCA1qNdMTQzXDxZOU-y36l9g',
                        MAX_RESULTS: 50
                    };

                    let allVideos = [];
                    let filteredVideos = [];
                    let currentFilter = 'all';
                    let currentView = 'grid';
                    let nextPageToken = null;

                    initializeYouTubeData();
                    setupEventListeners();

                    function setupEventListeners() {
                        document.querySelectorAll('.filter-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                                e.target.classList.add('active');
                                currentFilter = e.target.dataset.category;
                                filterVideos();
                            });
                        });

                        document.getElementById('shareBtn').addEventListener('click', shareMainVideo);
                    }

                    async function initializeYouTubeData() {
                        try {
                            await Promise.all([
                                loadChannelData(),
                                loadChannelVideos()
                            ]);
                        } catch (error) {
                            console.error('Erro ao carregar dados do YouTube:', error);
                            showFallbackContent();
                        }
                    }

                    async function loadChannelData() {
                        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${YOUTUBE_CONFIG.CHANNEL_ID}&key=${YOUTUBE_CONFIG.API_KEY}`;

                        try {
                            const response = await fetch(url);
                            const data = await response.json();

                            if (data.items && data.items.length > 0) {
                                const channel = data.items[0];
                                updateChannelInfo(channel);
                            }
                        } catch (error) {
                            console.error('Erro ao carregar dados do canal:', error);
                        }
                    }

                    async function loadChannelVideos() {
                        const url = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${YOUTUBE_CONFIG.CHANNEL_ID}&key=${YOUTUBE_CONFIG.API_KEY}&maxResults=${YOUTUBE_CONFIG.MAX_RESULTS}&type=video&order=date`;

                        try {
                            const response = await fetch(url);
                            const data = await response.json();

                            if (data.items) {
                                const videoIds = data.items.map(item => item.id.videoId).join(',');
                                const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_CONFIG.API_KEY}`;

                                const statsResponse = await fetch(statsUrl);
                                const statsData = await statsResponse.json();

                                allVideos = data.items.map(video => {
                                    const stats = statsData.items.find(stat => stat.id === video.id.videoId);
                                    return {
                                        ...video,
                                        statistics: stats ? stats.statistics : {},
                                        duration: stats ? stats.contentDetails.duration : 'PT0S'
                                    };
                                });

                                nextPageToken = data.nextPageToken;

                                if (allVideos.length > 0) {
                                    displayFeaturedVideo(allVideos[0]);
                                }

                                filteredVideos = [...allVideos];
                                displayVideos();

                                document.getElementById('loadingIndicator').style.display = 'none';

                                if (nextPageToken) {
                                    document.getElementById('loadMoreSection').style.display = 'block';
                                }
                            }
                        } catch (error) {
                            console.error('Erro ao carregar vídeos:', error);
                            showFallbackContent();
                        }
                    }

                    function updateChannelInfo(channel) {
                        const stats = channel.statistics;
                        const snippet = channel.snippet;


                        document.getElementById('videoCount').textContent = formatNumber(stats.videoCount);

                        document.getElementById('channelTitle').textContent = snippet.title;
                        document.getElementById('channelSubscribers').innerText = `${formatNumber(stats.subscriberCount)} inscritos`;


                        if (snippet.thumbnails && snippet.thumbnails.high) {
                            document.getElementById('channelAvatar').src = snippet.thumbnails.high.url;
                        }
                    }

                    function displayFeaturedVideo(video) {
                        const videoId = video.id.videoId;
                        const snippet = video.snippet;
                        const stats = video.statistics;

                        document.getElementById('mainVideoPlayer').src = `https://www.youtube.com/embed/${videoId}`;

                        document.getElementById('mainVideoTitle').textContent = snippet.title;
                        document.getElementById('mainVideoViews').textContent = `${formatNumber(stats.viewCount || 0)} visualizações`;
                        document.getElementById('mainVideoDate').textContent = formatDate(snippet.publishedAt);
                        document.getElementById('mainVideoDescription').textContent = snippet.description.substring(0, 200) + '...';
                        document.getElementById('likeCount').textContent = formatNumber(stats.likeCount || 0);

                        const tagsContainer = document.getElementById('mainVideoTags');
                        tagsContainer.innerHTML = '';
                        if (snippet.tags) {
                            snippet.tags.slice(0, 5).forEach(tag => {
                                const tagElement = document.createElement('span');
                                tagElement.className = 'tag';
                                tagElement.textContent = tag;
                                tagsContainer.appendChild(tagElement);
                            });
                        }
                    }

                    function displayVideos() {
                        const videosGrid = document.getElementById('videosGrid');
                        videosGrid.innerHTML = '';

                        filteredVideos.forEach(video => {
                            const videoCard = createVideoCard(video);
                            videosGrid.appendChild(videoCard);
                        });
                        var cards = document.querySelectorAll('.video-card');
                        document.getElementById('videoCount').textContent = Array.from(cards).length
                    }

                    function createVideoCard(video) {
                        const videoId = video.id.videoId;
                        const snippet = video.snippet;
                        const stats = video.statistics;
                        const duration = formatDuration(video.duration);

                        const card = document.createElement('div');
                        card.className = 'video-card fade-in';
                        card.dataset.videoId = videoId;

                        const category = determineCategory(snippet.title, snippet.description);
                        card.dataset.category = category;

                        card.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${snippet.thumbnails.high.url}" alt="${snippet.title}" />
                    <div class="video-duration">${duration}</div>
                    <div class="play-overlay">
                        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                    </div>
                </div>
                <div class="video-content">
                    <h3 class="video-title">${snippet.title}</h3>
                    <div class="video-meta">
                        <span class="views">${formatNumber(stats.viewCount || 0)} visualizações</span>
                        <span class="date">${formatDate(snippet.publishedAt)}</span>
                    </div>
                    <p class="video-description">${snippet.description.substring(0, 100)}...</p>
                </div>
            `;

                        card.addEventListener('click', () => {
                            displayFeaturedVideo(video);
                            document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
                        });

                        return card;
                    }

                    function filterVideos() {
                        if (currentFilter === 'all') {
                            filteredVideos = [...allVideos];
                        } else {
                            filteredVideos = allVideos.filter(video => {
                                const category = determineCategory(video.snippet.title, video.snippet.description);
                                return category === currentFilter;
                            });
                        }
                        displayVideos();
                    }

                    function determineCategory(title, description) {
                        const text = (title + ' ' + description).toLowerCase();

                        if (text.includes('react')) return 'react';
                        if (text.includes('javascript') || text.includes('js')) return 'javascript';
                        if (text.includes('display') || text.includes('style')) return 'css';
                        if (text.includes('tutorial') || text.includes('como')) return 'tutorial';
                        if (text.includes('design') || text.includes('tip')) return 'design';
                        if (text.includes('projeto') || text.includes('project')) return 'projects';

                        return 'tutorial';
                    }

                    function shareMainVideo() {
                        const videoTitle = document.getElementById('mainVideoTitle').textContent;
                        const videoUrl = document.getElementById('mainVideoPlayer').src.replace('/embed/', '/watch?v=');

                        if (navigator.share) {
                            navigator.share({
                                title: videoTitle,
                                url: videoUrl
                            });
                        } else {
                            navigator.clipboard.writeText(videoUrl).then(() => {
                                alert('Link copiado para a área de transferência!');
                            });
                        }
                    }

                    function showFallbackContent() {
                        document.getElementById('loadingIndicator').innerHTML = `
                <p>Não foi possível carregar os vídeos automaticamente.</p>
                <p>Visite o canal: <a href="https://www.youtube.com/@joaoarterodev" target="_blank">@joaoarterodev</a></p>
            `;
                    }

                    function formatNumber(num) {
                        if (!num) return '0';
                        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                        return num.toString();
                    }

                    function formatDate(dateString) {
                        const date = new Date(dateString);
                        const now = new Date();
                        const diffTime = Math.abs(now - date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 1) return 'há 1 dia';
                        if (diffDays < 7) return `há ${diffDays} dias`;
                        if (diffDays < 30) return `há ${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
                        if (diffDays < 365) return `há ${Math.ceil(diffDays / 30)} mês${Math.ceil(diffDays / 30) > 1 ? 'es' : ''}`;
                        return `há ${Math.ceil(diffDays / 365)} ano${Math.ceil(diffDays / 365) > 1 ? 's' : ''}`;
                    }

                    function formatDuration(duration) {
                        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                        const hours = (match[1] || '').replace('H', '');
                        const minutes = (match[2] || '').replace('M', '');
                        const seconds = (match[3] || '').replace('S', '');

                        if (hours) {
                            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
                        }
                        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
                    }
                }

                fetch('./pages/videos.html').then(r => r.text()).then(r => {
                    content.innerHTML = r;
                    document.querySelector('.main').classList.add('animated')
                    initializeVideos()
                })
            } else {
                content.innerHTML = '';
            }
            item.classList.add('active')
        })
    })


















});
