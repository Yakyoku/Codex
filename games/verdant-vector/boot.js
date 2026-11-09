/* Independent of the module graph: keep a recoverable title when a bundle fails. */
window.vvLoadFailure=function(){
 var target=document.getElementById('message');if(!target)return;
 if(document.getElementById('reloadGame'))return;
 target.textContent='ゲームの読み込みに失敗しました。接続を確認して再読み込みしてください。';
 var button=document.createElement('button');button.id='reloadGame';button.textContent='再読み込み';button.onclick=function(){location.reload();};target.appendChild(button);
};
window.addEventListener('error',function(e){if(e.target&&e.target.tagName==='SCRIPT')window.vvLoadFailure();},true);
