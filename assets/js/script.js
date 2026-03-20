document.addEventListener('DOMContentLoaded', function () {

    const content = document.querySelector('.content');
    const spinner = document.getElementById('pageSpinner');
    let isLoading = false;

    function showSpinner() { spinner.classList.add('active'); }
    function hideSpinner() { spinner.classList.remove('active'); }

    function loadPage(html) {
        content.innerHTML = html;
        const mainEl = document.querySelector('.main');
        mainEl.classList.remove('animated');
        void mainEl.offsetWidth;
        mainEl.classList.add('animated');
    }

    function startTypewriterEffect() {
        const text = 'Olá, eu sou o <span class="text-purple notranslate"> João Artero </span> :)';
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
                setTimeout(() => { cursor.style.opacity = '0'; }, 2000);
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
                    counter.textContent = Math.floor(current).toLocaleString('pt-BR') + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString('pt-BR') + suffix;
                    counter.classList.remove('counting');
                }
            }

            updateCounter();
        });
    }

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
        track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';

        const actualWidth = cards[0].offsetWidth || itemWidth;
        const centerOffset = container.offsetWidth < (actualWidth + gap)
            ? Math.max(0, (container.offsetWidth - actualWidth) / 2)
            : 0;
        let currentPosition = centerOffset;
        let currentIndex = 0;
        let isTransitioning = false;
        let alreadyMovedRight = false;

        const moveDistance = actualWidth + gap;
        const totalItems = cards.length / 2;

        track.style.transform = `translateX(${centerOffset}px)`;

        function updateLeftArrowVisibility() {
            leftArrow.style.visibility = (currentIndex === 0 && !alreadyMovedRight) ? 'hidden' : 'visible';
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
                        currentPosition = centerOffset;
                        currentIndex = 0;
                        track.style.transform = `translateX(${centerOffset}px)`;
                        alreadyMovedRight = false;
                        updateLeftArrowVisibility();
                        setTimeout(() => {
                            track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                            isTransitioning = false;
                        }, 50);
                    }, 500);
                } else {
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => { isTransitioning = false; }, 500);
                }
            } else if (direction === 'left') {
                if (currentIndex === 0) {
                    track.style.transition = 'none';
                    currentIndex = totalItems - 1;
                    currentPosition = centerOffset - (currentIndex * moveDistance);
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                        isTransitioning = false;
                    }, 50);
                } else {
                    currentIndex--;
                    currentPosition += moveDistance;
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => { isTransitioning = false; }, 500);
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
                setTimeout(() => leftArrow.classList.remove('clicked'), 300);
                moveCarousel('left');
            }
        });

        rightArrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
                rightArrow.classList.add('clicked');
                setTimeout(() => rightArrow.classList.remove('clicked'), 300);
                moveCarousel('right');
            }
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!isTransitioning) {
                    currentPosition = centerOffset - (index * moveDistance);
                    currentIndex = index;
                    track.style.transform = `translateX(${currentPosition}px)`;
                    updateIndicators();
                    updateLeftArrowVisibility();
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && !isTransitioning) {
                if (e.key === 'ArrowLeft') { e.preventDefault(); leftArrow.click(); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); rightArrow.click(); }
            }
        });

        updateIndicators();
        updateLeftArrowVisibility();
    }

    const liMenu = document.querySelectorAll('.li-menu');

    const menuIds = { home: 'li-home', sobre: 'li-experience', projetos: 'li-projects', videos: 'li-videos' };

    function getQueryPage() {
        const p = new URLSearchParams(window.location.search).get('page');
        const valid = { home: 1, sobre: 1, projetos: 1, videos: 1 };
        return (p && valid[p]) ? p : 'home';
    }

    function setActiveMenu(pageKey) {
        liMenu.forEach(i => i.classList.remove('active'));
        const el = document.getElementById(menuIds[pageKey]);
        if (el) el.classList.add('active');
    }

    function navigateTo(pageKey, addToHistory) {
        if (isLoading) return;
        isLoading = true;
        showSpinner();
        setActiveMenu(pageKey);
        const url = pageKey === 'home' ? '/' : '/?page=' + pageKey;
        if (addToHistory) {
            history.pushState({ page: pageKey }, '', url);
        } else {
            history.replaceState({ page: pageKey }, '', url);
        }
        ({ home: loadHome, sobre: loadExperience, projetos: loadProjects, videos: loadVideos }[pageKey] || loadHome)();
    }

    function loadHome() {
        updateBreadcrumb('home');
        fetch('./pages/home.html')
            .then(r => r.text())
            .then(r => {
                loadPage(r);
                startTypewriterEffect();
                setTimeout(startCounters, 2500);
                retranslatePage(() => { hideSpinner(); isLoading = false; });
            })
            .catch(() => { hideSpinner(); isLoading = false; });
    }

    function loadExperience() {
        updateBreadcrumb('Sobre Mim');
        fetch('./pages/experience.html')
            .then(r => r.text())
            .then(r => {
                loadPage(r);
                setTimeout(function () {
                    initializeCarousel('.events-carousel-container', '.events-carousel-track', '.events-arrow-left', '.events-arrow-right', '.events-indicator', '.event-card', 380, 32);
                    initializeCarousel('.certificates-carousel-container', '.certificates-carousel-track', '.certificates-arrow-left', '.certificates-arrow-right', '.certificates-indicator', '.event-card', 380, 32);
                }, 200);
                retranslatePage(() => { hideSpinner(); isLoading = false; });
            })
            .catch(() => { hideSpinner(); isLoading = false; });
    }

    function loadProjects() {
        updateBreadcrumb('Projetos');

        function initializeFilter() {
                    var resultsCount = document.getElementById('resultsCount');
                    var cards = document.querySelectorAll('.project-card');
                    var filtros = document.querySelectorAll('.tech-filter');
                    filtros[0].classList.add('active');
                    resultsCount.innerText = Array.from(cards).filter(card => card.style.display !== 'none').length;

                    cards.forEach((card, idx) => {
                        setTimeout(() => card.classList.add('animated'), 100 + idx * 100);
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
                                var match = Array.from(card.querySelectorAll('.tech-tag')).some(tag => tag.innerText.toLowerCase() == filtro);
                                if (filtro == 'todos' || match) {
                                    card.style.display = 'block';
                                    setTimeout(() => card.classList.add('animated'), 100 + delay * 100);
                                    delay++;
                                }
                            });

                            resultsCount.innerText = Array.from(cards).filter(card => card.style.display !== 'none').length;
                        });
                    });
                }

        fetch('./pages/cards.html')
            .then(r => r.text())
            .then(r => {
                loadPage(r);
                retranslatePage();
                initializeFilter();

                const mainImg = content.querySelector('.feat-img-main img');
                content.querySelectorAll('.feat-img-thumb').forEach(function (thumb) {
                    thumb.addEventListener('click', function () {
                        const thumbImg = thumb.querySelector('img');
                        const prevSrc = mainImg.src;
                        const prevAlt = mainImg.alt;
                        mainImg.src = thumbImg.src;
                        mainImg.alt = thumbImg.alt;
                        thumbImg.src = prevSrc;
                        thumbImg.alt = prevAlt;
                    });
                });
                retranslatePage(() => { hideSpinner(); isLoading = false; });
            })
            .catch(() => { hideSpinner(); isLoading = false; });

    }

    function loadVideos() {
        updateBreadcrumb('Vídeos');

        function initializeVideos() {
                    const YOUTUBE_CONFIG = {
                        API_KEY: 'AIzaSyCIT2o8vksHYQRSVD0TtcPzp_L44Uwcghw',
                        CHANNEL_ID: 'UCA1qNdMTQzXDxZOU-y36l9g',
                        MAX_RESULTS: 50
                    };

                    // ✅ ID da playlist de uploads (troca UC por UU)
                    const PLAYLIST_ID = YOUTUBE_CONFIG.CHANNEL_ID.replace(/^UC/, 'UU');

                    // ✅ Configuração do cache
                    const CACHE_KEY = 'yt_videos_cache';
                    const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 horas

                    let allVideos = [];
                    let filteredVideos = [];
                    let currentFilter = 'all';
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
                            await Promise.all([loadChannelData(), loadChannelVideos()]);
                        } catch (error) {
                            console.error('Erro ao carregar dados do YouTube:', error);
                            showFallbackContent();
                        }
                    }

                    async function loadChannelData() {
                        // ✅ Cache para dados do canal (24 horas)
                        const CHANNEL_CACHE_KEY = 'yt_channel_cache';
                        const CHANNEL_CACHE_TTL = 1000 * 60 * 60 * 24;
                        const cachedChannel = localStorage.getItem(CHANNEL_CACHE_KEY);

                        if (cachedChannel) {
                            const { data, timestamp } = JSON.parse(cachedChannel);
                            if (Date.now() - timestamp < CHANNEL_CACHE_TTL) {
                                updateChannelInfo(data);
                                return;
                            }
                        }

                        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${YOUTUBE_CONFIG.CHANNEL_ID}&key=${YOUTUBE_CONFIG.API_KEY}`;
                        try {
                            const response = await fetch(url);
                            const data = await response.json();
                            if (data.items && data.items.length > 0) {
                                updateChannelInfo(data.items[0]);
                                localStorage.setItem(CHANNEL_CACHE_KEY, JSON.stringify({
                                    data: data.items[0],
                                    timestamp: Date.now()
                                }));
                            }
                        } catch (error) {
                            console.error('Erro ao carregar dados do canal:', error);
                        }
                    }

                    async function loadChannelVideos() {
                        // ✅ Verifica cache antes de bater na API
                        const cached = localStorage.getItem(CACHE_KEY);
                        if (cached) {
                            const { data, timestamp } = JSON.parse(cached);
                            if (Date.now() - timestamp < CACHE_TTL) {
                                allVideos = data;
                                if (allVideos.length > 0) displayFeaturedVideo(allVideos[0]);
                                filteredVideos = [...allVideos];
                                displayVideos();
                                document.getElementById('loadingIndicator').style.display = 'none';
                                return;
                            }
                        }

                        // ✅ playlistItems.list custa 1 unidade (antes: search.list custava 100)
                        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=id,snippet&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_CONFIG.API_KEY}&maxResults=${YOUTUBE_CONFIG.MAX_RESULTS}`;
                        try {
                            const response = await fetch(url);
                            const data = await response.json();

                            if (data.items) {
                                const videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
                                const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_CONFIG.API_KEY}`;
                                const statsResponse = await fetch(statsUrl);
                                const statsData = await statsResponse.json();

                                // ✅ Adapta estrutura do playlistItems para o mesmo formato do search
                                allVideos = data.items.map(item => {
                                    const videoId = item.snippet.resourceId.videoId;
                                    const stats = statsData.items.find(stat => stat.id === videoId);
                                    return {
                                        id: { videoId },
                                        snippet: item.snippet,
                                        statistics: stats ? stats.statistics : {},
                                        duration: stats ? stats.contentDetails.duration : 'PT0S'
                                    };
                                });

                                nextPageToken = data.nextPageToken;

                                if (allVideos.length > 0) displayFeaturedVideo(allVideos[0]);

                                filteredVideos = [...allVideos];
                                displayVideos();

                                document.getElementById('loadingIndicator').style.display = 'none';
                                if (nextPageToken) document.getElementById('loadMoreSection').style.display = 'block';

                                // ✅ Salva no cache por 6 horas
                                localStorage.setItem(CACHE_KEY, JSON.stringify({
                                    data: allVideos,
                                    timestamp: Date.now()
                                }));
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
                        filteredVideos.forEach(video => videosGrid.appendChild(createVideoCard(video)));
                        document.getElementById('videoCount').textContent = document.querySelectorAll('.video-card').length;
                    }

                    function createVideoCard(video) {
                        const videoId = video.id.videoId;
                        const snippet = video.snippet;
                        const stats = video.statistics;
                        const duration = formatDuration(video.duration);

                        const card = document.createElement('div');
                        card.className = 'video-card fade-in';
                        card.dataset.videoId = videoId;
                        card.dataset.category = determineCategory(snippet.title, snippet.description);

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
                        filteredVideos = currentFilter === 'all'
                            ? [...allVideos]
                            : allVideos.filter(v => determineCategory(v.snippet.title, v.snippet.description) === currentFilter);
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
                            navigator.share({ title: videoTitle, url: videoUrl });
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
                        const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
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
                        if (hours) return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
                        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
                    }
                }

        fetch('./pages/videos.html')
            .then(r => r.text())
            .then(r => {
                loadPage(r);
                initializeVideos();
                retranslatePage(() => { hideSpinner(); isLoading = false; });
            })
            .catch(() => { hideSpinner(); isLoading = false; });

    }

    liMenu.forEach(item => {
        item.addEventListener('click', () => {
            const map = { 'li-home': 'home', 'li-experience': 'sobre', 'li-projects': 'projetos', 'li-videos': 'videos' };
            const page = map[item.id];
            if (page) navigateTo(page, true);
        });
    });

    window.addEventListener('popstate', function (e) {
        const page = (e.state && e.state.page) || getQueryPage();
        navigateTo(page, false);
    });

    navigateTo(getQueryPage(), false);

});
