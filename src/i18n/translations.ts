export enum Language {
  EN = 'en',
  AR = 'ar'
}

// Add type for the translations
export type TranslationType = typeof translations[Language];

// Add type for donation messages
export type DonationMessage = TranslationType['donation']['messages'][number];

export const translations = {
  en: {
    tagline: {
      zip: "zip",
      lock: "lock", 
      share: "ship",
      done: "done"
    },
    dropzone: "Drag and drop files here, or click to select (max 100MB per file)",
    secretStash: {
      title: "Your Secret Stash 🤫",
      filesReady: "file ready for encryption",
      filesReady_plural: "files ready for encryption"
    },
    secretPassword: {
      title: "Secret Password 🔐",
      funnyPlaceholder: "Type your super secret code... 🤫",
      savedPassword: "Password"
    },
    buttons: {
      zipMore: "Zip More Files 🗂️",
      emailKey: "Share Files 🔗",
      startFresh: "Start Fresh 🧹",
      removeFile: "Remove file",
      hidePassword: "Hide password 🙈",
      showPassword: "Show password 🙉",
      magicPassword: "Show me magic ✨",
      packItUp: "Pack it up! Let's go",
      allDone: "All done! Files are ready",
      download: "Download Files 📥",
      helpThinkPassword: "Help me think of one ✨",
      send: 'Send',
      cancel: 'Cancel',
      downloadToDevice: "Download to Device",
      shareViaEmail: "Share via Email",
      shareViaWhatsApp: "Share via WhatsApp",
      copyFileLink: "Copy File Link"
    },
    missionAccomplished: {
      title: "Mission Accomplished!",
      message: "Your files are ready to share!",
      passwordReminder: {
        warning: "🔑 Save this password - it can't be recovered if lost",
        tips: [
          "Write it down (not on a sticky note on your screen 😅)",
          "Store it in your password manager 🔐",
          "Memorize it like your favorite song 🎵",
          "Just don't tell it to your cat 🐱"
        ]
      }
    },
    stats: {
      originalSize: "Original Size",
      saved: "Space Saved",
      processingTime: "Processing Time",
      newSize: "New Size"
    },
    donation: {
      support: "Saved you some time? Support me 👇",
      supportMessage: "Help keep ziplock free & secure for everyone! 🚀",
      messages: [
        "Feed a hungry dev 🥙",
        "Support my shawarma addiction 🌯",
        "Help me get that premium IDE theme ✨",
        "Keep my coffee cup full ☕",
        "More shawarma = more features 🚀",
        "Running on shawarma power! 🔋",
        "Will code for food 💻",
        "Buy me a late night coding snack 🌙"
      ]
    },
    security: "🛡️ Zero-knowledge encryption: your password never leaves your device. Files are encrypted in-browser using Web Crypto API, then stored on AWS S3 with server-side encryption. Auto-deleted after 24h. We can't access your files - only you have the key 🔒",
    credit: "Coded with ❤️ by Karim",
    fileList: {
      filesReady: "file ready for encryption",
      filesReady_plural: "files ready for encryption",
      removeFile: "Remove file",
      fileSize: "Size",
      loading: "Loading files...",
      clearAll: "Clear all",
      oneFile: "One file, coming right up! 🎯",
      fewFiles: "Nice little bundle we got here! 📦",
      manyFiles: "Now we're talking! 🚀",
      lotsOfFiles: "Woah, that's a lot of files! 🤯"
    },
    success: {
      fileAdded: "Files added successfully! ✨",
      copied: "Copied to clipboard! ✨",
      linkCopied: "Link copied! ✨",
      passwordCopied: "Password copied! ✨"
    },
    errors: {
      tooLarge: "File too large: ",
      generic: "Oops! Something went wrong with those files 😅"
    },
    processing: {
      compressing: "Compressing...",
      progress: "Progress"
    },
    validation: {
      passwordLength: "Please enter a password with at least 8 characters",
      encryptionFailed: "Error creating encrypted zip file",
      passwordTip: "It's a dangerous world out there! Add a password (8+ characters) to protect your files! 🔐",
      passwordTips: [
        "It's a dangerous world out there! 🌍",
        "Your files need a superhero password! 🦸‍♂️",
        "Hackers hate this one simple trick! 🛡️",
        "Quick, your files need a secret handshake! 🤝",
        "Time to create a fortress for your files! 🏰",
        "Your files are feeling a bit exposed... 😳",
        "Password = Digital Armor! 🛡️",
        "Keep those prying eyes away! 👀",
        "Your files deserve better than '12345'! 🎯",
        "Make it memorable, make it strong! 💪"
      ]
    },
    processingTime: {
      fast: "Faster than making instant noodles! ⚡️",
      medium: "Time for a quick stretch 🚀",
      slow: "Is this dial-up? 🐌"
    },
    fileSize: {
      tiny: "Tiny file 📄",
      small: "Small file 📄",
      medium: "Medium file 📦",
      big: "Big file 📦"
    },
    speed: {
      zoom: "Zoom! ⚡️",
      fast: "Fast! 🏃",
      done: "Done! 🐢"
    },
    compression: {
      superSquish: "Super Squish! 🚀",
      nice: "Nice! ✨",
      messages: [
        "Warming up the squeezer... 🔧",
        "Calculating optimal squish ratio... 📐",
        "Folding digital origami... 📄",
        "Teaching files to be compact... 📚",
        "Applying compression magic... ✨",
        "Making bytes smaller... 🔍",
        "Squeezing pixels together... 🎨",
        "Digital Marie Kondo in progress... 🧹",
        "Almost there! Final squish... 💫",
        "Polishing the results... ✨"
      ],
      funMessages: [
        "Compressing bytes with love ❤️",
        "Teaching files to be more compact 📚",
        "Making digital origami 🎯",
        "Squeezing pixels together 🎨",
        "Adding some magic dust ✨",
        "Folding space and time 🌌",
        "Converting to binary hugs 🤗",
        "Optimizing digital dreams 💫",
        "Sprinkling compression fairy dust 🧚‍♂️",
        "Making files more friendly 🤝",
        "Applying quantum squishing 🔮",
        "Digital Marie Kondo in progress 🧹"
      ],
      superTiny: "Tiny as a pixel! 🔍",
      notBad: "Looking good! ✨",
      superShrink: "smaller! Your files are on a diet! 🏃‍♂️",
      goodShrink: "smaller! Not bad at all! 💪",
      mildShrink: "smaller! Every byte counts! 🤏",
    },
    magicPassword: {
      messages: [
        "Poof! Password copied to your clipboard! 🎩✨",
        "Magic password in your clipboard! 🪄",
        "Too lazy to think? I got you! Copied! 😏",
        "Meow-velous password copied! 🐱",
        "💪 Strong password copied to clipboard!",
        "Better than 'password123' - It's in your clipboard! 😅",
        "Military-grade password, at your clipboard! 🎖️",
        "Your wish is granted! Password copied! 🧞‍♂️",
        "Hacker-proof password copied! ☕",
        "Quantum-secure password in your clipboard! 🤖"
      ],
      clipboardError: "Magic worked but clipboard failed! Password is shown above ✨"
    },
  },
  ar: {
    tagline: {
      zip: "اضغط",
      lock: "شفّر",
      share: "أرسل",
      done: "تم"
    },
    dropzone: "اسحب وأفلت الملفات هنا، أو انقر للاختيار (الحد الأقصى ١٠٠ MB لكل ملف)",
    secretStash: {
      title: "ملفاتك السرية 🤫",
      filesReady: "ملف جاهز للتشفير",
      filesReady_plural: "ملفات جاهزة للتشفير"
    },
    secretPassword: {
      title: "كلمة السر 🔐",
      funnyPlaceholder: "اكتب رمزك السري... 🤫",
      savedPassword: "كلمة السر"
    },
    buttons: {
      zipMore: "ضغط المزيد من الملفات 🗂️",
      emailKey: "مشاركة الملفات 🔗",
      startFresh: "البدء من جديد 🧹",
      removeFile: "حذف الملف",
      hidePassword: "إخفاء كلمة السر 🙈",
      showPassword: "إظهار كلمة السر 🙉",
      magicPassword: "أرني السحر ✨",
      packItUp: "هيا نبدأ!",
      allDone: "تم! الملفات جاهزة",
      download: "تحميل الملفات 📥",
      helpThinkPassword: "ساعدني في التفكير ✨",
      send: 'إرسال',
      cancel: 'إلغاء',
      downloadToDevice: "تحميل على الجهاز",
      shareViaEmail: "مشاركة عبر البريد",
      shareViaWhatsApp: "مشاركة عبر واتساب",
      copyFileLink: "نسخ رابط الملف"
    },
    missionAccomplished: {
      title: "تمت المهمة بنجاح!",
      message: "ملفاتك جاهزة للمشاركة!",
      passwordReminder: {
        warning: "🔑 احفظ كلمة السر - لا يمكن استعادتها إذا فقدت",
        tips: [
          "😅 اكتبها في مكان آمن (ليس على ورقة ملصقة على شاشتك)",
          "🔐 احفظها في برنامج إدارة كلمات المرور",
          "🎵 احفظها مثل أغنيتك المفضلة",
          "🐱 فقط لا تخبر قطتك بها"
        ]
      }
    },
    stats: {
      originalSize: "الحجم الأصلي",
      saved: "تم توفير",
      processingTime: "وقت المعالجة",
      newSize: "الحجم الجديد"
    },
    fileSize: {
      tiny: "ملف صغير جداً 📄",
      small: "ملف صغير 📄",
      medium: "ملف متوسط 📦",
      big: "ملف كبير 📦"
    },
    speed: {
      zoom: "سريع جداً! ⚡️",
      fast: "سريع! 🏃",
      done: "تم! 🐢"
    },
    compression: {
      superSquish: "ضغط ممتاز! 🚀",
      nice: "جيد! ✨",
      messages: [
        "🔧 ...تسخين آلة الضغط",
        "📐 ...حساب نسبة الضغط المثالية",
        "📄 ...طي الأوريجامي الرقمي",
        "📚 ...تعليم الملفات كيف تكون مدمجة",
        "✨ ...تطبيق سحر الضغط",
        "🔍 ...تصغير البايتات",
        "🎨 ...ضغط البكسلات معاً",
        "🧹 ...ماري كوندو الرقمية في العمل",
        "💫 ...!تقريباً هناك! الضغط النهائي",
        "✨ ...تلميع النتائج"
      ],
      funMessages: [
        "❤️ ضغط البايتات بكل حب",
        "📚 تعليم الملفات كيف تكون أصغر",
        "🎯 صنع أوريغامي رقمي",
        "🎨 دمج البكسلات معاً",
        "✨ إضافة بعض السحر",
        "🌌 طي الزمان والمكان",
        "🤗 تحويل إلى عناق رقمي",
        "💫 تحسين الأحلام الرقمية",
        "🧚‍♂️ رش غبار الضغط السحري",
        "🤝 جعل الملفات أكثر ودية",
        "🔮 تطبيق الضغط الكمي",
        "🧹 ماري كوندو الرقمية في العمل"
      ],
      superTiny: "!صغير كالذرة ��",
      notBad: "!يبدو جيداً ✨",
      superShrink: "!أصغر! ملفاتك في رجيم 🏃‍♂️",
      goodShrink: "!أصغر! ليس سيئاً 💪",
      mildShrink: "!أصغر! كل بايت يهم 🤏",
    },
    donation: {
      support: "وفرت عليك بعض الوقت؟ ادعمني 👇",
      supportMessage: "ساعدنا في إبقاء <bdi>ziplock</bdi> مجانياً وآمناً للجميع! 🚀",
      messages: [
        "ساعدني في شراء قهوة البرمجة ☕️",
        "ادعم إدماني على الشاورما 🌯",
        "حافظ على فنجان قهوتي ممتلئاً ✨",
        "شاورما أكثر = ميزات أكثر 🚀",
        "يعمل على طاقة الشاورما! 🔋",
        "أبرمج مقابل الطعام 💻",
        "اشترِ لي وجبة البرمجة الليلية 🌙"
      ]
    },
    security: "🛡️ تشفير بمعرفة صفرية: كلمة السر لا تغادر جهازك أبداً. يتم تشفير الملفات في المتصفح باستخدام <bdi>Web Crypto API</bdi>، ثم تخزينها في <bdi>AWS S3</bdi> مع تشفير إضافي. حذف تلقائي بعد ٢٤ ساعة. لا يمكننا الوصول لملفاتك - أنت فقط تملك المفتاح 🔒",
    credit: "بُرمج بحب ❤️ من كريم",
    fileList: {
      filesReady: "ملف جاهز للتشفير",
      filesReady_plural: "ملفات جاهزة للتشفير",
      removeFile: "حذف الملف",
      fileSize: "الحجم",
      loading: "جاري تحميل الملفات...",
      clearAll: "حذف الكل",
      oneFile: "ملف واحد، جاري التجهيز 🎯",
      fewFiles: "حزمة جميلة لدينا هنا 📦",
      manyFiles: "هذا ما نتحدث عنه 🚀",
      lotsOfFiles: "واو، هذه ملفات كثيرة 🤯"
    },
    success: {
      fileAdded: "تمت إضافة الملفات بنجاح! ✨",
      copied: "تم النسخ إلى الحافظة! ✨",
      linkCopied: "تم نسخ الرابط! ✨",
      passwordCopied: "تم نسخ كلمة المرور! ✨"
    },
    errors: {
      tooLarge: "حجم الملف كبير جداً: ",
      generic: "عذراً! حدث خطأ مع هذه الملفات 😅"
    },
    processing: {
      compressing: "جاري الضغط...",
      progress: "التقدم"
    },
    validation: {
      passwordLength: "الرجاء إدخال كلمة سر لا تقل عن 8 أحرف",
      encryptionFailed: "حدث خطأ أثناء تشفير الملف",
      passwordTip: "!إنه عالم خطير! أضف كلمة مرور (8+ أحرف) لحماية ملفاتك 🔐",
      passwordTips: [
        "!إنه عالم خطير هناك ",
        "!ملفاتك تحتاج إلى كلمة مرور خارقة 🦸‍♂️",
        "!المخترقون يكرهون هذه الحيلة البسيطة ️",
        "!بسرعة، ملفاتك تحتاج إلى مصافحة سرية 🤝",
        "!حان وقت إنشاء قلعة لملفاتك 🏰",
        "...ملفاتك تشعر بالانكشاف 😳",
        "!كلمة المرور = درع رقمي 🛡️",
        "!أبعد تلك العيون المتطفلة 👀",
        "'12345' ملفاتك تستحق أفضل من ",
        "!اجعلها قوية واجعلها لا تُنسى 💪"
      ]
    },
    processingTime: {
      fast: "!أسرع من تحضير الشاي ⚡️",
      medium: "وقت تمديد سريع 🚀",
      slow: "هل نحن في التسعينات؟ 🐌"
    },
    magicPassword: {
      messages: [
        "بوف! تم نسخ كلمة المرور إلى الحافظة! 🎩✨",
        "كلمة المرور السحرية في حافظتك! 🪄",
        "كسول للتفكير؟ لا تقلق! تم النسخ! 😏",
        "كلمة مرور قطية رائعة - تم نسخها! 🐱",
        "💪 تم نسخ كلمة مرور قوية!",
        "أفضل من 'password123' - في حافظتك! 😅",
        "كلمة مرور عسكرية، في حافظتك! 🎖️",
        "تمت أمنيتك! تم نسخ كلمة المرور! 🧞‍♂️",
        "تم نسخ كلمة مرور ضد الاختراق! ☕",
        "كلمة مرور كمية آمنة في حافظتك! 🤖"
      ],
      clipboardError: "نجح السحر لكن فشل النسخ! كلمة المرور معروضة أعلاه ✨"
    },
  }
} as const;

export const getValidationMessage = (code: string, size: number, lang: Language): string => {
  switch (code) {
    case 'file-too-large':
      return lang === 'ar' 
        ? `حجم الملف كبير جداً (${formatFileSize(size)})، الحد الأقصى المسموح به هو ١٠٠ MB`
        : `File is too large (${formatFileSize(size)}). Max size is 100MB`;
    default:
      return lang === 'ar'
        ? 'حدث خطأ غير متوقع'
        : 'An unexpected error occurred';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}; 