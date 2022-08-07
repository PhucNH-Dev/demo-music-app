const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlistWrapper = $('.playlist-wrapper')

const playlist = $('.playlist')
const songStatus = $('.status')
const titleSong = $('.title')
const authorSong = $('.author')
const imageSong = $('.image-thumb')
const audio = $('#audio')
const timeNow = $('.time-start')
const timeEnd = $('.time-end')
const progress = $('.progress')
const volume = $('.volume')
const imageThumb = $('.image-thumb')
const nextBtn = $('#next')
const prevBtn = $('#prev')
const songFlow = $('#song-flow')
const playPauseBtn = $('#play-pause')
const openPlaylist = $('#open-playlist')
const closePlaylist = $('#close-playlist')
const progressBar = $('.progress-bar')
const volumeBar = $('.volume-bar')
const volumeIcon = $('#volume-icon')

const strokes = `
   <span class="stroke"></span>
   <span class="stroke"></span>
   <span class="stroke"></span>
   <span class="stroke"></span>
   <span class="stroke"></span>
`

const app = {
    currentIndex: 0,
    isPlaying: false,
    isHoldingProgress: false,
    isHoldingVolume: false,
    songFlowStates: ['repeat', 'repeat_one', 'shuffle'],
    songFlowIndex: 0,
    isScrolled: true,
    songs: [
        {
            name: 'Ai chung tình được mãi',
            singer: 'Đinh Tùng Huy',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Người lạ thoáng qua',
            singer: 'Đinh Tùng Huy',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Tình yêu màu hồng',
            singer: 'Hồ Văn Quý x Xám',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Cảm ơn vì tất cả',
            singer: 'Anh Quân Idol',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Em là con thuyền cô đơn',
            singer: 'Thái Học',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Người lạ từng thương',
            singer: 'Như Việt',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Giữa đại lộ đông tây',
            singer: 'Uyên Linh',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Về bên anh',
            singer: 'Jack',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Hôm nay em cưới rồi',
            singer: 'Khải Đăng',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },

    ],
    render: function() {
        const htmls = this.songs.map((song) => {
            return `
            <li class="playlist-item">
                <div class="item-image">
                    <div class="item-thumb" style="background-image: url('${song.image}')"></div>
                </div>
                <div class="item-song">
                    <div class="song-name">
                    ${song.name}
                    </div>
                    <div class="song-author">
                    ${song.singer}
                    </div>
                </div>
                <audio class="duration-display" preload="metadata" src=${song.path}></audio>
            <div class="wave"></div>
            </li>
            `
        }).join('')
        playlistWrapper.innerHTML = htmls
        const durations = $$('.duration-display')
        const wave = $$('.wave')
  
        durations.forEach((duration, index) => {
           duration.onloadedmetadata = function() {
              wave[index].innerHTML = index === this.currentIndex ? strokes : this.timerFormat(duration.duration)
           }
        })
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    timerFormat: function(duration) {
        const rounded = Math.floor(duration)
        return `${Math.floor(rounded/60) >= 10 ? Math.floor(rounded/60) : '0' + Math.floor(rounded/60)}:${rounded%60 >= 10 ? rounded%60 : '0' + rounded%60}`
    },
    setChangeSong: function() {
        $$('.wave')[this.currentIndex].innerHTML = strokes
    },
    handleEvents: function() {
        const _this = this

        const imageThumbAnimate = imageThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 8000,
            iterations: Infinity
        })
        imageThumbAnimate.pause()

        playPauseBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
                
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            imageThumbAnimate.play()
            songStatus.innerText = 'Now playing'
            playPauseBtn.innerText = 'pause_circle'
        }

        audio.onpause = function() {
            _this.isPlaying = false
            imageThumbAnimate.pause()
            songStatus.innerText = 'Now stopping'
            playPauseBtn.innerText = 'play_circle'
        }

        audio.ontimeupdate = function() {
            let progressPercent = (audio.currentTime/audio.duration) * 100
            timeNow.innerText = _this.timerFormat(audio.currentTime)
            progress.style.width = `${progressPercent}%`
        }

        audio.onvolumechange = function() {
            if(audio.muted) {
                volumeIcon.innerText = 'volume_off'
            } else {
                volumeIcon.innerText = audio.volume > 0.5 ? 'volume_up' : audio.volume <0.05 ? 'volume_off' : 'volume_down'
            }
            volume.style.width = `${audio.volume*100}%`
        }

        audio.onended = function() {
            if(_this.songFlowIndex === 2) {
                _this.randomSong()
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        volumeIcon.onclick = function() {
            audio.muted = !audio.muted
        }

        audio.onloadedmetadata = function() {
            timeNow.innerText = _this.timerFormat(audio.currentTime)
            timeEnd.innerText = _this.timerFormat(audio.duration)
        }

        progressBar.onmousedown = function(e) {
            _this.isHoldingProgress = true
            audio.currentTime = (e.offsetX/e.target.offsetWidth)*audio.duration
        }

        progressBar.onmousemove = function(e) {
            if(_this.isHoldingProgress) {
                audio.currentTime = (e.offsetX/e.target.offsetWidth)*audio.duration
            }
        }

        volumeBar.onmousedown = function(e) {
            _this.isHoldingVolume = true
            audio.volume = e.offsetX/e.target.offsetWidth
        }

        volumeBar.onmousemove = function(e) {
            if(_this.isHoldingVolume) {
                audio.volume = e.offsetX/e.target.offsetWidth
            }
        }

        nextBtn.onclick = function() {
            if(_this.songFlowIndex === 2) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        prevBtn.onclick = function() {
            if(_this.songFlowIndex === 2) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        songFlow.onclick = function() {
            _this.songFlowIndex = _this.songFlowIndex + 1 > 2 ? 0 : _this.songFlowIndex + 1
            songFlow.innerText = _this.songFlowStates[_this.songFlowIndex]
            if(_this.songFlowIndex === 1) {
                audio.loop = true
            } else {
                audio.loop = false
            }
        }

        openPlaylist.onclick = function() {
            playlist.classList.add('active')
            if(!_this.isScrolled) {
                setTimeout(function() {
                   $$('.playlist-item')[_this.currentIndex].scrollIntoView({
                      behavior: "smooth",
                      block: "center"
                   })
                }, 200)
    
                _this.isScrolled = true
             }
        }
        
        closePlaylist.onclick = function() {
            playlist.classList.remove('active')
        }
        
        window.onmouseup = function() {
            _this.isHoldingProgress = false
            _this.isHoldingVolume = false
        }

        window.onkeydown = function(e) {
            switch (e.keyCode) {
            case 32:
                e.preventDefault()
                playPauseBtn.click()
                break
            case 37:
                e.preventDefault()
                audio.currentTime-=5
                break
            case 38:
                e.preventDefault()
                audio.volume+0.05 < 1 ? audio.volume+=0.05 : audio.volume = 1
                break
            case 39:
                e.preventDefault()
                audio.currentTime+=5
                break
            case 40:
                e.preventDefault()
                audio.volume-0.05 > 0 ? audio.volume-=0.05 : audio.volume = 0
                break
            }
        }
    },
    loadCurrentSong: function() {
        titleSong.innerText = this.currentSong.name
        authorSong.innerText = this.currentSong.singer
        imageSong.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        $$('.wave')[this.currentIndex].innerHTML = this.timerFormat($$('.duration-display')[this.currentIndex].duration)
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.setChangeSong()
        this.loadCurrentSong()
    },
    prevSong: function() {
        $$('.wave')[this.currentIndex].innerHTML = this.timerFormat($$('.duration-display')[this.currentIndex].duration)
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.setChangeSong()
        this.loadCurrentSong()
    },
    randomSong: function() {
        $$('.wave')[this.currentIndex].innerHTML = this.timerFormat($$('.duration-display')[this.currentIndex].duration)
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.setChangeSong()
        this.loadCurrentSong()
    },
    selectSong: function() {
        const _this = this
        const playListItem = $$('.playlist-item')
        playListItem.forEach(function(item, index) {
            item.onclick = function() {
                $$('.wave')[_this.currentIndex].innerHTML = _this.timerFormat($$('.duration-display')[_this.currentIndex].duration)
                _this.currentIndex = index
                _this.setChangeSong()
                _this.loadCurrentSong()
                audio.play()
            }
        })
    },
    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        this.selectSong()
        audio.volume = 0.5
    } 
}

app.start()