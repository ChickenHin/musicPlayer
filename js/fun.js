function Player(musicArr) {
	this.audio = document.getElementsByTagName('audio')[0];
	this.singer = document.getElementById('singer');
	this.song = document.getElementById('song');
	this.lineBar = document.getElementById('line');
	this.lineBar1 = document.getElementById('line1');
	this.circleBar = document.getElementById('circle');

	this.musicArr = musicArr;
	this.timer;
	this.index = 0;
	this.isPlay = true;
	this.audio.volume = 0.5;
	this.audio.loop = false;

	this.loadDataList();
	this.clickList();
}
Player.prototype = {
	init: function() {
		this.audio.src = this.musicArr[this.index].musicSrc;
		this.singer.innerHTML = this.musicArr[this.index].musicSinger;
		this.song.innerHTML = this.musicArr[this.index].musicName;

		this.audio.currentTime = 0;
		this.circleBar.style.left = 0;
		this.lineBar1.style.width = 0;

		this.playAndPause();
		this.nextSong();
		this.progressJump();
		this.volumeUpAndOff();
		this.orderAndRepeat();
		this.progressShow();
	},
	loadDataList: function() {
		var self = this;
		var tbody = document.getElementsByTagName('tbody')[0];
		for(var i = 0; i < this.musicArr.length; i++) {
			var trNew = document.createElement('tr');
			var tdSong = document.createElement('td');
			var tdSinger = document.createElement('td');
			trNew.className = i;
			tdSong.innerHTML = this.musicArr[i].musicName;
			tdSinger.innerHTML = this.musicArr[i].musicSinger;
			trNew.appendChild(tdSong);
			trNew.appendChild(tdSinger);
			tbody.appendChild(trNew);
		}
	},
	clickList: function() {
		var self = this;
		var tr = document.getElementsByTagName('tr')
		for(var i = 0; i < tr.length; i++) {
			tr[i].addEventListener('click',function() {
				var clickIndex = this.className;
				self.index = clickIndex;
				console.log(self.index);
				self.init();
				if(!self.isPlay) {
				self.audio.pause();
			}
			});
		}
	},
	playAndPause: function() {
		var playBlock = document.getElementById('play-pause');
		var playBtn = document.getElementById('play');
		var pauseBtn = document.getElementById('pause');
		var self = this;
		playBlock.onclick = function() {
			if(self.isPlay) {
				self.audio.pause();
				self.isPlay = false;
				playBtn.style.display = "block";
				pauseBtn.style.display = "none";
				} else {
				self.audio.play();
				self.isPlay = true;
				playBtn.style.display = "none";
				pauseBtn.style.display = "block";
			}
		}
	},
	nextSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var nextBtn = document.getElementById('next');
		var self = this;
		nextBtn.addEventListener('click',function() {
			self.index = ++self.index%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime,innerHTML = " / 00:00";
			self.init();
			if(!self.isPlay) {
				self.audio.pause();
			}
		});
	},
	progressJump: function(event) {
		var self = this;
		var musicBox = document.getElementById('music-box');
		var progressBlock = document.getElementById('play-progress');
		this.lineBar.onmousedown = function(event) {
			var event = event || window.event;
			var x = parseInt(event.clientX - progressBlock.offsetLeft - musicBox.offsetLeft - self.circleBar.offsetWidth / 2);
			if(x < 0) {
				x = 0;
			}
			if(x > self.lineBar.offsetWidth + self.circleBar.offsetWidth / 2) {
				x = self.lineBar.offsetWidth + self.circleBar.offsetWidth / 2;
			}
			self.circleBar.style.left = x + "px";
			self.lineBar1.style.width = x + "px";
			self.audio.currentTime = x / self.lineBar.offsetWidth * self.audio.duration;
		}
		
	},
	volumeUpAndOff: function() {
		var volumeBlock = document.getElementById('volume-up-off');
		var volumeUpBtn = document.getElementById('volume-up');
		var volumeOffBtn = document.getElementById('volume-off');
		var self = this;
		volumeBlock.onclick = function() {
			if(self.audio.volume > 0) {
				volumeUpBtn.style.display = "none";
				volumeOffBtn.style.display = "block";
				self.audio.volume = 0;
			} else {
				volumeUpBtn.style.display = "block";
				volumeOffBtn.style.display = "none";
				self.audio.volume = 0.5;
			}
		}
	},
	orderAndRepeat: function() {
		var orderBlock = document.getElementById('order-repeat');
		var orderBtn = document.getElementById('order');
		var repeatBtn = document.getElementById('repeat');
		var self = this;
		orderBlock.onclick = function() {
			if(self.audio.loop) {
				orderBtn.style.display = "block";
				repeat.style.display = "none";
				self.audio.loop = false;
			} else {
				orderBtn.style.display = "none";
				repeatBtn.style.display = "block";
				self.audio.loop = true;
			}
		}
	},
	progressShow: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var self = this;

		self.audio.addEventListener('canplay',function() {
			var endTim = Math.floor(this.duration);
			var endMin = Math.floor(endTim / 60);
			var endSec = endTim % 60;
			endTime.innerHTML = "/ " + endMin + ":" + endSec;
		});
		clearInterval(this.timer);
		this.timer = setInterval(function() {
			var curTim = Math.floor(self.audio.currentTime);
			var curMin = Math.floor(curTim / 60);
			var curSec = curTim % 60;
			curMin = curMin >= 10? curMin : '0' + curMin;
            curSec = curSec >= 10? curSec : '0' + curSec;
            curTime.innerHTML = curMin + ":" + curSec;

            self.circleBar.style.left = parseInt(self.audio.currentTime / self.audio.duration * self.lineBar.offsetWidth) + "px";
            self.lineBar1.style.width = parseInt(self.audio.currentTime / self.audio.duration * self.lineBar.offsetWidth) + "px"
		},500);

		self.audio.addEventListener('ended',function() {
			clearInterval(self.timer);
			if(this.loop) {
				return;
			} else {
				self.index = ++self.index % self.musicArr.length;
				self.init();
			}
		});

	}


}
var musicArr = [{
	musicSinger: '陈一发儿', 
	musicName: '童话镇', 
	musicSrc: 'song/陈一发儿 - 童话镇.mp3'
}, {
	musicSinger: '赵雷', 
	musicName: '成都', 
	musicSrc: 'song/赵雷 - 成都.mp3'
},{
	musicSinger: 'Jam',
	musicName: '七月上',
	musicSrc: 'song/Jam - 七月上.mp3'
},{
	musicSinger: '张碧晨,陈奕夫,傲日其愣',
	musicName: '凉凉',
	musicSrc: 'song/张碧晨,陈奕夫,傲日其愣 - 凉凉.mp3'
},{
	musicSinger: '金玟岐',
	musicName: '岁月神偷',
	musicSrc: 'song/金玟岐 - 岁月神偷.mp3'
},{
	musicSinger: '陈雪凝',
	musicName: '白山茶',
	musicSrc: 'song/陈雪凝 - 白山茶.mp3'
},{
	musicSinger: '老狼,王婧',
	musicName: '想把我唱给你听',
	musicSrc: 'song/老狼,王婧 - 想把我唱给你听.mp3'
}];
var player = new Player(musicArr);
player.init();