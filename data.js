// ============================================================
// data.js - Complete JLPT N5 Reading App Data
// Kenji's Tokyo School Days - All 10 Blocks
// ============================================================

const appData = {
  metadata: {
    title: "Kenji's Tokyo School Days",
    subtitle: "健二さんの東京の学校",
    level: "JLPT N5",
    totalBlocks: 10,
    totalKanji: 100,
    version: "2.0.0",
  },

  // ============================================================
  // GRAMMAR PATTERNS (from Japanese Sentence Structure cards)
  // ============================================================
  grammarPatterns: [
    {
      id: "g1",
      cardNumber: 1,
      title: "X は Y です / だ",
      shortTitle: "Identification",
      type: "identification",
      meaning: "X is Y",
      particles: ["は"],
      formula: "[X] は [Y] です / だ",
      polite: {
        affirmative: "[X] は [Y] です",
        past: "[X] は [Y] でした",
        negative: "[X] は [Y] じゃないです",
        pastNegative: "[X] は [Y] じゃなかったです",
      },
      plain: {
        affirmative: "[X] は [Y] だ",
        past: "[X] は [Y] だった",
        negative: "[X] は [Y] じゃない",
        pastNegative: "[X] は [Y] じゃなかった",
      },
      examples: [
        { japanese: "私（わたし）は学生（がくせい）です。", translation: "I am a student." },
        { japanese: "これは本（ほん）です。", translation: "This is a book." },
      ],
      tips: "です/だ attach to NOUNS and NA-ADJECTIVES only. For i-adjectives, NO だ (e.g., 美味しい, not 美味しいだ).",
      color: "#ff6b6b",
    },
    {
      id: "g2",
      cardNumber: 2,
      title: "X は Y を [V]ます / [V]る",
      shortTitle: "Transitive Action",
      type: "transitive_action",
      meaning: "X does [verb] to Y",
      particles: ["は", "を"],
      formula: "[X] は [Y] を [V]ます / [V]る",
      polite: {
        affirmative: "[X] は [Y] を [V]ます",
        past: "[X] は [Y] を [V]ました",
        negative: "[X] は [Y] を [V]ません",
        pastNegative: "[X] は [Y] を [V]ませんでした",
      },
      plain: {
        affirmative: "[X] は [Y] を [V]る",
        past: "[X] は [Y] を [V]た",
        negative: "[X] は [Y] を [V]ない",
        pastNegative: "[X] は [Y] を [V]なかった",
      },
      examples: [
        { japanese: "私（わたし）は本（ほん）を読（よ）みます。", translation: "I read a book." },
        { japanese: "彼（かれ）は日本語（にほんご）を勉強（べんきょう）します。", translation: "He studies Japanese." },
      ],
      tips: "を ONLY marks direct object of transitive verbs. Plain past: 買う→買った, 食べる→食べた, する→した, 来る→来た(きた).",
      color: "#4ecdc4",
    },
    {
      id: "g3",
      cardNumber: 3,
      title: "[場所] に [もの] が あります / います",
      shortTitle: "Existence",
      type: "existence",
      meaning: "Y exists at X / There is Y at X",
      particles: ["に", "が"],
      formula: "[場所] に [もの] が あります / います",
      polite: {
        affirmative: "[場所] に [もの] があります / います",
        past: "[場所] に [もの] がありました / いました",
        negative: "[場所] に [もの] がありません / いません",
        pastNegative: "[場所] に [もの] がありませんでした / いませんでした",
      },
      plain: {
        affirmative: "[場所] に [もの] がある / いる",
        past: "[場所] に [もの] があった / いた",
        negative: "[場所] に [もの] がない / いない",
        pastNegative: "[場所] に [もの] がなかった / いなかった",
      },
      examples: [
        { japanese: "机（つくえ）の上（うえ）に本（ほん）があります。", translation: "There is a book on the desk." },
        { japanese: "公園（こうえん）に子（こ）どもがいます。", translation: "There is a child in the park." },
      ],
      tips: "ある = inanimate (books, chairs), いる = animate (people, animals). Word order can flip: [もの] が [場所] に あります (emphasizes the thing).",
      color: "#45b7d1",
    },
    {
      id: "g4",
      cardNumber: 4,
      title: "X は Y が 好きです / だ",
      shortTitle: "Liking",
      type: "liking",
      meaning: "X likes Y",
      particles: ["は", "が"],
      formula: "[X] は [Y] が 好きです / だ",
      polite: {
        affirmative: "[X] は [Y] が 好きです",
        past: "[X] は [Y] が 好きでした",
        negative: "[X] は [Y] が 好きじゃないです",
        pastNegative: "[X] は [Y] が 好きじゃなかったです",
      },
      plain: {
        affirmative: "[X] は [Y] が 好きだ",
        past: "[X] は [Y] が 好きだった",
        negative: "[X] は [Y] が 好きじゃない",
        pastNegative: "[X] は [Y] が 好きじゃなかった",
      },
      examples: [
        { japanese: "私（わたし）は寿司（すし）が好（す）きです。", translation: "I like sushi." },
        { japanese: "彼（かれ）は猫（ねこ）が好（す）きです。", translation: "He likes cats." },
      ],
      tips: "好き is a NA-ADJECTIVE, not a verb. Dislike = 嫌い (きらい). 'Really like' = 大好き (だいすき). Other emotion words with が: 怖い (scared), 嬉しい (happy).",
      color: "#f9ca24",
    },
    {
      id: "g5",
      cardNumber: 5,
      title: "X は Y が できます / できる",
      shortTitle: "Ability",
      type: "ability",
      meaning: "X can do Y / X is able to do Y",
      particles: ["は", "が"],
      formula: "[X] は [Y] が できます / できる",
      polite: {
        affirmative: "[X] は [Y] が できます",
        past: "[X] は [Y] が できました",
        negative: "[X] は [Y] が できません",
        pastNegative: "[X] は [Y] が できませんでした",
      },
      plain: {
        affirmative: "[X] は [Y] が できる",
        past: "[X] は [Y] が できた",
        negative: "[X] は [Y] が できない",
        pastNegative: "[X] は [Y] が できなかった",
      },
      examples: [
        { japanese: "私（わたし）は日本語（にほんご）ができます。", translation: "I can speak Japanese." },
        { japanese: "彼（かれ）は料理（りょうり）ができます。", translation: "He can cook." },
      ],
      tips: "できる is GROUP 3 (irregular) verb (する → できる). Also used for 'it's possible': 明日はできますか？ Alternative: verb potential form (e.g., 読める = can read) — but ができる is simpler.",
      color: "#6ab04c",
    },
    {
      id: "g6",
      cardNumber: 6,
      title: "[場所] へ / に 行きます / 来ます",
      shortTitle: "Movement",
      type: "movement",
      meaning: "Go to X / Come to X",
      particles: ["へ", "に"],
      formula: "[場所] へ / に 行きます / 来ます",
      polite: {
        affirmative: "[場所] へ / に 行きます / 来ます",
        past: "[場所] へ / に 行きました / 来ました",
        negative: "[場所] へ / に 行きません / 来ません",
        pastNegative: "[場所] へ / に 行きませんでした / 来ませんでした",
      },
      plain: {
        affirmative: "[場所] へ / に 行く / 来る",
        past: "[場所] へ / に 行った / 来た",
        negative: "[場所] へ / に 行かない / 来ない",
        pastNegative: "[場所] へ / に 行かなかった / 来なかった",
      },
      examples: [
        { japanese: "学校（がっこう）へ行（い）きます。", translation: "I go to school." },
        { japanese: "日本（にほん）に来（き）ました。", translation: "I came to Japan." },
      ],
      tips: "へ emphasizes DIRECTION; に emphasizes DESTINATION. In casual speech, へ is often pronounced 'え'. 'Come back' = 帰る (かえる). Time + に: 8時に 行きます.",
      color: "#eb4d4b",
    },
    {
      id: "g7",
      cardNumber: 7,
      title: "[場所/手段] で [動作] を します / する",
      shortTitle: "Location / Means",
      type: "location_means",
      meaning: "Do Y at X / Do Y by means of X",
      particles: ["で", "を"],
      formula: "[X] で [Y] を します / する",
      polite: {
        affirmative: "[X] で [Y] を します",
        past: "[X] で [Y] を しました",
        negative: "[X] で [Y] を しません",
        pastNegative: "[X] で [Y] を しませんでした",
      },
      plain: {
        affirmative: "[X] で [Y] を する",
        past: "[X] で [Y] を した",
        negative: "[X] で [Y] を しない",
        pastNegative: "[X] で [Y] を しなかった",
      },
      examples: [
        { japanese: "公園（こうえん）で本（ほん）を読（よ）みます。", translation: "I read a book at the park." },
        { japanese: "バスで学校（がっこう）へ行（い）きます。", translation: "I go to school by bus." },
      ],
      tips: "で is NOT for existence (that's に). Means/tools: ペンで書く = write with a pen. Language: 日本語で話す = speak in Japanese.",
      color: "#f0932b",
    },
    {
      id: "g8",
      cardNumber: 8,
      title: "[Giver] は [Receiver] に [Thing] を あげます / あげる",
      shortTitle: "Giving",
      type: "giving",
      meaning: "Give Z to Y",
      particles: ["は", "に", "を"],
      formula: "[Giver] は [Receiver] に [Thing] を あげます / あげる",
      polite: {
        affirmative: "[Giver] は [Receiver] に [Thing] を あげます",
        past: "[Giver] は [Receiver] に [Thing] を あげました",
        negative: "[Giver] は [Receiver] に [Thing] を あげません",
        pastNegative: "[Giver] は [Receiver] に [Thing] を あげませんでした",
      },
      plain: {
        affirmative: "[Giver] は [Receiver] に [Thing] を あげる",
        past: "[Giver] は [Receiver] に [Thing] を あげた",
        negative: "[Giver] は [Receiver] に [Thing] を あげない",
        pastNegative: "[Giver] は [Receiver] に [Thing] を あげなかった",
      },
      examples: [
        { japanese: "私（わたし）は友達（ともだち）に本（ほん）をあげます。", translation: "I give a book to my friend." },
        { japanese: "彼女（かのじょ）にプレゼントをあげました。", translation: "I gave a present to her." },
      ],
      tips: "あげる = giving OUTWARD (from speaker to others). くれる = giving INWARD (someone gives TO speaker): 友達が本をくれました = My friend gave me a book. もらう = receiving: 友達に本をもらいました = I received a book from my friend.",
      color: "#7ed6df",
    },
    {
      id: "g9",
      cardNumber: 9,
      title: "X は Y が 欲しいです / だ",
      shortTitle: "Wanting (Things)",
      type: "wanting",
      meaning: "X wants Y",
      particles: ["は", "が"],
      formula: "[X] は [Y] が 欲しいです / だ",
      polite: {
        affirmative: "[X] は [Y] が 欲しいです",
        past: "[X] は [Y] が 欲しかったです",
        negative: "[X] は [Y] が 欲しくないです",
        pastNegative: "[X] は [Y] が 欲しくなかったです",
      },
      plain: {
        affirmative: "[X] は [Y] が 欲しい",
        past: "[X] は [Y] が 欲しかった",
        negative: "[X] は [Y] が 欲しくない",
        pastNegative: "[X] は [Y] が 欲しくなかった",
      },
      examples: [
        { japanese: "私（わたし）はコーヒーが欲（ほ）しいです。", translation: "I want coffee." },
        { japanese: "新（あたら）しい車（くるま）が欲（ほ）しいです。", translation: "I want a new car." },
      ],
      tips: "欲しい is an I-ADJECTIVE (conjugates like 高い). ONLY for NOUNS (things you want to HAVE). For wanting to DO something: use 〜たい (e.g., 行きたい = want to go). Don't say 欲しいです for actions — that's a common mistake!",
      color: "#badc58",
    },
    {
      id: "g10",
      cardNumber: 10,
      title: "[Statement] + か",
      shortTitle: "Question",
      type: "question",
      meaning: "Question?",
      particles: ["か"],
      formula: "[Statement] + か",
      polite: {
        affirmative: "[Statement] ですか",
        past: "[Statement] でしたか",
        negative: "[Statement] じゃないですか",
        pastNegative: "[Statement] じゃなかったですか",
      },
      plain: {
        affirmative: "[Statement] か",
        past: "[Statement] だったか",
        negative: "[Statement] じゃないか",
        pastNegative: "[Statement] じゃなかったか",
      },
      examples: [
        { japanese: "学生（がくせい）ですか？", translation: "Are you a student?" },
        { japanese: "もう食（た）べたか？", translation: "Did you already eat?" },
      ],
      tips: "No question mark needed (but often used in casual text). In speech, rising intonation does the job too. WH-questions: どこですか？ = Where is it? 何を食べますか？ = What will you eat? Casual: か is sometimes dropped (もう 食べた？).",
      color: "#dff9fb",
    },
  ],

  // ============================================================
  // STORY BLOCKS - All 10 Blocks with corrected furigana
  // ============================================================
  blocks: [
    // ==========================================================
    // BLOCK 1: The 65-Year-Old Student
    // ==========================================================
    {
      id: 1,
      title: "The 65-Year-Old Student",
      titleJapanese: "65歳の学生",
      kanjiList: ["一", "二", "三", "人", "名", "男", "女", "子", "友", "古"],
      grammarFocus: ["g1", "g2", "g3"],

      story: {
        fullJapanese: "一人の男の子が古い学校を見ています。彼の名前は健二です。六十五歳ですが、心はまだ子どものようです。学校には、二人の女の人の友達がいました。健二さんは、三人と一緒に日本語を勉強します。",
        fullFurigana: "ひとりのおとこのこがふるいがっこうをみています。かれのなまえはけんじです。ろくじゅうごさいですが、こころはまだこどものようです。がっこうには、ふたりのおんなのひとのともだちがいました。けんじさんは、さんにんといっしょににほんごをべんきょうします。",
        fullTranslation: "One boy is looking at an old school. His name is Kenji. He is 65 years old, but his heart is still like a child's. At the school, there were two female friends. The three of them study Japanese together.",

        sentences: [
          {
            japanese: "一人の男の子が古い学校を見ています。",
            japaneseWithFurigana: "一人（ひとり）の男（おとこ）の子（こ）が古（ふる）い学校（がっこう）を見（み）ています。",
            translation: "One boy is looking at an old school.",
            patternIds: ["g2", "g3"],
          },
          {
            japanese: "彼の名前は健二です。",
            japaneseWithFurigana: "彼（かれ）の名前（なまえ）は健二（けんじ）です。",
            translation: "His name is Kenji.",
            patternIds: ["g1"],
          },
          {
            japanese: "六十五歳ですが、心はまだ子どものようです。",
            japaneseWithFurigana: "六十五（ろくじゅうご）歳（さい）ですが、心（こころ）はまだ子（こ）どものようです。",
            translation: "He is 65 years old, but his heart is still like a child's.",
            patternIds: ["g1"],
          },
          {
            japanese: "学校には、二人の女の人の友達がいました。",
            japaneseWithFurigana: "学校（がっこう）には、二人（ふたり）の女（おんな）の人（ひと）の友達（ともだち）がいました。",
            translation: "At the school, there were two female friends.",
            patternIds: ["g3"],
          },
          {
            japanese: "健二さんは、三人と一緒に日本語を勉強します。",
            japaneseWithFurigana: "健二（けんじ）さんは、三人（さんにん）と一緒（いっしょ）に日本語（にほんご）を勉強（べんきょう）します。",
            translation: "The three of them study Japanese together.",
            patternIds: ["g2"],
          },
        ],
      },

      questions: [
        {
          id: "q1",
          question: "健二（けんじ）さんは何（なん）歳（さい）ですか。",
          translation: "How old is Kenji?",
          correct: "六十五（ろくじゅうご）歳（さい）です。",
          correctTranslation: "He is 65 years old.",
          distractors: [
            "六十（ろくじゅう）歳（さい）です。",
            "七十（ななじゅう）歳（さい）です。",
          ],
          distractorsTranslation: [
            "He is 60 years old.",
            "He is 70 years old.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Look for the number in the story.",
        },
        {
          id: "q2",
          question: "学校（がっこう）には、何（なん）人（にん）いましたか。",
          translation: "How many people were at the school?",
          correct: "二人（ふたり）でした。",
          correctTranslation: "There were two people.",
          distractors: [
            "三人（さんにん）でした。",
            "一人（ひとり）でした。",
          ],
          distractorsTranslation: [
            "There were three people.",
            "There was one person.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Count the friends mentioned.",
        },
        {
          id: "q3",
          question: "健二（けんじ）さんは、誰（だれ）と日本語（にほんご）を勉強（べんきょう）しますか。",
          translation: "Who does Kenji study Japanese with?",
          correct: "三人（さんにん）と一緒（いっしょ）に勉強（べんきょう）します。",
          correctTranslation: "He studies together with three people (the two friends).",
          distractors: [
            "二人（ふたり）と勉強（べんきょう）します。",
            "一人（ひとり）と勉強（べんきょう）します。",
          ],
          distractorsTranslation: [
            "He studies with two people.",
            "He studies with one person.",
          ],
          patternIds: ["g2", "g10"],
          hint: "Check who joins Kenji in the last sentence.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Identification pattern used to state who or what something is.",
          examples: ["彼（かれ）の名前（なまえ）は健二（けんじ）です。"],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Transitive action pattern used when someone does an action to something.",
          examples: [
            "一人（ひとり）の男（おとこ）の子（こ）が古（ふる）い学校（がっこう）を見（み）ています。",
            "健二（けんじ）さんは日本語（にほんご）を勉強（べんきょう）します。"
          ],
        },
        {
          patternId: "g3",
          title: "[場所] に [もの] が あります / います",
          explanation: "Existence pattern used to describe where things are located.",
          examples: ["学校（がっこう）には、二人（ふたり）の女（おんな）の人（ひと）の友達（ともだち）がいました。"],
        },
      ],
    },

    // ==========================================================
    // BLOCK 2: The Daily Morning Walk
    // ==========================================================
    {
      id: 2,
      title: "The Daily Morning Walk",
      titleJapanese: "毎朝の散歩",
      kanjiList: ["日", "月", "火", "水", "木", "金", "土", "山", "川", "田"],
      grammarFocus: ["g2", "g3", "g6", "g7"],

      story: {
        fullJapanese: "ある日の朝、健二さんは公園へ歩きました。公園の近くに、小さな山ときれいな川がありました。木の下で、水をたくさん飲みました。月曜日から金曜日まで学校があります。火曜日と水曜日は、土の上を走ります。彼は遠くの田舎を思い出しました。",
        fullFurigana: "あるひのあさ、けんじさんはこうえんへあるきました。こうえんのちかくに、ちいさなやまと きれいなかわがありました。きのしたで、みずをたくさんのみました。げつようびからきんようびまでがっこうがあります。かようびとすいようびは、つちのうえをはしります。かれはとおくのいなかをおもいだしました。",
        fullTranslation: "One morning, Kenji walked to the park. Near the park, there was a small mountain and a beautiful river. Under a tree, he drank a lot of water. There is school from Monday to Friday. On Tuesdays and Wednesdays, he runs on the dirt path. He remembered the distant countryside.",

        sentences: [
          {
            japanese: "ある日の朝、健二さんは公園へ歩きました。",
            japaneseWithFurigana: "ある日（ひ）の朝（あさ）、健二（けんじ）さんは公園（こうえん）へ歩（ある）きました。",
            translation: "One morning, Kenji walked to the park.",
            patternIds: ["g6"],
          },
          {
            japanese: "公園の近くに、小さな山ときれいな川がありました。",
            japaneseWithFurigana: "公園（こうえん）の近（ちか）くに、小（ちい）さな山（やま）ときれいな川（かわ）がありました。",
            translation: "Near the park, there was a small mountain and a beautiful river.",
            patternIds: ["g3"],
          },
          {
            japanese: "木の下で、水をたくさん飲みました。",
            japaneseWithFurigana: "木（き）の下（した）で、水（みず）をたくさん飲（の）みました。",
            translation: "Under a tree, he drank a lot of water.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "月曜日から金曜日まで学校があります。",
            japaneseWithFurigana: "月曜日（げつようび）から金曜日（きんようび）まで学校（がっこう）があります。",
            translation: "There is school from Monday to Friday.",
            patternIds: ["g3"],
          },
          {
            japanese: "火曜日と水曜日は、土の上を走ります。",
            japaneseWithFurigana: "火曜日（かようび）と水曜日（すいようび）は、土（つち）の上（うえ）を走（はし）ります。",
            translation: "On Tuesdays and Wednesdays, he runs on the dirt path.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "彼は遠くの田舎を思い出しました。",
            japaneseWithFurigana: "彼（かれ）は遠（とお）くの田舎（いなか）を思（おも）い出（だ）しました。",
            translation: "He remembered the distant countryside.",
            patternIds: ["g2"],
          },
        ],
      },

      questions: [
        {
          id: "q4",
          question: "健二（けんじ）さんは、何曜日（なんようび）から何曜日（なんようび）まで学校（がっこう）へ行（い）きますか。",
          translation: "From what day to what day of the week does Kenji go to school?",
          correct: "月曜日（げつようび）から金曜日（きんようび）まで行（い）きます。",
          correctTranslation: "He goes from Monday to Friday.",
          distractors: [
            "月曜日（げつようび）から水曜日（すいようび）まで行（い）きます。",
            "火曜日（かようび）から金曜日（きんようび）まで行（い）きます。",
          ],
          distractorsTranslation: [
            "He goes from Monday to Wednesday.",
            "He goes from Tuesday to Friday.",
          ],
          patternIds: ["g3", "g6", "g10"],
          hint: "Look for the days mentioned.",
        },
        {
          id: "q5",
          question: "健二（けんじ）さんは、何（なに）を飲（の）みましたか。",
          translation: "What did Kenji drink?",
          correct: "水（みず）を飲（の）みました。",
          correctTranslation: "He drank water.",
          distractors: [
            "コーヒーを飲（の）みました。",
            "お茶（ちゃ）を飲（の）みました。",
          ],
          distractorsTranslation: [
            "He drank coffee.",
            "He drank tea.",
          ],
          patternIds: ["g2", "g10"],
          hint: "Check what he drank under the tree.",
        },
        {
          id: "q6",
          question: "公園（こうえん）の近（ちか）くに、何（なに）がありましたか。",
          translation: "What was near the park?",
          correct: "山（やま）と川（かわ）がありました。",
          correctTranslation: "There was a mountain and a river.",
          distractors: [
            "山（やま）だけがありました。",
            "川（かわ）だけがありました。",
          ],
          distractorsTranslation: [
            "There was only a mountain.",
            "There was only a river.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Look at what was near the park.",
        },
      ],

      grammar: [
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Transitive action pattern used when someone does an action to something.",
          examples: [
            "木（き）の下（した）で、水（みず）をたくさん飲（の）みました。",
            "彼（かれ）は遠（とお）くの田舎（いなか）を思（おも）い出（だ）しました。"
          ],
        },
        {
          patternId: "g3",
          title: "[場所] に [もの] が あります / います",
          explanation: "Existence pattern used to describe where things are located.",
          examples: ["公園（こうえん）の近（ちか）くに、小（ちい）さな山（やま）ときれいな川（かわ）がありました。"],
        },
        {
          patternId: "g6",
          title: "[場所] へ / に 行きます / 来ます",
          explanation: "Movement pattern used to indicate going or coming to a place.",
          examples: ["ある日（ひ）の朝（あさ）、健二（けんじ）さんは公園（こうえん）へ歩（ある）きました。"],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used to indicate where an action takes place or the means used.",
          examples: ["木（き）の下（した）で、水（みず）をたくさん飲（の）みました。"],
        },
      ],
    },

    // ==========================================================
    // BLOCK 3: Navigating the Classroom
    // ==========================================================
    {
      id: 3,
      title: "Navigating the Classroom",
      titleJapanese: "教室の中",
      kanjiList: ["上", "下", "左", "右", "前", "後", "中", "外", "北", "南"],
      grammarFocus: ["g3", "g6", "g7"],

      story: {
        fullJapanese: "学校の中に入ってください。教室の前に黒板があります。黒板の左に時計があり、右にドアがあります。机の上に本があり、机の下に鞄があります。授業の後で、健二さんは外に出ました。東京の北から南までビルがたくさん見えます。",
        fullFurigana: "がっこうのなかにはいってください。きょうしつのまえにこくばんがあります。こくばんのひだりにとけいがあり、みぎにドアがあります。つくえのうえにほんがあり、つくえのしたにかばんがあります。じゅぎょうのあとで、けんじさんはそとにでました。とうきょうのきたからみなみまでビルがたくさんみえます。",
        fullTranslation: "Please go inside the school. In front of the classroom, there is a blackboard. To the left of the blackboard is a clock, and to the right is a door. On the desk is a book, and under the desk is a bag. After class, Kenji went outside. From north to south in Tokyo, many buildings can be seen.",

        sentences: [
          {
            japanese: "学校の中に入ってください。",
            japaneseWithFurigana: "学校（がっこう）の中（なか）に入（はい）ってください。",
            translation: "Please go inside the school.",
            patternIds: ["g7"],
          },
          {
            japanese: "教室の前に黒板があります。",
            japaneseWithFurigana: "教室（きょうしつ）の前（まえ）に黒板（こくばん）があります。",
            translation: "In front of the classroom, there is a blackboard.",
            patternIds: ["g3"],
          },
          {
            japanese: "黒板の左に時計があり、右にドアがあります。",
            japaneseWithFurigana: "黒板（こくばん）の左（ひだり）に時計（とけい）があり、右（みぎ）にドアがあります。",
            translation: "To the left of the blackboard is a clock, and to the right is a door.",
            patternIds: ["g3"],
          },
          {
            japanese: "机の上に本があり、机の下に鞄があります。",
            japaneseWithFurigana: "机（つくえ）の上（うえ）に本（ほん）があり、机（つくえ）の下（した）に鞄（かばん）があります。",
            translation: "On the desk is a book, and under the desk is a bag.",
            patternIds: ["g3"],
          },
          {
            japanese: "授業の後で、健二さんは外に出ました。",
            japaneseWithFurigana: "授業（じゅぎょう）の後（あと）で、健二（けんじ）さんは外（そと）に出（で）ました。",
            translation: "After class, Kenji went outside.",
            patternIds: ["g6", "g7"],
          },
          {
            japanese: "東京の北から南までビルがたくさん見えます。",
            japaneseWithFurigana: "東京（とうきょう）の北（きた）から南（みなみ）までビルがたくさん見（み）えます。",
            translation: "From north to south in Tokyo, many buildings can be seen.",
            patternIds: ["g3"],
          },
        ],
      },

      questions: [
        {
          id: "q7",
          question: "教室（きょうしつ）の左（ひだり）に何（なに）がありますか。",
          translation: "What is to the left of the classroom?",
          correct: "時計（とけい）があります。",
          correctTranslation: "There is a clock.",
          distractors: [
            "黒板（こくばん）があります。",
            "ドアがあります。",
          ],
          distractorsTranslation: [
            "There is a blackboard.",
            "There is a door.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Look for what's on the left side.",
        },
        {
          id: "q8",
          question: "机（つくえ）の下（した）に何（なに）がありますか。",
          translation: "What is under the desk?",
          correct: "鞄（かばん）があります。",
          correctTranslation: "There is a bag.",
          distractors: [
            "本（ほん）があります。",
            "ペンがあります。",
          ],
          distractorsTranslation: [
            "There is a book.",
            "There is a pen.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Check what's under the desk.",
        },
        {
          id: "q9",
          question: "健二（けんじ）さんは、授業（じゅぎょう）の後（あと）でどこに出（で）ましたか。",
          translation: "Where did Kenji go after class?",
          correct: "外（そと）に出（で）ました。",
          correctTranslation: "He went outside.",
          distractors: [
            "教室（きょうしつ）に出（で）ました。",
            "家（いえ）に出（で）ました。",
          ],
          distractorsTranslation: [
            "He went to the classroom.",
            "He went home.",
          ],
          patternIds: ["g6", "g10"],
          hint: "Look where he went after class.",
        },
      ],

      grammar: [
        {
          patternId: "g3",
          title: "[場所] に [もの] が あります / います",
          explanation: "Existence pattern used to describe where things are located.",
          examples: [
            "教室（きょうしつ）の前（まえ）に黒板（こくばん）があります。",
            "机（つくえ）の上（うえ）に本（ほん）があり、机（つくえ）の下（した）に鞄（かばん）があります。"
          ],
        },
        {
          patternId: "g6",
          title: "[場所] へ / に 行きます / 来ます",
          explanation: "Movement pattern used to indicate going or coming to a place.",
          examples: ["授業（じゅぎょう）の後（あと）で、健二（けんじ）さんは外（そと）に出（で）ました。"],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used to indicate where an action takes place.",
          examples: ["学校（がっこう）の中（なか）に入（はい）ってください。"],
        },
      ],
    },

    // ==========================================================
    // BLOCK 4: Finding a New Apartment
    // ==========================================================
    {
      id: 4,
      title: "Finding a New Apartment",
      titleJapanese: "新しいアパートを探す",
      kanjiList: ["東", "西", "大", "小", "長", "高", "新", "白", "赤", "青"],
      grammarFocus: ["g1", "g2", "g3", "g7"],

      story: {
        fullJapanese: "健二さんは、新しいアパートを探しています。アパートは大きいですが、部屋は小さいです。東の窓から青い空が見えます。西の壁には、長い白い棚があります。家賃はあまり高くないです。机の上に赤いペンを置きました。",
        fullFurigana: "けんじさんは、あたらしいアパートをさがしています。アパートはおおきいですが、へやはちいさいです。ひがしのまどからあおいそらがみえます。にしのかべには、ながいしろいたながあります。やちんはあまりたかくないです。つくえのうえにあかいペンをおきました。",
        fullTranslation: "Kenji is looking for a new apartment. The apartment building is large, but the room is small. From the east window, the blue sky can be seen. On the west wall, there is a long white shelf. The rent is not very expensive. He placed a red pen on the desk.",

        sentences: [
          {
            japanese: "健二さんは、新しいアパートを探しています。",
            japaneseWithFurigana: "健二（けんじ）さんは、新（あたら）しいアパートを探（さが）しています。",
            translation: "Kenji is looking for a new apartment.",
            patternIds: ["g2"],
          },
          {
            japanese: "アパートは大きいですが、部屋は小さいです。",
            japaneseWithFurigana: "アパートは大（おお）きいですが、部屋（へや）は小（ちい）さいです。",
            translation: "The apartment building is large, but the room is small.",
            patternIds: ["g1"],
          },
          {
            japanese: "東の窓から青い空が見えます。",
            japaneseWithFurigana: "東（ひがし）の窓（まど）から青（あお）い空（そら）が見（み）えます。",
            translation: "From the east window, the blue sky can be seen.",
            patternIds: ["g3"],
          },
          {
            japanese: "西の壁には、長い白い棚があります。",
            japaneseWithFurigana: "西（にし）の壁（かべ）には、長（なが）い白（しろ）い棚（たな）があります。",
            translation: "On the west wall, there is a long white shelf.",
            patternIds: ["g3"],
          },
          {
            japanese: "家賃はあまり高くないです。",
            japaneseWithFurigana: "家賃（やちん）はあまり高（たか）くないです。",
            translation: "The rent is not very expensive.",
            patternIds: ["g1"],
          },
          {
            japanese: "机の上に赤いペンを置きました。",
            japaneseWithFurigana: "机（つくえ）の上（うえ）に赤（あか）いペンを置（お）きました。",
            translation: "He placed a red pen on the desk.",
            patternIds: ["g2", "g7"],
          },
        ],
      },

      questions: [
        {
          id: "q10",
          question: "アパートの部屋（へや）は大（おお）きいですか。",
          translation: "Is the apartment room large?",
          correct: "いいえ、部屋（へや）は小（ちい）さいです。",
          correctTranslation: "No, the room is small.",
          distractors: [
            "はい、部屋（へや）は大（おお）きいです。",
            "いいえ、部屋（へや）は高（たか）くないです。",
          ],
          distractorsTranslation: [
            "Yes, the room is large.",
            "No, the room is not expensive.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Look for the size description of the room.",
        },
        {
          id: "q11",
          question: "西（にし）の壁（かべ）に何（なに）がありますか。",
          translation: "What is on the west wall?",
          correct: "長（なが）い白（しろ）い棚（たな）があります。",
          correctTranslation: "There is a long white shelf.",
          distractors: [
            "短（みじか）い黒（くろ）い棚（たな）があります。",
            "長（なが）い青（あお）い棚（たな）があります。",
          ],
          distractorsTranslation: [
            "There is a short black shelf.",
            "There is a long blue shelf.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Check what's on the west wall.",
        },
        {
          id: "q12",
          question: "健二（けんじ）さんは、何（なに）を机（つくえ）の上（うえ）に置（お）きましたか。",
          translation: "What did Kenji place on the desk?",
          correct: "赤（あか）いペンを置（お）きました。",
          correctTranslation: "He placed a red pen.",
          distractors: [
            "青（あお）いペンを置（お）きました。",
            "本（ほん）を置（お）きました。",
          ],
          distractorsTranslation: [
            "He placed a blue pen.",
            "He placed a book.",
          ],
          patternIds: ["g2", "g10"],
          hint: "Look at what he placed on the desk.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Used to describe characteristics and states.",
          examples: [
            "アパートは大（おお）きいですが、部屋（へや）は小（ちい）さいです。",
            "家賃（やちん）はあまり高（たか）くないです。"
          ],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Transitive action pattern used when someone does an action to something.",
          examples: [
            "健二（けんじ）さんは新（あたら）しいアパートを探（さが）しています。",
            "机（つくえ）の上（うえ）に赤（あか）いペンを置（お）きました。"
          ],
        },
        {
          patternId: "g3",
          title: "[場所] に [もの] が あります / います",
          explanation: "Existence pattern used to describe where things are located.",
          examples: [
            "東（ひがし）の窓（まど）から青（あお）い空（そら）が見（み）えます。",
            "西（にし）の壁（かべ）には、長（なが）い白（しろ）い棚（たな）があります。"
          ],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used to indicate where an action takes place or the means used.",
          examples: ["机（つくえ）の上（うえ）に赤（あか）いペンを置（お）きました。"],
        },
      ],
    },

    // ==========================================================
    // BLOCK 5: The Language Lessons Begin
    // ==========================================================
    {
      id: 5,
      title: "The Language Lessons Begin",
      titleJapanese: "日本語の授業が始まる",
      kanjiList: ["学", "校", "先", "生", "本", "語", "文", "字", "何", "万"],
      grammarFocus: ["g1", "g2", "g9", "g10"],

      story: {
        fullJapanese: "ここは有名な日本語の学校です。先生はとても親切です。先生がこの文の意味は何ですかと聞きました。健二さんは本を開いて、漢字の単語を読みました。一万個の単語を覚えたいです！",
        fullFurigana: "ここはゆうめいなにほんごのがっこうです。せんせいはとてもしんせつです。せんせいがこのぶんのいみはなんですかとききました。けんじさんはほんをひらいて、かんじのたんごをよみました。いちまんこのたんごをおぼえたいです！",
        fullTranslation: "This is a famous Japanese language school. The teacher is very kind. The teacher asked, 'What is the meaning of this sentence?' Kenji opened the book and read the Kanji vocabulary words. 'I want to memorize ten thousand words!'",

        sentences: [
          {
            japanese: "ここは有名な日本語の学校です。",
            japaneseWithFurigana: "ここは有名（ゆうめい）な日本語（にほんご）の学校（がっこう）です。",
            translation: "This is a famous Japanese language school.",
            patternIds: ["g1"],
          },
          {
            japanese: "先生はとても親切です。",
            japaneseWithFurigana: "先生（せんせい）はとても親切（しんせつ）です。",
            translation: "The teacher is very kind.",
            patternIds: ["g1"],
          },
          {
            japanese: "先生がこの文の意味は何ですかと聞きました。",
            japaneseWithFurigana: "先生（せんせい）が「この文（ぶん）の意味（いみ）は何（なん）ですか」と聞（き）きました。",
            translation: 'The teacher asked, "What is the meaning of this sentence?"',
            patternIds: ["g1", "g10"],
          },
          {
            japanese: "健二さんは本を開いて、漢字の単語を読みました。",
            japaneseWithFurigana: "健二（けんじ）さんは本（ほん）を開（ひら）いて、漢字（かんじ）の単語（たんご）を読（よ）みました。",
            translation: "Kenji opened the book and read the Kanji vocabulary words.",
            patternIds: ["g2"],
          },
          {
            japanese: "一万個の単語を覚えたいです！",
            japaneseWithFurigana: "一万（いちまん）個（こ）の単語（たんご）を覚（おぼ）えたいです！",
            translation: '"I want to memorize ten thousand words!"',
            patternIds: ["g2", "g9"],
          },
        ],
      },

      questions: [
        {
          id: "q13",
          question: "健二（けんじ）さんは漢字（かんじ）の単語（たんご）を何（なん）個（こ）覚（おぼ）えたいですか。",
          translation: "How many Kanji vocabulary words does Kenji want to memorize?",
          correct: "一万（いちまん）個（こ）覚（おぼ）えたいです。",
          correctTranslation: "He wants to memorize ten thousand words.",
          distractors: [
            "一千（いっせん）個（こ）覚（おぼ）えたいです。",
            "十万（じゅうまん）個（こ）覚（おぼ）えたいです。",
          ],
          distractorsTranslation: [
            "He wants to memorize 1,000 words.",
            "He wants to memorize 100,000 words.",
          ],
          patternIds: ["g2", "g9", "g10"],
          hint: "Look for the number in the last sentence.",
        },
        {
          id: "q14",
          question: "この学校（がっこう）の先生（せんせい）は、どんな人（ひと）ですか。",
          translation: "What kind of person is the teacher at this school?",
          correct: "とても親切（しんせつ）な人（ひと）です。",
          correctTranslation: "She is a very kind person.",
          distractors: [
            "とても厳（きび）しい人（ひと）です。",
            "とても面白（おもしろ）い人（ひと）です。",
          ],
          distractorsTranslation: [
            "She is a very strict person.",
            "She is a very funny person.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Look at how the teacher is described.",
        },
        {
          id: "q15",
          question: "先生（せんせい）は何（なん）と聞（き）きましたか。",
          translation: "What did the teacher ask?",
          correct: "「この文（ぶん）の意味（いみ）は何（なん）ですか」と聞（き）きました。",
          correctTranslation: 'She asked, "What is the meaning of this sentence?"',
          distractors: [
            "「日本語（にほんご）は難（むずか）しいですか」と聞（き）きました。",
            "「漢字（かんじ）は書（か）けますか」と聞（き）きました。",
          ],
          distractorsTranslation: [
            'She asked, "Is Japanese difficult?"',
            'She asked, "Can you write Kanji?"',
          ],
          patternIds: ["g10"],
          hint: "Find the direct quote from the teacher.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Used to identify and describe people and things.",
          examples: [
            "ここは有名（ゆうめい）な日本語（にほんご）の学校（がっこう）です。",
            "先生（せんせい）はとても親切（しんせつ）です。"
          ],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Transitive action pattern used when someone does an action to something.",
          examples: ["健二（けんじ）さんは本（ほん）を開（ひら）いて、漢字（かんじ）の単語（たんご）を読（よ）みました。"],
        },
        {
          patternId: "g9",
          title: "X は Y が 欲しいです / だ",
          explanation: "Used to express wanting things.",
          examples: ["一万（いちまん）個（こ）の単語（たんご）を覚（おぼ）えたいです！"],
        },
        {
          patternId: "g10",
          title: "[Statement] + か",
          explanation: "Used to form questions.",
          examples: ["「この文（ぶん）の意味（いみ）は何（なん）ですか」と聞（き）きました。"],
        },
      ],
    },

    // ==========================================================
    // BLOCK 6: Studying Hard in Class
    // ==========================================================
    {
      id: 6,
      title: "Studying Hard in Class",
      titleJapanese: "授業で一生懸命勉強する",
      kanjiList: ["見", "聞", "書", "読", "話", "行", "来", "出", "入", "食"],
      grammarFocus: ["g2", "g6", "g7"],

      story: {
        fullJapanese: "健二さんは毎日学校へ行きます。朝九時に教室に入ります。先生の話をよく聞きます。ノートに漢字をたくさん書きます。教科書を読みながら、新しい言葉を見ます。明日も学校へ来てくださいね。昼休みになりました。外に出ましょう。みんなで美味しいご飯を食べます。友達と日本語で話します。",
        fullFurigana: "けんじさんはまいにちがっこうへいきます。あさくじにきょうしつにはいります。せんせいのはなしをよくききます。ノートにかんじをたくさんかきます。きょうかしょをよみながら、あたらしいことばをみます。あしたもがっこうへきてくださいね。ひるやすみになりました。そとにでましょう。みんなでおいしいごはんをたべます。ともだちとにほんごではなします。",
        fullTranslation: "Kenji goes to school every day. He enters the classroom at 9 AM. He listens carefully to the teacher. He writes a lot of Kanji in his notebook. While reading the textbook, he looks for new words. 'Please come to school tomorrow too.' It is now lunch break. Let's go outside. Everyone eats delicious food together. He talks with his friends in Japanese.",

        sentences: [
          {
            japanese: "健二さんは毎日学校へ行きます。",
            japaneseWithFurigana: "健二（けんじ）さんは毎日（まいにち）学校（がっこう）へ行（い）きます。",
            translation: "Kenji goes to school every day.",
            patternIds: ["g6"],
          },
          {
            japanese: "朝九時に教室に入ります。",
            japaneseWithFurigana: "朝（あさ）九時（くじ）に教室（きょうしつ）に入（はい）ります。",
            translation: "He enters the classroom at 9 AM.",
            patternIds: ["g6"],
          },
          {
            japanese: "先生の話をよく聞きます。",
            japaneseWithFurigana: "先生（せんせい）の話（はなし）をよく聞（き）きます。",
            translation: "He listens carefully to the teacher.",
            patternIds: ["g2"],
          },
          {
            japanese: "ノートに漢字をたくさん書きます。",
            japaneseWithFurigana: "ノートに漢字（かんじ）をたくさん書（か）きます。",
            translation: "He writes a lot of Kanji in his notebook.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "教科書を読みながら、新しい言葉を見ます。",
            japaneseWithFurigana: "教科書（きょうかしょ）を読（よ）みながら、新（あたら）しい言葉（ことば）を見（み）ます。",
            translation: "While reading the textbook, he looks for new words.",
            patternIds: ["g2"],
          },
          {
            japanese: "明日も学校へ来てくださいね。",
            japaneseWithFurigana: "明日（あした）も学校（がっこう）へ来（き）てくださいね。",
            translation: '"Please come to school tomorrow too."',
            patternIds: ["g6"],
          },
          {
            japanese: "昼休みになりました。",
            japaneseWithFurigana: "昼休（ひるやす）みになりました。",
            translation: "It is now lunch break.",
            patternIds: [],
          },
          {
            japanese: "外に出ましょう。",
            japaneseWithFurigana: "外（そと）に出（で）ましょう。",
            translation: "Let's go outside.",
            patternIds: ["g6"],
          },
          {
            japanese: "みんなで美味しいご飯を食べます。",
            japaneseWithFurigana: "みんなで美味（おい）しいご飯（はん）を食（た）べます。",
            translation: "Everyone eats delicious food together.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "友達と日本語で話します。",
            japaneseWithFurigana: "友達（ともだち）と日本語（にほんご）で話（はな）します。",
            translation: "He talks with his friends in Japanese.",
            patternIds: ["g2", "g7"],
          },
        ],
      },

      questions: [
        {
          id: "q16",
          question: "健二（けんじ）さんは何時（なんじ）に教室（きょうしつ）に入（はい）りますか。",
          translation: "What time does Kenji enter the classroom?",
          correct: "朝（あさ）九時（くじ）に入（はい）ります。",
          correctTranslation: "He enters at 9 AM.",
          distractors: [
            "朝（あさ）八時（はちじ）に入（はい）ります。",
            "朝（あさ）十時（じゅうじ）に入（はい）ります。",
          ],
          distractorsTranslation: [
            "He enters at 8 AM.",
            "He enters at 10 AM.",
          ],
          patternIds: ["g6", "g10"],
          hint: "Check the time mentioned for entering the classroom.",
        },
        {
          id: "q17",
          question: "健二（けんじ）さんは、何（なに）を食（た）べますか。",
          translation: "What does Kenji eat?",
          correct: "美味（おい）しいご飯（はん）を食（た）べます。",
          correctTranslation: "He eats delicious food.",
          distractors: [
            "美味（おい）しいパンを食（た）べます。",
            "美味（おい）しい果物（くだもの）を食（た）べます。",
          ],
          distractorsTranslation: [
            "He eats delicious bread.",
            "He eats delicious fruit.",
          ],
          patternIds: ["g2", "g10"],
          hint: "Look for what everyone eats.",
        },
        {
          id: "q18",
          question: "健二（けんじ）さんは、誰（だれ）と日本語（にほんご）で話（はな）しますか。",
          translation: "Who does Kenji talk to in Japanese?",
          correct: "友達（ともだち）と話（はな）します。",
          correctTranslation: "He talks with friends.",
          distractors: [
            "先生（せんせい）と話（はな）します。",
            "家族（かぞく）と話（はな）します。",
          ],
          distractorsTranslation: [
            "He talks with the teacher.",
            "He talks with family.",
          ],
          patternIds: ["g2", "g7", "g10"],
          hint: "Look at who he talks with at the end.",
        },
      ],

      grammar: [
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Used for transitive actions.",
          examples: [
            "先生（せんせい）の話（はなし）をよく聞（き）きます。",
            "ノートに漢字（かんじ）をたくさん書（か）きます。",
            "みんなで美味（おい）しいご飯（はん）を食（た）べます。"
          ],
        },
        {
          patternId: "g6",
          title: "[場所] へ / に 行きます / 来ます",
          explanation: "Used for movement to places.",
          examples: [
            "健二（けんじ）さんは毎日（まいにち）学校（がっこう）へ行（い）きます。",
            "朝（あさ）九時（くじ）に教室（きょうしつ）に入（はい）ります。"
          ],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used for location of actions.",
          examples: [
            "ノートに漢字（かんじ）をたくさん書（か）きます。",
            "友達（ともだち）と日本語（にほんご）で話（はな）します。"
          ],
        },
      ],
    },

    // ==========================================================
    // BLOCK 7: Buying Coffee and Counting Change
    // ==========================================================
    {
      id: 7,
      title: "Buying Coffee and Counting Change",
      titleJapanese: "コーヒーを買ってお釣りを数える",
      kanjiList: ["飲", "買", "千", "百", "円", "分", "時", "間", "年", "午"],
      grammarFocus: ["g1", "g2", "g6", "g7"],

      story: {
        fullJapanese: "午前の授業は三時間でした。午後一時十五分に店へ行きました。喫茶店でコーヒーを買いました。温かいコーヒーを飲みます。コーヒーは四百円でした。千円札で払いました。健二さんは今年、六十五歳です。",
        fullFurigana: "ごぜんのじゅぎょうはさんじかんでした。ごごいちじじゅうごふんにみせへいきました。きっさてんでコーヒーをかいました。あたたかいコーヒーをのみます。コーヒーはよんひゃくえんでした。せんえんさつではらいました。けんじさんはことし、ろくじゅうごさいです。",
        fullTranslation: "The morning class was three hours long. At 1:15 PM, he went to a shop. He bought coffee at a cafe. He drinks the warm coffee. The coffee was 400 yen. He paid with a 1,000 yen note. Kenji is 65 years old this year.",

        sentences: [
          {
            japanese: "午前の授業は三時間でした。",
            japaneseWithFurigana: "午前（ごぜん）の授業（じゅぎょう）は三時間（さんじかん）でした。",
            translation: "The morning class was three hours long.",
            patternIds: ["g1"],
          },
          {
            japanese: "午後一時十五分に店へ行きました。",
            japaneseWithFurigana: "午後（ごご）一時（いちじ）十五分（じゅうごふん）に店（みせ）へ行（い）きました。",
            translation: "At 1:15 PM, he went to a shop.",
            patternIds: ["g6"],
          },
          {
            japanese: "喫茶店でコーヒーを買いました。",
            japaneseWithFurigana: "喫茶店（きっさてん）でコーヒーを買（か）いました。",
            translation: "He bought coffee at a cafe.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "温かいコーヒーを飲みます。",
            japaneseWithFurigana: "温（あたた）かいコーヒーを飲（の）みます。",
            translation: "He drinks the warm coffee.",
            patternIds: ["g2"],
          },
          {
            japanese: "コーヒーは四百円でした。",
            japaneseWithFurigana: "コーヒーは四百円（よんひゃくえん）でした。",
            translation: "The coffee was 400 yen.",
            patternIds: ["g1"],
          },
          {
            japanese: "千円札で払いました。",
            japaneseWithFurigana: "千円（せんえん）札（さつ）で払（はら）いました。",
            translation: "He paid with a 1,000 yen note.",
            patternIds: ["g7"],
          },
          {
            japanese: "健二さんは今年、六十五歳です。",
            japaneseWithFurigana: "健二（けんじ）さんは今年（ことし）、六十五（ろくじゅうご）歳（さい）です。",
            translation: "Kenji is 65 years old this year.",
            patternIds: ["g1"],
          },
        ],
      },

      questions: [
        {
          id: "q19",
          question: "コーヒーは何円（なんえん）でしたか。",
          translation: "How much was the coffee?",
          correct: "四百円（よんひゃくえん）でした。",
          correctTranslation: "It was 400 yen.",
          distractors: [
            "五百円（ごひゃくえん）でした。",
            "三百円（さんびゃくえん）でした。",
          ],
          distractorsTranslation: [
            "It was 500 yen.",
            "It was 300 yen.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Find the price of the coffee.",
        },
        {
          id: "q20",
          question: "健二（けんじ）さんは、何（なに）で払（はら）いましたか。",
          translation: "How did Kenji pay?",
          correct: "千円（せんえん）札（さつ）で払（はら）いました。",
          correctTranslation: "He paid with a 1,000 yen note.",
          distractors: [
            "五百円（ごひゃくえん）札（さつ）で払（はら）いました。",
            "二千円（にせんえん）札（さつ）で払（はら）いました。",
          ],
          distractorsTranslation: [
            "He paid with a 500 yen note.",
            "He paid with a 2,000 yen note.",
          ],
          patternIds: ["g7", "g10"],
          hint: "Look at what he used to pay.",
        },
        {
          id: "q21",
          question: "午前（ごぜん）の授業（じゅぎょう）は何時間（なんじかん）でしたか。",
          translation: "How long was the morning class?",
          correct: "三時間（さんじかん）でした。",
          correctTranslation: "It was three hours.",
          distractors: [
            "二時間（にじかん）でした。",
            "四時間（よじかん）でした。",
          ],
          distractorsTranslation: [
            "It was two hours.",
            "It was four hours.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Check the duration of the morning class.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Used to describe states and identification.",
          examples: [
            "午前（ごぜん）の授業（じゅぎょう）は三時間（さんじかん）でした。",
            "コーヒーは四百円（よんひゃくえん）でした。"
          ],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Used for actions involving objects.",
          examples: [
            "喫茶店（きっさてん）でコーヒーを買（か）いました。",
            "温（あたた）かいコーヒーを飲（の）みます。"
          ],
        },
        {
          patternId: "g6",
          title: "[場所] へ / に 行きます / 来ます",
          explanation: "Used for movement to places.",
          examples: ["午後（ごご）一時（いちじ）十五分（じゅうごふん）に店（みせ）へ行（い）きました。"],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used to indicate means or location.",
          examples: [
            "喫茶店（きっさてん）でコーヒーを買（か）いました。",
            "千円（せんえん）札（さつ）で払（はら）いました。"
          ],
        },
      ],
    },

    // ==========================================================
    // BLOCK 8: Calling the Family Back Home
    // ==========================================================
    {
      id: 8,
      title: "Calling the Family Back Home",
      titleJapanese: "家族に電話する",
      kanjiList: ["父", "母", "兄", "姉", "弟", "妹", "家", "車", "駅", "電"],
      grammarFocus: ["g1", "g2", "g3", "g6", "g8"],

      story: {
        fullJapanese: "健二さんの家はアメリカにあります。アパートから駅まで歩きます。駅の近くには車がたくさん走っています。健二さんは電話を持っています。アメリカの父と母に電話をしました。兄と姉も元気です。弟と妹は健二さんを応援しています。",
        fullFurigana: "けんじさんのいえはアメリカにあります。アパートからえきまであるきます。えきのちかくにはくるまがたくさんはしっています。けんじさんはでんわをもっています。アメリカのちちとははにでんわをしました。あにとあねもげんきです。おとうとといもうとはけんじさんをおうえんしています。",
        fullTranslation: "Kenji's house is in America. He walks from the apartment to the station. Many cars are driving near the station. Kenji has a telephone. He called his father and mother in America. His older brother and sister are also doing well. His younger brother and sister are cheering him on.",

        sentences: [
          {
            japanese: "健二さんの家はアメリカにあります。",
            japaneseWithFurigana: "健二（けんじ）さんの家（いえ）はアメリカにあります。",
            translation: "Kenji's house is in America.",
            patternIds: ["g3"],
          },
          {
            japanese: "アパートから駅まで歩きます。",
            japaneseWithFurigana: "アパートから駅（えき）まで歩（ある）きます。",
            translation: "He walks from the apartment to the station.",
            patternIds: ["g6"],
          },
          {
            japanese: "駅の近くには車がたくさん走っています。",
            japaneseWithFurigana: "駅（えき）の近（ちか）くには車（くるま）がたくさん走（はし）っています。",
            translation: "Many cars are driving near the station.",
            patternIds: ["g3"],
          },
          {
            japanese: "健二さんは電話を持っています。",
            japaneseWithFurigana: "健二（けんじ）さんは電話（でんわ）を持（も）っています。",
            translation: "Kenji has a telephone.",
            patternIds: ["g2"],
          },
          {
            japanese: "アメリカの父と母に電話をしました。",
            japaneseWithFurigana: "アメリカの父（ちち）と母（はは）に電話（でんわ）をしました。",
            translation: "He called his father and mother in America.",
            patternIds: ["g2", "g8"],
          },
          {
            japanese: "兄と姉も元気です。",
            japaneseWithFurigana: "兄（あに）と姉（あね）も元気（げんき）です。",
            translation: "His older brother and sister are also doing well.",
            patternIds: ["g1"],
          },
          {
            japanese: "弟と妹は健二さんを応援しています。",
            japaneseWithFurigana: "弟（おとうと）と妹（いもうと）は健二（けんじ）さんを応援（おうえん）しています。",
            translation: "His younger brother and sister are cheering him on.",
            patternIds: ["g2"],
          },
        ],
      },

      questions: [
        {
          id: "q22",
          question: "健二（けんじ）さんの家（いえ）はどこにありますか。",
          translation: "Where is Kenji's house?",
          correct: "アメリカにあります。",
          correctTranslation: "It is in America.",
          distractors: [
            "日本（にほん）にあります。",
            "カナダにあります。",
          ],
          distractorsTranslation: [
            "It is in Japan.",
            "It is in Canada.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Find the location of Kenji's house.",
        },
        {
          id: "q23",
          question: "健二（けんじ）さんは、誰（だれ）に電話（でんわ）をしましたか。",
          translation: "Who did Kenji call?",
          correct: "父（ちち）と母（はは）に電話（でんわ）をしました。",
          correctTranslation: "He called his father and mother.",
          distractors: [
            "兄（あに）と姉（あね）に電話（でんわ）をしました。",
            "弟（おとうと）と妹（いもうと）に電話（でんわ）をしました。",
          ],
          distractorsTranslation: [
            "He called his older brother and sister.",
            "He called his younger brother and sister.",
          ],
          patternIds: ["g2", "g8", "g10"],
          hint: "Look at who he called on the phone.",
        },
        {
          id: "q24",
          question: "駅（えき）の近（ちか）くに何（なに）がありますか。",
          translation: "What is near the station?",
          correct: "車（くるま）がたくさんあります。",
          correctTranslation: "There are many cars.",
          distractors: [
            "バスがたくさんあります。",
            "自転車（じてんしゃ）がたくさんあります。",
          ],
          distractorsTranslation: [
            "There are many buses.",
            "There are many bicycles.",
          ],
          patternIds: ["g3", "g10"],
          hint: "Check what's running near the station.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Used to describe states and identification.",
          examples: ["兄（あに）と姉（あね）も元気（げんき）です。"],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Used for actions involving objects.",
          examples: [
            "健二（けんじ）さんは電話（でんわ）を持（も）っています。",
            "アメリカの父（ちち）と母（はは）に電話（でんわ）をしました。"
          ],
        },
        {
          patternId: "g3",
          title: "[場所] に [もの] が あります / います",
          explanation: "Used to describe existence and location.",
          examples: [
            "健二（けんじ）さんの家（いえ）はアメリカにあります。",
            "駅（えき）の近（ちか）くには車（くるま）がたくさん走（はし）っています。"
          ],
        },
        {
          patternId: "g6",
          title: "[場所] へ / に 行きます / 来ます",
          explanation: "Used for movement to places.",
          examples: ["アパートから駅（えき）まで歩（ある）きます。"],
        },
        {
          patternId: "g8",
          title: "[Giver] は [Receiver] に [Thing] を あげます / あげる",
          explanation: "Used for giving things.",
          examples: ["アメリカの父（ちち）と母（はは）に電話（でんわ）をしました。"],
        },
      ],
    },

    // ==========================================================
    // BLOCK 9: A Rainy Commute
    // ==========================================================
    {
      id: 9,
      title: "A Rainy Commute",
      titleJapanese: "雨の日の通勤",
      kanjiList: ["気", "天", "雨", "空", "魚", "犬", "物", "耳", "目", "口"],
      grammarFocus: ["g1", "g2", "g3", "g4", "g7"],

      story: {
        fullJapanese: "今日の天気はあまりよくないです。空が暗くなりました。そして、雨が降り出しました。駅の前で、可愛い犬を見ました。犬は大きな目と耳を動かしています。近くの魚屋さんで、新鮮な魚を買いました。健二さんは美味しい食べ物が大好きです。彼は口を開けて笑いました。",
        fullFurigana: "きょうのてんきはあまりよくないです。そらがくらくなりました。そして、あめがふりだしました。えきのまえで、かわいいいぬをみました。いぬはおおきなめとみみをうごかしています。ちかくのさかなやさんで、しんせんなさかなをかいました。けんじさんはおいしいたべものがだいすきです。かれはくちをあけてわらいました。",
        fullTranslation: "Today's weather is not very good. The sky became dark. Then, rain started to fall. In front of the station, he saw a cute dog. The dog is moving its big eyes and ears. He bought fresh fish at a nearby fish shop. Kenji loves delicious food. He opened his mouth and laughed.",

        sentences: [
          {
            japanese: "今日の天気はあまりよくないです。",
            japaneseWithFurigana: "今日（きょう）の天気（てんき）はあまりよくないです。",
            translation: "Today's weather is not very good.",
            patternIds: ["g1"],
          },
          {
            japanese: "空が暗くなりました。",
            japaneseWithFurigana: "空（そら）が暗（くら）くなりました。",
            translation: "The sky became dark.",
            patternIds: [],
          },
          {
            japanese: "そして、雨が降り出しました。",
            japaneseWithFurigana: "そして、雨（あめ）が降（ふ）り出（だ）しました。",
            translation: "Then, rain started to fall.",
            patternIds: [],
          },
          {
            japanese: "駅の前で、可愛い犬を見ました。",
            japaneseWithFurigana: "駅（えき）の前（まえ）で、可愛（かわい）い犬（いぬ）を見（み）ました。",
            translation: "In front of the station, he saw a cute dog.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "犬は大きな目と耳を動かしています。",
            japaneseWithFurigana: "犬（いぬ）は大（おお）きな目（め）と耳（みみ）を動（うご）かしています。",
            translation: "The dog is moving its big eyes and ears.",
            patternIds: ["g2"],
          },
          {
            japanese: "近くの魚屋さんで、新鮮な魚を買いました。",
            japaneseWithFurigana: "近（ちか）くの魚屋（さかなや）さんで、新鮮（しんせん）な魚（さかな）を買（か）いました。",
            translation: "He bought fresh fish at a nearby fish shop.",
            patternIds: ["g2", "g7"],
          },
          {
            japanese: "健二さんは美味しい食べ物が大好きです。",
            japaneseWithFurigana: "健二（けんじ）さんは美味（おい）しい食（た）べ物（もの）が大（だい）好（す）きです。",
            translation: "Kenji loves delicious food.",
            patternIds: ["g4"],
          },
          {
            japanese: "彼は口を開けて笑いました。",
            japaneseWithFurigana: "彼（かれ）は口（くち）を開（あ）けて笑（わら）いました。",
            translation: "He opened his mouth and laughed.",
            patternIds: ["g2"],
          },
        ],
      },

      questions: [
        {
          id: "q25",
          question: "健二（けんじ）さんは駅（えき）の前（まえ）で何（なに）を見（み）ましたか。",
          translation: "What did Kenji see in front of the station?",
          correct: "可愛（かわい）い犬（いぬ）を見（み）ました。",
          correctTranslation: "He saw a cute dog.",
          distractors: [
            "可愛（かわい）い猫（ねこ）を見（み）ました。",
            "大（おお）きな鳥（とり）を見（み）ました。",
          ],
          distractorsTranslation: [
            "He saw a cute cat.",
            "He saw a big bird.",
          ],
          patternIds: ["g2", "g7", "g10"],
          hint: "Look at what he saw in front of the station.",
        },
        {
          id: "q26",
          question: "今日（きょう）の天気（てんき）はどうですか。",
          translation: "How is today's weather?",
          correct: "あまりよくないです。",
          correctTranslation: "It's not very good.",
          distractors: [
            "とてもいいです。",
            "とても悪（わる）いです。",
          ],
          distractorsTranslation: [
            "It's very good.",
            "It's very bad.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Check the description of today's weather.",
        },
        {
          id: "q27",
          question: "健二（けんじ）さんは何（なに）が大（だい）好（す）きですか。",
          translation: "What does Kenji love?",
          correct: "美味（おい）しい食（た）べ物（もの）が大（だい）好（す）きです。",
          correctTranslation: "He loves delicious food.",
          distractors: [
            "甘（あま）い物（もの）が大（だい）好（す）きです。",
            "辛（から）い物（もの）が大（だい）好（す）きです。",
          ],
          distractorsTranslation: [
            "He loves sweet things.",
            "He loves spicy things.",
          ],
          patternIds: ["g4", "g10"],
          hint: "Look at what Kenji loves.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Used to describe states and conditions.",
          examples: ["今日（きょう）の天気（てんき）はあまりよくないです。"],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Transitive action pattern used when someone does an action to something.",
          examples: [
            "駅（えき）の前（まえ）で、可愛（かわい）い犬（いぬ）を見（み）ました。",
            "近（ちか）くの魚屋（さかなや）さんで、新鮮（しんせん）な魚（さかな）を買（か）いました。"
          ],
        },
        {
          patternId: "g4",
          title: "X は Y が 好きです / だ",
          explanation: "Used to express liking.",
          examples: ["健二（けんじ）さんは美味（おい）しい食（た）べ物（もの）が大（だい）好（す）きです。"],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used to indicate means or location.",
          examples: [
            "駅（えき）の前（まえ）で、可愛（かわい）い犬（いぬ）を見（み）ました。",
            "近（ちか）くの魚屋（さかなや）さんで、新鮮（しんせん）な魚（さかな）を買（か）いました。"
          ],
        },
      ],
    },

    // ==========================================================
    // BLOCK 10: After-School Socializing
    // ==========================================================
    {
      id: 10,
      title: "After-School Socializing",
      titleJapanese: "放課後の交流",
      kanjiList: ["手", "足", "社", "店", "道", "会", "少", "多", "半", "国"],
      grammarFocus: ["g1", "g2", "g3", "g6", "g7"],

      story: {
        fullJapanese: "学校の帰りに、広い道を歩きました。たくさん歩いたので、足が少し痛いです。手を洗ってから、店に入りました。そこには、多くの学生がいました。少し日本語で話しました。五時半に、クラスの友達に会いました。友達の会社の話を聞きました。いろんな国から来た人と話すのは楽しいです。健二さんの挑戦はこれからも続きます。",
        fullFurigana: "がっこうのかえりに、ひろいみちをあるきました。たくさんあるいたので、あしがすこしいたいです。てをあらってから、みせにはいりました。そこには、おおくのがくせいがいました。すこしにほんごではなしました。ごじはんに、クラスのともだちにあいました。ともだちのかいしゃのはなしをききました。いろんなくにからきたひととはなすのはたのしいです。けんじさんのちょうせんはこれからもつづきます。",
        fullTranslation: "On the way back from school, he walked along a wide road. Because he walked a lot, his feet hurt a little. After washing his hands, he entered a shop. There were many students inside. He spoke a little in Japanese. At 5:30, he met his classmates. He listened to a story about his friend's company. Talking with people from different countries is fun. Kenji's challenge will continue from now on.",

        sentences: [
          {
            japanese: "学校の帰りに、広い道を歩きました。",
            japaneseWithFurigana: "学校（がっこう）の帰（かえ）りに、広（ひろ）い道（みち）を歩（ある）きました。",
            translation: "On the way back from school, he walked along a wide road.",
            patternIds: ["g2"],
          },
          {
            japanese: "たくさん歩いたので、足が少し痛いです。",
            japaneseWithFurigana: "たくさん歩（ある）いたので、足（あし）が少（すこ）し痛（いた）いです。",
            translation: "Because he walked a lot, his feet hurt a little.",
            patternIds: ["g1"],
          },
          {
            japanese: "手を洗ってから、店に入りました。",
            japaneseWithFurigana: "手（て）を洗（あら）ってから、店（みせ）に入（はい）りました。",
            translation: "After washing his hands, he entered a shop.",
            patternIds: ["g2", "g6"],
          },
          {
            japanese: "そこには、多くの学生がいました。",
            japaneseWithFurigana: "そこには、多（おお）くの学生（がくせい）がいました。",
            translation: "There were many students inside.",
            patternIds: ["g3"],
          },
          {
            japanese: "少し日本語で話しました。",
            japaneseWithFurigana: "少（すこ）し日本語（にほんご）で話（はな）しました。",
            translation: "He spoke a little in Japanese.",
            patternIds: ["g7"],
          },
          {
            japanese: "五時半に、クラスの友達に会いました。",
            japaneseWithFurigana: "五時（ごじ）半（はん）に、クラスの友達（ともだち）に会（あ）いました。",
            translation: "At 5:30, he met his classmates.",
            patternIds: ["g6"],
          },
          {
            japanese: "友達の会社の話を聞きました。",
            japaneseWithFurigana: "友達（ともだち）の会（かい）社（しゃ）の話（はなし）を聞（き）きました。",
            translation: "He listened to a story about his friend's company.",
            patternIds: ["g2"],
          },
          {
            japanese: "いろんな国から来た人と話すのは楽しいです。",
            japaneseWithFurigana: "いろんな国（くに）から来（き）た人（ひと）と話（はな）すのは楽（たの）しいです。",
            translation: "Talking with people from different countries is fun.",
            patternIds: ["g1"],
          },
          {
            japanese: "健二さんの挑戦はこれからも続きます。",
            japaneseWithFurigana: "健二（けんじ）さんの挑戦（ちょうせん）はこれからも続（つづ）きます。",
            translation: "Kenji's challenge will continue from now on.",
            patternIds: ["g1"],
          },
        ],
      },

      questions: [
        {
          id: "q28",
          question: "何時（なんじ）半（はん）にクラスの友達（ともだち）に会（あ）いましたか。",
          translation: "At what time did he meet his classmates?",
          correct: "五時（ごじ）半（はん）に会（あ）いました。",
          correctTranslation: "He met them at 5:30.",
          distractors: [
            "四時（よじ）半（はん）に会（あ）いました。",
            "六時（ろくじ）半（はん）に会（あ）いました。",
          ],
          distractorsTranslation: [
            "He met them at 4:30.",
            "He met them at 6:30.",
          ],
          patternIds: ["g6", "g10"],
          hint: "Find the time mentioned for meeting friends.",
        },
        {
          id: "q29",
          question: "健二（けんじ）さんは、何（なに）で話（はな）しましたか。",
          translation: "What language did Kenji speak?",
          correct: "日本語（にほんご）で話（はな）しました。",
          correctTranslation: "He spoke in Japanese.",
          distractors: [
            "英語（えいご）で話（はな）しました。",
            "中国語（ちゅうごくご）で話（はな）しました。",
          ],
          distractorsTranslation: [
            "He spoke in English.",
            "He spoke in Chinese.",
          ],
          patternIds: ["g7", "g10"],
          hint: "Look at what language he used to speak.",
        },
        {
          id: "q30",
          question: "いろんな国（くに）から来（き）た人（ひと）と話（はな）すのは、どうですか。",
          translation: "How is talking with people from different countries?",
          correct: "楽（たの）しいです。",
          correctTranslation: "It is fun.",
          distractors: [
            "難（むずか）しいです。",
            "つまらないです。",
          ],
          distractorsTranslation: [
            "It is difficult.",
            "It is boring.",
          ],
          patternIds: ["g1", "g10"],
          hint: "Find how Kenji feels about talking with people from different countries.",
        },
      ],

      grammar: [
        {
          patternId: "g1",
          title: "X は Y です / だ",
          explanation: "Used to describe states and opinions.",
          examples: [
            "足（あし）が少（すこ）し痛（いた）いです。",
            "いろんな国（くに）から来（き）た人（ひと）と話（はな）すのは楽（たの）しいです。"
          ],
        },
        {
          patternId: "g2",
          title: "X は Y を [V]ます / [V]る",
          explanation: "Transitive action pattern used when someone does an action to something.",
          examples: [
            "学校（がっこう）の帰（かえ）りに、広（ひろ）い道（みち）を歩（ある）きました。",
            "友達（ともだち）の会（かい）社（しゃ）の話（はなし）を聞（き）きました。"
          ],
        },
        {
          patternId: "g3",
          title: "[場所] に [もの] が あります / います",
          explanation: "Used to describe existence and location.",
          examples: ["そこには、多（おお）くの学生（がくせい）がいました。"],
        },
        {
          patternId: "g6",
          title: "[場所] へ / に 行きます / 来ます",
          explanation: "Used for movement to places.",
          examples: ["五時（ごじ）半（はん）に、クラスの友達（ともだち）に会（あ）いました。"],
        },
        {
          patternId: "g7",
          title: "[場所/手段] で [動作] を します / する",
          explanation: "Used to indicate means or location.",
          examples: ["少（すこ）し日本語（にほんご）で話（はな）しました。"],
        },
      ],
    },
  ],
};

// ============================================================
// EXPORT
// ============================================================
if (typeof window !== "undefined") {
  window.appData = appData;
  console.log("✅ data.js loaded:", appData.blocks?.length || 0, "blocks");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = appData;
}