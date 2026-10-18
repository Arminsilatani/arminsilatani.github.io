/* :::::::::::::::::::::::::: IMPORTS :::::::::::::::::::::::::: */

import { notifyTelegram } from '/assets/src/core/telegram-notify.js';

/* :::::::::::::::::::::::::: INTERNATIONALIZATION :::::::::::::::::::::::::: */

const LANG = (document.documentElement.lang || 'fa').slice(0, 2).toLowerCase();

const I18N = {

    /* :::::::::::::::::::::::::: PERSIAN :::::::::::::::::::::::::: */

    fa: {
        locale: 'fa-IR',
        digits: '۰۱۲۳۴۵۶۷۸۹',
        monthlySuffix: ' / ماهانه',
        millionSuffix: 'میلیون تومان / ماهانه',
        currencyLabel: { IRR: 'تومان', USD: 'دلار', EUR: 'یورو', AED: 'درهم', TRY: 'لیر' },

        addonLabels: {
            keywords: 'خوشه‌های کلمات کلیدی',
            content: 'محتوای متنی',
            reporterageBase: 'رپورتاژ آگهی (پایه)',
            reporteragePremium: 'رپورتاژ آگهی (پریمیوم)',
            accelerator: 'شتاب دهنده سئو',
            acceleratorAdvanced: 'شتاب دهنده سئو پیشرفته'
        },
        unitLabels: { cluster: 'خوشه', item: 'عدد' },
        addonHint: 'هر {unit} اضافه: ',

        packageLabels: {
            BASIC: 'بسته پایه استاندارد',
            PRO: 'بسته حرفه‌ای استاندارد',
            ENTERPRISE: 'بسته پریمیوم استاندارد',
            ADV_BASIC: 'بسته پایه پیشرفته',
            ADV_PRO: 'بسته حرفه‌ای پیشرفته',
            ADV_ENTERPRISE: 'بسته پریمیوم پیشرفته'
        },

        componentLabels: {
            STD_BAS: {
                KEY: 'تحقیق کلمات کلیدی خوشه‌ای (2 خوشه)',
                CON: 'تولید 8 محتوای متنی',
                BKL: 'لینک سازی (استراتژی پایه)',
                RPR: 'انتشار 1 رپورتاژ آگهی پایه',
                TEC: 'تکنیکال سئو (بهینه سازی پایه)',
                REP: 'گزارش عملکرد پایه (ماهانه)',
                SUP: 'پشتیبانی تیکتی'
            },
            STD_PRO: {
                KEY: 'تحقیق کلمات کلیدی خوشه‌ای (5 خوشه)',
                CMP: 'تحلیل 3 رقیب',
                CON: 'تولید 15 محتوای متنی',
                BKL: 'لینک سازی (استراتژی حرفه‌ای)',
                RPR: 'انتشار 2 رپورتاژ آگهی پایه',
                TEC: 'تکنیکال سئو (بهینه سازی کامل)',
                REP: 'گزارش تحلیلی (ماهانه)',
                SUP: 'پشتیبانی تیکتی و چت'
            },
            STD_PRM: {
                KEY: 'تحقیق کلمات کلیدی خوشه‌ای (10 خوشه)',
                CMP: 'تحلیل 5 رقیب',
                CON: 'تولید 20 محتوای متنی',
                BKL: 'لینک سازی (استراتژی پیشرفته)',
                RPR: 'انتشار 4 رپورتاژ آگهی پایه',
                TEC: 'تکنیکال سئو (بهینه سازی پیشرفته)',
                REP: 'گزارش جامع و استراتژیک',
                SUP: 'پشتیبانی اولویت دار (تیکت + چت + تلفن)'
            },
            ADV_BAS: {
                KEY: 'تحقیق کلمات کلیدی خوشه‌ای (5 خوشه)',
                CMP: 'تحلیل 3 رقیب',
                CON: 'تولید 15 محتوای متنی',
                BKL: 'لینک سازی (استراتژی پریمیوم)',
                RPR: 'انتشار 1 رپورتاژ آگهی پریمیوم',
                TEC: 'تکنیکال سئو (بهینه سازی کامل)',
                REP: 'گزارش عملکرد پایه (هفتگی)',
                SUP: 'پشتیبانی اختصاصی'
            },
            ADV_PRO: {
                KEY: 'تحقیق کلمات کلیدی خوشه‌ای (10 خوشه)',
                CMP: 'تحلیل 5 رقیب',
                CON: 'تولید 25 محتوای متنی',
                BKL: 'لینک سازی (استراتژی پریمیوم پیشرفته)',
                RPR: 'انتشار 2 رپورتاژ آگهی پریمیوم',
                TEC: 'تکنیکال سئو (بهینه سازی پیشرفته)',
                REP: 'گزارش عملکرد (هفتگی + تحلیل عمیق)',
                SUP: 'پشتیبانی اختصاصی + مشاوره'
            },
            ADV_PRM: {
                KEY: 'تحقیق کلمات کلیدی خوشه‌ای (15 خوشه)',
                CMP: 'تحلیل 7 رقیب',
                CON: 'تولید 30 محتوای متنی',
                BKL: 'لینک سازی (استراتژی پریمیوم)',
                RPR: 'انتشار 4 رپورتاژ آگهی پریمیوم',
                TEC: 'تکنیکال سئو (بهینه سازی Enterprise)',
                REP: 'گزارش عملکرد (هفتگی + استراتژی + پیش بینی)',
                SUP: 'پشتیبانی اختصاصی + مشاور + تماس اضطراری'
            }
        },

        componentFallback: {
            KEY: 'تحقیق کلمات کلیدی',
            CMP: 'تحلیل رقبا',
            CON: 'تولید محتوا',
            BKL: 'لینک‌سازی',
            RPR: 'رپورتاژ آگهی',
            TEC: 'سئو تکنیکال',
            REP: 'گزارش‌دهی',
            SUP: 'پشتیبانی'
        },

        form: {
            required: 'لطفاً فیلدهای ستاره‌دار را کامل کنید.',
            invalidUrl: 'آدرس وب‌سایت معتبر نیست. مثال: https://example.com',
            invalidPhone: 'شماره تماس معتبر نیست.',
            internalError: 'خطای داخلی: سیستم ثبت درخواست در دسترس نیست.',
            sending: 'در حال ارسال…',
            success: 'درخواست شما با موفقیت ثبت شد. کارشناسان ما طی ۲۴ ساعت کاری با شما تماس می‌گیرند.',
            error: 'متأسفانه در ارسال خطایی رخ داد. لطفاً دوباره تلاش کنید یا با ۰۹۱۲۵۷۵۹۴۶۶ تماس بگیرید.'
        },

        capacity: {
            loading: 'در حال بررسی ظرفیت...',
            available: 'پذیرش پروژه‌های سئو',
            full: 'ظرفیت پروژه‌های سئو تا {date} تکمیل است',
            oneLeft: '۱ جای خالی برای پروژه سئو',
            nLeft: '{n} جای خالی برای پروژه سئو'
        }
    },

    /* :::::::::::::::::::::::::: ARABIC :::::::::::::::::::::::::: */

    ar: {
        locale: 'ar-EG',
        digits: '٠١٢٣٤٥٦٧٨٩',
        monthlySuffix: ' / شهريًا',
        millionSuffix: 'مليون تومان / شهريًا',
        currencyLabel: { IRR: 'ريال', USD: 'دولار', EUR: 'يورو', AED: 'درهم', TRY: 'ليرة' },

        addonLabels: {
            keywords: 'عناقيد الكلمات المفتاحية',
            content: 'محتوى نصي',
            reporterageBase: 'مقال إعلاني مدفوع (أساسي)',
            reporteragePremium: 'مقال إعلاني مدفوع (بريميوم)',
            accelerator: 'مُسرّع السيو',
            acceleratorAdvanced: 'مُسرّع السيو المتقدم'
        },
        unitLabels: { cluster: 'عنقود', item: 'قطعة' },
        addonHint: 'كل {unit} إضافي: ',

        packageLabels: {
            BASIC: 'الباقة الأساسية القياسية',
            PRO: 'الباقة الاحترافية القياسية',
            ENTERPRISE: 'باقة بريميوم القياسية',
            ADV_BASIC: 'الباقة الأساسية المتقدمة',
            ADV_PRO: 'الباقة الاحترافية المتقدمة',
            ADV_ENTERPRISE: 'باقة بريميوم المتقدمة'
        },

        componentLabels: {
            STD_BAS: {
                KEY: 'البحث عن الكلمات المفتاحية وتجميعها في عناقيد (عنقودان)',
                CON: 'إنتاج ٨ قطع محتوى نصية',
                BKL: 'بناء الروابط وفق استراتيجية أساسية',
                RPR: 'نشر مقال إعلاني مدفوع أساسي واحد',
                TEC: 'السيو التقني: تحسينات أساسية',
                REP: 'تقرير أداء أساسي شهري',
                SUP: 'دعم عبر التذاكر'
            },
            STD_PRO: {
                KEY: 'البحث عن الكلمات المفتاحية وتجميعها في عناقيد (٥ عناقيد)',
                CMP: 'تحليل ٣ منافسين',
                CON: 'إنتاج ١٥ قطعة محتوى نصية',
                BKL: 'بناء الروابط وفق استراتيجية احترافية',
                RPR: 'نشر مقالين إعلانيين مدفوعين أساسيين',
                TEC: 'السيو التقني: تحسين شامل',
                REP: 'تقرير تحليلي شهري',
                SUP: 'دعم عبر التذاكر والدردشة'
            },
            STD_PRM: {
                KEY: 'البحث عن الكلمات المفتاحية وتجميعها في عناقيد (١٠ عناقيد)',
                CMP: 'تحليل ٥ منافسين',
                CON: 'إنتاج ٢٠ قطعة محتوى نصية',
                BKL: 'بناء الروابط وفق استراتيجية متقدمة',
                RPR: 'نشر ٤ مقالات إعلانية مدفوعة أساسية',
                TEC: 'السيو التقني: تحسينات متقدمة',
                REP: 'تقرير شامل واستراتيجي',
                SUP: 'دعم ذو أولوية عبر التذاكر والدردشة والهاتف'
            },
            ADV_BAS: {
                KEY: 'البحث عن الكلمات المفتاحية وتجميعها في عناقيد (٥ عناقيد)',
                CMP: 'تحليل ٣ منافسين',
                CON: 'إنتاج ١٥ قطعة محتوى نصية',
                BKL: 'بناء الروابط وفق استراتيجية بريميوم',
                RPR: 'نشر مقال إعلاني مدفوع واحد من فئة بريميوم',
                TEC: 'السيو التقني: تحسين شامل',
                REP: 'تقرير أداء أساسي أسبوعي',
                SUP: 'دعم مخصص'
            },
            ADV_PRO: {
                KEY: 'البحث عن الكلمات المفتاحية وتجميعها في عناقيد (١٠ عناقيد)',
                CMP: 'تحليل ٥ منافسين',
                CON: 'إنتاج ٢٥ قطعة محتوى نصية',
                BKL: 'بناء الروابط وفق استراتيجية بريميوم متقدمة',
                RPR: 'نشر مقالين إعلانيين مدفوعين من فئة بريميوم',
                TEC: 'السيو التقني: تحسينات متقدمة',
                REP: 'تقرير أداء أسبوعي مع تحليل معمّق',
                SUP: 'دعم مخصص واستشارات'
            },
            ADV_PRM: {
                KEY: 'البحث عن الكلمات المفتاحية وتجميعها في عناقيد: ١٥ عنقودًا',
                CMP: 'تحليل ٧ منافسين',
                CON: 'إنتاج ٣٠ قطعة محتوى نصية',
                BKL: 'بناء الروابط وفق استراتيجية بريميوم',
                RPR: 'نشر ٤ مقالات إعلانية مدفوعة من فئة بريميوم',
                TEC: 'السيو التقني: تحسينات على مستوى المؤسسات',
                REP: 'تقرير أداء أسبوعي يشمل الاستراتيجية والتوقعات',
                SUP: 'دعم مخصص ومستشار واتصال للحالات الطارئة'
            }
        },

        componentFallback: {
            KEY: 'البحث عن الكلمات المفتاحية',
            CMP: 'تحليل المنافسين',
            CON: 'إنتاج المحتوى',
            BKL: 'بناء الروابط',
            RPR: 'مقال إعلاني مدفوع',
            TEC: 'السيو التقني',
            REP: 'إعداد التقارير',
            SUP: 'الدعم'
        },

        form: {
            required: 'يرجى إكمال الحقول الإلزامية.',
            invalidUrl: 'عنوان الموقع غير صالح. مثال: https://example.com',
            invalidPhone: 'رقم الاتصال غير صالح.',
            internalError: 'خطأ داخلي: نظام تسجيل الطلبات غير متاح.',
            sending: 'جارٍ الإرسال…',
            success: 'تم تسجيل طلبك بنجاح. سيتواصل معك فريقنا خلال ٢٤ ساعة عمل.',
            error: 'للأسف حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو الاتصال على ٠٩١٢٥٧٥٩٤٦٦.'
        },

        capacity: {
            loading: 'جارٍ التحقق من القدرة الاستيعابية…',
            available: 'استقبال مشاريع السيو',
            full: 'القدرة الاستيعابية لمشاريع السيو مكتملة حتى {date}',
            oneLeft: 'مقعد واحد متبقٍ لمشروع السيو',
            nLeft: '{n} مقاعد متبقية لمشاريع السيو'
        }
    },

    /* :::::::::::::::::::::::::: ENGLISH :::::::::::::::::::::::::: */

    en: {
        locale: 'en-US',
        digits: '0123456789',
        monthlySuffix: ' / month',
        millionSuffix: 'Million Toman / month',
        currencyLabel: { IRR: 'Toman', USD: 'USD', EUR: 'EUR', AED: 'AED', TRY: 'TRY' },

        addonLabels: {
            keywords: 'Keyword clusters',
            content: 'Text content',
            reporterageBase: 'Sponsored article (Basic)',
            reporteragePremium: 'Sponsored article (Premium)',
            accelerator: 'SEO Accelerator',
            acceleratorAdvanced: 'Advanced SEO Accelerator'
        },
        unitLabels: { cluster: 'cluster', item: 'item' },
        addonHint: 'Each additional {unit}: ',

        packageLabels: {
            BASIC: 'Standard Basic Package',
            PRO: 'Standard Professional Package',
            ENTERPRISE: 'Standard Premium Package',
            ADV_BASIC: 'Advanced Basic Package',
            ADV_PRO: 'Advanced Professional Package',
            ADV_ENTERPRISE: 'Advanced Premium Package'
        },

        componentLabels: {
            STD_BAS: {
                KEY: 'Cluster keyword research (2 clusters)',
                CON: 'Produce 8 content pieces',
                BKL: 'Link building (basic strategy)',
                RPR: 'Publish 1 basic sponsored article',
                TEC: 'Technical SEO (basic optimization)',
                REP: 'Basic monthly performance report',
                SUP: 'Ticket support'
            },
            STD_PRO: {
                KEY: 'Cluster keyword research (5 clusters)',
                CMP: 'Analyze 3 competitors',
                CON: 'Produce 15 content pieces',
                BKL: 'Link building (professional strategy)',
                RPR: 'Publish 2 basic sponsored articles',
                TEC: 'Technical SEO (full optimization)',
                REP: 'Monthly analytical report',
                SUP: 'Ticket and chat support'
            },
            STD_PRM: {
                KEY: 'Cluster keyword research (10 clusters)',
                CMP: 'Analyze 5 competitors',
                CON: 'Produce 20 content pieces',
                BKL: 'Link building (advanced strategy)',
                RPR: 'Publish 4 basic sponsored articles',
                TEC: 'Technical SEO (advanced optimization)',
                REP: 'Comprehensive strategic report',
                SUP: 'Priority support (ticket + chat + phone)'
            },
            ADV_BAS: {
                KEY: 'Cluster keyword research (5 clusters)',
                CMP: 'Analyze 3 competitors',
                CON: 'Produce 15 content pieces',
                BKL: 'Link building (premium strategy)',
                RPR: 'Publish 1 premium sponsored article',
                TEC: 'Technical SEO (full optimization)',
                REP: 'Basic weekly performance report',
                SUP: 'Dedicated support'
            },
            ADV_PRO: {
                KEY: 'Cluster keyword research (10 clusters)',
                CMP: 'Analyze 5 competitors',
                CON: 'Produce 25 content pieces',
                BKL: 'Link building (advanced premium strategy)',
                RPR: 'Publish 2 premium sponsored articles',
                TEC: 'Technical SEO (advanced optimization)',
                REP: 'Weekly report with in-depth analysis',
                SUP: 'Dedicated support + consulting'
            },
            ADV_PRM: {
                KEY: 'Cluster keyword research (15 clusters)',
                CMP: 'Analyze 7 competitors',
                CON: 'Produce 30 content pieces',
                BKL: 'Link building (premium strategy)',
                RPR: 'Publish 4 premium sponsored articles',
                TEC: 'Technical SEO (enterprise-grade optimization)',
                REP: 'Weekly report (strategy + forecasting)',
                SUP: 'Dedicated support + consultant + emergency line'
            }
        },

        componentFallback: {
            KEY: 'Keyword research',
            CMP: 'Competitor analysis',
            CON: 'Content production',
            BKL: 'Link building',
            RPR: 'Sponsored article',
            TEC: 'Technical SEO',
            REP: 'Reporting',
            SUP: 'Support'
        },

        form: {
            required: 'Please fill in the required fields.',
            invalidUrl: 'Invalid website URL. Example: https://example.com',
            invalidPhone: 'Invalid phone number.',
            internalError: 'Internal error: request submission is unavailable.',
            sending: 'Sending…',
            success: 'Your request was submitted successfully. Our team will contact you within 24 business hours.',
            error: 'Unfortunately an error occurred. Please try again or call 09125759466.'
        },

        capacity: {
            loading: 'Checking availability…',
            available: 'Accepting SEO projects',
            full: 'SEO project capacity is full until {date}',
            oneLeft: '1 slot left for an SEO project',
            nLeft: '{n} slots left for SEO projects'
        }
    },

    /* :::::::::::::::::::::::::: TURKISH :::::::::::::::::::::::::: */

    tr: {
        locale: 'tr-TR',
        digits: '0123456789',
        monthlySuffix: ' / ay',
        millionSuffix: 'Milyon Tümen / ay',
        currencyLabel: { IRR: 'Tümen', USD: 'Dolar', EUR: 'Euro', AED: 'Dirhem', TRY: 'Lira' },

        addonLabels: {
            keywords: 'Anahtar kelime kümeleri',
            content: 'Metin içeriği',
            reporterageBase: 'Sponsorlu makale (Temel)',
            reporteragePremium: 'Sponsorlu makale (Premium)',
            accelerator: 'SEO Hızlandırıcı',
            acceleratorAdvanced: 'Gelişmiş SEO Hızlandırıcı'
        },
        unitLabels: { cluster: 'küme', item: 'adet' },
        addonHint: 'Her ek {unit}: ',

        packageLabels: {
            BASIC: 'Standart Temel Paket',
            PRO: 'Standart Profesyonel Paket',
            ENTERPRISE: 'Standart Premium Paket',
            ADV_BASIC: 'Gelişmiş Temel Paket',
            ADV_PRO: 'Gelişmiş Profesyonel Paket',
            ADV_ENTERPRISE: 'Gelişmiş Premium Paket'
        },

        componentLabels: {
            STD_BAS: {
                KEY: 'Küme anahtar kelime araştırması (2 küme)',
                CON: '8 içerik parçası üretimi',
                BKL: 'Bağlantı oluşturma (temel strateji)',
                RPR: '1 temel sponsorlu makale yayını',
                TEC: 'Teknik SEO (temel optimizasyon)',
                REP: 'Temel aylık performans raporu',
                SUP: 'Destek talebi'
            },
            STD_PRO: {
                KEY: 'Küme anahtar kelime araştırması (5 küme)',
                CMP: '3 rakibin analizi',
                CON: '15 içerik parçası üretimi',
                BKL: 'Bağlantı oluşturma (profesyonel strateji)',
                RPR: '2 temel sponsorlu makale yayını',
                TEC: 'Teknik SEO (tam optimizasyon)',
                REP: 'Aylık analitik rapor',
                SUP: 'Destek talebi ve sohbet'
            },
            STD_PRM: {
                KEY: 'Küme anahtar kelime araştırması (10 küme)',
                CMP: '5 rakibin analizi',
                CON: '20 içerik parçası üretimi',
                BKL: 'Bağlantı oluşturma (gelişmiş strateji)',
                RPR: '4 temel sponsorlu makale yayını',
                TEC: 'Teknik SEO (gelişmiş optimizasyon)',
                REP: 'Kapsamlı ve stratejik rapor',
                SUP: 'Öncelikli destek (talep + sohbet + telefon)'
            },
            ADV_BAS: {
                KEY: 'Küme anahtar kelime araştırması (5 küme)',
                CMP: '3 rakibin analizi',
                CON: '15 içerik parçası üretimi',
                BKL: 'Bağlantı oluşturma (premium strateji)',
                RPR: '1 premium sponsorlu makale yayını',
                TEC: 'Teknik SEO (tam optimizasyon)',
                REP: 'Temel haftalık performans raporu',
                SUP: 'Özel destek'
            },
            ADV_PRO: {
                KEY: 'Küme anahtar kelime araştırması (10 küme)',
                CMP: '5 rakibin analizi',
                CON: '25 içerik parçası üretimi',
                BKL: 'Bağlantı oluşturma (gelişmiş premium strateji)',
                RPR: '2 premium sponsorlu makale yayını',
                TEC: 'Teknik SEO (gelişmiş optimizasyon)',
                REP: 'Haftalık rapor (derinlemesine analiz ile)',
                SUP: 'Özel destek + danışmanlık'
            },
            ADV_PRM: {
                KEY: 'Küme anahtar kelime araştırması (15 küme)',
                CMP: '7 rakibin analizi',
                CON: '30 içerik parçası üretimi',
                BKL: 'Bağlantı oluşturma (premium strateji)',
                RPR: '4 premium sponsorlu makale yayını',
                TEC: 'Teknik SEO (kurumsal düzeyde optimizasyon)',
                REP: 'Haftalık rapor (strateji + tahmin)',
                SUP: 'Özel destek + danışman + acil hat'
            }
        },

        componentFallback: {
            KEY: 'Anahtar kelime araştırması',
            CMP: 'Rakip analizi',
            CON: 'İçerik üretimi',
            BKL: 'Bağlantı oluşturma',
            RPR: 'Sponsorlu makale',
            TEC: 'Teknik SEO',
            REP: 'Raporlama',
            SUP: 'Destek'
        },

        form: {
            required: 'Lütfen zorunlu alanları doldurun.',
            invalidUrl: 'Geçersiz web sitesi adresi. Örnek: https://example.com',
            invalidPhone: 'Geçersiz telefon numarası.',
            internalError: 'Dahili hata: talep sistemi kullanılamıyor.',
            sending: 'Gönderiliyor…',
            success: 'Talebiniz başarıyla kaydedildi. Ekibimiz 24 iş saati içinde sizinle iletişime geçecek.',
            error: 'Maalesef gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin veya 09125759466 numarasını arayın.'
        },

        capacity: {
            loading: 'Kapasite kontrol ediliyor…',
            available: 'SEO projeleri kabul ediliyor',
            full: 'SEO proje kapasitesi {date} tarihine kadar dolu',
            oneLeft: 'SEO projesi için 1 yer kaldı',
            nLeft: 'SEO projeleri için {n} yer kaldı'
        }
    },

    /* :::::::::::::::::::::::::: GERMAN :::::::::::::::::::::::::: */

    de: {
        locale: 'de-DE',
        digits: '0123456789',
        monthlySuffix: ' / Monat',
        millionSuffix: 'Millionen Toman / Monat',
        currencyLabel: { IRR: 'Toman', USD: 'Dollar', EUR: 'Euro', AED: 'Dirham', TRY: 'Lira' },

        addonLabels: {
            keywords: 'Keyword-Cluster',
            content: 'Textinhalte',
            reporterageBase: 'Pressemitteilung (Basis)',
            reporteragePremium: 'Pressemitteilung (Premium)',
            accelerator: 'SEO-Beschleuniger',
            acceleratorAdvanced: 'Erweiterter SEO-Beschleuniger'
        },
        unitLabels: { cluster: 'Cluster', item: 'Stück' },
        addonHint: 'Jedes weitere {unit}: ',

        packageLabels: {
            BASIC: 'Standard-Basispaket',
            PRO: 'Standard-Professional-Paket',
            ENTERPRISE: 'Standard-Premium-Paket',
            ADV_BASIC: 'Erweitertes Basispaket',
            ADV_PRO: 'Erweitertes Professional-Paket',
            ADV_ENTERPRISE: 'Erweitertes Premium-Paket'
        },

        componentLabels: {
            STD_BAS: {
                KEY: 'Cluster-Keyword-Recherche (2 Cluster)',
                CON: 'Erstellung von 8 Textinhalten',
                BKL: 'Linkaufbau (Basisstrategie)',
                RPR: 'Veröffentlichung von 1 Basis-Pressemitteilung',
                TEC: 'Technisches SEO (Basisoptimierung)',
                REP: 'Basis-Monatsbericht',
                SUP: 'Ticket-Support'
            },
            STD_PRO: {
                KEY: 'Cluster-Keyword-Recherche (5 Cluster)',
                CMP: 'Analyse von 3 Wettbewerbern',
                CON: 'Erstellung von 15 Textinhalten',
                BKL: 'Linkaufbau (professionelle Strategie)',
                RPR: 'Veröffentlichung von 2 Basis-Pressemitteilungen',
                TEC: 'Technisches SEO (vollständige Optimierung)',
                REP: 'Monatlicher Analysebericht',
                SUP: 'Ticket- und Chat-Support'
            },
            STD_PRM: {
                KEY: 'Cluster-Keyword-Recherche (10 Cluster)',
                CMP: 'Analyse von 5 Wettbewerbern',
                CON: 'Erstellung von 20 Textinhalten',
                BKL: 'Linkaufbau (fortgeschrittene Strategie)',
                RPR: 'Veröffentlichung von 4 Basis-Pressemitteilungen',
                TEC: 'Technisches SEO (fortgeschrittene Optimierung)',
                REP: 'Umfassender strategischer Bericht',
                SUP: 'Prioritäts-Support (Ticket + Chat + Telefon)'
            },
            ADV_BAS: {
                KEY: 'Cluster-Keyword-Recherche (5 Cluster)',
                CMP: 'Analyse von 3 Wettbewerbern',
                CON: 'Erstellung von 15 Textinhalten',
                BKL: 'Linkaufbau (Premium-Strategie)',
                RPR: 'Veröffentlichung von 1 Premium-Pressemitteilung',
                TEC: 'Technisches SEO (vollständige Optimierung)',
                REP: 'Basis-Wochenbericht',
                SUP: 'Dedizierter Support'
            },
            ADV_PRO: {
                KEY: 'Cluster-Keyword-Recherche (10 Cluster)',
                CMP: 'Analyse von 5 Wettbewerbern',
                CON: 'Erstellung von 25 Textinhalten',
                BKL: 'Linkaufbau (erweiterte Premium-Strategie)',
                RPR: 'Veröffentlichung von 2 Premium-Pressemitteilungen',
                TEC: 'Technisches SEO (fortgeschrittene Optimierung)',
                REP: 'Wochenbericht mit eingehender Analyse',
                SUP: 'Dedizierter Support + Beratung'
            },
            ADV_PRM: {
                KEY: 'Cluster-Keyword-Recherche (15 Cluster)',
                CMP: 'Analyse von 7 Wettbewerbern',
                CON: 'Erstellung von 30 Textinhalten',
                BKL: 'Linkaufbau (Premium-Strategie)',
                RPR: 'Veröffentlichung von 4 Premium-Pressemitteilungen',
                TEC: 'Technisches SEO (Optimierung auf Unternehmensniveau)',
                REP: 'Wochenbericht (Strategie + Prognose)',
                SUP: 'Dedizierter Support + Berater + Notfall-Hotline'
            }
        },

        componentFallback: {
            KEY: 'Keyword-Recherche',
            CMP: 'Wettbewerbsanalyse',
            CON: 'Content-Produktion',
            BKL: 'Linkaufbau',
            RPR: 'Pressemitteilung',
            TEC: 'Technisches SEO',
            REP: 'Reporting',
            SUP: 'Support'
        },

        form: {
            required: 'Bitte füllen Sie die Pflichtfelder aus.',
            invalidUrl: 'Ungültige Website-Adresse. Beispiel: https://example.com',
            invalidPhone: 'Ungültige Telefonnummer.',
            internalError: 'Interner Fehler: Das Anfragesystem ist nicht verfügbar.',
            sending: 'Wird gesendet…',
            success: 'Ihre Anfrage wurde erfolgreich übermittelt. Unser Team wird Sie innerhalb von 24 Geschäftsstunden kontaktieren.',
            error: 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie 09125759466 an.'
        },

        capacity: {
            loading: 'Verfügbarkeit wird geprüft…',
            available: 'SEO-Projekte werden angenommen',
            full: 'SEO-Projektkapazität ist bis {date} ausgebucht',
            oneLeft: '1 Platz für ein SEO-Projekt frei',
            nLeft: '{n} Plätze für SEO-Projekte frei'
        }
    },

    /* :::::::::::::::::::::::::: ITALIAN :::::::::::::::::::::::::: */

    it: {
        locale: 'it-IT',
        digits: '0123456789',
        monthlySuffix: ' / mese',
        millionSuffix: 'Milioni di Toman / mese',
        currencyLabel: { IRR: 'Toman', USD: 'Dollaro', EUR: 'Euro', AED: 'Dirham', TRY: 'Lira' },

        addonLabels: {
            keywords: 'Cluster di keyword',
            content: 'Contenuti testuali',
            reporterageBase: 'Comunicato stampa (Base)',
            reporteragePremium: 'Comunicato stampa (Premium)',
            accelerator: 'Acceleratore SEO',
            acceleratorAdvanced: 'Acceleratore SEO avanzato'
        },
        unitLabels: { cluster: 'cluster', item: 'pezzo' },
        addonHint: 'Ogni {unit} aggiuntivo: ',

        packageLabels: {
            BASIC: 'Pacchetto Base Standard',
            PRO: 'Pacchetto Professional Standard',
            ENTERPRISE: 'Pacchetto Premium Standard',
            ADV_BASIC: 'Pacchetto Base Avanzato',
            ADV_PRO: 'Pacchetto Professional Avanzato',
            ADV_ENTERPRISE: 'Pacchetto Premium Avanzato'
        },

        componentLabels: {
            STD_BAS: {
                KEY: 'Ricerca keyword a cluster (2 cluster)',
                CON: 'Produzione di 8 contenuti testuali',
                BKL: 'Link building (strategia base)',
                RPR: 'Pubblicazione di 1 comunicato base',
                TEC: 'SEO tecnico (ottimizzazione base)',
                REP: 'Report mensile di base',
                SUP: 'Supporto via ticket'
            },
            STD_PRO: {
                KEY: 'Ricerca keyword a cluster (5 cluster)',
                CMP: 'Analisi di 3 concorrenti',
                CON: 'Produzione di 15 contenuti testuali',
                BKL: 'Link building (strategia professionale)',
                RPR: 'Pubblicazione di 2 comunicati base',
                TEC: 'SEO tecnico (ottimizzazione completa)',
                REP: 'Report analitico mensile',
                SUP: 'Supporto via ticket e chat'
            },
            STD_PRM: {
                KEY: 'Ricerca keyword a cluster (10 cluster)',
                CMP: 'Analisi di 5 concorrenti',
                CON: 'Produzione di 20 contenuti testuali',
                BKL: 'Link building (strategia avanzata)',
                RPR: 'Pubblicazione di 4 comunicati base',
                TEC: 'SEO tecnico (ottimizzazione avanzata)',
                REP: 'Report completo e strategico',
                SUP: 'Supporto prioritario (ticket + chat + telefono)'
            },
            ADV_BAS: {
                KEY: 'Ricerca keyword a cluster (5 cluster)',
                CMP: 'Analisi di 3 concorrenti',
                CON: 'Produzione di 15 contenuti testuali',
                BKL: 'Link building (strategia premium)',
                RPR: 'Pubblicazione di 1 comunicato premium',
                TEC: 'SEO tecnico (ottimizzazione completa)',
                REP: 'Report settimanale di base',
                SUP: 'Supporto dedicato'
            },
            ADV_PRO: {
                KEY: 'Ricerca keyword a cluster (10 cluster)',
                CMP: 'Analisi di 5 concorrenti',
                CON: 'Produzione di 25 contenuti testuali',
                BKL: 'Link building (strategia premium avanzata)',
                RPR: 'Pubblicazione di 2 comunicati premium',
                TEC: 'SEO tecnico (ottimizzazione avanzata)',
                REP: 'Report settimanale con analisi approfondita',
                SUP: 'Supporto dedicato + consulenza'
            },
            ADV_PRM: {
                KEY: 'Ricerca keyword a cluster (15 cluster)',
                CMP: 'Analisi di 7 concorrenti',
                CON: 'Produzione di 30 contenuti testuali',
                BKL: 'Link building (strategia premium)',
                RPR: 'Pubblicazione di 4 comunicati premium',
                TEC: 'SEO tecnico (ottimizzazione di livello enterprise)',
                REP: 'Report settimanale (strategia + previsioni)',
                SUP: 'Supporto dedicato + consulente + linea di emergenza'
            }
        },

        componentFallback: {
            KEY: 'Ricerca keyword',
            CMP: 'Analisi concorrenti',
            CON: 'Produzione contenuti',
            BKL: 'Link building',
            RPR: 'Comunicato stampa',
            TEC: 'SEO tecnico',
            REP: 'Reportistica',
            SUP: 'Supporto'
        },

        form: {
            required: 'Si prega di compilare i campi obbligatori.',
            invalidUrl: 'URL del sito non valido. Esempio: https://example.com',
            invalidPhone: 'Numero di telefono non valido.',
            internalError: 'Errore interno: sistema di richieste non disponibile.',
            sending: 'Invio in corso…',
            success: 'La tua richiesta è stata inviata con successo. Il nostro team ti contatterà entro 24 ore lavorative.',
            error: 'Purtroppo si è verificato un errore. Riprova o chiama il numero 09125759466.'
        },

        capacity: {
            loading: 'Verifica disponibilità in corso…',
            available: 'Accettiamo progetti SEO',
            full: 'Capacità progetti SEO completa fino al {date}',
            oneLeft: '1 posto rimasto per un progetto SEO',
            nLeft: '{n} posti rimasti per progetti SEO'
        }
    }
};

const t = I18N[LANG] || I18N.fa;

/* :::::::::::::::::::::::::: DEFAULTS :::::::::::::::::::::::::: */

let basePricesUSD = { SEO: {} };
let getExchangeRates = null;

let determineCurrency = (lang) => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) return saved;
    return (lang || 'fa').startsWith('fa') ? 'IRR' : 'USD';
};

/* :::::::::::::::::::::::::: DYNAMIC IMPORTS :::::::::::::::::::::::::: */

try {
    const mod = await import('../../tariff/js/data/prices.js');
    if (mod?.basePricesUSD) basePricesUSD = mod.basePricesUSD;
} catch (e) {
    console.warn('[SEO] prices.js not loaded — using empty defaults.', e);
}

try {
    const mod = await import('../../tariff/js/services/exchange-rates.js');
    if (mod?.getExchangeRates) getExchangeRates = mod.getExchangeRates;
} catch (e) {
    console.warn('[SEO] exchange-rates.js not loaded.', e);
}

try {
    const mod = await import('../../tariff/js/utils/currency-engine.js');
    if (mod?.determineCurrency) determineCurrency = mod.determineCurrency;
} catch (e) {
    console.warn('[SEO] currency-engine.js not loaded — using simple fallback.', e);
}

/* :::::::::::::::::::::::::: SUPABASE CLIENT :::::::::::::::::::::::::: */

const SUPABASE_URL = "https://vzqicidepdmraygulrey.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kqRWgOmLISOE2EuLL1s8fw_WN6FJRTI";
const supabaseClient =
    window.supabaseClient ||
    window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/* :::::::::::::::::::::::::: LANDING CONFIG :::::::::::::::::::::::::: */

const SEO_LANDING_CONFIG = {
    packages: {
        BASIC: 'STD_BAS',
        PRO: 'STD_PRO',
        ENTERPRISE: 'STD_PRM',
        ADV_BASIC: 'ADV_BAS',
        ADV_PRO: 'ADV_PRO',
        ADV_ENTERPRISE: 'ADV_PRM'
    }
};

/* :::::::::::::::::::::::::: PRICE HELPERS :::::::::::::::::::::::::: */

function sumPackageUSD(prefix) {
    const seo = basePricesUSD?.SEO || {};
    return Object.entries(seo)
        .filter(([key]) => key.startsWith(prefix + '_'))
        .reduce((sum, [, value]) => sum + value, 0);
}

/* :::::::::::::::::::::::::: COMPONENT LABELS :::::::::::::::::::::::::: */

const PACKAGE_COMPONENT_LABELS = t.componentLabels;
const PACKAGE_COMPONENT_FALLBACK = t.componentFallback;

/* :::::::::::::::::::::::::: PACKAGE BREAKDOWN :::::::::::::::::::::::::: */

function getPackageBreakdown(prefix) {
    const seo = basePricesUSD?.SEO || {};
    const packageLabels = PACKAGE_COMPONENT_LABELS[prefix] || {};
    const rows = [];

    Object.entries(seo).forEach(([key, value]) => {
        if (!key.startsWith(prefix + '_')) return;
        const suffix = key.slice(prefix.length + 1);
        const label =
            packageLabels[suffix] ||
            PACKAGE_COMPONENT_FALLBACK[suffix] ||
            suffix;
        rows.push({ suffix, label, usd: value });
    });

    return rows;
}

/* :::::::::::::::::::::::::: MAIN PAGE :::::::::::::::::::::::::: */

(function () {
    'use strict';

    const page = document.querySelector('.seo-page');
    if (!page) return;

    /* :::::::::::::::::::::::::: PRICING BRIDGE :::::::::::::::::::::::::: */

    const pricing = {
        rates: {},
        currency:
            localStorage.getItem('selectedCurrency') ||
            determineCurrency(document.documentElement.lang || 'fa'),

        rate() {
            return this.rates[this.currency] || 1;
        },

        usdToDisplay(usd) {
            return Math.round(usd * this.rate());
        }
    };

    const FA_DIGITS = t.digits;
    const CURRENCY_LABEL = t.currencyLabel;

    function formatMillionsIRR(display) {
        const m = display / 1_000_000;
        let str = m.toFixed(1);
        if (str.endsWith('.0')) str = str.slice(0, -2);
        return str
            .replace(/[0-9]/g, (d) => FA_DIGITS[d])
            .replace(/\./g, LANG === 'fa' ? '٫' : '.');
    }

    function formatFullIRR(display) {
        return new Intl.NumberFormat(t.locale).format(display);
    }

    function formatMoney(display, currency) {
        switch (currency) {
            case 'IRR': return formatFullIRR(display);
            case 'USD': return '$' + display.toLocaleString('en-US');
            case 'EUR': return '€' + display.toLocaleString('de-DE');
            case 'AED': return String(display).replace(/[0-9]/g, (d) => FA_DIGITS[d]);
            case 'TRY': return display.toLocaleString('tr-TR');
            default:    return display.toLocaleString('en-US') + ' ' + currency;
        }
    }

    /* :::::::::::::::::::::::::: PACKAGE PRICE RENDERER :::::::::::::::::::::::::: */

    function renderPackagePrices() {
        const map = SEO_LANDING_CONFIG.packages;

        page.querySelectorAll('[data-seo-pkg]').forEach((el) => {
            const landingKey = el.dataset.seoPkg;
            const prefix = map[landingKey];
            if (!prefix) return;

            const usd = sumPackageUSD(prefix);
            if (!usd) return;

            const display = pricing.usdToDisplay(usd);
            const unitEl = el.parentElement.querySelector('[data-seo-pkg-unit]');
            const plus = '';

            if (pricing.currency === 'IRR') {
                if (display >= 1_000_000) {
                    el.textContent = formatMillionsIRR(display) + plus;
                    if (unitEl) unitEl.textContent = t.millionSuffix;
                } else {
                    el.textContent = formatFullIRR(display) + plus;
                    if (unitEl) unitEl.textContent = CURRENCY_LABEL.IRR + t.monthlySuffix;
                }
            } else {
                el.textContent = formatMoney(display, pricing.currency) + plus;
                if (unitEl) {
                    unitEl.textContent =
                        (CURRENCY_LABEL[pricing.currency] || pricing.currency) +
                        t.monthlySuffix;
                }
            }
        });
    }

    /* :::::::::::::::::::::::::: SCROLL REVEAL :::::::::::::::::::::::::: */

    (function initReveal() {
        const items = page.querySelectorAll('.seo-reveal');

        if (!('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const siblings = Array.from(el.parentElement.children);
                        const delay = (siblings.indexOf(el) % 6) * 90;
                        setTimeout(() => el.classList.add('is-visible'), delay);
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );

        items.forEach((el) => io.observe(el));
    })();

    /* :::::::::::::::::::::::::: PACKAGE CONFIGURATION :::::::::::::::::::::::::: */

    const A = t.addonLabels;
    const U = t.unitLabels;

    const PACKAGE_CONFIG = {
        BASIC: {
            label: t.packageLabels.BASIC,
            isAdvanced: false,
            addons: [
                { id: 'keywords',    type: 'range',  label: A.keywords,          unit: U.cluster, base: 2,  max: 22, priceKey: 'ADD_KEY_UNT' },
                { id: 'content',     type: 'range',  label: A.content,           unit: U.item,    base: 8,  max: 48, priceKey: 'ADD_CON_UNT' },
                { id: 'reporterage', type: 'range',  label: A.reporterageBase,   unit: U.item,    base: 1,  max: 16, priceKey: 'ADD_RPR_STD' },
                { id: 'accelerator', type: 'toggle', label: A.accelerator,                                                priceKey: 'ADD_ACC_STD' }
            ]
        },
        PRO: {
            label: t.packageLabels.PRO,
            isAdvanced: false,
            addons: [
                { id: 'keywords',    type: 'range',  label: A.keywords,          unit: U.cluster, base: 5,  max: 25, priceKey: 'ADD_KEY_UNT' },
                { id: 'content',     type: 'range',  label: A.content,           unit: U.item,    base: 15, max: 55, priceKey: 'ADD_CON_UNT' },
                { id: 'backlinks',   type: 'range',  label: A.reporterageBase,   unit: U.item,    base: 8,  max: 28, priceKey: 'ADD_BKL_UNT' },
                { id: 'accelerator', type: 'toggle', label: A.accelerator,                                                priceKey: 'ADD_ACC_STD' }
            ]
        },
        ENTERPRISE: {
            label: t.packageLabels.ENTERPRISE,
            isAdvanced: false,
            addons: [
                { id: 'keywords',    type: 'range',  label: A.keywords,          unit: U.cluster, base: 10, max: 30, priceKey: 'ADD_KEY_UNT' },
                { id: 'content',     type: 'range',  label: A.content,           unit: U.item,    base: 20, max: 60, priceKey: 'ADD_CON_UNT' },
                { id: 'reporterage', type: 'range',  label: A.reporterageBase,   unit: U.item,    base: 4,  max: 19, priceKey: 'ADD_RPR_PRM' },
                { id: 'accelerator', type: 'toggle', label: A.accelerator,                                                priceKey: 'ADD_ACC_ADV' }
            ]
        },
        ADV_BASIC: {
            label: t.packageLabels.ADV_BASIC,
            isAdvanced: true,
            addons: [
                { id: 'keywords',    type: 'range',  label: A.keywords,           unit: U.cluster, base: 5,  max: 25, priceKey: 'ADD_KEY_UNT' },
                { id: 'content',     type: 'range',  label: A.content,            unit: U.item,    base: 15, max: 55, priceKey: 'ADD_CON_UNT' },
                { id: 'reporterage', type: 'range',  label: A.reporteragePremium, unit: U.item,    base: 1,  max: 16, priceKey: 'ADD_RPR_PRM' },
                { id: 'accelerator', type: 'toggle', label: A.acceleratorAdvanced,                                priceKey: 'ADD_ACC_ADV' }
            ]
        },
        ADV_PRO: {
            label: t.packageLabels.ADV_PRO,
            isAdvanced: true,
            addons: [
                { id: 'keywords',    type: 'range',  label: A.keywords,           unit: U.cluster, base: 10, max: 30, priceKey: 'ADD_KEY_UNT' },
                { id: 'content',     type: 'range',  label: A.content,            unit: U.item,    base: 25, max: 65, priceKey: 'ADD_CON_UNT' },
                { id: 'backlinks',   type: 'range',  label: A.reporteragePremium, unit: U.item,    base: 12, max: 32, priceKey: 'ADD_BKL_UNT' },
                { id: 'accelerator', type: 'toggle', label: A.acceleratorAdvanced,                                priceKey: 'ADD_ACC_ADV' }
            ]
        },
        ADV_ENTERPRISE: {
            label: t.packageLabels.ADV_ENTERPRISE,
            isAdvanced: true,
            addons: [
                { id: 'keywords',    type: 'range',  label: A.keywords,           unit: U.cluster, base: 15, max: 35, priceKey: 'ADD_KEY_UNT' },
                { id: 'content',     type: 'range',  label: A.content,            unit: U.item,    base: 30, max: 70, priceKey: 'ADD_CON_UNT' },
                { id: 'reporterage', type: 'range',  label: A.reporteragePremium, unit: U.item,    base: 4,  max: 19, priceKey: 'ADD_RPR_PRM' },
                { id: 'accelerator', type: 'toggle', label: A.acceleratorAdvanced,                                priceKey: 'ADD_ACC_ADV' }
            ]
        }
    };

    /* :::::::::::::::::::::::::: PRICE CALCULATOR :::::::::::::::::::::::::: */

    (function initCalculator() {
        const calcEl = page.querySelector('#seo-calc');
        if (!calcEl) return;

        const addonsContainer = calcEl.querySelector('[data-seo-addons]');
        const pkgNameEl = calcEl.querySelector('[data-seo-calc-pkg-name]');
        const pkgPriceEl = calcEl.querySelector('[data-seo-calc-pkg-price]');
        const totalEl = calcEl.querySelector('[data-seo-price]');
        const totalCurrencyEl = calcEl.querySelector('[data-seo-price-currency]');
        const sumBaseEl = calcEl.querySelector('[data-seo-sum-base]');
        const sumAddonsEl = calcEl.querySelector('[data-seo-sum-addons]');
        const addonRowsContainer = calcEl.querySelector('[data-seo-sum-addon-rows]');
        const summaryTotalRow = calcEl.querySelector('.seo-summary-total');

        const seo = basePricesUSD?.SEO || {};
        const getAddonPrice = (addon) => Number(seo[addon.priceKey] ?? 0);

        const state = {
            package: 'PRO',
            values: {}
        };

        const toFa = (n) => String(n).replace(/[0-9]/g, (d) => FA_DIGITS[d]);

        function paintRange(el) {
            if (!el) return;
            const min = +el.min;
            const max = +el.max;
            const val = +el.value;
            const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
            const accent = calcEl.classList.contains('is-advanced') ? '#FFE76D' : '#4ECDC4';

            const isLtr = document.documentElement.dir === 'ltr';
            const direction = isLtr ? 'to right' : 'to left';

            el.style.background =
                'linear-gradient(' + direction + ', ' + accent + ' 0%, ' + accent + ' ' +
                pct + '%, rgba(255,255,255,.09) ' + pct + '%, rgba(255,255,255,.09) 100%)';
        }

        function formatNumber(display, currency) {
            if (currency === 'IRR') return new Intl.NumberFormat(t.locale).format(display);
            return String(display).replace(/[0-9]/g, (d) => FA_DIGITS[d]);
        }

        function formatMoneyShort(usd, currency) {
            const display = pricing.usdToDisplay(usd);
            const label = CURRENCY_LABEL[currency] || currency;
            return formatNumber(display, currency) + ' ' + label;
        }

        function animateNumber(el, fromUsd, toUsd, duration) {
            if (!el) return;
            if (el._seoAnimId) cancelAnimationFrame(el._seoAnimId);

            if (Math.abs(fromUsd - toUsd) < 0.5) {
                el.textContent = formatMoneyShort(toUsd, pricing.currency);
                return;
            }

            const startTime = performance.now();

            const step = (now) => {
                const t2 = Math.min((now - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - t2, 3);
                const currentUsd = fromUsd + (toUsd - fromUsd) * ease;
                el.textContent = formatMoneyShort(currentUsd, pricing.currency);

                if (t2 < 1) {
                    el._seoAnimId = requestAnimationFrame(step);
                } else {
                    el.textContent = formatMoneyShort(toUsd, pricing.currency);
                    el._seoAnimId = null;
                }
            };

            el._seoAnimId = requestAnimationFrame(step);
        }

        /* :::::::::::::::::::::::::: BREAKDOWN ROWS :::::::::::::::::::::::::: */

        function renderBreakdownRows() {
            calcEl.querySelectorAll('.seo-breakdown-row').forEach((el) => el.remove());

            const pricingKey = SEO_LANDING_CONFIG.packages[state.package];
            if (!pricingKey) return;

            const breakdown = getPackageBreakdown(pricingKey);

            breakdown.forEach((item) => {
                const li = document.createElement('li');
                li.className = 'seo-breakdown-row';
                li.innerHTML =
                    '<span>' + item.label + '</span>' +
                    '<span class="seo-summary-value">' +
                        formatMoneyShort(item.usd, pricing.currency) +
                    '</span>';

                if (summaryTotalRow) {
                    summaryTotalRow.parentNode.insertBefore(li, summaryTotalRow);
                }
            });
        }

        /* :::::::::::::::::::::::::: INVOICE DATA :::::::::::::::::::::::::: */

        function buildInvoiceData() {
            const config = PACKAGE_CONFIG[state.package];
            if (!config) return null;

            const pricingKey = SEO_LANDING_CONFIG.packages[state.package];
            if (!pricingKey) return null;

            const baseUsd = sumPackageUSD(pricingKey);

            const items = [];

            const breakdown = getPackageBreakdown(pricingKey);
            breakdown.forEach((item) => {
                items.push({ label: item.label, usd: item.usd });
            });

            let addonsUsd = 0;
            config.addons.forEach((addon) => {
                const v = state.values[addon.id];

                if (addon.type === 'range') {
                    const extra = Math.max(0, (+v || 0) - addon.base);
                    if (extra > 0) {
                        const usd = extra * getAddonPrice(addon);
                        addonsUsd += usd;
                        items.push({
                            label: addon.label + ' (+' + toFa(extra) + ' ' + addon.unit + ')',
                            usd: usd
                        });
                    }
                } else if (addon.type === 'toggle') {
                    if (v) {
                        const usd = getAddonPrice(addon);
                        addonsUsd += usd;
                        items.push({ label: addon.label, usd: usd });
                    }
                }
            });

            return {
                packageLabel: config.label,
                items: items,
                totalUsd: baseUsd + addonsUsd
            };
        }

        /* :::::::::::::::::::::::::: PRINT INVOICE :::::::::::::::::::::::::: */

        function openPrintInvoice() {
            const data = buildInvoiceData();
            if (!data) return;

            const root = document.querySelector('[data-seo-print-invoice]');
            if (!root) return;

            const nameEl = root.querySelector('[data-print-pkg-name]');
            if (nameEl) nameEl.textContent = data.packageLabel;

            const now = new Date();
            const dateEl = root.querySelector('[data-print-date]');
            if (dateEl) {
                const formattedDate = new Intl.DateTimeFormat(t.locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(now);
                dateEl.textContent = formattedDate;
            }

            const idEl = root.querySelector('[data-print-id]');
            if (idEl) {
                const id = 'SEO-' + String(now.getTime()).slice(-8);
                idEl.textContent = id;
            }

            const rowsBody = root.querySelector('[data-print-rows]');
            if (rowsBody) {
                rowsBody.innerHTML = '';
                data.items.forEach((item, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML =
                        '<td>' + toFa(index + 1) + '</td>' +
                        '<td>' + item.label + '</td>' +
                        '<td>' + formatMoneyShort(item.usd, pricing.currency) + '</td>';
                    rowsBody.appendChild(tr);
                });
            }

            const totalEl = root.querySelector('[data-print-total]');
            if (totalEl) {
                totalEl.textContent = formatMoneyShort(data.totalUsd, pricing.currency);
            }

            const logoImg = root.querySelector('.seo-print-logo-img');
            const triggerPrint = () => setTimeout(() => window.print(), 100);

            if (logoImg && !logoImg.complete) {
                logoImg.addEventListener('load', triggerPrint, { once: true });
                logoImg.addEventListener('error', triggerPrint, { once: true });
            } else {
                triggerPrint();
            }
        }

        /* :::::::::::::::::::::::::: ADDON UI :::::::::::::::::::::::::: */

        function buildRangeAddon(addon) {
            const currentVal = state.values[addon.id];
            const group = document.createElement('div');
            group.className = 'seo-control-group';
            group.dataset.addonId = addon.id;

            group.innerHTML =
                '<div class="seo-control-head">' +
                    '<label class="seo-control-label">' + addon.label + '</label>' +
                    '<span class="seo-range-value"><span data-addon-count>' + toFa(currentVal) + '</span> ' + addon.unit + '</span>' +
                '</div>' +
                '<input type="range" min="0" max="' + addon.max + '" step="1" value="' + currentVal + '" data-addon-range />' +
                '<p class="seo-addon-hint">' + t.addonHint.replace('{unit}', addon.unit) +
                    '<span data-addon-unit>' +
                    formatMoneyShort(getAddonPrice(addon), pricing.currency) +
                '</span></p>';

            const input = group.querySelector('[data-addon-range]');
            const countEl = group.querySelector('[data-addon-count]');

            input.addEventListener('input', () => {
                let v = +input.value;
                if (v < addon.base) {
                    v = addon.base;
                    input.value = v;
                }
                state.values[addon.id] = v;
                countEl.textContent = toFa(v);
                paintRange(input);
                update();
            });

            requestAnimationFrame(() => paintRange(input));

            return group;
        }

        function buildToggleAddon(addon) {
            const checked = !!state.values[addon.id];
            const label = document.createElement('label');
            label.className = 'seo-toggle';
            label.dataset.addonId = addon.id;

            label.innerHTML =
                '<input type="checkbox" data-addon-checkbox ' + (checked ? 'checked' : '') + ' />' +
                '<span class="seo-toggle-box"></span>' +
                '<span class="seo-toggle-label">' + addon.label + '</span>' +
                '<span class="seo-toggle-price">+' + formatMoneyShort(getAddonPrice(addon), pricing.currency) + '</span>';

            const checkbox = label.querySelector('[data-addon-checkbox]');
            checkbox.addEventListener('change', () => {
                state.values[addon.id] = checkbox.checked;
                update();
            });

            return label;
        }

        function buildAddonUI(config) {
            if (!addonsContainer) return;
            addonsContainer.innerHTML = '';
            config.addons.forEach((addon) => {
                if (addon.type === 'range') addonsContainer.appendChild(buildRangeAddon(addon));
                else if (addon.type === 'toggle') addonsContainer.appendChild(buildToggleAddon(addon));
            });
        }

        /* :::::::::::::::::::::::::: TOTAL SUMMARY :::::::::::::::::::::::::: */

        function update() {
            const config = PACKAGE_CONFIG[state.package];
            if (!config) return;

            const pricingKey = SEO_LANDING_CONFIG.packages[state.package];
            const baseUsd = pricingKey ? sumPackageUSD(pricingKey) : 0;

            let addonsUsd = 0;
            const rows = [];

            config.addons.forEach((addon) => {
                const v = state.values[addon.id];
                let contribution = 0;

                if (addon.type === 'range') {
                    const extra = Math.max(0, (+v || 0) - addon.base);
                    contribution = extra * getAddonPrice(addon);
                    if (extra > 0) {
                        rows.push({
                            id: addon.id,
                            label: addon.label + ' (+' + toFa(extra) + ' ' + addon.unit + ')',
                            usd: contribution
                        });
                    }
                } else if (addon.type === 'toggle') {
                    if (v) {
                        contribution = getAddonPrice(addon);
                        rows.push({ id: addon.id, label: addon.label, usd: contribution });
                    }
                }

                addonsUsd += contribution;
            });

            const totalUsd = baseUsd + addonsUsd;

            const prevBaseUsd = state._prevBaseUsd ?? baseUsd;
            const prevAddonsUsd = state._prevAddonsUsd ?? addonsUsd;
            const prevTotalUsd = state._prevTotalUsd ?? totalUsd;

            if (pkgNameEl) pkgNameEl.textContent = config.label;
            if (pkgPriceEl) {
                if (state._pkgChanged) {
                    pkgPriceEl.textContent = formatMoneyShort(baseUsd, pricing.currency);
                } else {
                    animateNumber(pkgPriceEl, prevBaseUsd, baseUsd, 500);
                }
            }

            if (totalEl) {
                if (state._pkgChanged) {
                    totalEl.textContent = formatNumber(pricing.usdToDisplay(totalUsd), pricing.currency);
                } else {
                    animateNumber(totalEl, prevTotalUsd, totalUsd, 600);
                }
            }
            if (totalCurrencyEl) totalCurrencyEl.textContent = CURRENCY_LABEL[pricing.currency] || pricing.currency;

            if (sumBaseEl) {
                if (state._pkgChanged) {
                    sumBaseEl.textContent = formatMoneyShort(baseUsd, pricing.currency);
                } else {
                    animateNumber(sumBaseEl, prevBaseUsd, baseUsd, 500);
                }
            }
            if (sumAddonsEl) {
                if (state._pkgChanged) {
                    sumAddonsEl.textContent = formatMoneyShort(addonsUsd, pricing.currency);
                } else {
                    animateNumber(sumAddonsEl, prevAddonsUsd, addonsUsd, 500);
                }
            }

            if (addonRowsContainer) {
                const prevRows = state._prevRows || {};
                const nextRows = {};

                addonRowsContainer.innerHTML = '';
                rows.forEach((row) => {
                    nextRows[row.id] = row.usd;

                    const li = document.createElement('li');
                    li.className = 'seo-summary-addon';
                    li.innerHTML =
                        '<span>' + row.label + '</span>' +
                        '<span class="seo-summary-value" data-row-value></span>';
                    addonRowsContainer.appendChild(li);

                    const valEl = li.querySelector('[data-row-value]');
                    const prevVal = state._pkgChanged ? row.usd : (prevRows[row.id] ?? row.usd);
                    animateNumber(valEl, prevVal, row.usd, 500);
                });

                state._prevRows = nextRows;
            }

            state._prevBaseUsd = baseUsd;
            state._prevAddonsUsd = addonsUsd;
            state._prevTotalUsd = totalUsd;
            state._pkgChanged = false;
        }

        /* :::::::::::::::::::::::::: PACKAGE SELECTION :::::::::::::::::::::::::: */

        function selectPackage(pkgKey) {
            const config = PACKAGE_CONFIG[pkgKey];
            if (!config) return;

            state.package = pkgKey;
            state.values = {};

            config.addons.forEach((addon) => {
                state.values[addon.id] = addon.type === 'toggle' ? false : addon.base;
            });

            calcEl.classList.toggle('is-advanced', !!config.isAdvanced);

            state._pkgChanged = true;
            state._prevRows = {};

            buildAddonUI(config);
            update();
            renderBreakdownRows();
        }

        page.querySelectorAll('[data-seo-select-pkg]').forEach((btn) => {
            btn.addEventListener('click', () => selectPackage(btn.dataset.seoSelectPkg));
        });

        const printBtn = calcEl.querySelector('[data-seo-print-invoice-trigger]');
        if (printBtn) {
            printBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openPrintInvoice();
            });
        }

        page._seoCalcUpdate = function () {
            const config = PACKAGE_CONFIG[state.package];
            if (!config) return;

            state._pkgChanged = true;

            buildAddonUI(config);
            update();
            renderBreakdownRows();

            state._pkgChanged = false;
        };

        selectPackage(state.package);
    })();

    /* :::::::::::::::::::::::::: PRICING TABS :::::::::::::::::::::::::: */

    (function initPricingTabs() {
        const tabs = page.querySelectorAll('[data-seo-tab]');
        const panels = page.querySelectorAll('[data-seo-panel]');
        if (!tabs.length || !panels.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.seoTab;

                tabs.forEach((tb) => tb.classList.toggle('is-active', tb === tab));

                panels.forEach((p) => {
                    p.hidden = p.dataset.seoPanel !== target;
                });

                panels.forEach((p) => {
                    if (!p.hidden) {
                        p.querySelectorAll('.seo-reveal:not(.is-visible)').forEach((el) => {
                            el.classList.add('is-visible');
                        });
                    }
                });

                adjustFieldPrefixes();
            });
        });
    })();

    /* :::::::::::::::::::::::::: FIELD PREFIXES :::::::::::::::::::::::::: */

    function adjustFieldPrefixes() {
        const fieldGroups = document.querySelectorAll('.seo-audit-form .field-group');
        const isLtr = getComputedStyle(document.documentElement).direction === 'ltr';

        fieldGroups.forEach((group) => {
            const input = group.querySelector('input, textarea');
            const prefix = group.querySelector('.field-prefix');
            if (!input || !prefix) return;

            const edgePadding = 12;
            const gapAfterPrefix = 8;
            const prefixWidth = prefix.getBoundingClientRect().width;

            input.style.paddingLeft = '';
            input.style.paddingRight = '';

            if (isLtr) {
                input.style.paddingLeft = (edgePadding + prefixWidth + gapAfterPrefix) + 'px';
                input.style.textAlign = 'left';
            } else {
                input.style.paddingRight = (edgePadding + prefixWidth + gapAfterPrefix) + 'px';
                input.style.textAlign = 'right';
            }

            const verticalOffset = 2;
            const isTextarea = input.matches('textarea');

            if (isTextarea) {
                const styles = getComputedStyle(input);
                const paddingTop = parseFloat(styles.paddingTop) || 0;
                prefix.style.top = (input.offsetTop + paddingTop + verticalOffset) + 'px';
                prefix.style.transform = 'none';
            } else {
                prefix.style.top = (input.offsetTop + input.clientHeight / 2 + verticalOffset) + 'px';
                prefix.style.transform = 'translateY(-50%)';
            }

            if (isTextarea && !input.dataset.prefixScrollBound) {
                input.dataset.prefixScrollBound = 'true';

                input.addEventListener('scroll', () => {
                    prefix.style.transform = 'translateY(-' + input.scrollTop + 'px)';
                });

                input.addEventListener('input', () => {
                    if (input.scrollTop > 0) {
                        prefix.style.transform = 'translateY(-' + input.scrollTop + 'px)';
                    }
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            adjustFieldPrefixes();
            setTimeout(adjustFieldPrefixes, 300);
        });
    } else {
        adjustFieldPrefixes();
        setTimeout(adjustFieldPrefixes, 300);
    }

    /* :::::::::::::::::::::::::: AUDIT FORM :::::::::::::::::::::::::: */

    (function initAuditForm() {
        const form = page.querySelector('[data-seo-audit]');
        if (!form) return;

        const msg = form.querySelector('[data-seo-form-msg]');
        const submitBtn = form.querySelector('button[type="submit"]');

        function showMsg(text, isError) {
            if (!msg) return;
            msg.textContent = text;
            msg.classList.remove('seo-hidden');
            msg.classList.toggle('seo-error', !!isError);
        }

        function hideMsg() {
            if (!msg) return;
            msg.classList.add('seo-hidden');
            msg.classList.remove('seo-error');
        }

        function isValidUrl(str) {
            try {
                const u = new URL(str);
                return u.protocol === 'http:' || u.protocol === 'https:';
            } catch {
                return false;
            }
        }

        function isValidPhone(str) {
            const digits = str.replace(/[\s\-()]/g, '');
            return /^(\+?\d{10,15})$/.test(digits);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMsg();

            const url = form.siteUrl.value.trim();
            const name = form.fullName.value.trim();
            const phone = form.phone.value.trim();
            const keywords = form.keywords.value.trim();

            if (!url || !name || !phone) {
                showMsg(t.form.required, true);
                return;
            }
            if (!isValidUrl(url)) {
                showMsg(t.form.invalidUrl, true);
                return;
            }
            if (!isValidPhone(phone)) {
                showMsg(t.form.invalidPhone, true);
                return;
            }

            if (!supabaseClient) {
                showMsg(t.form.internalError, true);
                console.warn('[SEO] supabaseClient not available.');
                return;
            }

            const original = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = t.form.sending;

            try {
                const { error } = await supabaseClient
                    .from('seo_audit_requests')
                    .insert({
                        site_url: url,
                        full_name: name,
                        phone: phone,
                        keywords: keywords || null,
                        locale: document.documentElement.lang || 'fa',
                        source: 'seo-landing'
                    });

                if (error) throw error;

                notifyTelegram('/services/seo/', {
                    'نام': name,
                    'شماره تماس': phone,
                    'آدرس سایت': url,
                    'کلمات کلیدی': keywords || '—'
                });

                showMsg(t.form.success, false);
                form.reset();

                adjustFieldPrefixes();
            } catch (err) {
                console.error('[SEO] form submit error:', err);
                showMsg(t.form.error, true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = original;
            }
        });
    })();

    /* :::::::::::::::::::::::::: SMOOTH SCROLL :::::::::::::::::::::::::: */

    (function initSmoothScroll() {
        page.querySelectorAll('a[href^="#seo-"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href');
                if (!id || id === '#') return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                const top =
                    target.getBoundingClientRect().top + window.scrollY - 96;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    })();

    /* :::::::::::::::::::::::::: PRICING SYNC :::::::::::::::::::::::::: */

    async function refreshPackagePrices() {
        if (!getExchangeRates) {
            console.warn('[SEO] getExchangeRates not available — skipping price render.');
            return;
        }

        try {
            pricing.rates = await getExchangeRates();
        } catch (err) {
            console.warn('SEO pricing: failed to fetch exchange rates.', err);
            return;
        }

        renderPackagePrices();
        if (typeof page._seoCalcUpdate === 'function') page._seoCalcUpdate();
    }

    window.addEventListener('currency-change', (event) => {
        pricing.currency = event.detail.currency;
        refreshPackagePrices();
    });

    refreshPackagePrices();
})();

/* :::::::::::::::::::::::::: CAPACITY BADGE :::::::::::::::::::::::::: */

(function initSeoCapacityBadge() {
    const badge = document.querySelector('[data-seo-capacity]');
    const textEl = document.querySelector('[data-seo-capacity-text]');
    if (!badge || !textEl) return;

    const localNum = (n) =>
        String(n).replace(/[0-9]/g, (d) => t.digits[d]);

    function applyAvailability(detail) {
        if (!detail || typeof detail.remainingSlots !== 'number') {
            badge.setAttribute('data-state', 'available');
            textEl.textContent = t.capacity.available;
            return;
        }

        const { remainingSlots, firstAvailableDate } = detail;

        if (remainingSlots === 0 && firstAvailableDate) {
            badge.setAttribute('data-state', 'full');
            textEl.textContent = t.capacity.full.replace('{date}', firstAvailableDate.label);
            return;
        }

        if (remainingSlots === 1) {
            badge.setAttribute('data-state', 'limited');
            textEl.textContent = t.capacity.oneLeft;
            return;
        }

        badge.setAttribute('data-state', 'available');
        textEl.textContent = t.capacity.nLeft.replace('{n}', localNum(remainingSlots));
    }

    if (window.__seoAvailability) {
        applyAvailability(window.__seoAvailability);
    } else {
        badge.setAttribute('data-state', 'loading');
        textEl.textContent = t.capacity.loading;
    }

    const fallbackTimer = setTimeout(() => {
        if (badge.getAttribute('data-state') === 'loading') {
            badge.setAttribute('data-state', 'available');
            textEl.textContent = t.capacity.available;
        }
    }, 5000);

    window.addEventListener('seoAvailabilityUpdated', (e) => {
        clearTimeout(fallbackTimer);
        window.__seoAvailability = e.detail;
        applyAvailability(e.detail);
    });
})();

/* :::::::::::::::::::::::::: TESTIMONIALS :::::::::::::::::::::::::: */

const TESTIMONIALS = {

    /* :::::::::::::::::::::::::: PERSIAN :::::::::::::::::::::::::: */

    fa: [
        {
            name: "محمود صفری",
            role: "مدیر موسسه ثبت فرهنگ",
            content: "مدتی بود که کارهای سایت و سئو شرکتم را به یک مجموعه در ظاهر بزرگ سپرده بودم که تنها زمان زیادی را از دست دادم که با توجه به برنامه ریزی‌ام برایم بسیار گران تمام شد. ولی از زمانی که با آقای سیلاطانی پروژه سئو سایت را استارت زدیم شرایط بسیار عوض شد و روز به روز نتایج سئو سایتم در حال بهبود است. با توجه به تجربه بالا ایشان طبیعتاً جناب مهندس سیلاطانی را به دیگران نیز معرفی خواهم کرد.",
            image: "/assets/images/arminsilatani/services/seo/mahmoudsafari.webp"
        },
        {
            name: "رامین منصوری",
            role: "مدیر فروش شرکت آوای تجارت",
            content: "من از خدمات سئو مهندس سیلاطانی برای بهبود وب‌سایت شرکتم استفاده کردم و تجربه فوق‌العاده‌ای داشتم. او نه تنها توانست وب‌سایت ما را بهینه کند، بلکه با مشاوره‌های تخصصی‌اش باعث شد دید ما نسبت به سئو تغییر کند. کار با او مثل این است که یک مشاور قابل‌اعتماد و حرفه‌ای در کنار خود داشته باشید. اگر دنبال کسی هستید که واقعاً به رشد کسب‌وکار شما اهمیت بدهد، حتماً ایشان را پیشنهاد می‌کنم.",
            image: "/assets/images/arminsilatani/services/seo/raminmansoori.webp"
        },
        {
            name: "آناهیتا درنیانی",
            role: "مدیر پروژه شرکت آراد تک",
            content: "مهندس سیلاطانی یکی از متخصص‌ترین و با تجربه‌ترین افرادی است که تا به حال در حوزه سئو با او کار کرده‌ایم. او دیدگاه خاصی به پروژه‌ها دارد و از همان ابتدا با یک برنامه ریزی دقیق و منظم وارد عمل می‌شود. کاری که جناب مهندس انجام می‌دهد، فراتر از بهینه سازی سایت است؛ انگار یک شریک تجاری واقعی دارید که دغدغه رشد شما را دارد. اگر دنبال خدمات سئو هستید و می‌خواهید نتیجه ملموس ببینید، ایشان بهترین گزینه است.",
            image: "/assets/images/arminsilatani/services/seo/anahitadorniani.webp"
        },
        {
            name: "کامران رضایی‌نژاد",
            role: "مدیر ارشد فناوری آریاپیما لجستیک",
            content: "قبل از شروع همکاری، صادقانه بگویم که اعتقاد چندانی به تأثیر سئو روی پیپ‌لاین فروش B2B نداشتم. معمولاً در حوزه لجستیک، معاملات از طریق رفرال بسته می‌شوند نه جستجوی ارگانیک. اما داده‌هایی که جناب سیلاطانی در فاز ممیزی اولیه ارائه داد، نشان می‌داد که رقبای مستقیم ما ۶۰ تا ۷۰ درصد ترافیک واجد شرایط خود را از کلیدواژه‌های اینتنت تحقیقاتی می‌گیرند. بعد از سه ماه اجرای ساختار محتوای سیلویی که تیم فنی ایشان طراحی کرد، نرخ تبدیل صفحات خدمات از ۰.۸٪ به ۲.۱٪ رسید و تعداد RFQهای ورودی از کانال ارگانیک به شکل محسوسی افزایش پیدا کرد.",
            image: "/assets/images/arminsilatani/services/seo/kamranrezaeinejad.webp"
        },
        {
            name: "الهام نیک‌پی",
            role: "مدیرعامل تراز پرداز هومان",
            content: "برای ما امضای قرارداد سئو بدون تصویر روشن از مسیر کار دشوار بود؛ فروش سازمانی هم چرخه کوتاهی ندارد که اثر هر فعالیت فوراً مشخص شود. جناب مهندس سیلاطانی پیش از شروع، صفحات دارای تقاضای بالفعل را از موضوعات بلندمدت جدا کرد و برای هر فاز خروجی قابل بررسی گذاشت. هنوز سئو را کانال نتیجه‌گیری فوری نمی‌دانیم، اما اکنون می‌توانیم هزینه و پیشرفت آن را در جلسه مدیریت با معیارهای مشخص ارزیابی کنیم.",
            image: "/assets/images/arminsilatani/services/seo/elhamnikpay.webp"
        },
        {
            name: "نرگس دادفر",
            role: "مدیر ارشد بازاریابی نگاه درمان سپهر",
            content: "نگرانی ما این بود که برای جذب ورودی، محتوایی منتشر شود که از نظر تیم محصول و متخصصان حوزه سلامت دقیق نباشد. در شروع همکاری، این موضوع را صریح مطرح کردیم. مهندس سیلاطانی مسیر تأیید محتوا را با تیم تخصصی ما هماهنگ کرد و تحقیق کلمات کلیدی را به پرسش‌های واقعی خریداران سازمانی وصل کرد. اکنون صفحات خدمات هم از نظر فنی برای جست‌وجو ساختار بهتری دارند و هم بدون تأیید تخصصی منتشر نمی‌شوند.",
            image: "/assets/images/arminsilatani/services/seo/nargesdadfar.webp"
        },
        {
            name: "آرش بهنام",
            role: "مدیر ارشد فناوری ابر راه ناوگان",
            content: "سایت ما با چند سرویس داخلی در ارتباط است و نگران بودم تغییرات سئو به زمان بارگذاری یا پایداری آن آسیب بزند. پیشنهاد اولیه تیم‌های قبلی بیشتر اضافه‌کردن صفحه بود تا حل مسئله. آقای سیلاطانی بررسی را از ساختار صفحات و لاگ خطاها شروع کرد و اصلاحات را با تیم فنی مرور کردیم. حالا برای هر تغییر، اثر آن بر خزش و عملکرد صفحه را کنار هم می‌بینیم؛ این برای من از یک فهرست کلمات کلیدی مفیدتر است.",
            image: "/assets/images/arminsilatani/services/seo/arashbehnam.webp"
        },
        {
            name: "سارا محتشم",
            role: "مدیر توسعه کسب‌وکار همکاران داده مهر",
            content: "در همکاری قبلی، رتبه چند عبارت بهتر شده بود، اما تیم فروش تغییری در کیفیت درخواست‌ها حس نمی‌کرد. به همین دلیل نسبت به گزارش‌های سئو بدبین بودم. با چارچوبی که جناب سیلاطانی برای سنجش گذاشت، صفحات محصول، درخواست دمو و عبارت‌های مرتبط با خرید جداگانه بررسی شدند. هنوز همه ورودی‌ها به فرصت فروش تبدیل نمی‌شوند، اما حالا دقیق‌تر می‌فهمیم کدام صفحات ارزش اصلاح یا سرمایه‌گذاری بیشتر دارند.",
            image: "/assets/images/arminsilatani/services/seo/saramohtasham.webp"
        },
        {
            name: "حمیدرضا وثوق",
            role: "مدیرعامل رایان تأمین پارسین",
            content: "پیش از قرارداد، دغدغه‌ام این بود که دانش سئو بیرون از شرکت بماند و پس از چند ماه ندانیم چه چیزی تغییر کرده است. مهندس سیلاطانی برای هر فاز، تصمیم‌ها، تغییرات صفحات و اقدام‌های بعدی را مستند کرد و در جلسه‌های دوره‌ای با مسئول محصول مرور کردیم. نتیجه فقط چند صفحه اصلاح‌شده نبود؛ تیم ما اکنون می‌تواند دلیل اولویت‌ها را بفهمد و درباره ادامه مسیر آگاهانه تصمیم بگیرد.",
            image: "/assets/images/arminsilatani/services/seo/hamidrezavosugh.webp"
        }
    ],

    /* :::::::::::::::::::::::::: ARABIC :::::::::::::::::::::::::: */

    ar: [
        {
            name: "محمود صفري",
            role: "مدير مؤسسة تسجيل فَرْهَنك",
            content: "كنت قد أوكلت أعمال موقع شركتي والسيو إلى جهة تبدو كبيرة، لكنني خسرت وقتًا طويلًا، وكلّفني ذلك كثيرًا بحسب خططي. لكن منذ أن بدأنا مشروع السيو مع الأستاذ سيلاتاني تغيّرت الأمور كثيرًا، ونتائج السيو لموقعي تتحسّن يومًا بعد يوم. وبالنظر إلى خبرته، سأوصي به للآخرين بكل تأكيد.",
            image: "/assets/images/arminsilatani/services/seo/mahmoudsafari.webp"
        },
        {
            name: "رامين منصوري",
            role: "مدير مبيعات شركة آواي تجارت",
            content: "استخدمت خدمات السيو من المهندس سيلاتاني لتحسين موقع شركتي، وكانت تجربة رائعة. لم يقتصر الأمر على تحسين الموقع، بل غيّرت استشاراته المتخصصة نظرتنا إلى السيو. العمل معه يشبه أن يكون لديك مستشار موثوق ومحترف إلى جانبك. إذا كنت تبحث عن شخص يهتم فعلًا بنمو عملك، فأنا أوصي به دون تردد.",
            image: "/assets/images/arminsilatani/services/seo/raminmansoori.webp"
        },
        {
            name: "آناهيتا دورنياني",
            role: "مديرة مشروع شركة آراد تك",
            content: "المهندس سيلاتاني من أكثر الأشخاص تخصصًا وخبرةً ممن عملنا معهم في مجال السيو. لديه رؤية خاصة للمشاريع، ويبدأ العمل منذ اللحظة الأولى بخطة دقيقة ومنظمة. ما يقوم به يتجاوز تحسين الموقع؛ تشعر وكأن لديك شريكًا تجاريًا حقيقيًا يهتم بنموك. إذا كنت تبحث عن خدمات سيو ونتائج ملموسة، فهو الخيار الأفضل.",
            image: "/assets/images/arminsilatani/services/seo/anahitadorniani.webp"
        },
        {
            name: "كمران رضائي‌نژاد",
            role: "المدير التقني في آريا بيما للخدمات اللوجستية",
            content: "قبل بدء التعاون، وبصراحة، لم أكن مقتنعًا كثيرًا بتأثير السيو على خط مبيعات B2B. ففي مجال اللوجستيك عادةً تُغلق الصفقات عبر التوصيات لا عبر البحث العضوي. لكن البيانات التي عرضها الأستاذ سيلاتاني في مرحلة التدقيق الأولي أظهرت أن منافسينا المباشرين يحصلون على ٦٠ إلى ٧٠٪ من زياراتهم المؤهلة عبر كلمات مفتاحية ذات نية بحثية. بعد ثلاثة أشهر من تنفيذ هيكل المحتوى الذي صممه فريقه الفني، ارتفع معدل تحويل صفحات الخدمات من ٠٫٨٪ إلى ٢٫١٪، وازداد عدد طلبات عروض الأسعار الواردة من القناة العضوية بشكل ملحوظ.",
            image: "/assets/images/arminsilatani/services/seo/kamranrezaeinejad.webp"
        },
        {
            name: "إلهام نيك‌باي",
            role: "الرئيس التنفيذي لشركة تراز پرداز هومان",
            content: "كان توقيع عقد السيو صعبًا بالنسبة لنا دون رؤية واضحة لمسار العمل؛ فالمبيعات المؤسسية لا دورة قصيرة لها حتى يظهر أثر كل نشاط فورًا. قبل البدء، فصل المهندس سيلاتاني الصفحات ذات الطلب الفعلي عن المواضيع طويلة الأمد، وحدد لكل مرحلة مخرجات قابلة للمراجعة. ما زلنا لا نعتبر السيو قناة نتائج فورية، لكننا الآن قادرون على تقييم تكلفته وتقدمه في اجتماع الإدارة بمعايير واضحة.",
            image: "/assets/images/arminsilatani/services/seo/elhamnikpay.webp"
        },
        {
            name: "نرجس دادفر",
            role: "مديرة التسويق في نگاه درمان سپهر",
            content: "كان قلقنا أن يُنشر محتوى لجذب الزيارات لا يكون دقيقًا من وجهة نظر فريق المنتج والمتخصصين في المجال الصحي. طرحنا الأمر بوضوح في بداية التعاون. نسّق المهندس سيلاتاني مسار اعتماد المحتوى مع فريقنا المتخصص، وربط بحث الكلمات المفتاحية بأسئلة المشترين المؤسسيين الحقيقية. الآن أصبحت صفحات الخدمات أفضل من ناحية البنية التقنية للبحث، ولا يُنشر شيء بدون اعتماد متخصص.",
            image: "/assets/images/arminsilatani/services/seo/nargesdadfar.webp"
        },
        {
            name: "آرش بهنام",
            role: "المدير التقني في أبر راه ناوغان",
            content: "موقعنا مرتبط بعدة خدمات داخلية، وكنت قلقًا من أن تؤثر تغييرات السيو على زمن التحميل أو استقراره. كانت اقتراحات الفرق السابقة تدور حول إضافة صفحات أكثر بدلًا من حل المشكلة. بدأ الأستاذ سيلاتاني المراجعة من بنية الصفحات وسجلات الأخطاء، وراجعنا التعديلات مع الفريق الفني. الآن نرى أثر كل تغيير على الزحف وأداء الصفحة معًا؛ وهذا بالنسبة لي أنفع من قائمة كلمات مفتاحية.",
            image: "/assets/images/arminsilatani/services/seo/arashbehnam.webp"
        },
        {
            name: "سارة محتشم",
            role: "مديرة تطوير الأعمال في همكاران داده مهر",
            content: "في تعاون سابق، تحسّن ترتيب بعض العبارات، لكن فريق المبيعات لم يشعر بأي تغيير في جودة الطلبات. لذلك كنت متشككة في تقارير السيو. مع الإطار الذي وضعه الأستاذ سيلاتاني للقياس، دُرست صفحات المنتجات وطلبات العرض التوضيحي والعبارات المرتبطة بالشراء بشكل منفصل. لا تزال كل الزيارات لا تتحول إلى فرص بيع، لكننا الآن نفهم بدقة أكبر أي الصفحات تستحق التعديل أو استثمارًا إضافيًا.",
            image: "/assets/images/arminsilatani/services/seo/saramohtasham.webp"
        },
        {
            name: "حميدرضا وثوق",
            role: "الرئيس التنفيذي لشركة رايان تأمين بارسين",
            content: "قبل العقد، كان همّي أن تبقى معرفة السيو خارج الشركة، وأن لا نعرف بعد أشهر ما الذي تغيّر. وثّق المهندس سيلاتاني لكل مرحلة القرارات وتغييرات الصفحات والخطوات التالية، وراجعناها في اجتماعات دورية مع مسؤول المنتج. لم تكن النتيجة مجرد بضع صفحات معدّلة؛ فريقنا الآن قادر على فهم سبب الأولويات واتخاذ قرار واعٍ بشأن استمرار المسار.",
            image: "/assets/images/arminsilatani/services/seo/hamidrezavosugh.webp"
        }
    ],

    /* :::::::::::::::::::::::::: ENGLISH :::::::::::::::::::::::::: */

    en: [
        {
            name: "Mahmoud Safari",
            role: "Director, Farhang Registration Institute",
            content: "For a while I had handed off my company's website and SEO to what looked like a big agency, and I only lost a lot of time — which, given my plans, cost me dearly. But once we started the SEO project with Mr. Silatani, things changed completely, and my site's SEO results keep improving day by day. Given his experience, I'll definitely be recommending him to others.",
            image: "/assets/images/arminsilatani/services/seo/mahmoudsafari.webp"
        },
        {
            name: "Ramin Mansouri",
            role: "Sales Manager, Avaye Tejarat",
            content: "I used Mr. Silatani's SEO services to improve my company's website, and it was a great experience. He didn't just optimize the site — his expert advice actually changed how we look at SEO. Working with him feels like having a trustworthy, professional consultant on your side. If you're looking for someone who genuinely cares about your business's growth, I'd recommend him without hesitation.",
            image: "/assets/images/arminsilatani/services/seo/raminmansoori.webp"
        },
        {
            name: "Anahita Dorniani",
            role: "Project Manager, Arad Tech",
            content: "Mr. Silatani is one of the most skilled and experienced people we've ever worked with in SEO. He has a unique approach to projects and starts with a precise, well-organized plan from day one. What he does goes beyond site optimization — it feels like having a real business partner who cares about your growth. If you're after SEO services and want to see tangible results, he's the best choice.",
            image: "/assets/images/arminsilatani/services/seo/anahitadorniani.webp"
        },
        {
            name: "Kamran Rezaeinejad",
            role: "CTO, AriaPima Logistics",
            content: "Before we started, I'll be honest — I didn't really believe SEO could affect a B2B sales pipeline. In logistics, deals usually come through referrals, not organic search. But the data Mr. Silatani presented in the initial audit showed that our direct competitors were getting 60–70% of their qualified traffic from research-intent keywords. After three months of implementing the silo content structure his technical team designed, our service pages' conversion rate went from 0.8% to 2.1%, and the number of RFQs coming in from organic channels rose noticeably.",
            image: "/assets/images/arminsilatani/services/seo/kamranrezaeinejad.webp"
        },
        {
            name: "Elham Nikpay",
            role: "CEO, Taraz Pardaz Houman",
            content: "Signing an SEO contract without a clear picture of the road ahead was hard for us; enterprise sales don't have a short enough cycle for every activity's impact to show up right away. Before we started, Mr. Silatani separated pages with actual demand from long-term topics and set reviewable deliverables for each phase. We still don't treat SEO as an instant-results channel, but we can now evaluate its cost and progress in management meetings with clear metrics.",
            image: "/assets/images/arminsilatani/services/seo/elhamnikpay.webp"
        },
        {
            name: "Narges Dadfar",
            role: "Head of Marketing, Negah Darman Sepehr",
            content: "Our concern was that content would be published just to attract traffic but wouldn't be accurate from the product team's and health specialists' point of view. We raised this clearly at the start. Mr. Silatani aligned the content approval path with our specialist team and connected keyword research to real questions from enterprise buyers. Now our service pages are better structured for search technically, and nothing goes out without specialist approval.",
            image: "/assets/images/arminsilatani/services/seo/nargesdadfar.webp"
        },
        {
            name: "Arash Behnam",
            role: "CTO, Abr Rah Navgan",
            content: "Our site is connected to several internal services, and I was worried SEO changes might hurt load time or stability. The previous teams' suggestions were mostly about adding more pages instead of solving the problem. Mr. Silatani started the review from page structure and error logs, and we went over the fixes with the technical team. Now, for every change, we see its effect on crawling and page performance side by side — that's more useful to me than a keyword list.",
            image: "/assets/images/arminsilatani/services/seo/arashbehnam.webp"
        },
        {
            name: "Sara Mohtasham",
            role: "Business Development Manager, Hamkaran Dadeh Mehr",
            content: "In a previous engagement, a few keyword rankings had improved, but the sales team didn't feel any difference in lead quality. That's why I was skeptical of SEO reports. With the framework Mr. Silatani set up, product pages, demo requests, and purchase-related terms were reviewed separately. Not every visit turns into a sales opportunity yet, but we now understand more precisely which pages are worth fixing or investing in further.",
            image: "/assets/images/arminsilatani/services/seo/saramohtasham.webp"
        },
        {
            name: "Hamidreza Vosough",
            role: "CEO, Rayan Tamin Parsin",
            content: "Before the contract, my concern was that SEO knowledge would stay outside the company and that a few months in we wouldn't know what had changed. Mr. Silatani documented the decisions, page changes, and next steps for each phase, and we reviewed them in regular meetings with the product lead. The result wasn't just a handful of fixed pages — our team can now understand why priorities were set and make informed decisions about the road ahead.",
            image: "/assets/images/arminsilatani/services/seo/hamidrezavosugh.webp"
        }
    ],

    /* :::::::::::::::::::::::::: TURKISH :::::::::::::::::::::::::: */

    tr: [
        {
            name: "Mahmoud Safari",
            role: "Farhang Kayıt Kurumu Müdürü",
            content: "Bir süre şirketimin sitesini ve SEO işlerini büyük görünen bir ekibe emanet etmiştim, sadece çok zaman kaybettim — planlarım açısından bu bana pahalıya mal oldu. Ama Bay Silatani ile SEO projesine başladığımızdan beri işler tamamen değişti ve sitemin SEO sonuçları her geçen gün iyileşiyor. Tecrübesi göz önüne alındığında onu başkalarına da kesinlikle önereceğim.",
            image: "/assets/images/arminsilatani/services/seo/mahmoudsafari.webp"
        },
        {
            name: "Ramin Mansouri",
            role: "Satış Müdürü, Avaye Tejarat",
            content: "Şirketimin sitesini iyileştirmek için Bay Silatani'nin SEO hizmetlerinden yararlandım ve harika bir deneyimdi. Sadece siteyi optimize etmekle kalmadı, uzman tavsiyeleriyle SEO'ya bakış açımızı da değiştirdi. Onunla çalışmak, yanınızda güvenilir ve profesyonel bir danışman varmış gibi hissettiriyor. İşinizin büyümesini gerçekten önemseyen birini arıyorsanız, tereddüt etmeden öneririm.",
            image: "/assets/images/arminsilatani/services/seo/raminmansoori.webp"
        },
        {
            name: "Anahita Dorniani",
            role: "Proje Yöneticisi, Arad Tech",
            content: "Bay Silatani, SEO alanında birlikte çalıştığımız en uzman ve deneyimli kişilerden biri. Projelere kendine özgü bir bakış açısı var ve ilk günden itibaren titiz, düzenli bir planla işe koyuluyor. Yaptığı iş site optimizasyonunun ötesinde; sanki büyümenizi önemseyen gerçek bir iş ortağınız var. SEO hizmeti arıyorsanız ve somut sonuç görmek istiyorsanız, en iyi seçenek o.",
            image: "/assets/images/arminsilatani/services/seo/anahitadorniani.webp"
        },
        {
            name: "Kamran Rezaeinejad",
            role: "CTO, AriaPima Lojistik",
            content: "Başlamadan önce dürüst olayım, SEO'nun B2B satış hattına etkisine pek inanmıyordum. Lojistikte anlaşmalar genelde referanslarla kapanır, organik aramayla değil. Ama Bay Silatani'nin ilk denetim aşamasında sunduğu veriler, doğrudan rakiplerimizin nitelikli trafiğinin %60-70'ini araştırma niyetli anahtar kelimelerden aldığını gösteriyordu. Teknik ekibinin tasarladığı silo içerik yapısının üç aylık uygulamasından sonra hizmet sayfalarımızın dönüşüm oranı %0.8'den %2.1'e çıktı ve organik kanaldan gelen RFQ sayısı belirgin şekilde arttı.",
            image: "/assets/images/arminsilatani/services/seo/kamranrezaeinejad.webp"
        },
        {
            name: "Elham Nikpay",
            role: "CEO, Taraz Pardaz Houman",
            content: "İşin gidişatına dair net bir resim olmadan SEO sözleşmesi imzalamak bizim için zordu; kurumsal satışta her faaliyetin etkisi hemen görülecek kadar kısa bir döngü yok. Başlamadan önce Bay Silatani, gerçek talebi olan sayfaları uzun vadeli konulardan ayırdı ve her aşama için incelenebilir çıktılar belirledi. SEO'yu hâlâ hızlı sonuç veren bir kanal olarak görmüyoruz, ama artık maliyetini ve ilerlemesini yönetim toplantısında net ölçütlerle değerlendirebiliyoruz.",
            image: "/assets/images/arminsilatani/services/seo/elhamnikpay.webp"
        },
        {
            name: "Narges Dadfar",
            role: "Pazarlama Direktörü, Negah Darman Sepehr",
            content: "Endişemiz, trafik çekmek için yayınlanan içeriğin ürün ekibi ve sağlık uzmanları açısından doğru olmamasıydı. Bunu işbirliğinin başında açıkça dile getirdik. Bay Silatani, içerik onay sürecini uzman ekibimizle uyumlu hale getirdi ve anahtar kelime araştırmasını kurumsal alıcıların gerçek sorularına bağladı. Şimdi hizmet sayfaları hem teknik olarak arama için daha iyi yapılandırılmış hem de uzman onayı olmadan yayınlanmıyor.",
            image: "/assets/images/arminsilatani/services/seo/nargesdadfar.webp"
        },
        {
            name: "Arash Behnam",
            role: "CTO, Abr Rah Navgan",
            content: "Sitemiz birkaç dahili servise bağlı ve SEO değişikliklerinin yükleme süresine veya kararlılığa zarar vermesinden endişeliydim. Önceki ekiplerin önerileri sorunu çözmek yerine daha çok sayfa eklemek yönündeydi. Bay Silatani incelemeye sayfa yapısından ve hata kayıtlarından başladı, düzeltmeleri teknik ekiple birlikte gözden geçirdik. Artık her değişikliğin tarama ve sayfa performansı üzerindeki etkisini yan yana görüyoruz; bu benim için bir anahtar kelime listesinden çok daha faydalı.",
            image: "/assets/images/arminsilatani/services/seo/arashbehnam.webp"
        },
        {
            name: "Sara Mohtasham",
            role: "İş Geliştirme Müdürü, Hamkaran Dadeh Mehr",
            content: "Önceki işbirliğinde birkaç kelimenin sıralaması iyileşmişti ama satış ekibi talep kalitesinde bir fark hissetmiyordu. Bu yüzden SEO raporlarına şüpheyle bakıyordum. Bay Silatani'nin ölçüm için koyduğu çerçeveyle ürün sayfaları, demo talepleri ve satın alma ile ilgili terimler ayrı ayrı incelendi. Hâlâ her ziyaret satış fırsatına dönüşmüyor, ama artık hangi sayfaların düzeltilmeye veya daha fazla yatırıma değer olduğunu daha net anlıyoruz.",
            image: "/assets/images/arminsilatani/services/seo/saramohtasham.webp"
        },
        {
            name: "Hamidreza Vosough",
            role: "CEO, Rayan Tamin Parsin",
            content: "Sözleşmeden önce endişem, SEO bilgisinin şirketin dışında kalması ve birkaç ay sonra neyin değiştiğini bilmememizdi. Bay Silatani her aşama için kararları, sayfa değişikliklerini ve sonraki adımları belgeledi, ürün sorumlusuyla düzenli toplantılarda gözden geçirdik. Sonuç sadece birkaç düzeltilmiş sayfa değildi; ekibimiz artık önceliklerin nedenini anlayabiliyor ve yolun devamı hakkında bilinçli karar verebiliyor.",
            image: "/assets/images/arminsilatani/services/seo/hamidrezavosugh.webp"
        }
    ],

    /* :::::::::::::::::::::::::: GERMAN :::::::::::::::::::::::::: */

    de: [
        {
            name: "Mahmoud Safari",
            role: "Leiter, Farhang-Registrierungsinstitut",
            content: "Ich hatte die Website und das SEO meiner Firma eine Zeit lang einer scheinbar großen Agentur überlassen und dabei nur viel Zeit verloren – was mich angesichts meiner Pläne teuer zu stehen kam. Seit wir das SEO-Projekt mit Herrn Silatani gestartet haben, hat sich das Blatt aber gewendet, und die SEO-Ergebnisse meiner Seite verbessern sich Tag für Tag. Angesichts seiner Erfahrung werde ich ihn auf jeden Fall weiterempfehlen.",
            image: "/assets/images/arminsilatani/services/seo/mahmoudsafari.webp"
        },
        {
            name: "Ramin Mansouri",
            role: "Vertriebsleiter, Avaye Tejarat",
            content: "Ich habe die SEO-Dienste von Herrn Silatani genutzt, um die Website meiner Firma zu verbessern, und es war eine großartige Erfahrung. Er hat nicht nur die Seite optimiert – seine fachkundige Beratung hat auch unseren Blick auf SEO verändert. Mit ihm zu arbeiten fühlt sich an, als hätte man einen vertrauenswürdigen, professionellen Berater an seiner Seite. Wenn Sie jemanden suchen, dem das Wachstum Ihres Unternehmens wirklich am Herzen liegt, kann ich ihn nur empfehlen.",
            image: "/assets/images/arminsilatani/services/seo/raminmansoori.webp"
        },
        {
            name: "Anahita Dorniani",
            role: "Projektleiterin, Arad Tech",
            content: "Herr Silatani ist einer der kompetentesten und erfahrensten Menschen, mit denen wir im SEO-Bereich je zusammengearbeitet haben. Er hat eine eigene Sicht auf Projekte und legt von Anfang an einen präzisen, gut strukturierten Plan vor. Was er macht, geht über die Optimierung einer Website hinaus – es fühlt sich an, als hätte man einen echten Geschäftspartner, dem Ihr Wachstum wichtig ist. Wenn Sie SEO-Dienste suchen und greifbare Ergebnisse sehen wollen, ist er die beste Wahl.",
            image: "/assets/images/arminsilatani/services/seo/anahitadorniani.webp"
        },
        {
            name: "Kamran Rezaeinejad",
            role: "CTO, AriaPima Logistik",
            content: "Ehrlich gesagt habe ich vor dem Start nicht wirklich daran geglaubt, dass SEO die B2B-Vertriebspipeline beeinflussen kann. In der Logistik laufen Abschlüsse meist über Empfehlungen, nicht über organische Suche. Die Daten, die Herr Silatani in der ersten Auditphase präsentierte, zeigten jedoch, dass unsere direkten Wettbewerber 60–70 % ihres qualifizierten Traffics über Keywords mit Rechercheabsicht gewinnen. Nach drei Monaten Umsetzung der Silo-Content-Struktur, die sein technisches Team entworfen hat, stieg die Conversion-Rate unserer Leistungsseiten von 0,8 % auf 2,1 %, und die Zahl der RFQs aus organischen Kanälen nahm spürbar zu.",
            image: "/assets/images/arminsilatani/services/seo/kamranrezaeinejad.webp"
        },
        {
            name: "Elham Nikpay",
            role: "CEO, Taraz Pardaz Houman",
            content: "Einen SEO-Vertrag ohne klares Bild vom weiteren Weg zu unterschreiben, war für uns schwierig; im Enterprise-Vertrieb ist der Zyklus nicht kurz genug, um die Wirkung jeder Maßnahme sofort zu sehen. Vor dem Start hat Herr Silatani Seiten mit tatsächlicher Nachfrage von langfristigen Themen getrennt und für jede Phase überprüfbare Ergebnisse festgelegt. Wir sehen SEO noch immer nicht als Kanal für Sofortergebnisse, aber wir können Kosten und Fortschritt jetzt in der Management-Runde mit klaren Kennzahlen bewerten.",
            image: "/assets/images/arminsilatani/services/seo/elhamnikpay.webp"
        },
        {
            name: "Narges Dadfar",
            role: "Marketingleiterin, Negah Darman Sepehr",
            content: "Unsere Sorge war, dass Inhalte nur zur Traffic-Steigerung veröffentlicht werden und aus Sicht des Produktteams und der Fachexperten im Gesundheitsbereich nicht korrekt sind. Das haben wir zu Beginn klar angesprochen. Herr Silatani hat den Freigabeprozess für Inhalte mit unserem Fachteam abgestimmt und die Keyword-Recherche mit den tatsächlichen Fragen institutioneller Käufer verbunden. Inzwischen sind unsere Leistungsseiten technisch besser für die Suche aufgestellt, und nichts wird ohne fachliche Freigabe veröffentlicht.",
            image: "/assets/images/arminsilatani/services/seo/nargesdadfar.webp"
        },
        {
            name: "Arash Behnam",
            role: "CTO, Abr Rah Navgan",
            content: "Unsere Website ist mit mehreren internen Diensten verbunden, und ich hatte Sorge, dass SEO-Änderungen die Ladezeit oder Stabilität beeinträchtigen könnten. Die Vorschläge früherer Teams liefen eher darauf hinaus, mehr Seiten hinzuzufügen, statt das Problem zu lösen. Herr Silatani begann die Prüfung mit der Seitenstruktur und den Fehlerprotokollen, und wir haben die Korrekturen mit dem technischen Team durchgesprochen. Jetzt sehen wir bei jeder Änderung die Wirkung auf Crawling und Seitenleistung nebeneinander; das ist für mich nützlicher als eine Keyword-Liste.",
            image: "/assets/images/arminsilatani/services/seo/arashbehnam.webp"
        },
        {
            name: "Sara Mohtasham",
            role: "Leiterin Geschäftsentwicklung, Hamkaran Dadeh Mehr",
            content: "In einer früheren Zusammenarbeit hatten sich die Rankings einiger Begriffe verbessert, aber das Vertriebsteam spürte keinen Unterschied in der Lead-Qualität. Deshalb war ich SEO-Berichten gegenüber skeptisch. Mit dem Rahmen, den Herr Silatani für die Messung aufgesetzt hat, wurden Produktseiten, Demo-Anfragen und kaufrelevante Begriffe getrennt betrachtet. Noch wird nicht jeder Besuch zur Verkaufschance, aber wir verstehen jetzt genauer, welche Seiten eine Überarbeitung oder weitere Investition wert sind.",
            image: "/assets/images/arminsilatani/services/seo/saramohtasham.webp"
        },
        {
            name: "Hamidreza Vosough",
            role: "CEO, Rayan Tamin Parsin",
            content: "Vor dem Vertrag war meine Sorge, dass das SEO-Wissen außerhalb der Firma bleibt und wir nach ein paar Monaten nicht wüssten, was sich geändert hat. Herr Silatani hat für jede Phase Entscheidungen, Seitenänderungen und nächste Schritte dokumentiert, und wir haben sie in regelmäßigen Meetings mit dem Produktverantwortlichen durchgesprochen. Das Ergebnis waren nicht nur ein paar überarbeitete Seiten; unser Team kann jetzt nachvollziehen, warum Prioritäten gesetzt wurden, und bewusst über den weiteren Weg entscheiden.",
            image: "/assets/images/arminsilatani/services/seo/hamidrezavosugh.webp"
        }
    ],

    /* :::::::::::::::::::::::::: ITALIAN :::::::::::::::::::::::::: */

    it: [
        {
            name: "Mahmoud Safari",
            role: "Direttore, Istituto di Registrazione Farhang",
            content: "Per un po' avevo affidato il sito e la SEO della mia azienda a una struttura che sembrava grande, e ho solo perso molto tempo — cosa che, visti i miei piani, mi è costata cara. Ma da quando abbiamo avviato il progetto SEO con il signor Silatani le cose sono cambiate del tutto, e i risultati SEO del mio sito migliorano giorno dopo giorno. Vista la sua esperienza, lo consiglierò senz'altro ad altri.",
            image: "/assets/images/arminsilatani/services/seo/mahmoudsafari.webp"
        },
        {
            name: "Ramin Mansouri",
            role: "Direttore vendite, Avaye Tejarat",
            content: "Ho utilizzato i servizi SEO del signor Silatani per migliorare il sito della mia azienda ed è stata un'esperienza ottima. Non solo ha ottimizzato il sito, ma con i suoi consigli da esperto ha cambiato il nostro modo di vedere la SEO. Lavorare con lui è come avere al proprio fianco un consulente affidabile e professionale. Se cercate qualcuno a cui stia davvero a cuore la crescita della vostra attività, ve lo consiglio senza esitare.",
            image: "/assets/images/arminsilatani/services/seo/raminmansoori.webp"
        },
        {
            name: "Anahita Dorniani",
            role: "Project Manager, Arad Tech",
            content: "Il signor Silatani è una delle persone più competenti ed esperte con cui abbiamo mai lavorato nel campo della SEO. Ha una visione tutta sua dei progetti e parte fin dal primo giorno con un piano preciso e ben organizzato. Quello che fa va oltre l'ottimizzazione del sito: sembra di avere un vero partner commerciale a cui interessa la tua crescita. Se cercate servizi SEO e volete risultati concreti, è la scelta migliore.",
            image: "/assets/images/arminsilatani/services/seo/anahitadorniani.webp"
        },
        {
            name: "Kamran Rezaeinejad",
            role: "CTO, AriaPima Logistica",
            content: "A dire il vero, prima di iniziare non credevo granché che la SEO potesse influire sulla pipeline di vendita B2B. Nella logistica gli accordi di solito si chiudono tramite segnalazioni, non tramite ricerca organica. Ma i dati presentati dal signor Silatani nella fase di audit iniziale mostravano che i nostri concorrenti diretti ottenevano il 60–70% del loro traffico qualificato da keyword con intento di ricerca. Dopo tre mesi dall'implementazione della struttura di contenuti a silo progettata dal suo team tecnico, il tasso di conversione delle pagine di servizio è passato dallo 0,8% al 2,1%, e il numero di richieste di preventivo arrivate dal canale organico è cresciuto in modo evidente.",
            image: "/assets/images/arminsilatani/services/seo/kamranrezaeinejad.webp"
        },
        {
            name: "Elham Nikpay",
            role: "CEO, Taraz Pardaz Houman",
            content: "Firmare un contratto SEO senza un'idea chiara del percorso era difficile per noi; nelle vendite enterprise il ciclo non è abbastanza breve perché l'effetto di ogni attività si veda subito. Prima di iniziare, il signor Silatani ha separato le pagine con domanda reale dai temi di lungo periodo e ha fissato per ogni fase risultati verificabili. Non consideriamo ancora la SEO un canale a risultati immediati, ma ora possiamo valutare costi e progressi in riunione di direzione con parametri chiari.",
            image: "/assets/images/arminsilatani/services/seo/elhamnikpay.webp"
        },
        {
            name: "Narges Dadfar",
            role: "Responsabile marketing, Negah Darman Sepehr",
            content: "La nostra preoccupazione era che venissero pubblicati contenuti solo per attirare traffico, senza essere accurati dal punto di vista del team prodotto e degli specialisti del settore sanitario. L'abbiamo detto chiaramente all'inizio. Il signor Silatani ha allineato il percorso di approvazione dei contenuti con il nostro team specialistico e ha collegato la ricerca delle keyword alle domande reali degli acquirenti aziendali. Ora le pagine di servizio sono strutturate meglio per la ricerca anche dal punto di vista tecnico, e nulla viene pubblicato senza approvazione specialistica.",
            image: "/assets/images/arminsilatani/services/seo/nargesdadfar.webp"
        },
        {
            name: "Arash Behnam",
            role: "CTO, Abr Rah Navgan",
            content: "Il nostro sito è collegato a diversi servizi interni e temevo che le modifiche SEO potessero danneggiare i tempi di caricamento o la stabilità. I suggerimenti dei team precedenti consistevano più che altro nell'aggiungere pagine, invece di risolvere il problema. Il signor Silatani ha iniziato la revisione dalla struttura delle pagine e dai log degli errori, e abbiamo esaminato le correzioni con il team tecnico. Ora, per ogni modifica, vediamo fianco a fianco l'effetto sulla scansione e sulle prestazioni della pagina; per me è più utile di un elenco di keyword.",
            image: "/assets/images/arminsilatani/services/seo/arashbehnam.webp"
        },
        {
            name: "Sara Mohtasham",
            role: "Responsabile sviluppo business, Hamkaran Dadeh Mehr",
            content: "In una collaborazione precedente il ranking di alcune keyword era migliorato, ma il team vendite non percepiva alcun cambiamento nella qualità delle richieste. Per questo ero scettica sui report SEO. Con il quadro di misurazione impostato dal signor Silatani, pagine prodotto, richieste di demo e termini legati all'acquisto sono stati analizzati separatamente. Non tutte le visite diventano ancora opportunità di vendita, ma ora capiamo con più precisione quali pagine meritano correzioni o ulteriori investimenti.",
            image: "/assets/images/arminsilatani/services/seo/saramohtasham.webp"
        },
        {
            name: "Hamidreza Vosough",
            role: "CEO, Rayan Tamin Parsin",
            content: "Prima del contratto, la mia preoccupazione era che il know-how SEO restasse fuori dall'azienda e che dopo qualche mese non sapessimo cosa fosse cambiato. Il signor Silatani ha documentato per ogni fase decisioni, modifiche alle pagine e passi successivi, e li abbiamo rivisti in riunioni periodiche con il responsabile prodotto. Il risultato non è stato solo qualche pagina sistemata; il nostro team ora riesce a capire il motivo delle priorità e a decidere consapevolmente sul percorso da seguire.",
            image: "/assets/images/arminsilatani/services/seo/hamidrezavosugh.webp"
        }
    ]
};

/* :::::::::::::::::::::::::: TESTIMONIALS INIT :::::::::::::::::::::::::: */

(function initTestimonials() {
    const container = document.querySelector('#seo-testimonials .testimonials-container');
    if (!container) return;

    const testimonials =
        (TESTIMONIALS[LANG] && TESTIMONIALS[LANG].length)
            ? TESTIMONIALS[LANG]
            : TESTIMONIALS.fa;

    const createCard = (item) => `
        <div class="card">
            <div class="profile">
                <img src="${item.image}" alt="${item.alt || item.name}" loading="lazy">
                <div>
                    <div class="name">${item.name}</div>
                    <div class="role">${item.role}</div>
                </div>
            </div>
            <div class="content">${item.content}</div>
        </div>
    `;

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function fill(columnId) {
        const el = document.getElementById(columnId);
        if (!el) return;
        const list = shuffle([...testimonials]);
        el.innerHTML = list.concat(list).map(createCard).join("");
    }

    fill("column1");
    fill("column2");
    fill("column3");
})();