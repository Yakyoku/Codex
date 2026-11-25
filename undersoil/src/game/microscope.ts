// 拡大像（スーツの拡大鏡）：生き物の紹介カードが出ている間、画面の右上に「本物の顕微鏡写真」と「ゲームの拡大像」を並べる。
// 土の中は暗く、生き物は小さく半透明なので、見たことがない人にも「これがその生き物だ」と分かるようにするため。
// ゲームの拡大像は、Blender（Cycles）で顕微鏡と同じしくみ（後ろからの光・体での屈折と吸収・浅いピント）を計算して描いた動画
// （assets/blender/micro_render.py → scripts/micro-encode.py → public/micro/）。細菌は、写真と同じ位相差顕微鏡の見え方に変換してある。
// 以前はブラウザの中で簡単な塗り方で描いていたが、本物の写真と並べると差が大きかったため、2026-11-25 に作り替えた。
import PHOTOS from '../data/photos.json';

type Photo = { src: string; caption: string; credit: string };
/** 種 → 動画の名前と、その動画の写り方（写真の撮り方と同じ） */
const MICRO: Record<string, { file: string; how: string; scale: string }> = {
  'paramacrobiotus-metropolitanus': { file: 'tardigrade', how: '明視野（めいしや）顕微鏡のしくみで描いた姿', scale: '― 100 µm' },
  colpoda: { file: 'colpoda', how: '明視野（めいしや）顕微鏡のしくみで描いた姿', scale: '― 20 µm' },
  'bacillus-subtilis': { file: 'bacillus', how: '位相差（いそうさ）顕微鏡のしくみで描いた姿', scale: '― 5 µm' },
  'pseudomonas-fluorescens': { file: 'pseudomonas', how: '位相差（いそうさ）顕微鏡のしくみで描いた姿', scale: '― 5 µm' },
};

export async function buildMicroscope(base: string) {
  // 左：本物の顕微鏡写真（許諾つき、出典を表示）。右：ゲームの拡大像（動画）
  const frame = document.createElement('div'); frame.className = 'scope';
  frame.innerHTML = '<div class="scope-photo"><img alt=""><div class="scope-tag">本物（ほんもの）の写真（しゃしん）<small></small></div><div class="scope-credit"></div></div>'
    + '<div class="scope-3d"><video muted loop playsinline preload="none"></video><div class="scope-tag">ゲームの拡大像（かくだいぞう）<small></small></div><div class="scope-scale"></div></div><div class="scope-name"></div>';
  document.body.append(frame);
  const img = frame.querySelector('.scope-photo img') as HTMLImageElement, video = frame.querySelector('.scope-3d video') as HTMLVideoElement;
  const canWebm = video.canPlayType('video/webm; codecs="vp9"') !== '';
  let cur: string | null = null, photoI = 0, photoT = 0; let photos: Photo[] = [];
  const setPhoto = (i: number) => { const ph = photos[i]; if (!ph) return; img.src = base + ph.src; frame.querySelector('.scope-photo small')!.textContent = ph.caption; frame.querySelector('.scope-credit')!.textContent = '出典：' + ph.credit; };
  return {
    has: (id: string) => id in MICRO || id in PHOTOS,
    /** 拡大像が出ているか。出ている間は、本体の画面を左へずらして、枠が生き物に重ならないようにする */
    get on3d() { return cur !== null && frame.classList.contains('on'); },
    /** 拡大像の動画がない種（地上の場面のシロツメクサなど）は、写真だけを出し、枠を半分の幅にする */
    show(id: string, name: string) {
      if (!(id in MICRO) && !(id in PHOTOS)) return;
      const m = MICRO[id]; cur = m ? id : null;
      photos = (PHOTOS as Record<string, Photo[]>)[id] ?? []; photoI = 0; photoT = 0; setPhoto(0);
      frame.classList.toggle('photo-only', !m); frame.classList.toggle('no-photo', photos.length === 0);
      if (m) {
        video.poster = `${base}micro/${m.file}.webp`; video.src = `${base}micro/${m.file}.${canWebm ? 'webm' : 'mp4'}`;
        video.currentTime = 0; void video.play().catch(() => { /* 自動再生できないときは、最初のコマ（poster）のまま */ });
        frame.querySelector('.scope-3d small')!.textContent = m.how; frame.querySelector('.scope-scale')!.textContent = m.scale;
      }
      frame.querySelector('.scope-name')!.textContent = name; frame.classList.add('on');
    },
    hide() { cur = null; photos = []; frame.classList.remove('on'); video.pause(); },
    /** 写真を数秒ごとに切り替える */
    tick(dt: number) { if (photos.length < 2 || !frame.classList.contains('on')) return; photoT += dt; if (photoT > 7) { photoT = 0; photoI = (photoI + 1) % photos.length; setPhoto(photoI); } },
    /** 以前の WebGL 描画の名残（呼ばれても何もしない） */
    render(_r?: unknown, _dt?: number) { /* 動画で表示するので、描き足しは不要 */ },
  };
}
