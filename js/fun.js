function Player(musicArr) {
	this.audio = document.getElementsByTagName('audio')[0];
	this.singer = document.getElementById('singer');
	this.song = document.getElementById('song');
	this.lineBar = document.getElementById('line');
	this.lineBar1 = document.getElementById('line1');
	this.circleBar = document.getElementById('circle');

	this.musicArr = musicArr;
	this.timer;
	this.lrcTimer;
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
		this.prevSong();
		this.progressJump();
		this.volumeUpAndOff();
		this.orderAndRepeat();
		this.progressShow();
		this.lyricShow();
	},
	// 根据歌曲数组生成歌曲列表
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
	// 点击列表播放对应歌曲
	clickList: function() {
		var self = this;
		var tr = document.getElementsByTagName('tr')
		for(var i = 0; i < tr.length; i++) {
			tr[i].addEventListener('click',function() {
				var clickIndex = this.className;
				self.index = clickIndex;
				// console.log(self.index);
				self.init();
				if(!self.isPlay) {
				self.audio.pause();
			}
			});
		}
	},
	// 暂停和继续
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
	// 下一首
	nextSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var nextBtn = document.getElementById('next');
		var self = this;

		nextBtn.addEventListener('click',function() {
			self.index = ++self.index%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime.innerHTML = " / 00:00";
			self.init();
			if(!self.isPlay) {
				self.audio.pause();
			}
		});
	},
	// 上一首
	prevSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var prevBtn = document.getElementById('prev');
		var self = this;

		nextBtn.addEventListener('click',function() {
			self.index = (--self.index + self.musicArr.length)%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime.innerHTML = " / 00:00";
			self.init();
			if(!self.isPlay) {
				self.audio.pause();
			}
		});
	},
	// 进度跳转
	progressJump: function(event) {
		var self = this;
		var musicBox = document.getElementById('music-box');
		var progressBlock = document.getElementById('play-progress');

		this.lineBar.onmousedown = function(event) {
			var event = event || window.event;
			// 获取鼠标与进度条开始处的距离
			var x = parseInt(event.clientX - progressBlock.offsetLeft - musicBox.offsetLeft - self.circleBar.offsetWidth / 2);
			// 超出边界情况
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
	// 静音开启与关闭
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
	// 顺序播放和循环播放
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
	// 显示播放进度
	progressShow: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var self = this;
		// 播放时间显示
		self.audio.addEventListener('canplay',function() {
			var endTim = Math.floor(this.duration);
			var endMin = Math.floor(endTim / 60);
			var endSec = endTim % 60;
			endTime.innerHTML = "/ " + endMin + ":" + endSec;
		});
		// 进度条更新
		clearInterval(this.timer);
		this.timer = setInterval(function() {
			var curTim = Math.floor(self.audio.currentTime);
			var curMin = Math.floor(curTim / 60);
			var curSec = curTim % 60;
			curMin = curMin >= 10 ? curMin : '0' + curMin;
            curSec = curSec >= 10 ? curSec : '0' + curSec;
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

	},
	// 显示歌词
	lyricShow() {
		var lrcBlock = document.getElementById('lyric');
		var lrcPara = lrcBlock.getElementsByTagName('p');
		var timeArr = new Array();
		var lrcArr = new Array();
		var minArr = new Array();
		var secArr = new Array();
		var secTotal = new Array();
		var self = this;

		var str = self.musicArr[0].musicLrc.split('[');
		// str[0] == ""
		for(var i = 1; i < str.length; i++) {
			var j = i - 1;
			// str[i] == 00:00.00]童话镇
			// timeArr[j] == 00:00
			// lrcArr[j] == 童话镇
			// minArr[j] == 00
			// secArr[j] == 00.00
			// secTotal == 0
			timeArr[j] = str[i].split(']')[0];
			lrcArr[j] = str[i].split(']')[1];
			minArr[j] = timeArr[j].split(':')[0];
			secArr[j] = timeArr[j].split(':')[1];
			secTotal[j] = parseInt(minArr[j]) * 60 + parseInt(secArr[j]);
		}
		// 歌词更新
		lrcTimer = setInterval(function() {
			var secDiffer = secTotal.map(function(item,index,array) {
				return parseInt(item - self.audio.currentTime);
			})
			for(var k = 0; k < secDiffer.length; k++) {
				if(secDiffer[k] == 0) {
					var lrcIndex = k;
					if(lrcIndex < 6) {
						lrcPara[0].innerHTML = lrcArr[0];
						lrcPara[1].innerHTML = lrcArr[1];
						lrcPara[2].innerHTML = lrcArr[2];
						lrcPara[3].innerHTML = lrcArr[3];
						lrcPara[4].innerHTML = lrcArr[4];
						lrcPara[5].innerHTML = lrcArr[5];
					} else if(lrcIndex > lrcArr.length - 6) {
						lrcPara[0].innerHTML = lrcArr[lrcArr.length - 5];
						lrcPara[1].innerHTML = lrcArr[lrcArr.length - 4];
						lrcPara[2].innerHTML = lrcArr[lrcArr.length - 3];
						lrcPara[3].innerHTML = lrcArr[lrcArr.length - 2];
						lrcPara[4].innerHTML = lrcArr[lrcArr.length - 1];
						lrcPara[5].innerHTML = lrcArr[lrcArr.length];
					} else {
						var tempIndex = lrcIndex;
						lrcPara[0].innerHTML = lrcArr[--tempIndex];
						lrcPara[1].innerHTML = lrcArr[--tempIndex];
						lrcPara[2].innerHTML = lrcArr[lrcIndex];
						lrcPara[3].innerHTML = lrcArr[++lrcIndex];
						lrcPara[4].innerHTML = lrcArr[++lrcIndex];
						lrcPara[5].innerHTML = lrcArr[++lrcIndex];
					}
				}
			}
		},500);

		self.audio.addEventListener('ended',function() {
			clearInterval(self.lrcTimer);
		});	

	}

}
var musicArr = [{
	musicSinger: '陈一发儿', 
	musicName: '童话镇', 
	musicSrc: 'song/陈一发儿 - 童话镇.mp3',
	musicLrc: '[00:00.00]童话镇[00:05.00]演唱：陈一发儿[00:10.00]作曲 : 暗杠[00:15.00]作词 : 竹君[00:22.93]听说白雪公主在逃跑[00:26.43]小红帽在担心大灰狼[00:29.83]听说疯帽喜欢爱丽丝[00:33.17]丑小鸭会变成白天鹅[00:36.34]听说彼得潘总长不大[00:40.23]杰克他有竖琴和魔法[00:43.56]听说森林里有糖果屋[00:46.82]灰姑娘丢了心爱的玻璃鞋[00:50.39]只有睿智的河水知道[00:53.68]白雪是因为贪玩跑出了城堡[00:57.31]小红帽有件抑制自己[01:00.73]变成狼的大红袍[01:03.80]总有一条蜿蜒在童话镇里七彩的河[01:11.00]沾染魔法的乖张气息[01:14.42]却又在爱里曲折[01:17.76]川流不息扬起水花[01:20.87]又卷入一帘时光入水[01:24.68]让所有很久很久以前[01:28.12]都走到幸福结局的时刻[01:33.18]music....[01:47.00]听说睡美人被埋藏[01:50.44]小人鱼在眺望金殿堂[01:53.79]听说阿波罗变成金乌[01:57.12]草原有奔跑的剑齿虎[02:00.73]听说匹诺曹总说着谎[02:04.16]侏儒怪拥有宝石满箱[02:07.57]听说悬崖有颗长生树[02:10.80]红鞋子不知疲倦地在跳舞[02:14.43]只有睿智的河水知道[02:17.84]睡美人逃避了生活的煎熬[02:21.14]小人鱼把阳光抹成眼影[02:24.58]投进泡沫的怀抱[02:27.77]总有一条蜿蜒在童话镇里七彩的河[02:35.06]沾染魔法的乖张气息[02:38.43]却又在爱里曲折[02:41.82]川流不息扬起水花[02:44.87]又卷入一帘时光入水[02:48.69]让所有很久很久以前[02:52.00]都走到幸福结局的时刻[02:55.46]总有一条蜿蜒在童话镇里梦幻的河[03:02.47]分隔了理想分隔现实[03:05.82]又在前方的山口汇合[03:09.22]川流不息扬起水花[03:12.36]又卷入一帘时光入水[03:16.23]让全部很久很久以前[03:19.38]都走到幸福结局的时刻[03:22.72]又陌生[03:24.52]啊~~啊~~啊~~啊~~'
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