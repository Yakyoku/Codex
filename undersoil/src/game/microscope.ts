// 拡大像の枠：生き物の紹介カードが出ている間、画面の右上に「本物の顕微鏡写真・動画」を大きく出す。
// 土の中は暗く、生き物は小さく半透明なので、見たことがない人にも「本物はこういう姿だ」と分かるようにするため。
// 2026-11-25：持ち主の確認で「ゲームで描いた拡大像を本物の写真と並べると、かえって AI っぽく見える」との指摘。
//   → 本物の写真・動画（許諾・出典つき）を主役にした。ゲームで描いた姿（Blender の Cycles で顕微鏡のしくみを計算した動画、public/micro/）は、
//     「ゲームの姿と比べる」を押したときだけ横に出す。
// 写真ごとに、撮り方（明視野・位相差・電子顕微鏡など）を表示し、「部分の名前」を押すと、写真の上に部分の名前が出る。
import PHOTOS from '../data/photos.json';
import MEET from '../data/meet.json';

type Part = { x: number; y: number; label: string };
type Track = { label: string; pts: [number, number, number, number][] };   // [秒, x%, y%, 半径%]
type Media = { src: string; caption: string; credit: string; method: string; video?: boolean; parts?: Part[]; track?: Track };
const MEDIA = PHOTOS as Record<string, Media[]>;
/** ゲームで描いた姿（比べる用） */
const MICRO: Record<string, { file: string; how: string }> = {
  'paramacrobiotus-metropolitanus': { file: 'tardigrade', how: '明視野顕微鏡のしくみで描いた' },
  colpoda: { file: 'colpoda', how: '明視野顕微鏡のしくみで描いた' },
  'bacillus-subtilis': { file: 'bacillus', how: '位相差顕微鏡のしくみで描いた' },
  'pseudomonas-fluorescens': { file: 'pseudomonas', how: '位相差顕微鏡のしくみで描いた' },
};
const SCALE: Record<string, string> = { 'bacillus-subtilis': '長さ 約 3 µm', 'pseudomonas-fluorescens': '長さ 約 2 µm', colpoda: '長さ 約 60 µm', 'paramacrobiotus-metropolitanus': '体長 約 0.5 mm', 'trifolium-repens': '子葉の長さ 約 4 mm' };

export async function buildMicroscope(base: string) {
  const frame = document.createElement('div'); frame.className = 'scope';
  frame.innerHTML = `
    <div class="scope-real">
      <img alt=""><video muted playsinline preload="none"></video>
      <div class="scope-parts"></div><div class="scope-track"><i></i><span></span></div><div class="scope-meet"><b>本物（ほんもの）に会うには</b><p></p><small></small></div>
      <div class="scope-tag">本物（ほんもの）の姿（すがた）<small class="scope-method"></small></div>
      <div class="scope-foot"><div class="scope-caption"></div><div class="scope-credit"></div></div>
      <div class="scope-dots"></div>
    </div>
    <div class="scope-cg"><video muted loop playsinline preload="none"></video><div class="scope-tag">ゲームで描いた姿<small></small></div></div>
    <div class="scope-bar"><b class="scope-name"></b><span class="scope-scale"></span>
      <button type="button" class="scope-btn" data-a="meet">本物に会うには</button><button type="button" class="scope-btn" data-a="parts">部分の名前</button><button type="button" class="scope-btn" data-a="cmp">ゲームの中と見比べる</button><button type="button" class="scope-btn" data-a="cg">Blender で描いた姿</button><button type="button" class="scope-btn" data-a="close" aria-label="とじる">×</button></div>`;
  document.body.append(frame);
  const cmpTag = document.createElement('div'); cmpTag.className = 'cmp-tag'; cmpTag.innerHTML = 'ゲームの中の姿<small>いま土の中にいる、その生き物</small>'; document.body.append(cmpTag);
  const $ = <T extends Element>(s: string) => frame.querySelector(s) as T;
  const img = $<HTMLImageElement>('.scope-real img'), vid = $<HTMLVideoElement>('.scope-real video'), cgv = $<HTMLVideoElement>('.scope-cg video');
  const canWebm = vid.canPlayType('video/webm; codecs="vp9"') !== '';
  const ext = canWebm ? 'webm' : 'mp4';
  let cur: string | null = null, list: Media[] = [], idx = 0, holdT = 0, showParts = false, showCg = false;

  const setMedia = (i: number) => {
    const m = list[i]; if (!m) return; idx = i; holdT = 0;
    if (m.video) {
      img.style.display = 'none'; vid.style.display = 'block'; vid.poster = `${base}${m.src}.webp`; vid.src = `${base}${m.src}.${ext}`;
      vid.loop = true; vid.currentTime = 0; void vid.play().catch(() => { /* 自動再生できないときは最初のコマのまま */ });
    } else { vid.pause(); vid.removeAttribute('src'); vid.style.display = 'none'; img.style.display = 'block'; img.src = base + m.src; }
    $('.scope-method').textContent = m.method; $('.scope-caption').textContent = m.caption; $('.scope-credit').textContent = '出典：' + m.credit;
    const parts = $('.scope-parts'); parts.innerHTML = '';
    for (const p of m.parts ?? []) { const d = document.createElement('div'); d.className = 'scope-part'; d.style.left = p.x + '%'; d.style.top = p.y + '%'; d.innerHTML = `<i></i><span>${p.label}</span>`; parts.append(d); }
    frame.classList.toggle('has-parts', !!m.parts?.length);
    $('.scope-dots').innerHTML = list.length > 1 ? list.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('') : '';
  };
  // 本物の動画の中で、見るべき生き物を丸で追いかける（動画の時刻に合わせて、記録した位置の間をなめらかにつなぐ）
  const trackEl = $<HTMLElement>('.scope-track');
  const moveTrack = () => {
    const m = list[idx]; const tr = m?.track; if (!tr || !m.video) { trackEl.style.display = 'none'; return; }
    const t = vid.currentTime || 0, P = tr.pts; let k = 0; while (k < P.length - 2 && P[k + 1][0] < t) k++;
    const a = P[k], b = P[k + 1] ?? a, f = Math.max(0, Math.min(1, (t - a[0]) / Math.max(0.001, b[0] - a[0])));
    const x = a[1] + (b[1] - a[1]) * f, y = a[2] + (b[2] - a[2]) * f, r = a[3] + (b[3] - a[3]) * f;
    trackEl.style.display = 'block'; trackEl.style.left = x + '%'; trackEl.style.top = y + '%'; trackEl.style.setProperty('--rp', (r / 100 * $<HTMLElement>('.scope-real').clientWidth).toFixed(1) + 'px');
    (trackEl.querySelector('span') as HTMLElement).textContent = tr.label;
  };
  const trackLoop = () => { if (cur) moveTrack(); requestAnimationFrame(trackLoop); }; requestAnimationFrame(trackLoop);
  const next = (d = 1) => { if (list.length > 1) setMedia((idx + d + list.length) % list.length); };
  // 写真の左右をタップすると前後へ。ボタンは部分の名前／ゲームの姿
  $('.scope-meet').addEventListener('click', (e) => e.stopPropagation());
  $('.scope-real').addEventListener('click', (e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); next((e as MouseEvent).clientX < r.left + r.width / 2 ? -1 : 1); });
  frame.querySelectorAll('.scope-btn').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation(); const a = (b as HTMLElement).dataset.a;
    if (a === 'cmp') { const on = !document.body.classList.contains('compare'); document.body.classList.toggle('compare', on); b.classList.toggle('on', on); holdT = -60; return; }
    if (a === 'close') { document.body.classList.remove('compare'); frame.classList.remove('on'); vid.pause(); cgv.pause(); cur = null; return; }
    if (a === 'meet') { const on = !frame.classList.contains('meet-on'); frame.classList.toggle('meet-on', on); b.classList.toggle('on', on); holdT = -30; }
    else if (a === 'parts') { showParts = !showParts; frame.classList.toggle('parts-on', showParts); b.classList.toggle('on', showParts); holdT = -20; }
    else { showCg = !showCg; frame.classList.toggle('cg-on', showCg); b.classList.toggle('on', showCg); if (showCg && cur && MICRO[cur]) void cgv.play().catch(() => {}); else cgv.pause(); }
  }));

  return {
    has: (id: string) => id in MEDIA,
    /** 枠が出ているか。出ている間は、本体の画面を左へずらして、枠が生き物に重ならないようにする */
    get on3d() { return cur !== null && frame.classList.contains('on'); },
    /** 見比べる表示か（本体の映像を、画面の左半分の中央に寄せる） */
    get compare() { return document.body.classList.contains('compare'); },
    show(id: string, name: string) {
      list = MEDIA[id] ?? []; if (!list.length) return;
      cur = id; const cg = MICRO[id];
      frame.classList.toggle('no-cg', !cg); showCg = false; frame.classList.remove('cg-on'); $('.scope-btn[data-a="cg"]').classList.remove('on');
      if (cg) { cgv.poster = `${base}micro/${cg.file}.webp`; cgv.src = `${base}micro/${cg.file}.${ext}`; $('.scope-cg small').textContent = cg.how + '（Blender で計算）'; }
      { const M = MEET as Record<string, string>; $('.scope-meet p').textContent = M[id] ?? ''; $('.scope-meet small').textContent = M._note; frame.classList.toggle('has-meet', !!M[id]); frame.classList.remove('meet-on'); $('.scope-btn[data-a="meet"]').classList.remove('on'); }
      $('.scope-name').textContent = name; $('.scope-scale').textContent = SCALE[id] ?? '';
      setMedia(0); frame.classList.add('on');
    },
    hide() { document.body.classList.remove('compare'); frame.querySelectorAll('.scope-btn[data-a="cmp"]').forEach((x) => x.classList.remove('on')); cur = null; list = []; frame.classList.remove('on'); vid.pause(); cgv.pause(); },
    /** 写真は 8 秒ごとに次へ（動画は 10 秒か、1 回流し終えたら次へ）。「部分の名前」を押した直後は、しばらく止める */
    tick(dt: number) {
      if (!cur || list.length < 2) return; holdT += dt;
      const m = list[idx]; if (holdT > (m.video ? Math.max(10, (vid.duration || 0) + 0.5) : 8)) next();
    },
    render() { /* 以前の WebGL 描画の名残（何もしない） */ },
  };
}
