"""図鑑の文章を、台帳（Docs/SPECIES.md）から species/*.json へ写す。台帳と中身を一致させるため、手で書かない。
  look＝姿と色の特徴、motion＝動き方、role＝土の中での働き、relations＝関係。どれも最初の 2 文まで（短い文章で読めるように）。
  実行: python3 scripts/zukan-text.py"""
import json, re, glob
L = open('Docs/SPECIES.md').read()
HEAD = {'trifolium-repens': 'シロツメクサ\n', 'clover-seed': 'シロツメクサの種', 'bacillus-subtilis': '枯草菌', 'pseudomonas-fluorescens': 'シュードモナス', 'colpoda': 'コルポダ',
        'paramacrobiotus-metropolitanus': 'トウキョウチョウメイムシ', 'aggregate': '団粒', 'water-film': '水の膜', 'sand': '砂粒', 'clay': '粘土鉱物', 'humus': '腐植'}
def section(head):
    i = L.index('## ' + head); j = L.find('\n## ', i + 3); return L[i:j if j > 0 else None]
def field(sec, name):
    m = re.search(r'- \*\*' + name + r'\*\*：(.+)', sec)
    if not m: return ''
    t = re.sub(r'\*([^*]+)\*', r'\1', m.group(1)).strip()
    t = re.sub(r'（[^（）]*(未確認|確認済み|△|検索結果|要旨)[^（）]*）', '', t)      # 確認の注記は図鑑には出さない
    t = re.sub(r'（[^（）]*(Colpoda|論文|同属|一般的)[^（）]*）', '', t)
    parts = [p for p in re.split(r'(?<=。)', t) if p.strip() and not re.search(r'未確認|信頼できる|資料|論文|確かめ', p)]   # 確認の状態を述べる文は、図鑑には出さない
    return ''.join(parts[:2]).strip()
# 台帳の文のうち、制作の注意書き（「ゲームでは…しない」など）や、文の途中で切れるものは、台帳の内容を変えずに言い直す
OVER = {
  'paramacrobiotus-metropolitanus': {'relations': '何を食べるかは、まだよく分かっていない。乾くと樽の形に縮んで眠り（乾眠）、水が戻ると歩き出す。'},
  'colpoda': {'relations': '細菌を食べる。乾くと丸い殻（シスト）にこもって眠り、水と養分が戻ると出てくる。'},
  'trifolium-repens': {'relations': '種からしみ出す糖などが、まわりの細菌の活動を引き起こす。育つと、根に根粒菌がすみつく（ステージ3）。'},
  'pseudomonas-fluorescens': {'motion': '体の端の鞭毛を回して泳ぐ。前に進む速さは毎秒約78µm（体の長さの約25倍）で、枯草菌より速い。'},
  'clover-seed': {'motion': '自分では動かない。水を吸ってふくらみ、種皮を破って白い根を出す。'},
}
for f in glob.glob('src/data/species/*.json'):
    d = json.load(open(f))
    if d['id'] not in HEAD: continue
    sec = section(HEAD[d['id']])
    d['look'] = field(sec, '姿と色の特徴') or field(sec, '何であるか'); d['motion'] = field(sec, '動き方'); d['role'] = field(sec, '土の中での働き'); d['relations'] = field(sec, '関係')
    d.update(OVER.get(d['id'], {}))
    json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2); open(f, 'a').write('\n')
    print(d['id'], {k: len(d[k]) for k in ('look', 'motion', 'role', 'relations')})
