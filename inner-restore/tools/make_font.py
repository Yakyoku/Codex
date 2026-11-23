"""同梱フォント：Noto Sans JP（SIL OFL 1.1）から、ゲームで使う文字だけを切り出して WOFF2 にする。
   文字の集め方：src・各ページの HTML・台帳・要点JSON の中の文字＋英数字と記号。文言を足したら、もう一度実行する。
   太さは 300〜600 の可変のまま残す（細い見出しと、ふつうの本文）。
   入力：tools/fonts/NotoSansJP[wght].ttf（リポジトリには入れない。tools/fonts/README.md の場所から取得）
   出力：public/static/fonts/ir-jp.woff2"""
import os, glob, sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "tools", "fonts", "NotoSansJP[wght].ttf")
chars = set(chr(c) for c in range(0x20, 0x7f)) | set("　、。・「」『』（）〜…ー―→←↑↓✓×µ％％：；！？○●◎△▲▼■□◆◇★☆♪°±÷≒＝＋－")
files = glob.glob(os.path.join(ROOT, "src", "**", "*.*"), recursive=True) + [os.path.join(ROOT, p) for p in ("index.html", "vr/index.html", "diag/index.html", "public/voice-buddy-context.json")]
for f in files:
    try: chars |= set(open(f, encoding="utf-8").read())
    except Exception: pass
chars = {c for c in chars if ord(c) >= 0x20}
font = TTFont(src, lazy=False)
opts = subset.Options(); opts.layout_features = ["*"]; opts.name_IDs = ["*"]; opts.notdef_outline = True
sub = subset.Subsetter(opts); sub.populate(text="".join(chars)); sub.subset(font)   # 先に文字を減らしてから
font = instancer.instantiateVariableFont(font, {"wght": (300, 600)})              # 太さの幅を狭める
out = os.path.join(ROOT, "public", "static", "fonts", "ir-jp.woff2"); os.makedirs(os.path.dirname(out), exist_ok=True)
font.flavor = "woff2"; font.save(out)
print("chars", len(chars), "bytes", os.path.getsize(out))
