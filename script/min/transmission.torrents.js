transmission.torrents={all:null,puased:null,downloading:null,actively:null,searchResult:null,error:null,warning:null,folders:{},status:{},count:0,totalSize:0,loadSimpleInfo:false,activeTorrentCount:0,pausedTorrentCount:0,fields:{base:"id,name,status,hashString,totalSize,percentDone,addedDate,trackerStats,leftUntilDone,rateDownload,rateUpload,rateDownload,rateUpload,peersGettingFromUs,peersSendingToUs,uploadRatio,uploadedEver,downloadedEver,downloadDir,error,errorString",status:"id,status,percentDone,trackerStats,leftUntilDone,rateDownload,rateUpload,rateDownload,rateUpload,peersGettingFromUs,peersSendingToUs,uploadRatio,uploadedEver,downloadedEver,error,errorString",
config:"downloadLimit,downloadLimited,peer-limit,seedIdleLimit,seedIdleMode,seedRatioLimit,seedRatioMode,uploadLimit,uploadLimited"},datas:{},recently:null,removed:null,isRecentlyActive:false,newIds:[],getallids:function(b,d){var c=this.fields.base;if(this.loadSimpleInfo&&this.all)c=this.fields.status;arguments={fields:c.split(",")};this.isRecentlyActive=false;if(this.all&&d==undefined){arguments.ids="recently-active";this.isRecentlyActive=true}else if(d)arguments.ids=d;if(!this.all)this.all={};transmission.exec({method:"torrent-get",
arguments:arguments},function(a){if(a.result=="success"){transmission.torrents.newIds.length=0;transmission.torrents.loadSimpleInfo=true;transmission.torrents.recently=a.arguments.torrents;transmission.torrents.removed=a.arguments.removed;transmission.torrents.splitid();b&&b(a.arguments.torrents)}else{transmission.torrents.datas=null;b&&b(null)}})},splitid:function(){this.downloading=[];this.puased=[];this.actively=[];this.error=[];this.warning=[];transmission.downloadDirs=[];var b=transmission._status;
this.status={};transmission.trackers={};this.totalSize=0;this.folders={};this.count=0;var d=new Base64,c;for(c in this.recently){var a=this.recently[c];this.datas[a.id]=a}var g=[];for(c in this.removed){a=this.removed[c];g.push(a)}for(c in this.datas){a=this.datas[c];if(!a)return;if($.inArray(a.id,g)!=-1&&g.length>0){if(this.all[a.id]){this.all[a.id]=null;delete this.all[a.id]}this.datas[c]=null;delete this.datas[c]}else{this.isRecentlyActive&&!this.all[a.id]&&this.newIds.push(a.id);a=$.extend(this.all[a.id],
a);if(a.uploadedEver==0&&a.downloadedEver==0)a.uploadRatio="∞";a.infoIsLoading=false;var e=this.status[a.status];this.addTracker(a);if(!e){this.status[a.status]=[];e=this.status[a.status]}e.push(a);a.error!=0&&this.error.push(a);if(a.rateUpload>0||a.rateDownload>0)this.actively.push(a);switch(a.status){case b.stopped:this.puased.push(a);break;case b.download:this.downloading.push(a)}this.all[a.id]=a;this.totalSize+=a.totalSize;$.inArray(a.downloadDir,transmission.downloadDirs)==-1&&transmission.downloadDirs.push(a.downloadDir);
if(transmission.options.getFolders){e=a.downloadDir.split("/");var h="folders-",i;for(i in e){var f=e[i];if(f!=""){h+=d.encode(f);(f=this.folders[h])||(f={count:0,torrents:[],size:0,nodeid:h});f.torrents.push(a);f.count++;f.size+=a.totalSize;this.folders[h]=f}}}this.count++}}transmission.downloadDirs=transmission.downloadDirs.sort();this.newIds.length>0&&this.getallids(null,this.newIds)},addTracker:function(b){var d=b.trackerStats,c=false;b.leecherCount=0;b.seederCount=0;if(d.length>0){for(var a in d){var g=
d[a],e=g.lastAnnounceResult.toLowerCase(),h=g.host.replace("http://","").replace("https://","").split(":")[0].split(".");$.inArray(h[0],"www,tracker".split(","))!=-1&&h.shift();h=h.join(".");var i="tracker-"+h.replace(/\./g,"-"),f=transmission.trackers[i];if(!f){transmission.trackers[i]={count:0,torrents:[],size:0,connected:true};f=transmission.trackers[i]}f.name=h;f.nodeid=i;f.host=g.host;if(e!="success"){c=true;b.warning=g.lastAnnounceResult;if(e=="could not connect to tracker")f.connected=false}f.torrents.push(b);
f.count++;f.size+=b.totalSize;b.leecherCount+=g.leecherCount;b.seederCount+=g.seederCount}if(c){if(b.nextAnnounceTime){if(b.nextAnnounceTime>g.nextAnnounceTime)b.nextAnnounceTime=g.nextAnnounceTime}else b.nextAnnounceTime=g.nextAnnounceTime;this.warning.push(b)}if(b.leecherCount<0)b.leecherCount=0;if(b.seederCount<0)b.seederCount=0;b.leecher=b.leecherCount+" ("+b.peersGettingFromUs+")";b.seeder=b.seederCount+" ("+b.peersSendingToUs+")"}},getPeers:function(b){transmission.exec({method:"torrent-get",
arguments:{fields:"peers,peersFrom".split(","),ids:b}},function(d){console.log("data:",d)})},getMoreInfos:function(b,d,c){transmission.exec({method:"torrent-get",arguments:{fields:b.split(","),ids:d}},function(a){if(a.result=="success")c&&c(a.arguments.torrents);else c&&c(null)})},search:function(b,d){if(!b)return null;if(!d)d=this.all;var c=[];$.each(d,function(a){d[a].name.toLowerCase().indexOf(b.toLowerCase())!=-1&&c.push(d[a])});return this.searchResult=c},getFiles:function(b,d){transmission.exec({method:"torrent-get",
arguments:{fields:"files,fileStats".split(","),ids:b}},function(c){if(c.result=="success")d&&d(c.arguments.torrents);else d&&d(null)})},getConfig:function(b,d){this.getMoreInfos(this.fields.config,b,d)},getErrorIds:function(b,d){var c=[],a=new Date;if(d==true)a=a.getTime()/1E3;for(var g in this.error){var e=this.error[g];if(!($.inArray(e.id,b)!=-1&&b.length>0)){if(d==true)if(a<e.nextAnnounceTime)continue;c.push(e.id)}}for(g in this.warning){e=this.warning[g];if(!($.inArray(e.id,b)!=-1&&b.length>0)){if(d==
true)if(a<e.nextAnnounceTime)continue;c.push(e.id)}}return c},searchAndReplaceTrackers:function(b,d,c){if(b&&d){var a={},g=0,e;for(e in this.all){var h=this.all[e];if(!h)return;var i=h.trackerStats,f;for(f in i)if(i[f].announce==b){a[f]||(a[f]={ids:[],tracker:d});a[f].ids.push(h.id);g++}}g==0&&c&&c(null,0);for(e in a)transmission.exec({method:"torrent-set",arguments:{ids:a[e].ids,trackerReplace:[parseInt(e),a[e].tracker]}},function(j,k){if(j.result=="success")c&&c(k,g);else c&&c(null)},a[e].ids)}}};
