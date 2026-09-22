# MiniBlog

> **Simple, not crude. Minimal, not empty. Quiet, but memorable.**

[鍦ㄧ嚎闃呰](https://tommy-hang.github.io/Miniblog/) 路 [English Version](#miniblog--english-version) 路 [婧愪唬鐮乚(https://github.com/Tommy-hang/Miniblog)

MiniBlog 鏄竴涓娇鐢?Astro 鏋勫缓鐨勭幇浠ｄ釜浜哄嚭鐗堢墿锛屼篃鏄竴娆″叧浜庘€滀紭绉€浣撻獙绌剁珶闇€瑕佸灏戝鏉傚害鈥濈殑闀挎湡瀹為獙銆傛枃绔犳槸 Markdown锛岀晫闈㈠浐瀹氳嫳鏂囷紝鍐呭鍙互鏄腑鏂囨垨鑻辨枃锛屾暣绔欓潤鎬佺敓鎴愩€侀浂瀹㈡埛绔?JavaScript銆?
V1 绯诲垪锛圴1.0鈥揤1.5锛夊凡缁忓畬鎴愶細鍐呭鏋舵瀯銆佽瑷€妯″瀷銆佹枃绔犳帓鐗堛€佸唴瀹瑰彂鐜帮紝浠ュ強涓€濂楄浣滆€呭彲浠ラ暱鏈熴€佷綆鎽╂摝銆佷綆閿欒鐜囦娇鐢ㄧ殑鍙戝竷娴佺▼銆?
```text
鎯虫硶 鈫?npm run new 鈫?Markdown + 鍥剧墖 鈫?npm run verify 鈫?git push 鈫?鑷姩閮ㄧ讲
```

---

## 鐞嗗康

- **Content First**锛氬唴瀹逛笌浠ｇ爜鍒嗙锛屾棩甯稿彧鍐?Markdown銆佹斁鍥剧墖銆佹彁浜?git銆?- **Brand Language = English锛孋ontent Language = 涓枃 / English**锛氱晫闈㈠浐瀹氳嫳鏂囷紱鍐呭璇█鐢辩洰褰曞喅瀹氾紝浜掍笉褰卞搷銆?- **Complexity Budget + Quality Floor**锛氱敤灏藉彲鑳藉皯鐨勫鏉傚害锛岃幏寰楀敖鍙兘楂樼殑浣撻獙璐ㄩ噺銆?- **Build-time over runtime**锛氭病鏈夋暟鎹簱銆佹病鏈?CMS銆佹病鏈夊悗鍙帮紝椤甸潰鍦ㄦ瀯寤烘湡鐢熸垚銆?
---

## 蹇€熷紑濮?
闇€瑕?Node.js 22.12 鎴栨洿鏂扮増鏈€?
```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd MiniBlog
npm install
npm run dev
```

鍒涘缓绗竴绡囨枃绔狅細

```bash
npm run new
```

---

## 鍒涘缓鍐呭

`npm run new` 鏄竴涓緢灏忕殑浜や簰寮忚剼鏈紝浼氶棶鍑犱釜闂锛岀劧鍚庣敓鎴愪竴涓鍚堝綋鍓?schema 鐨?`index.md`銆?
```text
What do you want to create?
  1. Writing
  2. Project
  3. Translation of existing content
```

- **Writing / Project**锛氶€夋嫨璇█锛坺h / en锛夆啋 杈撳叆鏍囬 鈫?纭 slug 鈫?閫夋嫨鏍囩銆?- **slug**锛氬皬鍐?ASCII銆乲ebab-case锛屼緥濡?`understanding-attention`銆備腑鏂囨爣棰樹笉浼氳嚜鍔ㄨ浆鎷奸煶锛岃鎵嬪姩杈撳叆涓€涓ǔ瀹氱殑鑻辨枃 slug銆?- **tags**锛氬彲閫夛紝鍙兘浣跨敤 `src/lib/tags.ts` 涓敞鍐岃繃鐨勬爣绛撅紙瑙併€屾爣绛俱€嶏級銆?- **鏂板唴瀹归粯璁?`draft: true`**锛氬垱寤轰笉绛変簬鍙戝竷銆?
```text
Created:
  src/content/writing/zh/understanding-attention/index.md
```

鑴氭湰涓嶄細 git commit / push锛屼篃涓嶄細淇敼鎴栬鐩栦换浣曞凡鏈夋枃浠讹紱鐩爣鐩綍宸插瓨鍦ㄦ椂浼氱洿鎺ユ嫆缁濄€?
---

## 鍐欎綔

鏂囩珷灏辨槸鏅€?Markdown銆俧rontmatter 鏈€灏忕ず渚嬶細

```yaml
---
title: "涓€涓竻妤氱殑鏍囬"
description: "涓€鍙ヨ瘽璇存槑杩欑瘒鏂囩珷銆?
date: 2026-09-22
tags:
  - AI
draft: true
---
```

- `title` / `description` / `date` 蹇呭～锛坄description` 瀵?Archive銆丼EO銆侀椤甸兘寰堥噸瑕侊級銆?- `tags` 鍙€夛紝鍙楁帶璇嶈〃銆?- `draft` / `featured` 榛樿 false锛沗updated` / `cover` 鍙€夈€?
### 鐩綍鍗宠瑷€涓?URL

```text
src/content/writing/zh/<slug>/index.md   鈫? /writing/<slug>/
src/content/writing/en/<slug>/index.md   鈫? /en/writing/<slug>/
```

鍚屼竴涓?slug 鍑虹幇鍦ㄤ袱绉嶈瑷€鐩綍涓嬶紝灏辨槸涓€瀵圭炕璇戙€傞」鐩悓鐞嗭紙`src/content/projects/<locale>/<slug>/`锛夈€?
---

## 鍥剧墖

鍥剧墖涓?`index.md` 鏀惧湪鍚屼竴涓枃浠跺す锛岀浉瀵瑰紩鐢細

```md
![娓呮銆佹湁鎰忎箟鐨?alt 鏂囨湰](./diagram.webp)
```

鏇翠赴瀵岀殑鍛堢幇锛堥兘鏄彲閫夌殑鏋佽交绾﹀畾锛夛細

- **瀹藉浘**锛歚![瀹藉浘](./diagram.webp "wide")` 鈥斺€?杞诲井绐佺牬姝ｆ枃鍒楀銆?- **灏侀潰**锛歠rontmatter `cover: ./cover.webp` 鈥斺€?鍑虹幇鍦ㄦ爣棰樹笅鏂广€佹瘮姝ｆ枃鏇村銆?- **Caption**锛氬湪鍥剧墖涓嬩竴琛屽啓涓€鏉℃枩浣撹鏄庯紝渚嬪 `*鍥?1 鈥?鏁版嵁濡備綍娴佸姩銆?`
- **甯︾粏杈规鐨勫浘**锛歚"frame"`锛屽彲涓?`wide` 缁勫悎锛屽 `"wide frame"`銆?
---

## 缈昏瘧

鐢ㄥ悓涓€濂楄剼鏈細

```bash
npm run new
# 閫夋嫨 3. Translation of existing content
```

閫夋嫨鍐呭绫诲瀷銆佹簮璇█銆佸凡鏈?slug銆佺洰鏍囪瑷€锛岃剼鏈細鍦ㄧ洰鏍囪瑷€鐩綍涓嬬敤**鐩稿悓 slug** 鍒涘缓缈昏瘧鐗堟湰锛屽苟澶嶅埗 `date` / `tags`锛堥」鐩繕浼氬鍒?`status`锛夛紝鎶婃爣棰樹笌姝ｆ枃鐣欐垚鍗犱綅绗︺€?
- 鍙湁**宸插彂甯?*鐨勭炕璇戞墠浼氬湪鏂囩珷椤垫樉绀鸿瑷€閾炬帴锛坄EN` / `涓枃`锛夈€?- 涓嶈姹傛墍鏈夊唴瀹归兘鍙岃锛涘崟璇唴瀹瑰畬鍏ㄦ甯搞€?
---

## 鏍囩

鏍囩鏄唴瀹瑰彂鐜扮殑绗簩杞达紝涔熸槸**鍙楁帶璇嶈〃**锛?
- 鍙兘浣跨敤 `src/lib/tags.ts` 涓敞鍐岀殑鍚嶅瓧銆傚啓閿欙紙渚嬪 `Contorl`锛変細鍦?`npm run check` / `npm run build` 闃舵鐩存帴澶辫触锛屼笉浼氱敓鎴?`/tags/contorl/`銆?- 鏂板鏍囩锛氬湪 `src/lib/tags.ts` 閲屽姞涓€琛?`{ name: "Control", slug: "control" }`銆?- 涓€绡囧唴瀹归€氬父 1鈥? 涓爣绛撅紱鏍囩鏄富棰樺鑸紝涓嶆槸 SEO 鍏抽敭璇嶃€?- 鏍囩璺?Writing / Projects锛沗/tags/<slug>/` 浼氳嚜鍔ㄧ敓鎴愶紝鍙鐪熸鏈夊唴瀹圭殑鏍囩鐢熸垚銆?
---

## 楠岃瘉

鍙戝竷鍓嶈繍琛岀粺涓€妫€鏌ワ細

```bash
npm run verify
```

瀹冧細渚濇鎵ц锛?
```text
npm run validate:content   璺ㄥ唴瀹瑰畬鏁存€ф鏌ワ紙鍙锛?npm run check              astro check锛堢被鍨?+ 鍐呭 schema锛?npm run build              闈欐€佹瀯寤?```

涔熷彲浠ュ崟鐙繍琛?`npm run validate:content`銆傚畠鍙鏌?schema 鐪嬩笉鍒扮殑璺ㄥ唴瀹硅鍒欙細

**Errors锛堜細闃绘閮ㄧ讲锛?*

- 閲嶅鐨勫唴瀹硅韩浠斤紙鍚?collection + locale + slug锛?- `updated` 鏃╀簬 `date`
- 宸插彂甯冨唴瀹圭己 `title` 鎴?`description`

**Warnings锛堝彧鎻愮ず锛屼笉闃绘锛?*

- `draft: true` 鍗?`featured: true`
- 宸插彂甯冨唴瀹规鏂囦负绌?- slug 涓嶆槸灏忓啓 kebab-case
- slug 甯﹁瑷€鍚庣紑锛堢炕璇戝簲浣跨敤鐩稿悓 slug锛?
---

## 鍙戝竷

鎶?`draft: false`锛岀劧鍚庯細

```bash
npm run verify
git add .
git commit -m "Publish: ..."
git push
```

push 鍒?`main` 鍚庯紝GitHub Actions 浼氭墽琛屽悓涓€濂?`verify`锛岄€氳繃鍚庢墠閮ㄧ讲鍒?GitHub Pages锛涗换浣曚竴姝ュけ璐ラ兘涓嶄細閮ㄧ讲銆?
鍙戝竷鍓嶆竻鍗曪細

```text
1. draft: false
2. description 宸插～鍐?3. tags 鍚堟硶
4. npm run verify 閫氳繃
5. commit / push
```

---

## 瀹氬埗

- `src/site.ts` 鈥?鍗氬鍚嶇О銆佷綔鑰呫€丟itHub銆佹墍鍦ㄥ湴銆侀椤?Currently銆?- `src/lib/tags.ts` 鈥?鍙楁帶鏍囩璇嶈〃銆?- `src/i18n/ui.ts` 鈥?鍙繚瀛橀殢鍐呭璇█鍙樺寲鐨勫皯閲忔枃妗堛€?- `src/styles/global.css` 鈥?Design Tokens銆佺珯鐐瑰瑙傘€佸鑸€侀椤点€佸彂鐜伴〉銆?- `src/styles/prose.css` 鈥?Editorial Prose System锛堟枃绔犻槄璇讳笌 Markdown 鎺掔増锛夈€?- `public/favicon.svg` / `public/social-card.svg` 鈥?鍝佺墝璧勪骇銆?
## 椤圭洰缁撴瀯

```text
scripts/                    鏈湴鑴氭湰锛歯ew-content銆乿alidate-content銆佸叡浜伐鍏?src/
鈹溾攢鈹€ components/             Header銆丗ooter銆丄rticleRow銆丄rticleList銆丳rojectList銆乄ritingArchive銆乀agLinks
鈹溾攢鈹€ content/                writing / projects锛坺h / en 鍐呭鍖咃級
鈹溾攢鈹€ i18n/ui.ts              鍐呭绾ф枃妗?+ 璇█绫诲瀷
鈹溾攢鈹€ lib/content.ts          locale / slug / 杩囨护 / 鎺掑簭 / 鍒嗙粍 / 缈昏瘧鍖归厤
鈹溾攢鈹€ lib/tags.ts             鍙楁帶鏍囩璇嶈〃
鈹溾攢鈹€ layouts/                BaseLayout銆丄rticleLayout
鈹溾攢鈹€ pages/                  鍝佺墝椤甸潰銆佸唴瀹硅鎯呫€?tags/<tag>/銆丷SS銆侀噸瀹氬悜
鈹溾攢鈹€ styles/                 global.css銆乸rose.css
鈹溾攢鈹€ content.config.ts       涓や釜 Collection 鐨?Schema
鈹斺攢鈹€ site.ts                 鍗氬韬唤
.github/workflows/          GitHub Pages 閮ㄧ讲锛堝惈 quality gate锛?astro.config.mjs            鏋勫缓銆侀儴缃茶矾寰勩€丼itemap 杩囨护
```

### 璺敱

```text
/                        棣栭〉
/writing/                Writing Archive锛堝勾 / 鏈堝垎缁?+ 鏍囩瀵艰埅锛?/writing/<slug>/         涓枃鏂囩珷
/en/writing/<slug>/      English article
/projects/               Projects
/projects/<slug>/        涓枃椤圭洰
/en/projects/<slug>/     English project
/tags/<tag>/             鏍囩椤碉紙鑷姩鐢熸垚锛?/about/                  About
/rss.xml  /en/rss.xml    鍙岃 RSS
```

## 閮ㄧ讲鍒?GitHub Pages

浠撳簱鍖呭惈 `.github/workflows/deploy.yml`銆傚湪 **Settings 鈫?Pages** 涓€夋嫨 **GitHub Actions**锛岀劧鍚?push 鍒?`main` 鍗冲彲锛泈orkflow 浼氳嚜鍔ㄥ鐞嗗瓙璺緞銆?
## 鍒绘剰娌℃湁瀹炵幇浠€涔?
V1.5 娌℃湁鎼滅储銆佽瘎璁恒€丆MS銆佺櫥褰曘€佹暟鎹簱銆丄nalytics銆丄I 鍔╂墜銆丼eries銆佺浉鍏虫枃绔犮€佷笂涓€绡?/ 涓嬩竴绡囥€佺洰褰曘€佸垎椤点€乀ag Cloud 鎴栧鎴风杩囨护銆?*鎼滅储鏄湁鎰忔帹杩熺殑**锛氬綋鍓嶈妯′笅锛屽勾 / 鏈堟椂闂磋酱鍔犱笂鏍囩宸茬粡瓒冲鎵惧埌鍐呭銆?
## 寮€婧愯鍙笌浣滆€?
MiniBlog 鐢?**寮犳枃鏇滐紙Tommy-hang锛?* 鍒涘缓骞剁淮鎶ゃ€?
- 绋嬪簭浠ｇ爜銆佺粍浠躲€佹牱寮忓拰閰嶇疆浣跨敤 [MIT License](LICENSE)銆?- 鍘熷垱鏂囩珷銆佽鏄庢枃瀛楀拰瑙嗚鍐呭浣跨敤 [CC BY 4.0](LICENSE-CONTENT.md)銆?
---

<a id="miniblog--english-version"></a>

# MiniBlog 鈥?English Version

> **Beautiful by design. Simple by engineering.**

[Live site](https://tommy-hang.github.io/Miniblog/) 路 [Source](https://github.com/Tommy-hang/Miniblog) 路 [涓枃](#miniblog)

MiniBlog is a modern personal publication built with Astro and a long-term experiment around one question: how little technical complexity does an excellent digital reading experience actually require? Articles are Markdown, the interface is fixed English, content can be Chinese or English, and the whole site is static with zero client-side JavaScript.

The V1 series (V1.0鈥揤1.5) is complete: content architecture, the language model, editorial typography, content discovery, and a publishing workflow that is low-friction and low-error for the author.

```text
idea 鈫?npm run new 鈫?Markdown + images 鈫?npm run verify 鈫?git push 鈫?deploy
```

## Philosophy

- **Content first**: content and code are separate; day to day you write Markdown, drop in images and commit.
- **Brand language is English, content language is Chinese / English**: the folder decides a piece's language.
- **Complexity budget + quality floor**: the least complexity that still delivers a high-quality experience.
- **Build-time over runtime**: no database, no CMS, no admin 鈥?pages are generated at build time.

## Quick start

Node.js 22.12 or newer is required.

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd MiniBlog
npm install
npm run dev
```

Create your first article with `npm run new`.

## Create content

`npm run new` is a tiny interactive script. It asks a few questions and writes an `index.md` that matches the current schema.

```text
What do you want to create?
  1. Writing
  2. Project
  3. Translation of existing content
```

- **Writing / Project**: choose a language (zh / en) 鈫?title 鈫?slug 鈫?optional tags.
- **Slug**: lowercase ASCII kebab-case, e.g. `understanding-attention`. Chinese titles are not transliterated; supply a stable English slug.
- **Tags**: optional, and limited to the names registered in `src/lib/tags.ts`.
- **New content starts as `draft: true`** 鈥?creating is not publishing.

The script never commits, pushes, edits or overwrites; it refuses if the target folder already exists.

## Write

Articles are plain Markdown. A minimal frontmatter:

```yaml
---
title: "A clear title"
description: "One sentence that explains the article."
date: 2026-09-22
tags:
  - AI
draft: true
---
```

The folder is the language and the URL:

```text
src/content/writing/zh/<slug>/index.md   鈫? /writing/<slug>/
src/content/writing/en/<slug>/index.md   鈫? /en/writing/<slug>/
```

The same slug under both locales is a translation pair. Projects work the same way.

## Images

Keep images beside `index.md` and reference them relatively:

```md
![A clear, meaningful alt text](./diagram.webp)
```

Optional, very light conventions: `![Wide](./diagram.webp "wide")` for a wider image, `cover: ./cover.webp` in frontmatter for a cover, an italic line after an image for a caption, and `"frame"` (combinable as `"wide frame"`) for a hairline border.

## Translate

Run `npm run new` and pick **3. Translation of existing content**. Choose the content type, source locale, existing slug and target locale. The script creates the counterpart under the same slug, copying `date`, `tags` (and `status` for projects) while leaving the title and body as placeholders.

Only a **published** translation shows a language link on the article page. Single-language content is perfectly fine.

## Tags

Tags are the second discovery axis and a **controlled vocabulary**:

- Only names registered in `src/lib/tags.ts` are allowed. A typo fails `npm run check` / `npm run build` instead of creating `/tags/contorl/`.
- Add a tag by adding one line: `{ name: "Control", slug: "control" }`.
- Use 1鈥? tags per piece; tags navigate topics, they are not SEO keywords.
- Tags cross Writing and Projects; `/tags/<slug>/` is generated only for tags that have content.

## Validate

Run the unified check before publishing:

```bash
npm run verify
```

It runs, in order:

```text
npm run validate:content   cross-content integrity (read-only)
npm run check              astro check (types + content schema)
npm run build              static build
```

`npm run validate:content` only checks what a per-file schema cannot see:

**Errors (block a deploy)**

- duplicate content identity (same collection + locale + slug)
- `updated` earlier than `date`
- published content missing `title` or `description`

**Warnings (reported only)**

- `draft: true` together with `featured: true`
- published content with an empty body
- a slug that is not lowercase kebab-case
- a slug with a locale suffix (translations use an identical slug)

## Publish

Set `draft: false`, then:

```bash
npm run verify
git add .
git commit -m "Publish: ..."
git push
```

Pushing to `main` runs the same `verify` in GitHub Actions; the site is deployed only if it passes.

## Customize

- `src/site.ts` 鈥?identity and the homepage `Currently` list.
- `src/lib/tags.ts` 鈥?the controlled tag vocabulary.
- `src/i18n/ui.ts` 鈥?the few strings that follow the content language.
- `src/styles/global.css` 鈥?design tokens and site chrome.
- `src/styles/prose.css` 鈥?the Editorial Prose System.

## Deploy

The repo includes `.github/workflows/deploy.yml`. Choose **GitHub Actions** under **Settings 鈫?Pages**, then push to `main`. The workflow handles the project base path.

## What is intentionally absent

No search, comments, CMS, authentication, database, analytics, AI assistant, series, related posts, previous/next, table of contents, pagination, tag cloud or client-side filtering. **Search is intentionally deferred**: at the current scale, year/month plus tags are enough.

## License and author

MiniBlog is created and maintained by **寮犳枃鏇?(Tommy-hang)**. Source code is available under the [MIT License](LICENSE); original articles and visual content under [CC BY 4.0](LICENSE-CONTENT.md).

---

**Simple, not crude. Minimal, not empty. Quiet, but memorable.**
