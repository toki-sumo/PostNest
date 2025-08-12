--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO nacky;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published boolean DEFAULT true NOT NULL,
    "imageUrl" text,
    summary text,
    tags text[],
    "authorId" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Article" OWNER TO nacky;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO nacky;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    bio text DEFAULT ''::text,
    role text DEFAULT 'user'::text NOT NULL,
    password text
);


ALTER TABLE public."User" OWNER TO nacky;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO nacky;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nacky;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cmdjl0ffe0001yh8u75v4nl5r	7e075cec-4204-41c9-8e95-5d3aebe04ce0	oauth	github	215460756	\N	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	\N	bearer	read:user,user:email	\N	\N
\.


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" (id, title, content, "createdAt", published, "imageUrl", summary, tags, "authorId", "updatedAt") FROM stdin;
cmdzg83y9000ryhndd7v0m1uw	title	content	2025-08-06 04:09:08.864	t	\N	\N	{kakak,あああああ}	cmdljro9x000ayhjepxzxunud	2025-08-06 13:42:39.632
cmdy5jm2g000dyhndcbcqgr5r	title	honbun	2025-08-05 06:22:23.602	t	\N	\N	{テスト,サンプル}	cmdljro9x000ayhjepxzxunud	2025-08-07 00:08:54.588
cme0rnm5z000tyhndhg400mfi	あああ	っっっｆ	2025-08-07 02:16:54.256	t	\N	\N	{っっっｆ}	cmdljro9x000ayhjepxzxunud	2025-08-07 02:16:54.256
cmdx5d9150003yhnd0yl7ojdd	Test Title2	This is test content.aaaa\nbbbb\nccccgggg	2025-08-04 13:29:40.601	t	\N	\N	\N	cmdv65bka0011yh5b3qj02v5b	2025-08-05 04:36:28.388
cmdy1s7k10005yhndtcxdspgz	gggg	cccc	2025-08-05 04:37:06.239	t	\N	\N	\N	cmdv65bka0011yh5b3qj02v5b	2025-08-05 04:37:06.239
cmdy1ztv40009yhndl0sdz8pc	kkkkkkk	llllllllllllllll	2025-08-05 04:43:01.744	t	\N	\N	\N	cmdv65bka0011yh5b3qj02v5b	2025-08-05 04:43:01.744
cme0s15v70001yh6156x2jycy	ai vs human	ffff	2025-08-07 02:27:26.322	t	\N	\N	{AI,人間,テクノロジー,sample,未来}	cmdljro9x000ayhjepxzxunud	2025-08-07 06:28:36.635
cmdy5pc8x000fyhndw90pprqc	ssample	honbun	2025-08-05 06:26:50.817	t	\N	\N	\N	cmdljro9x000ayhjepxzxunud	2025-08-05 06:26:50.817
cmdyfbs8t000jyhnd3lljognv	タイトル	本文	2025-08-05 10:56:14.524	t	\N	\N	{}	cmdljro9x000ayhjepxzxunud	2025-08-05 10:56:14.524
cme11x12r0001yhyijoktuus4	next.js	内容	2025-08-07 07:04:09.645	t	\N	\N	{Web開発,フレームワーク,フロントエンド}	cmdljro9x000ayhjepxzxunud	2025-08-07 07:04:09.645
cme12l4n90003yhyi4tl0q95n	「AIと共に働く時代：エンジニアが知っておくべき5つの変化」	AIの進化が著しい今、エンジニアの働き方にも大きな変化が訪れています。ChatGPTやGitHub Copilotなど、開発支援ツールの台頭により、単なるコーディングスキルだけでは通用しない時代になってきました。\n\n今回は、AIと共に働く時代にエンジニアが知っておくべき5つの変化について紹介します。\n\n---\n\n### 1. **コーディングの自動化が進む**\nAIがコードを書く時代では、エンジニアは「実装」から「設計」や「レビュー」へと役割をシフトしていく必要があります。\n\n### 2. **ドキュメントや仕様書の重要性が増す**\nAIは文脈をもとに動くため、仕様の曖昧さが問題になります。明確な要件定義やドキュメント作成がこれまで以上に重要になります。\n\n### 3. **AIを使いこなすスキルが必要に**\nAIツールを使って効率化を図れるかどうかで、業務の生産性が大きく変わります。プロンプトの書き方や活用法は必須スキルとなるでしょう。\n\n### 4. **「人間にしかできない仕事」に価値が集まる**\n抽象的な課題解決、倫理的判断、ユーザー体験設計など、人間ならではの領域がより重要視されます。\n\n### 5. **継続的な学習が前提になる**\n変化のスピードが速いため、常に学び続ける姿勢が不可欠です。AIの進化と共に、我々もアップデートされていく必要があります。\n\n---\n\nAIに仕事を奪われるのではなく、**AIと共に進化する**ことが求められています。  \nエンジニアにとっては、今がまさに「進化のチャンス」なのです。\n	2025-08-07 07:22:54.016	t	\N	\N	{AI,エンジニア,働き方}	cmdljro9x000ayhjepxzxunud	2025-08-07 07:22:54.016
cmdx5anqj0001yhnd41o0so8n	Test Title	This is test content.	2025-08-04 13:27:39.691	t	\N	\N	\N	cmdljro9x000ayhjepxzxunud	2025-08-07 12:51:12.667
cme12vd600005yhyi61my6fmv	「初心者でもできる！無理なく続ける家計管理の5つのコツ」	毎月の支出が増えて、なかなか貯金ができないと感じている方も多いのではないでしょうか？  \n家計管理は難しいものと思われがちですが、基本を押さえれば誰でも無理なく続けられます。\n\n今回は、初心者でもすぐに実践できる家計管理の5つのコツをご紹介します。\n\n---\n\n### 1. **収支を「見える化」する**\n\nまずは、毎月の収入と支出をしっかり把握しましょう。  \n家計簿アプリやエクセルを使って「見える化」することで、無駄遣いや節約ポイントが明確になります。\n\n### 2. **固定費の見直しをする**\n\n家賃や通信費、保険料などの固定費は、節約の大きなカギです。  \n契約プランの変更や乗り換え、不要なサービスの解約で無理なく節約できます。\n\n### 3. **「先取り貯金」を習慣化する**\n\n給料が入ったらまず貯金額を確保する「先取り貯金」を取り入れましょう。  \n残ったお金で生活する意識が貯蓄の習慣化につながります。\n\n### 4. **無理のない予算を立てる**\n\n毎月の支出は、無理のない範囲で予算を立てましょう。  \nきつい節約は長続きしません。楽しく続けられる範囲を見極めることが大切です。\n\n### 5. **定期的に振り返りを行う**\n\n1ヶ月単位で振り返りを行い、計画と実績のズレを確認しましょう。  \n改善ポイントを見つけて、柔軟に家計管理を続けるコツです。\n\n---\n\n家計管理は「完璧」を目指すより、「続けること」が何より大切です。  \nまずは小さな一歩から、無理なく始めてみましょう！\n	2025-08-07 07:30:51.619	t	\N	\N	{家計管理,節約,暮らし}	7e075cec-4204-41c9-8e95-5d3aebe04ce0	2025-08-07 07:30:51.619
cme1ehpj00007yhyiyf6zvapf	「家計簿が続かない人へ。ストレスなく始める家計管理のコツ」	✅ はじめに\n「家計簿をつけよう！」と意気込んで始めたものの、三日坊主で終わった経験はありませんか？\n家計管理はお金の見える化に直結する大切な習慣ですが、完璧を目指すと続きません。\n\nこの記事では、ズボラでも続けられる家計管理のコツを紹介します。\n特別なアプリやスプレッドシートのスキルがなくても大丈夫です。\n\n💡 ステップ1：月に1回だけ「お金の全体像」を見る\n毎日の記録が面倒で挫折する人は多いです。\nそこでおすすめなのが、月1回だけ振り返る「ざっくり家計簿」。\n\nまずは以下の3項目だけを確認しましょう：\n\n今月の収入（手取り）\n\n固定費（家賃・通信・保険など）\n\n貯金 or 使途不明金（収入 － 支出）\n\nこれだけで、今月お金がどう動いたのかが見えるようになります。\n\n📱 ステップ2：レシートは撮影、またはスマホメモ\n支出の記録も簡略化しましょう。\n\nコンビニやスーパーのレシートは捨てる前に写真を撮るだけ。\n\nそれすら面倒なら、スマホのメモアプリに「食費 500円」とだけ書いてOK。\n\n記録が多少雑でも、あとから「食費多いかも？」と気づければ成功です。\n\n🧩 ステップ3：分類は3つだけで十分\n家計簿を「食費・日用品・交際費・医療費…」など細かく分けすぎると、それだけで疲れてしまいます。\n\n最初は以下の3つだけで十分です：\n\n生活費（食費、日用品）\n\n変動費（交際費、外食、レジャー）\n\n固定費（家賃、光熱費、通信）\n\nざっくりでも継続することが一番の成果です。\n\n🔁 ステップ4：定期的な振り返りをセット\n月末に5分だけ「使いすぎた？」「無駄な買い物あった？」と振り返る時間をとると、自然とお金の使い方が整ってきます。\n\n紙でもアプリでも構いません。重要なのは完璧にやることではなく、やめないこと。\n\n🧘‍♀️ まとめ\n家計管理は、**“毎日やるもの”ではなく、“振り返るもの”**と考えるとぐっと楽になります。\n最初から完璧を目指さず、できるところから始めていきましょう。\n\n小さな一歩の積み重ねが、将来の安心に繋がります。	2025-08-07 12:56:09.846	t	\N	\N	{家計簿,家計管理,ライフスタイル,習慣化}	cmdv65bka0011yh5b3qj02v5b	2025-08-07 12:56:09.846
cme1w2dg50009yhyixu3g50a6	将来に不安を感じたら──ライフプランの作り方をやさしく解説	「このままで老後資金って足りるのかな」「いつか家を買いたいけど、現実的にどうなんだろう」\nそんなふうに、将来のことをぼんやりと不安に感じたことはありませんか？\n\n将来のお金や暮らしについて考えるとき、大きな助けになるのが「ライフプラン」です。\n今回は、はじめての方でも取り組みやすいように、ライフプランの作り方をわかりやすくまとめました。\n\n📌 ライフプランって何？\nライフプランとは、人生のイベントとそれにかかるお金を見える化した設計図のこと。\n結婚、子育て、マイホーム購入、教育費、老後生活など、未来の出来事とそれに必要なお金を一緒に考えます。\n\n🪜 ライフプラン作成のステップ\n① ライフイベントを洗い出す\nまずは、自分や家族の将来の予定や希望を書き出します。\n例：\n\n35歳でマイホームを購入したい\n\n40歳で子どもが中学に入学する\n\n60歳で定年退職したい など\n\n無理に正確である必要はありません。「こうなったらいいな」レベルで大丈夫です。\n\n② 収入と支出を見積もる\n次に、今後の年収や生活費、ライフイベントごとの費用をざっくりで良いので見積もります。\n\n年収の見込み（昇給・転職なども加味）\n\n月々の支出（家賃、食費、保険料など）\n\nイベントごとの費用（進学費用、住宅ローン、老後資金など）\n\n③ キャッシュフロー表を作る\nキャッシュフロー表とは、毎年の収入・支出・貯蓄残高の推移を一覧でまとめたものです。\n\nExcelや無料のシミュレーションツール（FP協会などが提供）を使って、\n「◯年後に赤字になるかも」といったリスクを早めに発見できます。\n\n④ 不足があれば調整する\n仮に赤字になる年が出たとしても、それは良いことです。\n「今のままだとマズいかも」と気づけたら、以下のように調整できます。\n\n支出を減らす（習い事や保険の見直し）\n\n収入を増やす（副業・昇進）\n\nライフイベントをずらす（住宅購入を数年遅らせる）\n\n🌱 まずは「ざっくり」でOK\n完璧を目指す必要はありません。\n「自分はこれからどう生きたいのか」\nその方向を見つけるために、ライフプランを作るのだと思います。\n\n毎年少しずつ見直して、自分の生活にフィットした形に育てていくのが理想です。\n\n📚 おわりに\nライフプランは、一度作って終わりではなく、**人生の変化に応じて更新していく「生きた設計図」**です。\n\n将来の不安を漠然と抱えたまま過ごすより、\n一歩踏み出して「今できること」を見つけていきませんか？	2025-08-07 21:08:07.43	t	\N	\N	{人生,計画,将来,ライフプラン,不安}	cmdv65bka0011yh5b3qj02v5b	2025-08-07 21:08:07.43
cme6l1dnv000pyhyiru7d6uyo	スポーツ	っっｋ	2025-08-11 03:58:16.171	t	\N	\N	{お金,投資,学び,スポーツ,運動,健康,うんどう}	cmdv65bka0011yh5b3qj02v5b	2025-08-11 03:58:16.171
cme7vrg6u000ryhyiapkc23la	3日間、フェスに参加して得られたこと	・たくさんの人との交流\n・モチベーションアップ→転職・勉強・オフ会\n・転職の方向性の再確認\n・転職軸の考え方\n・\n\n\n	2025-08-12 01:46:14.827	t	\N	\N	{フェス,体験,学び}	cmdv65bka0011yh5b3qj02v5b	2025-08-12 01:46:14.827
cme23bssq000fyhyiq10cnn8w	sassss	<h1>aaaaaaaaaa</h1><p></p><h2>bbbbbbbbbbbb</h2><p></p><p></p><h3>ccccccccccccc</h3><p></p><p></p><p><strong>ddddddddddd</strong></p><p></p><p>eeeeeeeeeeeeeee</p><p></p>	2025-08-08 00:31:24.555	t	\N	\N	{ブログ,記事,情報,ああああああああああああああああああああああ,えええええええええええええええええええええええええ,未分類,その他}	cmdv65bka0011yh5b3qj02v5b	2025-08-08 07:33:33.44
cme1wkygv000byhyib7h2pw8r	家計管理の始め方｜今日からできる、シンプルで続けやすい方法	家計管理の始め方｜今日からできる、シンプルで続けやすい方法\n「家計簿をつけた方がいいのは分かっているけど、なかなか続かない」「そもそも何から始めればいいか分からない」\nそんなふうに感じたことはありませんか？\n\nこの記事では、これから家計管理を始めたい方に向けて、シンプルで続けやすい方法をご紹介します。\n特別なアプリや知識は不要。まずは“ざっくりとした把握”からスタートしてみましょう。\n\nStep 1｜目的を決める\n家計管理を始めるとき、まず意識したいのは「なぜ管理したいのか？」という目的です。\n\n毎月の支出を把握したい\n\n無駄遣いを減らしたい\n\n貯金を増やしたい\n\n将来に向けて安心したい\n\n目的が明確になると、続けるモチベーションにもなりますし、どこに力を入れるべきかも見えてきます。\n\nStep 2｜固定費と変動費を分けてみる\n家計簿を細かくつけるのが苦手な方は、まず**「固定費」と「変動費」に分けてざっくり把握すること**をおすすめします。\n\n項目\t内容例\n固定費\t家賃、通信費、保険、サブスクなど\n変動費\t食費、日用品、交際費、趣味、交通費など\n\nこの2つを分けて考えるだけでも、「どこを見直せば良いか」が分かるようになります。\n\nStep 3｜収支をざっくり把握する\nはじめは月単位で、ざっくり収支を把握するだけでOKです。\n最初から完璧を目指さず、「お金の流れを見ること」をゴールにしましょう。\n\nたとえばこんな感じです：\n\ntxt\nコピーする\n編集する\n収入：手取り25万円  \n固定費：12万円  \n変動費：10万円  \n残額：3万円（うち1万円を貯金）\n「なんとなく見えてきたな」と思えたら、それだけでも立派な第一歩です。\n\nStep 4｜記録の習慣をつくる\n記録をつける方法は、あなたに合ったもので構いません。\n\n紙のノート\n\nスプレッドシート\n\n家計簿アプリ（Zaim, マネーフォワードなど）\n\nおすすめは、1週間に1回だけ、ざっと振り返るスタイル。\n毎日記録できなくても、週末にざっくりチェックすれば十分です。\n\nStep 5｜理想のバランスに近づけていく\n慣れてきたら、収支のバランスを少しずつ整えていきましょう。\n\nよく言われる目安は以下のような比率です：\n\n生活費：60〜70%\n\n貯金・投資：20%\n\n自由費（趣味・娯楽）：10〜20%\n\nもちろん理想は人それぞれです。自分にとって「無理なく続けられるバランス」を探していくことが大切です。\n\nまとめ｜“完璧”より“継続”\n家計管理において一番大切なのは、「完璧にやること」ではなく「続けること」です。\n\n毎日つけられなくても、うまくいかない月があっても大丈夫。\n自分に合ったやり方を見つけて、家計を“見える化”する習慣を少しずつ身につけていきましょう。\n\nこの記事の一歩\n固定費・変動費に分けて、今月の支出をざっくり書き出してみましょう。	2025-08-07 21:22:34.49	t	\N	\N	{家計管理,節約,お金,初心者,ライフスタイル,貯蓄}	cmdv65bka0011yh5b3qj02v5b	2025-08-08 08:33:01.318
cme4zysrk000nyhyilojddolt	メモ	なぜそのポートフォリオを作ったのかの思いの部分\n悩みが解決できるタイミングであげる\nテストコード\n\nスクール卒業生の就職先一覧から探す\n\n企業選定\n自社開発　ー>思い　あっているところを見つける\n数社のみ　カルチャーフィットするところ\n２、３社　中小\n内面の部分\n軸の部分\nフリーランスになりたいっていうのは伝えないほうがいい\n\n好きなエンジニア\n	2025-08-10 01:20:37.657	t	\N	\N	{}	cmdv65bka0011yh5b3qj02v5b	2025-08-10 01:20:37.657
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "emailVerified", image, bio, role, password) FROM stdin;
cmdjvbb3k0008yht2tpe1h4xx	\N	crocodile0402@gmail.com	\N	\N		user	$2b$10$Od0WL2iGGpCsaBRUvuViZe3ximUYxMUoyq/qFBpd5roeif/H2ZOrm
cmdlcucpz0002yhjebdr5f85x	\N	aaa@aaa	\N	\N		user	$2b$10$J6N8ZiXcrQ0iFMr/09A46.p1HZM9Z1767kDL8YrcjErp.pV9mJOxa
cmdld7mo30003yhje3gg35hut	\N	qqq@qqq	\N	\N		user	$2b$10$w5aidr2U.zrY7CrdYgU.8uDg3B2Pc/XJSEl7CbkNqqGRSeOei59Vq
cmdsa4pxw000cyhba7unlzabo	\N	z@z	\N	\N		user	$2b$10$CLuzgoKgdC0Rqqo8BOe40OTA6M.EIy6KyMEJA2egal7z30xhqTPQe
cmdsc01yx0000yh5blv007e3n	\N	q@q	\N	\N		user	$2b$10$r8f92EYrAtysunY3it16eeSNOD7TzlyGloWBjYCjifhmUkCJhBR6W
cmdv65bka0011yh5b3qj02v5b	ユーザP	p@p	\N	\N	サンプルのプロフィールです。\n私はnext.jsを勉強しています。\n頑張っています。	user	$2b$10$pV2I5Tnp0Ju1M/WhUX7jxOcFKbieCQ.WR/HDA9VyUzpT1l/O7kudO
7e075cec-4204-41c9-8e95-5d3aebe04ce0	takimoto	mhc4pd8@gmail.com	\N	https://avatars.githubusercontent.com/u/215460756?v=4		Admin	\N
cmdljro9x000ayhjepxzxunud	ユーザA	a@a	\N	\N	プロフィールです。\naaaa	user	$2b$10$uwhkTC6HJLA3.zjSoE.6SOSoSpvfXM8UPyK5np5wz0IGuoO0SFdeO
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c780f209-6c72-4ccd-a4f8-2af2bab6ade4	254c2fe5cd3441494086ac92736ae3f34964704590b7c52f8adf75a1757f3e22	2025-07-26 09:37:33.123764+09	20250725000827_init	\N	\N	2025-07-26 09:37:33.104094+09	1
f8e7047b-6289-4b4e-a7b4-671e9fdfad6f	ecd5358cfa2121523b1aad608ee8eba15054c334f1b9cc356fb0d17e4fa2a146	2025-07-26 10:23:32.689611+09	20250726012332_add_default_role_bio	\N	\N	2025-07-26 10:23:32.688159+09	1
d00427bf-cce5-4ada-8113-dadca2f6947e	aa653f6fa662c585a55ccaf8aa8013cfffdf49b5b379f9f3c5ffc0f731fdad18	2025-07-26 13:28:21.947627+09	20250726042821_add_password_to_user	\N	\N	2025-07-26 13:28:21.946577+09	1
cb41e168-12a5-4675-bbea-57d48e413151	647095beccd5341b491ec39d9107bfa01530441d132464d7956c5c7d408e5841	2025-08-04 21:49:55.712195+09	20250804124955_add_article_model	\N	\N	2025-08-04 21:49:55.71093+09	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

