import '@fontsource/shippori-mincho/400.css';
import '@fontsource/shippori-mincho/600.css';
const q = new URLSearchParams(location.search);
const canvas = document.getElementById('stage') as HTMLCanvasElement;
document.body.style.cssText = 'margin:0;background:#f4efe4;overflow:hidden';
canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100dvh;touch-action:none;display:block';
function fatal(e: unknown): void {
  const el = document.getElementById('fatal')!; el.hidden = false;
  el.style.cssText = 'position:fixed;inset:10% 8%;padding:2em;background:#f4efe4;color:#2b3350;font-family:"Shippori Mincho",serif;border:1px solid #2b335055;z-index:99;overflow:auto';
  el.innerHTML = '<h2>申し訳ありません。絵を描く途中で問題が起きました。</h2><p>' + String((e as Error)?.message ?? e).replace(/</g, '&lt;') + '</p><p><button onclick="location.reload()">読み込み直す</button></p>';
}
addEventListener('error', e => fatal(e.error ?? e.message));
addEventListener('unhandledrejection', e => fatal(e.reason));
(async () => {
  if (q.has('view')) { const { runViewer } = await import('./dev/viewer'); await runViewer(canvas, q); return; }
  const { boot } = await import('./game/boot');
  await boot(canvas, q);
})().catch(fatal);
