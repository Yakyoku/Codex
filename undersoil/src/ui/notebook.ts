// 観察ノート：一度出会った生き物の、本物の写真・動画を集めて見返せる。部分の名前のクイズもできる。
// 出会った記録はこの端末だけに残す（localStorage。使えないときは、その場かぎり）。
// クイズ：選ぶ形式（マウス・タッチだけで答えられる）。選択肢の並びは毎回入れかえる。まちがえた問題だけをもう一度出し、全問正解まで続ける。
import PHOTOS from '../data/photos.json';
import { SPECIES } from '../game/species';

type Part = { x: number; y: number; label: string };
type Media = { src: string; caption: string; video?: boolean; parts?: Part[] };
const MEDIA = PHOTOS as Record<string, Media[]>;
const ORDER = ['bacillus-subtilis', 'pseudomonas-fluorescens', 'colpoda', 'paramacrobiotus-metropolitanus', 'clover-seed', 'trifolium-repens'];
const KEY = 'undersoil.met', KSTAMP = 'undersoil.stamps', KNOTE = 'undersoil.notes';
type Note = { text: string; date: string; photo?: string };
const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export function makeNotebook(base: string, open: (id: string) => void) {
  let met = new Set<string>(); try { met = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { /* 使えないときは、その場かぎり */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...met])); } catch { /* noop */ } };
  let stamps = 0; try { stamps = Number(localStorage.getItem(KSTAMP) ?? 0); } catch { /* noop */ }
  let notes: Record<string, Note> = {}; try { notes = JSON.parse(localStorage.getItem(KNOTE) ?? '{}'); } catch { /* noop */ }
  const saveNotes = () => { try { localStorage.setItem(KNOTE, JSON.stringify(notes)); return true; } catch { return false; } };
  const dlg = document.createElement('dialog'); dlg.className = 'notebook'; document.body.append(dlg);
  const thumb = (id: string) => { const m = MEDIA[id]?.find((x) => !x.video) ?? MEDIA[id]?.[0]; return m ? base + m.src + (m.video ? '.webp' : '') : ''; };

  const renderList = () => {
    const n = ORDER.filter((id) => met.has(id)).length;
    dlg.innerHTML = `<h2>観察（かんさつ）ノート <small>${n} / ${ORDER.length}</small></h2>
      <p class="nb-lead">出会った生き物の、本物の写真と動画です。押すと、もう一度見られます。</p>
      ${stamps ? `<div class="nb-stamps"><span>クイズ全問正解のスタンプ</span>${ORDER.filter((id) => met.has(id)).map((id) => `<img src="${thumb(id)}" alt="">`).join('')}<b>× ${stamps}</b></div>` : ''}
      <div class="nb-grid">${ORDER.map((id) => met.has(id)
        ? `<button type="button" class="nb-card" data-id="${id}"><img src="${thumb(id)}" alt=""><b>${SPECIES[id]?.title ?? SPECIES[id]?.nameJa ?? id}</b>${notes[id] ? '<em>✎ 観察メモあり</em>' : ''}</button>`
        : `<div class="nb-card nb-off"><i>？</i><b>まだ会っていない</b></div>`).join('')}</div>
      <div class="nb-actions"><button type="button" class="btn" data-notes>自分の観察を書く</button><button type="button" class="btn primary" data-quiz ${quizItems().length < 2 ? 'disabled' : ''}>部分の名前クイズ</button><button type="button" class="btn" data-close>とじる</button></div>
      ${quizItems().length < 2 ? '<p class="nb-hint">クイズは、生き物に 2 種類以上会うとできます。</p>' : ''}`;
    dlg.querySelectorAll<HTMLButtonElement>('.nb-card[data-id]').forEach((b) => b.addEventListener('click', () => { dlg.close(); open(b.dataset.id!); }));
    dlg.querySelector('[data-close]')!.addEventListener('click', () => dlg.close());
    dlg.querySelector<HTMLButtonElement>('[data-quiz]')!.addEventListener('click', startQuiz);
    dlg.querySelector<HTMLButtonElement>('[data-notes]')!.addEventListener('click', renderNotes);
  };

  /** 自分の観察：家や外で本物を見つけたら、日付・気づいたこと・写真を残す（この端末の中だけに保存） */
  const renderNotes = () => {
    const ids = ORDER.filter((id) => met.has(id));
    dlg.innerHTML = `<h2>自分（じぶん）の観察（かんさつ）</h2><p class="nb-lead">「本物に会うには」で本物を見つけたら、ここに書きのこそう。この端末の中だけに保存されます。</p>
      ${ids.length ? ids.map((id) => { const n = notes[id]; return `<div class="nb-note" data-id="${id}"><b>${SPECIES[id]?.title ?? SPECIES[id]?.nameJa}</b>
        <label>見つけた日 <input type="date" value="${n?.date ?? ''}"></label>
        <textarea rows="2" placeholder="どこで、どんなようすだった？">${n?.text ?? ''}</textarea>
        <label class="nb-file">写真（しゃしん）をえらぶ <input type="file" accept="image/*"></label>${n?.photo ? `<img src="${n.photo}" alt="">` : ''}</div>`; }).join('') : '<p class="nb-hint">まだ生き物に会っていません。</p>'}
      <div class="nb-actions"><button type="button" class="btn primary" data-save>保存してもどる</button></div><p class="nb-res" aria-live="polite"></p>`;
    dlg.querySelectorAll<HTMLElement>('.nb-note').forEach((box) => {
      box.querySelector<HTMLInputElement>('input[type=file]')!.addEventListener('change', (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
        const img = new Image(); img.onload = () => { const k = Math.min(1, 480 / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
          box.dataset.photo = c.toDataURL('image/jpeg', 0.7); let pv = box.querySelector('img'); if (!pv) { pv = document.createElement('img'); box.append(pv); } pv.src = box.dataset.photo; URL.revokeObjectURL(img.src); }; img.src = URL.createObjectURL(f); }); });
    dlg.querySelector('[data-save]')!.addEventListener('click', () => {
      dlg.querySelectorAll<HTMLElement>('.nb-note').forEach((box) => { const id = box.dataset.id!, text = box.querySelector('textarea')!.value.trim(), date = box.querySelector<HTMLInputElement>('input[type=date]')!.value, photo = box.dataset.photo ?? notes[id]?.photo;
        if (text || date || photo) notes[id] = { text, date, photo }; else delete notes[id]; });
      if (saveNotes()) renderList(); else dlg.querySelector('.nb-res')!.textContent = '保存できませんでした（写真が大きすぎるか、保存が使えない設定です）'; });
  };
  /** 出会った生き物の写真のうち、部分の名前があるものから問題を作る */
  const quizItems = () => {
    const q: { id: string; m: Media; p: Part }[] = [];
    for (const id of ORDER) if (met.has(id)) for (const m of MEDIA[id] ?? []) for (const p of m.parts ?? []) q.push({ id, m, p });
    return q;
  };
  let queue: ReturnType<typeof quizItems> = [], total = 0, wrongOnce = 0;
  const startQuiz = () => { queue = shuffle(quizItems()); total = queue.length; wrongOnce = 0; ask(); };
  const ask = () => {
    if (!queue.length) {
      stamps++; try { localStorage.setItem(KSTAMP, String(stamps)); } catch { /* noop */ }
      dlg.innerHTML = `<h2>全問正解（ぜんもんせいかい）！</h2><p class="nb-lead">${total} 問すべて正しく答えられました。${wrongOnce ? `まちがえた問題も、もう一度解いて覚えましたね。` : '一度もまちがえませんでした。'} スタンプを 1 つもらいました（${stamps} つめ）。</p>
        <div class="nb-actions"><button type="button" class="btn primary" data-back>ノートにもどる</button></div>`;
      dlg.querySelector('[data-back]')!.addEventListener('click', renderList); return;
    }
    const cur = queue[0];
    const others = shuffle([...new Set(quizItems().map((x) => x.p.label).filter((l) => l !== cur.p.label))]).slice(0, 2);
    const choices = shuffle([cur.p.label, ...others]);   // 正解の位置は毎回変わる
    dlg.innerHTML = `<h2>部分（ぶぶん）の名前クイズ <small>のこり ${queue.length} 問</small></h2>
      <p class="nb-lead">${SPECIES[cur.id]?.title ?? SPECIES[cur.id]?.nameJa ?? ''}：光っている <b>○</b> の所は、なんでしょう？</p>
      <div class="nb-q"><img src="${base}${cur.m.src}" alt=""><i style="left:${cur.p.x}%;top:${cur.p.y}%"></i></div>
      <div class="nb-choices">${choices.map((c) => `<button type="button" class="btn nb-choice">${c}</button>`).join('')}</div>
      <p class="nb-res" aria-live="polite"></p>`;
    dlg.querySelectorAll<HTMLButtonElement>('.nb-choice').forEach((b) => b.addEventListener('click', () => {
      const ok = b.textContent === cur.p.label; const res = dlg.querySelector('.nb-res')!;
      dlg.querySelectorAll<HTMLButtonElement>('.nb-choice').forEach((x) => { x.disabled = true; if (x.textContent === cur.p.label) x.classList.add('ok'); });
      if (ok) { res.textContent = 'せいかい！'; queue.shift(); }
      else { b.classList.add('ng'); res.textContent = `ざんねん。正しくは「${cur.p.label}」。あとでもう一度出ます。`; wrongOnce++; queue.push(queue.shift()!); }
      setTimeout(ask, ok ? 900 : 2200);
    }));
  };

  return {
    /** 紹介カードが出たときに呼ぶ */
    meet(id: string) { if (ORDER.includes(id) && !met.has(id)) { met.add(id); save(); } },
    open() { renderList(); dlg.showModal(); },
    count: () => ORDER.filter((id) => met.has(id)).length,
  };
}
