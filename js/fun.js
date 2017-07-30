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

	this.playAndPause();
	this.nextSong();
	this.prevSong();
	this.progressJump();
	this.volumeUpAndOff();
	this.orderAndRepeat();
	this.progressShow();
	
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

		if(!this.isPlay) {
            this.audio.pause();
		}
		var self = this;
		EventUtil.addHandler(self.audio, 'ended', function() {
			if(self.loop) {
				return;
			} else {
				self.index = ++self.index % self.musicArr.length;
				self.init();
			}
		});	

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
			EventUtil.addHandler(tr[i], 'click', function() {
				self.index = this.className;
				// console.log(self.index);
				self.init();
			});
		}
	},
	// 暂停和继续
	playAndPause: function() {
		var playBlock = document.getElementById('play-pause');
		var playBtn = document.getElementById('play');
		var pauseBtn = document.getElementById('pause');
		var self = this;
		playBtn.style.display = "none";
		pauseBtn.style.display = "block";

        EventUtil.addHandler(playBlock, 'click', function() {
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
        });
	},
	// 下一首
	nextSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var nextBtn = document.getElementById('next');
		var self = this;

        EventUtil.addHandler(nextBtn, 'click', function() {
            self.index = ++self.index%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime.innerHTML = " / 00:00";
			self.init();
        });
	},
	// 上一首
	prevSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var prevBtn = document.getElementById('prev');
		var self = this;

        EventUtil.addHandler(prevBtn, 'click', function() {
        	self.index = (--self.index + self.musicArr.length)%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime.innerHTML = " / 00:00";
			self.init();
        });
	},
	// 进度跳转
	progressJump: function() {
		var self = this;
		var musicBox = document.getElementById('music-box');
		var progressBlock = document.getElementById('play-progress');

        EventUtil.addHandler(self.lineBar, 'mousedown',function(event) {
			var event = EventUtil.getEvent(event);
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
		});
		
	},
	// 静音开启与关闭
	volumeUpAndOff: function() {
		var volumeBlock = document.getElementById('volume-up-off');
		var volumeUpBtn = document.getElementById('volume-up');
		var volumeOffBtn = document.getElementById('volume-off');
		var self = this;

        EventUtil.addHandler(volumeBlock, 'click',function() {
			if(self.audio.volume > 0) {
				volumeUpBtn.style.display = "none";
				volumeOffBtn.style.display = "block";
				self.audio.volume = 0;
			} else {
				volumeUpBtn.style.display = "block";
				volumeOffBtn.style.display = "none";
				self.audio.volume = 0.5;
			}
	    });
	},
	// 顺序播放和循环播放
	orderAndRepeat: function() {
		var orderBlock = document.getElementById('order-repeat');
		var orderBtn = document.getElementById('order');
		var repeatBtn = document.getElementById('repeat');
		var self = this;

        EventUtil.addHandler(orderBlock, 'click',function() {
			if(self.audio.loop) {
				orderBtn.style.display = "block";
				repeat.style.display = "none";
				self.audio.loop = false;
			} else {
				orderBtn.style.display = "none";
				repeatBtn.style.display = "block";
				self.audio.loop = true;
			}
		});
	},
	// 显示播放进度
	progressShow: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var self = this;
		// 播放时间显示
		EventUtil.addHandler(self.audio, 'canplay', function() {
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
	},
	// 显示歌词
	lyricShow: function() {
		var lrcBlock = document.getElementById('lyric');
		var lrcPara = lrcBlock.getElementsByTagName('p');
		var timeArr = new Array();
		var lrcArr = new Array();
		var minArr = new Array();
		var secArr = new Array();
		var secTotal = new Array();
		var self = this;

		var str = self.musicArr[self.index].musicLrc.split('[');
		
		for(var i = 1; i < str.length; i++) {
			var j = i - 1;
			// str[0] == ""
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
		clearInterval(self.lrcTimer);
		self.lrcTimer = setInterval(function() {
			for(var i = 0; i < lrcPara.length; i++) {
				lrcPara[i].style.color = "#000";
			}
			var secDiffer = secTotal.map(function(item,index,array) {
				return parseInt(item - self.audio.currentTime);
			})
			for(var k = 0; k < secDiffer.length; k++) {
				if(secDiffer[k] == 0) {
					var lrcIndex = k;
					// lrcPara[lrcIndex%6].style.color = "rgb(247,209,0)";
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
						lrcPara[1].innerHTML = lrcArr[--tempIndex];
						lrcPara[0].innerHTML = lrcArr[--tempIndex];
						lrcPara[2].innerHTML = lrcArr[lrcIndex];
						lrcPara[3].innerHTML = lrcArr[++lrcIndex];
						lrcPara[4].innerHTML = lrcArr[++lrcIndex];
						lrcPara[5].innerHTML = lrcArr[++lrcIndex];
					}
				}
			}
		},500);
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
	musicSrc: 'song/赵雷 - 成都.mp3',
	musicLrc: '[00:00.10]成都 - 赵雷[00:00.20]词：赵雷[00:00.30]曲：赵雷[00:00.40]编曲：赵雷/喜子[00:00.50][00:18.69]让我掉下眼泪的 不止昨夜的酒[00:26.48]让我依依不舍的 不止你的温柔[00:34.41]余路还要走多久 你攥着我的手[00:42.39]让我感到为难的 是挣扎的自由[00:52.12]分别总是在九月 回忆是思念的愁[01:00.12]深秋嫩绿的垂柳 亲吻着我额头[01:07.88]在那座阴雨的小城里[01:11.99]我从未忘记你[01:15.89]成都 带不走的 只有你[01:23.86]和我在成都的街头走一走[01:31.75]直到所有的灯都熄灭了也不停留[01:39.78]你会挽着我的衣袖[01:43.66]我会把手揣进裤兜[01:47.46]走到玉林路的尽头[01:51.42]坐在小酒馆的门口[02:31.18]分别总是在九月 回忆是思念的愁[[02:39.03]深秋嫩绿的垂柳 亲吻着我额头[02:46.86]在那座阴雨的小城里[02:50.82]我从未忘记你[[02:54.79]成都 带不走的 只有你[03:02.92]和我在成都的街头走一走[03:10.75]直到所有的灯都熄灭了也不停留[03:18.75]你会挽着我的衣袖[03:22.54]我会把手揣进裤兜[[03:26.59]走到玉林路的尽头[03:30.33]坐在小酒馆的门口[03:38.30]和我在成都的街头走一走[03:46.25]直到所有的灯都熄灭了也不停留[03:54.15]和我在成都的街头走一走[04:02.06]直到所有的灯都熄灭了也不停留[04:10.02]你会挽着我的衣袖[04:14.04]我会把手揣进裤兜[04:17.85]走到玉林路的尽头[04:21.82]走过小酒馆的门口[04:36.04]和我在成都的街头走一走[04:43.78]直到所有的灯都熄灭了也不停留'
},{
	musicSinger: 'Jam',
	musicName: '七月上',
	musicSrc: 'song/Jam - 七月上.mp3',
	musicLrc: '[00:00.00]七月上 - JAM[00:00.11]词：Jam 曲：Jam[00:13.44]我化尘埃飞扬[00:17.34]追寻赤裸逆翔[00:21.32]奔去七月刑场[00:25.27]时间烧灼滚烫[00:29.33]回忆撕毁臆想[00:33.43]路上行走匆忙[00:37.41]难能可贵世上[00:41.40]散播留香磁场[00:49.29]我欲乘风破浪[00:51.48]踏遍黄沙海洋[00:53.48]与其误会一场[00:55.58]也要不负勇往[00:57.76]我愿你是个谎[01:00.05]从未出现南墙[01:02.19]笑是神的伪装[01:04.29]笑是强忍的伤[01:06.51]就让我走向你[01:08.65]走向你的床[01:10.85]就让我看见你[01:13.02]看见你的伤[01:15.23]我想你就站在[01:17.33]站在大漠边疆[01:19.55]我想你就站在[01:21.75]站在七月上[01:38.73]我化尘埃飞扬[01:42.58]追寻赤裸逆翔[01:46.73]奔去七月刑场[01:50.90]时间烧灼滚烫[01:54.77]回忆撕毁臆想[01:59.16]路上行走匆忙[02:03.39]难能可贵世上[02:07.30]散播留香磁场[02:15.21]我欲乘风破浪[02:17.13]踏遍黄沙海洋[02:19.27]与其误会一场[02:21.44]也要不负勇往[02:23.65]我愿你是个谎[02:25.76]从未出现南墙[02:27.91]笑是神的伪装[02:30.10]笑是强忍的伤[02:32.25]就让我走向你[02:34.37]走向你的床[02:36.56]就让我看见你[02:38.71]看见你的伤[02:40.79]我想你就站在[02:42.91]站在大漠边疆[02:45.23]我想你就站在[02:47.21]站在七月上'
},{
	musicSinger: '张碧晨,陈奕夫,傲日其愣',
	musicName: '凉凉',
	musicSrc: 'song/张碧晨,陈奕夫,傲日其愣 - 凉凉.mp3',
	musicLrc: '[00:00.75]凉凉 - 张碧晨,陈奕夫,傲日其愣[00:02.14]词：刘畅[00:02.27]曲：谭旋[00:02.41]编曲：韦国赟[00:48.09]入夜渐微凉[00:49.93]繁花落地成霜[00:52.67]你在远方眺望[00:55.21]耗尽所有暮光[00:58.26]不思量自难相忘[01:09.21]夭夭桃花凉[01:11.47]前世你怎舍下[01:13.95]这一海心茫茫[01:16.62]还故作不痛不痒不牵强[01:24.13]都是假象[01:30.62]凉凉夜色为你思念成河[01:35.98]化作春泥呵护着我[01:41.40]浅浅岁月拂满爱人袖[01:45.72]片片芳菲入水流[01:51.90]凉凉天意潋滟一身花色[01:57.27]落入凡尘伤情着我[02:02.66]生劫易渡情劫难了[02:05.16]折旧的心还有几分前生的恨[02:13.42]还有几分[02:17.27]前生的恨[02:42.80]也曾鬓微霜[02:44.58]也曾因你回光[02:47.30]悠悠岁月漫长[02:49.94]怎能浪费时光[02:52.70]去流浪[02:53.80]去流浪[02:57.34]去换成长[03:04.00]灼灼桃花凉[03:06.13]今生愈渐滚烫[03:08.66]一朵已放心上[03:11.27]足够三生三世背影成双[03:16.00]背影成双[03:18.56]在水一方[03:25.37]凉凉夜色为你思念成河[03:30.68]化作春泥呵护着我[03:35.95]浅浅岁月拂满爱人袖[03:40.39]片片芳菲入水流[03:46.75]凉凉天意潋滟一身花色[03:51.98]落入凡尘伤情着我[03:57.27]生劫易渡情劫难了[03:59.80]折旧的心还有几分前生的恨[04:16.09]凉凉三生三世恍然如梦[04:21.20]须臾的年风干泪痕[04:26.66]若是回忆不能再相认[04:30.97]就让情分落九尘[04:37.28]凉凉十里何时还会春盛[04:42.65]又见树下一盏风存[04:47.90]落花有意流水无情[04:50.70]别让恩怨爱恨凉透那花的纯[05:01.49]吾生愿牵尘'
},{
	musicSinger: '金玟岐',
	musicName: '岁月神偷',
	musicSrc: 'song/金玟岐 - 岁月神偷.mp3',
	musicLrc: '[00:01.00]岁月神偷 - 金玟岐[00:07.50]歌词编辑：薰风习习[00:19.04]能够握紧的就别放了[00:23.09]能够拥抱的就别拉扯[00:27.22]时间着急的 冲刷着[00:31.65]剩下了什么[00:35.18]原谅走过的那些曲折[00:39.14]原来留下的都是真的[00:43.22]纵然似梦啊 半醒着[00:47.35]笑着哭着都快活[00:51.69]谁让[00:54.73]时间是让人猝不及防的东西[00:58.95]晴时有风阴有时雨[01:02.95]争不过朝夕 又念着往昔[01:06.93]偷走了青丝却留住一个你[01:11.00]岁月是一场有去无回的旅行[01:15.01]好的坏的都是风景[01:18.98]别怪我贪心 只是不愿醒[01:22.98]因为你只为你愿和我一起[01:27.00]看云淡风轻[01:42.91]时间是让人猝不及防的东西[01:46.92]晴时有风阴有时雨[01:50.91]争不过朝夕 又念着往昔[01:54.92]偷走了青丝却留住一个你[01:58.89]岁月是一场有去无回的旅行[02:02.88]好的坏的都是风景[02:06.96]别怪我贪心 只是不愿醒[02:10.86]因为你只为你愿和我一起[02:16.32]看云淡风轻'
}];
var player = new Player(musicArr);
player.init();