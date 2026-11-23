   /**
 * Kashmir Travelling Voyage Theme - Travel JS
 *
 * @package Kashmir-Travelling-Voyage
 * Version: 14.0.0
 * Pure Vanilla JS - No jQuery, No React
 */

(function () {
    'use strict';

    if (window.ktvTravelLoaded) return;
    window.ktvTravelLoaded = true;

    var KTV_DEBUG = false;
    function ktvLog() {
        if (KTV_DEBUG) {
            try { console.log.apply(console, arguments); } catch (e) { }
        }
    }

    /* ============================================================
       1. DOM READY AND UTILITIES
       ============================================================ */

    function ready(fn) {
        if (document.readyState !== 'loading') { fn(); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
    function addClass(el, c) { if (el) el.classList.add(c); }
    function removeClass(el, c) { if (el) el.classList.remove(c); }
    function hasClass(el, c) { return el ? el.classList.contains(c) : false; }

    function trim(str) { return str ? String(str).trim() : ''; }

    function sanitizeContent(text) {
        if (!text) return text;
        return String(text)
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/<object[^>]*>.*?<\/object>/gi, '')
            .replace(/<embed[^>]*>/gi, '')
            .trim();
    }

    function stripIconPrefix(name) {
        if (!name) return '';
        return String(name).replace(/^[^\p{L}\p{N}]+/u, '').trim();
    }

    function validateEmail(email) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    }

    function validatePhone(phone) {
        return /^\+?\d{7,15}$/.test(String(phone).replace(/[\s\-\(\)]/g, ''));
    }

    function validateCreditCard(number, expiry, cvv) {
        number = String(number).replace(/\s+/g, '');
        if (!/^[0-9]{13,19}$/.test(number)) return false;
        var sum = 0, alt = false;
        for (var i = number.length - 1; i >= 0; i--) {
            var n = parseInt(number.charAt(i), 10);
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n;
            alt = !alt;
        }
        if (sum % 10 !== 0) return false;
        var expiryMatch = String(expiry).match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
        if (!expiryMatch) return false;
        var month = parseInt(expiryMatch[1], 10);
        var year = parseInt('20' + expiryMatch[2], 10);
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
        if (!/^[0-9]{3,4}$/.test(String(cvv))) return false;
        return true;
    }

    function getCardType(number) {
        number = String(number).replace(/\s+/g, '');
        if (!number || number.length < 4) return 'Credit Card';
        if (/^4/.test(number)) return 'Visa';
        if (/^5[1-5]/.test(number)) return 'Mastercard';
        if (/^3[47]/.test(number)) return 'American Express';
        if (/^6(?:011|5)/.test(number)) return 'Discover';
        if (/^3(?:0[0-5]|[68])/.test(number)) return 'Diners Club';
        if (/^(?:2131|1800|35)/.test(number)) return 'JCB';
        if (/^62/.test(number)) return 'UnionPay';
        return 'Credit Card';
    }

    function getPhoneProvider(phone) {
        if (!phone) return '';
        var cleaned = String(phone).replace(/\s+/g, '').replace(/^\+91/, '').replace(/^0/, '');
        var providers = {
            'airtel': ['98110','98111','98112','98113','98114','98115','98116','98117','98118','98119','99100','99101','99102','99103','99104','99105','99106','99107','99108','99109','99580','99581','99582','99583','99584','99585','99586','99587','99588','99589'],
            'jio': ['700','701','702','703','704','705','706','707','708','709','720','721','722','723','724','725','726','727','728','729','730','731','732','733','734','735','736','737','738','739','740','741','742','743','744','745','746','747','748','749'],
            'vi': ['98300','98301','98302','98303','98304','98305','98306','98307','98308','98309','98200','98201','98202','98203','98204','98205','98206','98207','98208','98209','97300','97301','97302','97303','97304','97305','97306','97307','97308','97309'],
            'bsnl': ['94000','94001','94002','94003','94004','94005','94006','94007','94008','94009','94100','94101','94102','94103','94104','94105','94106','94107','94108','94109','94200','94201','94202','94203','94204','94205','94206','94207','94208','94209']
        };
        for (var provider in providers) {
            if (!providers.hasOwnProperty(provider)) continue;
            for (var i = 0; i < providers[provider].length; i++) {
                if (cleaned.indexOf(providers[provider][i]) === 0) {
                    return provider.charAt(0).toUpperCase() + provider.slice(1);
                }
            }
        }
        return '';
    }

    var _escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, function (ch) { return _escapeMap[ch]; });
    }


    function timeAgo(datetimeStr) {
        if (!datetimeStr) return '';
        var time = new Date(datetimeStr).getTime();
        if (isNaN(time)) return datetimeStr;
        var diff = Math.floor((Date.now() - time) / 1000);
        if (diff < 0) return 'Just now';
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
        return new Date(datetimeStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function slideDown(el, duration) {
        if (!el) return;
        duration = duration || 300;
        el.style.display = 'block';
        el.style.overflow = 'hidden';
        el.style.height = '0px';
        var height = 0;
        requestAnimationFrame(function () {
            height = el.scrollHeight;
            requestAnimationFrame(function () {
                el.style.transition = 'height ' + duration + 'ms ease';
                el.style.height = height + 'px';
                setTimeout(function () {
                    el.style.height = '';
                    el.style.overflow = '';
                    el.style.transition = '';
                }, duration);
            });
        });
    }
    function slideUp(el, duration) {
        if (!el) return;
        duration = duration || 300;
        var height = el.scrollHeight;
        requestAnimationFrame(function () {
            el.style.overflow = 'hidden';
            el.style.height = height + 'px';
            requestAnimationFrame(function () {
                el.style.transition = 'height ' + duration + 'ms ease';
                el.style.height = '0px';
                setTimeout(function () {
                    el.style.display = 'none';
                    el.style.height = '';
                    el.style.overflow = '';
                    el.style.transition = '';
                }, duration);
            });
        });
    }


    function animateScrollTo(target, offset) {
        if (!target) return;
        offset = offset || 100;
        requestAnimationFrame(function () {
            var targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        });
    }


    function triggerEvent(el, eventName) {
        if (!el) return;
        var event = new Event(eventName, { bubbles: true });
        el.dispatchEvent(event);
    }

    function compressImage(file, maxSizeKB, callback) {
        maxSizeKB = maxSizeKB || 50;
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var width = img.width, height = img.height;
                var maxDim = 800;
                if (width > maxDim || height > maxDim) {
                    var ratio = Math.min(maxDim / width, maxDim / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                var quality = 0.8;
                var dataUrl = canvas.toDataURL('image/jpeg', quality);
                var currentSize = Math.round((dataUrl.length - 22) * 3 / 4);
                var targetSize = maxSizeKB * 1024;
                while (currentSize > targetSize && quality > 0.1) {
                    quality -= 0.05;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                    currentSize = Math.round((dataUrl.length - 22) * 3 / 4);
                }
                var blob = dataURLToBlob(dataUrl);
                callback(blob);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function dataURLToBlob(dataURL) {
        var parts = dataURL.split(',');
        var mime = parts[0].match(/:(.*?);/)[1];
        var bstr = atob(parts[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        for (var i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mime });
    }

    function getAttr(el, attr, fallbackAttr) {
        if (!el) return '';
        var value = el.getAttribute(attr);
        if ((value === null || value === '') && fallbackAttr) {
            value = el.getAttribute(fallbackAttr);
        }
        return value || '';
    }

    function debounce(fn, wait) {
        var timeout;
        return function () {
            var ctx = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () { fn.apply(ctx, args); }, wait || 300);
        };
    }

    function promiseFinally(promise, fn) {
        if (typeof Promise !== 'undefined' && Promise.prototype && Promise.prototype.finally) {
            return promise.finally(fn);
        }
        return promise.then(
            function (value) { fn(); return value; },
            function (reason) { fn(); throw reason; }
        );
    }

    /* ============================================================
       2. OFFER-AWARE PAX RESOLUTION AND CURRENCY
       ============================================================ */

    function resolvePaxForOfferPrice(paxData, offerPrice, originalPrice) {
        var offer = parseFloat(offerPrice) || 0;
        var orig  = parseFloat(originalPrice) || 0;
        if (!(offer > 0 && orig > 0 && offer < orig)) {
            return paxData || {};
        }
        var out = {};
        for (var k in paxData) {
            if (!paxData.hasOwnProperty(k)) continue;
            out[k] = paxData[k];
        }
        var paxKeys = ['pax_1_price', 'pax_2_price', 'pax_3_price', 'group_price', 'family_price'];
        for (var i = 0; i < paxKeys.length; i++) {
            var key = paxKeys[i];
            var v = parseFloat(out[key]) || 0;
            if (v <= 0 || v === orig) {
                out[key] = offer;
            }
        }
        return out;
    }

    function pickEffectivePrice(originalPrice, offerPrice, fallbackPrice) {
        var orig = parseFloat(originalPrice) || 0;
        var offer = parseFloat(offerPrice) || 0;
        var fallback = parseFloat(fallbackPrice) || 0;
        if (offer > 0 && orig > 0 && offer < orig) return offer;
        if (fallback > 0) return fallback;
        if (orig > 0) return orig;
        return offer;
    }

    function calculateSmartPrice(tourPrice, totalAdults, nights, paxData) {
        var basePrice = parseFloat(tourPrice) || 0;
        var adultCount = Math.max(1, parseInt(totalAdults) || 1);
        var nightCount = Math.max(1, parseInt(nights) || 1);
        paxData = paxData || {};

        var origFromPax = parseFloat(paxData.original_price) || 0;
        if (origFromPax > 0 && basePrice > 0 && basePrice < origFromPax) {
            paxData = resolvePaxForOfferPrice(paxData, basePrice, origFromPax);
        }

        var children = Math.max(0, parseInt(paxData.children) || 0);

        var pax1 = parseFloat(paxData.pax_1_price) || 0;
        var pax2 = parseFloat(paxData.pax_2_price) || 0;
        var pax3 = parseFloat(paxData.pax_3_price) || 0;
        var group = parseFloat(paxData.group_price) || 0;
        var family = parseFloat(paxData.family_price) || 0;
        var extraAdult = parseFloat(paxData.extra_adult_price) || 0;
        var extraChild = parseFloat(paxData.extra_child_price) || 0;

        var extraAdultPct = parseFloat(paxData.extra_adult_percent);
        if (isNaN(extraAdultPct) || extraAdultPct <= 0) {
            extraAdultPct = (typeof window.ktvTravelConfig !== 'undefined' && window.ktvTravelConfig.extraAdultPercent) ? parseFloat(window.ktvTravelConfig.extraAdultPercent) : 50;
        }
        var extraChildPct = parseFloat(paxData.extra_child_percent);
        if (isNaN(extraChildPct) || extraChildPct <= 0) {
            extraChildPct = (typeof window.ktvTravelConfig !== 'undefined' && window.ktvTravelConfig.extraChildPercent) ? parseFloat(window.ktvTravelConfig.extraChildPercent) : 40;
        }

        var basePerPerson = pax1 > 0 ? pax1
            : (pax2 > 0 ? pax2
                : (pax3 > 0 ? pax3
                    : (group > 0 ? group
                        : (family > 0 ? family : basePrice))));

        if (basePerPerson <= 0) basePerPerson = basePrice;

        var extraAdultIncrement = extraAdult > 0 ? extraAdult : basePerPerson * (extraAdultPct / 100);
        var extraChildIncrement = extraChild > 0 ? extraChild : basePerPerson * (extraChildPct / 100);

        var extraAdultsCount = paxData.extra_adults !== undefined ? Math.max(0, parseInt(paxData.extra_adults)) : Math.max(0, adultCount - 1);
        var extraChildrenCount = paxData.extra_children !== undefined ? Math.max(0, parseInt(paxData.extra_children)) : children;

        var totalAdultsPrice = basePerPerson + (extraAdultsCount * extraAdultIncrement);
        var totalChildrenPrice = extraChildrenCount * extraChildIncrement;

        var priceBasis = paxData.priceBasis || 'per_day';
        var total;
        if (priceBasis === 'total') {
            total = totalAdultsPrice + totalChildrenPrice;
        } else {
            total = (totalAdultsPrice + totalChildrenPrice) * nightCount;
        }
        total = Math.round(total * 100) / 100;
        return total;
    }

    function getBasePerPerson(tourPrice, paxData) {
        paxData = paxData || {};
        var pax1 = parseFloat(paxData.pax_1_price) || 0;
        var pax2 = parseFloat(paxData.pax_2_price) || 0;
        var pax3 = parseFloat(paxData.pax_3_price) || 0;
        var group = parseFloat(paxData.group_price) || 0;
        var family = parseFloat(paxData.family_price) || 0;
        var basePrice = parseFloat(tourPrice) || 0;

        var basePerPerson = pax1 > 0 ? pax1
            : (pax2 > 0 ? pax2
                : (pax3 > 0 ? pax3
                    : (group > 0 ? group
                        : (family > 0 ? family : basePrice))));
        if (basePerPerson <= 0) basePerPerson = basePrice;
        return basePerPerson;
    }

    function resolveCurrencySymbol(code, fallbackSym) {
        if (fallbackSym && fallbackSym !== '') {
            return fallbackSym;
        }
        if (code) {
            var fallbackMap = {
                'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹',
                'AUD': 'A$', 'CAD': 'C$', 'JPY': '¥', 'AED': 'د.إ',
                'SAR': '﷼', 'SGD': 'S$', 'MYR': 'RM'
            };
            if (fallbackMap[code]) return fallbackMap[code];
        }
        return '$';
    }

        function getNormalizedRate(code) {
        var cfg = window.ktvTravelConfig || {};
        var rates = cfg.currencyRates || {};
        var r = parseFloat(rates[code]);
        if (!r || r <= 0) return 0;
        if (code !== 'INR' && code !== 'JPY' && code !== 'KRW' && code !== 'VND' && code !== 'IDR' && r > 5) {
            return 1 / r;
        }
        return r;
    }

    function convertPrice(amount) {
        var n = parseFloat(amount) || 0;
        if (n <= 0) return n;
        var cfg = window.ktvTravelConfig || {};
        var to   = cfg.currencyCode  || 'USD';
        var base = cfg.baseCurrency  || 'INR';
        if (to === base) return Math.round(n * 100) / 100;
        var toRate   = getNormalizedRate(to);
        var baseRate = getNormalizedRate(base) || 1;
        if (!toRate || toRate <= 0) return Math.round(n * 100) / 100;
        return Math.round(n * (toRate / baseRate) * 100) / 100;
    }

    function toBaseCurrency(amount) {
        var n = parseFloat(amount) || 0;
        if (n <= 0) return 0;
        var cfg = window.ktvTravelConfig || {};
        var from = cfg.currencyCode || 'USD';
        var base = cfg.baseCurrency || 'INR';
        if (from === base) return Math.round(n * 100) / 100;
        var fromRate = getNormalizedRate(from);
        if (!fromRate || fromRate <= 0) return Math.round(n * 100) / 100;
        return Math.round((n / fromRate) * 100) / 100;
    }


    /* ============================================================
       3. GLOBAL CONFIG
       ============================================================ */

    var ktvConfig = {
        version: '14.0.0',
        ajaxUrl: (typeof ktv_travel !== 'undefined' && ktv_travel.ajax_url) ? ktv_travel.ajax_url : '',
        nonce: (typeof ktv_travel !== 'undefined' && ktv_travel.nonce) ? ktv_travel.nonce : '',
        currencySymbol: resolveCurrencySymbol(
            (typeof ktv_travel !== 'undefined' && ktv_travel.currency_code) ? ktv_travel.currency_code : 'USD',
            (typeof ktv_travel !== 'undefined' && ktv_travel.currency_symbol) ? ktv_travel.currency_symbol : ''
        ),
        currencyCode: (typeof ktv_travel !== 'undefined' && ktv_travel.currency_code) ? ktv_travel.currency_code : 'USD',
        currencySymbols: (typeof ktv_travel !== 'undefined' && ktv_travel.currency_symbols) ? ktv_travel.currency_symbols : {},
        currencyRates: (typeof ktv_travel !== 'undefined' && ktv_travel.currency_rates) ? ktv_travel.currency_rates : {
            'INR': 1.0, 'USD': 0.0120, 'EUR': 0.0111, 'GBP': 0.0095, 'AUD': 0.0183,
            'CAD': 0.0164, 'JPY': 1.80, 'AED': 0.0441, 'SAR': 0.0450,
            'SGD': 0.0161, 'MYR': 0.0567
        },

        baseCurrency: (typeof ktv_travel !== 'undefined' && ktv_travel.base_currency) ? ktv_travel.base_currency : 'INR',
        upiId: (typeof ktv_travel !== 'undefined' && ktv_travel.upi_id) ? ktv_travel.upi_id : '7006838859@okbizaxis',
        gpayNumber: (typeof ktv_travel !== 'undefined' && ktv_travel.gpay_number) ? ktv_travel.gpay_number : '',
        gpayName: (typeof ktv_travel !== 'undefined' && ktv_travel.gpay_name) ? ktv_travel.gpay_name : 'Imran Zaindari',
        activityIcons: (typeof ktv_travel !== 'undefined' && ktv_travel.activity_icons) ? ktv_travel.activity_icons : {},
        allLocations: (typeof ktv_travel !== 'undefined' && ktv_travel.all_locations) ? ktv_travel.all_locations : [],
        allFlights: (typeof ktv_travel !== 'undefined' && ktv_travel.all_flights) ? ktv_travel.all_flights : [],
        allCountries: (typeof ktv_travel !== 'undefined' && ktv_travel.all_countries && ktv_travel.all_countries.length) ? ktv_travel.all_countries : [],
        siteUrl: (typeof ktv_travel !== 'undefined' && ktv_travel.site_url) ? ktv_travel.site_url : '',
        qrCodeApi: (typeof ktv_travel !== 'undefined' && ktv_travel.qr_code_api) ? ktv_travel.qr_code_api : 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=',
        upiGpayEnabled: (typeof ktv_travel !== 'undefined' && ktv_travel.upi_gpay_enabled) ? ktv_travel.upi_gpay_enabled : false,
        creditCardEnabled: (typeof ktv_travel !== 'undefined' && ktv_travel.credit_card_enabled) ? ktv_travel.credit_card_enabled : true,
        dynamicTours: (typeof ktv_travel !== 'undefined' && ktv_travel.dynamic_tours) ? ktv_travel.dynamic_tours : [],
        idDocumentMandatory: (typeof ktv_travel !== 'undefined' && ktv_travel.id_document_mandatory) ? ktv_travel.id_document_mandatory : false,
        gstPercent: (typeof ktv_travel !== 'undefined' && ktv_travel.gst_percent) ? ktv_travel.gst_percent : 5,
        gstLabel: (typeof ktv_travel !== 'undefined' && ktv_travel.gst_label) ? ktv_travel.gst_label : 'GST',
        reviewModalTitle: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_title) ? ktv_travel.review_modal_title : 'Write a Review',
        reviewModalIcon: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_icon) ? ktv_travel.review_modal_icon : 'fa-star',
        reviewModalLogo: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_logo) ? ktv_travel.review_modal_logo : '',
        reviewModalBgColor: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_bg_color) ? ktv_travel.review_modal_bg_color : '',
        reviewModalBgImage: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_bg_image) ? ktv_travel.review_modal_bg_image : '',
        reviewModalTitleBgColor: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_title_bg_color) ? ktv_travel.review_modal_title_bg_color : '',
        reviewModalTitleBgImage: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_title_bg_image) ? ktv_travel.review_modal_title_bg_image : '',
        reviewModalTitleTextColor: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_title_text_color) ? ktv_travel.review_modal_title_text_color : '#ffffff',
        reviewModalTitleIconColor: (typeof ktv_travel !== 'undefined' && ktv_travel.review_modal_title_icon_color) ? ktv_travel.review_modal_title_icon_color : '#FFD700',
        extraAdultPercent: (typeof ktv_travel !== 'undefined' && ktv_travel.extra_adult_percent) ? parseFloat(ktv_travel.extra_adult_percent) : 50,
        extraChildPercent: (typeof ktv_travel !== 'undefined' && ktv_travel.extra_child_percent) ? parseFloat(ktv_travel.extra_child_percent) : 40,
        darkModeEnabled: (typeof ktv_travel !== 'undefined' && ktv_travel.dark_mode_enabled) ? ktv_travel.dark_mode_enabled === true : false,
        honeypotField: (typeof ktv_travel !== 'undefined' && ktv_travel.honeypot_field) ? ktv_travel.honeypot_field : 'ktv_hp_website',
        honeypotEnabled: (typeof ktv_travel !== 'undefined' && ktv_travel.honeypot_enabled) ? ktv_travel.honeypot_enabled === true : true,
        spamFilterEnabled: (typeof ktv_travel !== 'undefined' && ktv_travel.spam_filter_enabled) ? ktv_travel.spam_filter_enabled === true : true,
        rateLimitEnabled: (typeof ktv_travel !== 'undefined' && ktv_travel.rate_limit_enabled) ? ktv_travel.rate_limit_enabled === true : true,
        voucherDefaults: (typeof ktv_travel !== 'undefined' && ktv_travel.voucher_defaults) ? ktv_travel.voucher_defaults : {
            logo_url: '',
            header_bg: '#075e54',
            header_text: 'TRAVEL VOUCHER',
            footer_text: 'Thank you for choosing Kashmir Travelling Voyage',
            company_name: 'Kashmir Travelling Voyage',
            show_logo: true
        },
        voucherActionSettings: (typeof ktv_travel !== 'undefined' && ktv_travel.voucher_action_settings) ? ktv_travel.voucher_action_settings : {
            show_download: true,
            show_view: false,
            show_online: true,
            show_accept: true,
            show_modify: true,
            show_decline: true,
            show_cancel: true,
            show_dynamic: true,
            show_icon: true,
            show_text: true,
            button_size: 'medium',
            font_size: '13px',
            button_color: '#075e54',
            button_text_color: '#ffffff',
            button_position: 'bottom'
        },
        onpageVoucherSettings: (typeof ktv_travel !== 'undefined' && ktv_travel.onpage_voucher_settings) ? ktv_travel.onpage_voucher_settings : {
            logo_size: '120',
            logo_width: '300',
            logo_align: 'center',
            logo_position: 'top',
            heading_text: 'Your Travel Voucher',
            heading_sub_text: 'Thank you for booking with us',
            booking_ref_label: 'Booking Ref',
            voucher_code_label: 'Voucher Code',
            show_heading: true,
            show_booking_ref: true,
            show_voucher_code: true,
            show_travelling_to: true,
            show_guest_country: true,
            show_company_name: true,
            show_after_booking: true
        },
        voucherDisplaySettings: (typeof ktv_travel !== 'undefined' && ktv_travel.voucher_display_settings) ? ktv_travel.voucher_display_settings : {
            ticket_border_color: '#075e54',
            ticket_border_width: '2px',
            ticket_border_style: 'dashed',
            ticket_bg_color: '#ffffff',
            ticket_bg_gradient: '#f8f9fa',
            ticket_text_color: '#333333',
            ticket_radius: '20px',
            section_bg_color: '#f8f9fa',
            section_border_color: '#075e54'
        },
        emailVoucherSettings: (typeof ktv_travel !== 'undefined' && ktv_travel.email_voucher_settings) ? ktv_travel.email_voucher_settings : {},
        adminVoucherSettings: (typeof ktv_travel !== 'undefined' && ktv_travel.admin_voucher_settings) ? ktv_travel.admin_voucher_settings : {},
        guestVoucherLabels: (typeof ktv_travel !== 'undefined' && ktv_travel.guest_voucher_labels) ? ktv_travel.guest_voucher_labels : {
            change_heading: 'Need to make a change?',
            change_note: 'You can Modify Booking or Request Cancellation directly from this email — no login required.',
            modify_label: 'Modify Booking',
            cancel_label: 'Request Cancellation',
            download_label: 'Download',
            view_label: 'View',
            print_label: 'Print',
            done_label: 'Done',
            open_full_page_label: 'Open Full Page'
        },
        bookingModalSettings: (typeof ktv_travel !== 'undefined' && ktv_travel.booking_modal_settings) ? ktv_travel.booking_modal_settings : {
            enable_modal: false,
            modal_title: 'Book Your Trip',
            modal_subtitle: 'Fill the form to reserve your spot',
            modal_width: 'large',
            modal_animation: 'slide-down',
            close_text: 'Close'
        }
    };

    window.ktvTravelConfig = ktvConfig;

    if (ktvConfig.dynamicTours && ktvConfig.dynamicTours.length > 0) {
        ktvConfig.dynamicTours = ktvConfig.dynamicTours.filter(function (tour) {
            return tour.is_hardcoded != 1 && tour.is_ghost != 1;
        });
    }

    var originalDocumentTitle = null;
    var originalDocumentDescription = null;

    function captureOriginalMeta() {
        if (originalDocumentTitle === null) originalDocumentTitle = document.title || '';
        if (originalDocumentDescription === null) {
            var meta = document.querySelector('meta[name="description"]');
            originalDocumentDescription = meta ? (meta.getAttribute('content') || '') : '';
        }
    }

    function applyTourMeta(selectedOption) {
        captureOriginalMeta();
        var titleAttr = selectedOption ? selectedOption.getAttribute('data-meta-title') : '';
        var descAttr = selectedOption ? selectedOption.getAttribute('data-meta-description') : '';
        var meta = document.querySelector('meta[name="description"]');

        if (titleAttr) {
            document.title = titleAttr;
        } else if (originalDocumentTitle !== null) {
            document.title = originalDocumentTitle;
        }

        if (meta) {
            if (descAttr) {
                meta.setAttribute('content', descAttr);
            } else if (originalDocumentDescription !== null) {
                meta.setAttribute('content', originalDocumentDescription);
            }
        }
    }

    var fallbackCountries = [
        { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
        { code: '+355', name: 'Albania', flag: '🇦🇱' },
        { code: '+213', name: 'Algeria', flag: '🇩🇿' },
        { code: '+54', name: 'Argentina', flag: '🇦🇷' },
        { code: '+61', name: 'Australia', flag: '🇦🇺' },
        { code: '+43', name: 'Austria', flag: '🇦🇹' },
        { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
        { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
        { code: '+32', name: 'Belgium', flag: '🇧🇪' },
        { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
        { code: '+55', name: 'Brazil', flag: '🇧🇷' },
        { code: '+1', name: 'Canada', flag: '🇨🇦' },
        { code: '+86', name: 'China', flag: '🇨🇳' },
        { code: '+45', name: 'Denmark', flag: '🇩🇰' },
        { code: '+20', name: 'Egypt', flag: '🇪🇬' },
        { code: '+33', name: 'France', flag: '🇫🇷' },
        { code: '+49', name: 'Germany', flag: '🇩🇪' },
        { code: '+30', name: 'Greece', flag: '🇬🇷' },
        { code: '+91', name: 'India', flag: '🇮🇳' },
        { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
        { code: '+98', name: 'Iran', flag: '🇮🇷' },
        { code: '+964', name: 'Iraq', flag: '🇮🇶' },
        { code: '+353', name: 'Ireland', flag: '🇮🇪' },
        { code: '+972', name: 'Israel', flag: '🇮🇱' },
        { code: '+39', name: 'Italy', flag: '🇮🇹' },
        { code: '+81', name: 'Japan', flag: '🇯🇵' },
        { code: '+962', name: 'Jordan', flag: '🇯🇴' },
        { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
        { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
        { code: '+960', name: 'Maldives', flag: '🇲🇻' },
        { code: '+52', name: 'Mexico', flag: '🇲🇽' },
        { code: '+212', name: 'Morocco', flag: '🇲🇦' },
        { code: '+977', name: 'Nepal', flag: '🇳🇵' },
        { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
        { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
        { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
        { code: '+47', name: 'Norway', flag: '🇳🇴' },
        { code: '+968', name: 'Oman', flag: '🇴🇲' },
        { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
        { code: '+63', name: 'Philippines', flag: '🇵🇭' },
        { code: '+48', name: 'Poland', flag: '🇵🇱' },
        { code: '+351', name: 'Portugal', flag: '🇵🇹' },
        { code: '+974', name: 'Qatar', flag: '🇶🇦' },
        { code: '+40', name: 'Romania', flag: '🇷🇴' },
        { code: '+7', name: 'Russia', flag: '🇷🇺' },
        { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+65', name: 'Singapore', flag: '🇸🇬' },
        { code: '+27', name: 'South Africa', flag: '🇿🇦' },
        { code: '+82', name: 'South Korea', flag: '🇰🇷' },
        { code: '+34', name: 'Spain', flag: '🇪🇸' },
        { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
        { code: '+46', name: 'Sweden', flag: '🇸🇪' },
        { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
        { code: '+66', name: 'Thailand', flag: '🇹🇭' },
        { code: '+90', name: 'Turkey', flag: '🇹🇷' },
        { code: '+971', name: 'UAE', flag: '🇦🇪' },
        { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
        { code: '+1', name: 'USA', flag: '🇺🇸' },
        { code: '+84', name: 'Vietnam', flag: '🇻🇳' }
    ];

    function getCountriesList() {
        if (ktvConfig.allCountries && ktvConfig.allCountries.length > 0) {
            return ktvConfig.allCountries;
        }
        return fallbackCountries;
    }

    /* ============================================================
       4. CLEANUP HELPERS
       ============================================================ */

    function removeStaleInlineVouchers() {
        var stale = document.querySelectorAll('.ktv-inline-voucher-wrapper');
        if (stale && stale.length) {
            Array.prototype.forEach.call(stale, function (el) {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }
    }

    function hideBrokenLogos(rootEl) {
        if (!rootEl) return;
        var imgs = rootEl.querySelectorAll('.ktv-voucher-logo-wrapper img');
        Array.prototype.forEach.call(imgs, function (img) {
            if (img.getAttribute('data-ktv-error-bound') === '1') return;
            img.setAttribute('data-ktv-error-bound', '1');

            var src = img.getAttribute('src') || '';
            if (src.indexOf('data:') === 0 || src.indexOf('cid:') === 0) {
                return;
            }

            var hideOnce = function () {
                if (img.getAttribute('data-ktv-hidden') === '1') return;
                img.setAttribute('data-ktv-hidden', '1');
                img.style.display = 'none';
            };

            img.addEventListener('error', hideOnce);

            if (typeof img.decode === 'function') {
                img.decode().catch(function () {
                    if (!img.complete || img.naturalWidth === 0) {
                        hideOnce();
                    }
                });
            }
        });
    }

    function ktvInitVoucherDownloadToggle(rootEl) {
        if (!rootEl) return;
        var toggles = rootEl.querySelectorAll('.ktv-voucher-download-toggle');
        if (!toggles.length) return;

        Array.prototype.forEach.call(toggles, function (btn) {
            if (btn.getAttribute('data-ktv-bound') === '1') return;
            btn.setAttribute('data-ktv-bound', '1');

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var targetId = btn.getAttribute('data-target') || btn.getAttribute('aria-controls');
                if (!targetId) return;
                var menu = document.getElementById(targetId);
                if (!menu) return;

                var isOpen = btn.getAttribute('aria-expanded') === 'true';
                var willOpen = !isOpen;

                btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                var chevron = btn.querySelector('.fa-chevron-down, .fa-chevron-up');
                if (chevron) {
                    if (willOpen) {
                        chevron.classList.remove('fa-chevron-down');
                        chevron.classList.add('fa-chevron-up');
                    } else {
                        chevron.classList.remove('fa-chevron-up');
                        chevron.classList.add('fa-chevron-down');
                    }
                }

                if (willOpen) {
                    menu.hidden = false;
                    menu.style.display = 'block';
                } else {
                    menu.hidden = true;
                    menu.style.display = 'none';
                }
            });
        });

        if (rootEl.getAttribute('data-ktv-outside-bound') !== '1') {
            rootEl.setAttribute('data-ktv-outside-bound', '1');
            var outsideHandler = function (e) {
                if (e.target.closest && e.target.closest('.ktv-voucher-row-download')) return;
                Array.prototype.forEach.call(rootEl.querySelectorAll('.ktv-voucher-download-toggle'), function (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                    var chevron = btn.querySelector('.fa-chevron-up');
                    if (chevron) {
                        chevron.classList.remove('fa-chevron-up');
                        chevron.classList.add('fa-chevron-down');
                    }
                    var targetId = btn.getAttribute('data-target') || btn.getAttribute('aria-controls');
                    if (targetId) {
                        var menu = document.getElementById(targetId);
                        if (menu) {
                            menu.hidden = true;
                            menu.style.display = 'none';
                        }
                    }
                });
            };
            document.addEventListener('click', outsideHandler);
        }
    }

    /* ============================================================
       5. HONEYPOT AND SPAM VALIDATION
       ============================================================ */

    function getHoneypotFieldName(form) {
        if (form) {
            var explicit = form.getAttribute('data-honeypot-field');
            if (explicit) return explicit;
        }
        return ktvConfig.honeypotField || 'ktv_hp_website';
    }

    function isHoneypotEnabledForForm(form) {
        if (form) {
            var disabled = form.getAttribute('data-honeypot-disabled');
            if (disabled === '1' || disabled === 'true') return false;
        }
        return ktvConfig.honeypotEnabled !== false;
    }

    function getHoneypotValue(form) {
        if (!form || !isHoneypotEnabledForForm(form)) return '';
        var fieldName = getHoneypotFieldName(form);
        var input = form.querySelector('input[name="' + fieldName + '"]');
        if (!input) return '';
        return trim(input.value);
    }

    function isHoneypotFilled(form) {
        if (!isHoneypotEnabledForForm(form)) return false;
        return getHoneypotValue(form) !== '';
    }

    function handleHoneypotTrip(form, showFormMessage, modalId) {
        if (!isHoneypotFilled(form)) return false;

        var fakeSuccess = 'Thank you! Your submission has been received. We will contact you shortly.';
        if (typeof showFormMessage === 'function') {
            showFormMessage(fakeSuccess, 'success');
        }
        if (modalId && typeof window.ktvShowModalMessage === 'function') {
            window.ktvShowModalMessage(modalId, fakeSuccess, 'success');
        }
        try {
            form.reset();
        } catch (e) { }
        return true;
    }

    /* ============================================================
       6. ROTATING DOTS
       ============================================================ */

    function showRotatingDots(imageWrapper) {
        if (!imageWrapper || imageWrapper.querySelector('.ktv-rotating-dots')) return;
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'ktv-rotating-dots';
        for (var i = 0; i < 3; i++) {
            var dot = document.createElement('span');
            dotsContainer.appendChild(dot);
        }
        imageWrapper.style.position = 'relative';
        imageWrapper.appendChild(dotsContainer);
        setTimeout(function () { if (dotsContainer.parentNode) dotsContainer.remove(); }, 2000);
    }

    /* ============================================================
       7. SMART UPI AND GPAY LINKS
       ============================================================ */

    function openGPaySmartLink(upiId, amount, name) {
        if (!upiId) {
            showToast('UPI ID not configured. Please contact support.', 'error');
            return;
        }
        var displayName = name || ktvConfig.gpayName || 'Imran Zaindari';
        var encodedUpi = encodeURIComponent(upiId);
        var encodedName = encodeURIComponent(displayName);
        var encodedAmount = encodeURIComponent(amount || '0');
        var upiUrl = 'upi://pay?pa=' + encodedUpi + '&pn=' + encodedName + '&am=' + encodedAmount + '&cu=INR&tn=' + encodeURIComponent('Tour Booking - ' + displayName);

        var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!isMobile) {
            var qrUrl = ktvConfig.qrCodeApi + encodeURIComponent(upiUrl);
            window.open(qrUrl, '_blank');
            return;
        }

        var isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
            var modernPkg = 'com.google.android.apps.nbu.paisa.user';
            var legacyPkg = 'com.google.android.apps.walletnfcrel';
            var gpayIntent = 'intent://pay?pa=' + encodedUpi + '&pn=' + encodedName + '&am=' + encodedAmount + '&cu=INR&tn=' + encodeURIComponent('Tour Booking - ' + displayName) + '#Intent;scheme=gpay;package=' + modernPkg + ';S.browser_fallback_url=' + encodeURIComponent(upiUrl) + ';end;';

            var fallbackTimer = null;
            var visibilityFired = false;

            function onVisibilityChange() {
                if (document.hidden) {
                    visibilityFired = true;
                    if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
                    document.removeEventListener('visibilitychange', onVisibilityChange);
                }
            }

            document.addEventListener('visibilitychange', onVisibilityChange);

            fallbackTimer = setTimeout(function () {
                document.removeEventListener('visibilitychange', onVisibilityChange);
                if (!visibilityFired) {
                    var legacyIntent = 'intent://pay?pa=' + encodedUpi + '&pn=' + encodedName + '&am=' + encodedAmount + '&cu=INR&tn=' + encodeURIComponent('Tour Booking - ' + displayName) + '#Intent;scheme=gpay;package=' + legacyPkg + ';S.browser_fallback_url=' + encodeURIComponent(upiUrl) + ';end;';
                    window.location.href = legacyIntent;
                    setTimeout(function () {
                        window.location.href = upiUrl;
                    }, 1200);
                }
            }, 2500);

            window.location.href = gpayIntent;
        } else {
            window.location.href = upiUrl;
        }
    }

    /* ============================================================
       8. MODAL SYSTEM
       ============================================================ */

    window.closeModal = function (modalId) {
        var modal = document.getElementById(modalId);
        if (modal) modal.remove();
        if (document.querySelectorAll('.ktv-modal-overlay').length === 0) {
            document.body.classList.remove('ktv-modal-open');
        }
    };

    function showModalMessage(modalId, message, type) {
        var msgDiv = document.querySelector('#' + modalId + ' .ktv-modal-message');
        if (!msgDiv) return;
        var bgColor = type === 'success' ? '#d4edda' : (type === 'error' ? '#f8d7da' : '#fff3cd');
        var textColor = type === 'success' ? '#155724' : (type === 'error' ? '#721c24' : '#856404');
        var icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle');
        msgDiv.innerHTML = '<div style="background:' + bgColor + ';color:' + textColor + ';padding:12px;border-radius:8px;"><i class="fas ' + icon + '"></i> ' + escapeHtml(message) + '</div>';
        msgDiv.style.display = 'block';
        var hideMs = (type === 'warning') ? 8000 : 5000;
        setTimeout(function () { msgDiv.style.display = 'none'; }, hideMs);
    }

    window.ktvShowModalMessage = showModalMessage;

    function applyDarkModeClassToElement(el) {
        if (!el) return el;
        if (ktvConfig.darkModeEnabled) {
            el.classList.add('ktv-dark-mode');
            el.classList.add('ktv-dark-mode-global');
        }
        return el;
    }

    function maybeWarnAboutEmailFailure(response) {
        if (!response || !response.data) return false;
        var d = response.data;
        var adminSent = d.admin_email_sent;
        var guestSent = d.guest_email_sent;
        var anyFailed = (adminSent === false) || (guestSent === false);
        if (!anyFailed) return false;

        var parts = [];
        if (guestSent === false) {
            parts.push('the guest confirmation email');
        }
        if (adminSent === false) {
            parts.push('the admin notification email');
        }
        var msg = 'Booking was saved, but ' + parts.join(' and ') + ' could not be sent. ';
        msg += 'Please check your email settings (WP Mail SMTP / FluentSMTP plugin) or review KTV Travel → Auto Messages.';
        if (d.email_error) {
            msg += ' Error: ' + d.email_error;
        }
        showToast(msg, 'warning');
        return true;
    }

    /* ============================================================
       9. REVIEW MODAL
       ============================================================ */

    function getReviewModalMeta() {
        var formBlock = document.querySelector('.ktv-review-progressive[data-review-modal-title]');
        if (formBlock) {
            return {
                title: formBlock.getAttribute('data-review-modal-title') || ktvConfig.reviewModalTitle,
                icon: formBlock.getAttribute('data-review-modal-icon') || ktvConfig.reviewModalIcon,
                logo: formBlock.getAttribute('data-review-modal-logo') || ktvConfig.reviewModalLogo || '',
                bgColor: formBlock.getAttribute('data-review-modal-bg-color') || ktvConfig.reviewModalBgColor || '',
                bgImage: formBlock.getAttribute('data-review-modal-bg-image') || ktvConfig.reviewModalBgImage || '',
                titleBgColor: formBlock.getAttribute('data-review-modal-title-bg-color') || ktvConfig.reviewModalTitleBgColor || '',
                titleBgImage: formBlock.getAttribute('data-review-modal-title-bg-image') || ktvConfig.reviewModalTitleBgImage || '',
                titleTextColor: formBlock.getAttribute('data-review-modal-title-text-color') || ktvConfig.reviewModalTitleTextColor || '#ffffff',
                titleIconColor: formBlock.getAttribute('data-review-modal-title-icon-color') || ktvConfig.reviewModalTitleIconColor || '#FFD700'
            };
        }
        var dispBlock = document.querySelector('.ktv-reviews-google[data-review-modal-title]');
        if (dispBlock) {
            return {
                title: dispBlock.getAttribute('data-review-modal-title') || ktvConfig.reviewModalTitle,
                icon: dispBlock.getAttribute('data-review-modal-icon') || ktvConfig.reviewModalIcon,
                logo: dispBlock.getAttribute('data-review-modal-logo') || ktvConfig.reviewModalLogo || '',
                bgColor: dispBlock.getAttribute('data-review-modal-bg-color') || ktvConfig.reviewModalBgColor || '',
                bgImage: dispBlock.getAttribute('data-review-modal-bg-image') || ktvConfig.reviewModalBgImage || '',
                titleBgColor: dispBlock.getAttribute('data-review-modal-title-bg-color') || ktvConfig.reviewModalTitleBgColor || '',
                titleBgImage: dispBlock.getAttribute('data-review-modal-title-bg-image') || ktvConfig.reviewModalTitleBgImage || '',
                titleTextColor: dispBlock.getAttribute('data-review-modal-title-text-color') || ktvConfig.reviewModalTitleTextColor || '#ffffff',
                titleIconColor: dispBlock.getAttribute('data-review-modal-title-icon-color') || ktvConfig.reviewModalTitleIconColor || '#FFD700'
            };
        }
        return {
            title: ktvConfig.reviewModalTitle || 'Write a Review',
            icon: ktvConfig.reviewModalIcon || 'fa-star',
            logo: ktvConfig.reviewModalLogo || '',
            bgColor: ktvConfig.reviewModalBgColor || '',
            bgImage: ktvConfig.reviewModalBgImage || '',
            titleBgColor: ktvConfig.reviewModalTitleBgColor || '',
            titleBgImage: ktvConfig.reviewModalTitleBgImage || '',
            titleTextColor: ktvConfig.reviewModalTitleTextColor || '#ffffff',
            titleIconColor: ktvConfig.reviewModalTitleIconColor || '#FFD700'
        };
    }

    window.openReviewModal = function (tourId, tourName, pageId) {
        var modalId = 'ktv-review-modal-' + Date.now();
        var meta = getReviewModalMeta();
        var titleText = meta.title;
        var iconText = meta.icon;
        var logoUrl = meta.logo;

        var logoHtml = '';
        if (logoUrl) {
            logoHtml = '<div class="ktv-review-logo-wrapper" style="text-align:center;margin-bottom:12px;"><img src="' + escapeHtml(logoUrl) + '" alt="" width="180" height="70" loading="lazy" decoding="async" style="display:inline-block;max-width:180px;max-height:70px;width:auto;height:auto;object-fit:contain;"></div>';
        }

        var bgStyleParts = [];
        if (meta.bgColor) bgStyleParts.push('background-color:' + meta.bgColor);
        if (meta.bgImage) bgStyleParts.push('background-image:url(' + meta.bgImage + ')', 'background-size:cover', 'background-position:center');
        var bgStyle = bgStyleParts.length ? ' style="' + bgStyleParts.join(';') + ';"' : '';

        var headerStyleParts = ['padding:20px 25px', 'display:flex', 'justify-content:space-between', 'align-items:center', 'border-radius:24px 24px 0 0', 'position:sticky', 'top:0', 'z-index:10'];
        if (meta.titleBgImage) {
            headerStyleParts.push('background-image:url(' + meta.titleBgImage + ')');
            headerStyleParts.push('background-size:cover');
            headerStyleParts.push('background-position:center');
        } else if (meta.titleBgColor) {
            headerStyleParts.push('background:' + meta.titleBgColor);
        } else {
            headerStyleParts.push('background:linear-gradient(135deg,#075e54 0%,#28a745 100%)');
        }
        headerStyleParts.push('color:' + meta.titleTextColor);
        var reviewHeaderStyle = headerStyleParts.join(';');

        var siteName = (typeof ktv_travel !== 'undefined' && ktv_travel.site_name) ? ktv_travel.site_name : (ktvConfig.voucherDefaults && ktvConfig.voucherDefaults.company_name ? ktvConfig.voucherDefaults.company_name : 'Kashmir Travelling Voyage');

        var modalHtml = ''
            + '<div id="' + modalId + '" class="ktv-modal-overlay" role="dialog" aria-modal="true">'
            + '  <div class="ktv-modal-container">'
            + '    <div class="ktv-modal-header ktv-review-modal-header" style="' + reviewHeaderStyle + '">'
            + '      <h3 style="margin:0;font-size:22px;font-weight:600;color:' + meta.titleTextColor + ';"><i class="fas ' + escapeHtml(iconText) + '" style="margin-right:10px;color:' + meta.titleIconColor + ';"></i> ' + escapeHtml(titleText) + '</h3>'
            + '      <button class="ktv-modal-close" data-close-modal="' + modalId + '" aria-label="Close" style="color:' + meta.titleTextColor + ';">&times;</button>'
            + '    </div>'
            + '    <div class="ktv-modal-body' + (meta.bgColor || meta.bgImage ? ' ktv-review-modal-has-bg' : '') + '"' + bgStyle + '>'
            + logoHtml
            + '      <div class="ktv-review-site-name"><h2>' + escapeHtml(siteName) + '</h2><p>Share Your Experience!</p></div>'
            + '      <p style="margin-bottom:15px;color:#666;">Reviewing: <strong>' + escapeHtml(tourName || 'This Tour') + '</strong></p>'
            + '      <form id="ktv-review-modal-form-' + modalId + '" enctype="multipart/form-data">'
            + '        <input type="hidden" name="tour_id" value="' + escapeHtml(tourId || '') + '">'
            + '        <input type="hidden" name="tour_name" value="' + escapeHtml(tourName || '') + '">'
            + '        <input type="hidden" name="page_id" value="' + escapeHtml(pageId || '') + '">'
            + '        <input type="hidden" name="action" value="ktv_submit_review">'
            + '        <input type="hidden" name="nonce" value="' + ktvConfig.nonce + '">'
            + '        <div style="margin-bottom:20px;">'
            + '          <label class="ktv-modal-label">Your Rating *</label>'
            + '          <div class="ktv-modal-stars" data-rating="0">'
            + '            <span data-value="1">☆</span><span data-value="2">☆</span><span data-value="3">☆</span><span data-value="4">☆</span><span data-value="5">☆</span>'
            + '          </div>'
            + '          <input type="hidden" name="rating" class="ktv-modal-rating-input" value="0">'
            + '        </div>'
            + '        <div style="margin-bottom:15px;"><label class="ktv-modal-label">Your Name *</label><input type="text" name="name" class="ktv-modal-input" required></div>'
            + '        <div style="margin-bottom:15px;"><label class="ktv-modal-label">Your Email *</label><input type="email" name="email" class="ktv-modal-input" required></div>'
            + '        <div style="margin-bottom:15px;"><label class="ktv-modal-label">Review Title</label><input type="text" name="review_title" class="ktv-modal-input" placeholder="Summarize your experience"></div>'
            + '        <div style="margin-bottom:15px;"><label class="ktv-modal-label">Review Language</label>'
            + '          <select name="review_language" class="ktv-modal-input">'
            + '            <option value="en">English</option><option value="hi">Hindi</option><option value="ur">Urdu</option><option value="ar">Arabic</option><option value="fr">French</option><option value="es">Spanish</option><option value="de">German</option>'
            + '          </select>'
            + '        </div>'
            + '        <div style="margin-bottom:15px;"><label class="ktv-modal-label">Upload Image (optional)</label><input type="file" name="review_image" accept="image/*" class="ktv-modal-input" style="padding:8px 12px;"></div>'
            + '        <div style="margin-bottom:15px;"><label class="ktv-modal-label">Profile Pic (optional)</label><input type="file" name="reviewer_profile_pic" accept="image/*" class="ktv-modal-input" style="padding:8px 12px;"></div>'
            + '        <div style="margin-bottom:20px;"><label class="ktv-modal-label">Your Review *</label><textarea name="content" rows="4" class="ktv-modal-input" required></textarea></div>'
            + '        <button type="submit" class="ktv-modal-btn">Submit Review <i class="fas fa-paper-plane"></i></button>'
            + '        <div class="ktv-modal-message"></div>'
            + '      </form>'
            + '    </div>'
            + '    <div class="ktv-modal-footer"><small>Your review helps other travelers make better choices.</small></div>'
            + '  </div>'
            + '</div>';

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.classList.add('ktv-modal-open');

        var modalEl = document.getElementById(modalId);
        if (modalEl) applyDarkModeClassToElement(modalEl);

        $$('#' + modalId + ' .ktv-modal-close').forEach(function (btn) {
            btn.addEventListener('click', function () { window.closeModal(modalId); });
        });

        var stars = document.querySelectorAll('#' + modalId + ' .ktv-modal-stars span');
        var ratingInput = document.querySelector('#' + modalId + ' .ktv-modal-rating-input');

        stars.forEach(function (star) {
            star.setAttribute('role', 'button');
            star.setAttribute('tabindex', '0');
            star.setAttribute('aria-label', 'Rate ' + star.getAttribute('data-value') + ' star' + (parseInt(star.getAttribute('data-value'), 10) > 1 ? 's' : ''));
            star.addEventListener('keydown', function (ev) {
                if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.click(); }
            });
            star.addEventListener('click', function () {
                var val = parseInt(this.getAttribute('data-value'));
                ratingInput.value = val;
                stars.forEach(function (s, idx) {
                    if (idx < val) { s.innerHTML = '★'; s.style.color = '#FFD700'; }
                    else { s.innerHTML = '☆'; s.style.color = '#ddd'; }
                });
            });
            star.addEventListener('mouseenter', function () {
                var val = parseInt(this.getAttribute('data-value'));
                stars.forEach(function (s, idx) {
                    if (idx < val) { s.innerHTML = '★'; s.style.color = '#FFD700'; }
                    else { s.innerHTML = '☆'; s.style.color = '#ddd'; }
                });
            });
            star.addEventListener('mouseleave', function () {
                var currentVal = parseInt(ratingInput.value);
                stars.forEach(function (s, idx) {
                    if (idx < currentVal) { s.innerHTML = '★'; s.style.color = '#FFD700'; }
                    else { s.innerHTML = '☆'; s.style.color = '#ddd'; }
                });
            });
        });

        var form = document.getElementById('ktv-review-modal-form-' + modalId);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var formData = new FormData(this);
            var submitBtn = this.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            var ratingVal = ratingInput.value;
            if (!ratingVal || ratingVal < 1) { showModalMessage(modalId, 'Please select a star rating', 'error'); return; }

            var titleInput = this.querySelector('input[name="review_title"]');
            if (titleInput && titleInput.value) {
                formData.append('review_title', titleInput.value);
            }

            var imageInput = this.querySelector('input[name="review_image"]');
            if (imageInput && imageInput.files && imageInput.files.length > 0) {
                var file = imageInput.files[0];
                if (file.size > 50000) {
                    compressImage(file, 50, function (compressedBlob) {
                        var newFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
                        formData.set('review_image', newFile);
                        submitReview(formData, submitBtn, originalText, modalId);
                    });
                    return;
                }
            }
            submitReview(formData, submitBtn, originalText, modalId);
        });

        function submitReview(formData, submitBtn, originalText, modalId) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
                .then(function (response) { return response.json(); })
                .then(function (response) {
                    if (response.success) {
                        showModalMessage(modalId, response.data.message || 'Thank you for your review!', 'success');
                        setTimeout(function () { window.closeModal(modalId); location.reload(); }, 2000);
                    } else {
                        showModalMessage(modalId, (response.data && response.data.message) || 'Error submitting review', 'error');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                })
                .catch(function () {
                    showModalMessage(modalId, 'Server error. Please try again.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
        }
    };

    /* ============================================================
       10. FIELD VALIDATION
       ============================================================ */

    function clearFieldErrors(form) {
        if (!form) return;
        form.querySelectorAll('.ktv-field-error-message').forEach(function (el) { el.remove(); });
        form.querySelectorAll('.ktv-has-error').forEach(function (el) { el.classList.remove('ktv-has-error'); });
        form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });
    }

    function markFieldError(field, message) {
        if (!field) return;
        var wrapper = field.closest('.ktv-input-group') || field.closest('.ktv-phone-group') || field.parentElement;
        if (wrapper) wrapper.classList.add('ktv-has-error');
        field.classList.add('error');

        var errId = 'ktv-err-' + Math.random().toString(36).substr(2, 9);
        var msg = document.createElement('div');
        msg.className = 'ktv-field-error-message';
        msg.id = errId;
        msg.textContent = message;

        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.insertBefore(msg, wrapper.nextSibling);
        } else if (field.parentNode) {
            field.parentNode.appendChild(msg);
        }
    }

    function isElementVisible(el) {
        if (!el) return false;
        if (el.hidden) return false;
        var step = el.closest('.ktv-form-step');
        if (step && step.style.display === 'none') return false;
        return true;
    }

    function validateBookingFields(form, scopeEl) {
        if (!form) return true;
        clearFieldErrors(form);
        var firstInvalid = null;
        var errors = [];
        var scope = scopeEl || form;

        var requiredFields = scope.querySelectorAll('[required]');
        Array.prototype.forEach.call(requiredFields, function (field) {
            if (!isElementVisible(field)) return;
            if (field.type === 'file') {
                if (!field.files || field.files.length === 0) {
                    markFieldError(field, 'This file is required');
                    errors.push(field.name);
                    if (!firstInvalid) firstInvalid = field;
                }
                return;
            }
            if (field.type === 'radio' || field.type === 'checkbox') {
                var group = form.querySelectorAll('input[name="' + field.name + '"]');
                var anyChecked = false;
                Array.prototype.forEach.call(group, function (g) { if (g.checked) anyChecked = true; });
                if (!anyChecked) {
                    markFieldError(field, 'Please select an option');
                    errors.push(field.name);
                    if (!firstInvalid) firstInvalid = field;
                }
                return;
            }
            if (!trim(field.value)) {
                var label = field.getAttribute('placeholder') || field.name;
                markFieldError(field, label.replace(/\s*\*$/, '') + ' is required');
                errors.push(field.name);
                if (!firstInvalid) firstInvalid = field;
            }
        });

        var customRequired = scope.querySelectorAll('[data-required="1"]');
        Array.prototype.forEach.call(customRequired, function (field) {
            if (!isElementVisible(field)) return;
            if (!trim(field.value)) {
                var label = field.getAttribute('placeholder') || field.name;
                markFieldError(field, label + ' is required');
                errors.push(field.name);
                if (!firstInvalid) firstInvalid = field;
            }
        });

        var emailField = scope.querySelector('input[name="email"]');
        if (emailField && emailField.value && isElementVisible(emailField) && !validateEmail(emailField.value.trim())) {
            markFieldError(emailField, 'Please enter a valid email address');
            errors.push('email');
            if (!firstInvalid) firstInvalid = emailField;
        }

        var phoneField = scope.querySelector('input[name="phone"]');
        if (phoneField && phoneField.value && isElementVisible(phoneField) && !validatePhone(phoneField.value.trim())) {
            markFieldError(phoneField, 'Please enter a valid phone number (7-15 digits)');
            errors.push('phone');
            if (!firstInvalid) firstInvalid = phoneField;
        }

        var arrivalField = scope.querySelector('input[name="arrival_date"]');
        var departureField = scope.querySelector('input[name="departure_date"]');
        if (arrivalField && departureField && arrivalField.value && departureField.value &&
            isElementVisible(arrivalField) && isElementVisible(departureField)) {
            if (new Date(departureField.value) <= new Date(arrivalField.value)) {
                markFieldError(departureField, 'Departure date must be after arrival date');
                errors.push('departure_date');
                if (!firstInvalid) firstInvalid = departureField;
            }
        }

        if (ktvConfig.idDocumentMandatory) {
            var idDoc = scope.querySelector('input[name="id_document"]');
            var idFile = scope.querySelector('input[name="id_document_file"]');
            if (isElementVisible(idDoc) || isElementVisible(idFile)) {
                var hasId = false;
                if (idDoc && trim(idDoc.value)) hasId = true;
                if (idFile && idFile.files && idFile.files.length > 0) hasId = true;
                if (!hasId) {
                    if (idDoc) markFieldError(idDoc, 'ID Document is MANDATORY');
                    errors.push('id_document');
                    if (!firstInvalid && idDoc) firstInvalid = idDoc;
                }
            }
        }

        if (firstInvalid) {
            animateScrollTo(firstInvalid, 120);
            try { firstInvalid.focus(); } catch (e) { }
        }

        return errors.length === 0;
    }

    /* ============================================================
       11. BOOKING MODAL HELPERS
       ============================================================ */

    function readBlockModalSettings(formContainer) {
        var settings = {
            enableModal: ktvConfig.bookingModalSettings.enable_modal === true,
            modalTitle: ktvConfig.bookingModalSettings.modal_title || 'Book Your Trip',
            modalSubtitle: ktvConfig.bookingModalSettings.modal_subtitle || 'Fill the form to reserve your spot',
            modalWidth: ktvConfig.bookingModalSettings.modal_width || 'large',
            modalAnimation: ktvConfig.bookingModalSettings.modal_animation || 'slide-down',
            modalCloseText: ktvConfig.bookingModalSettings.close_text || 'Close',
            showTourType: true,
            showTourIcon: true,
            extraAdultPercent: ktvConfig.extraAdultPercent,
            extraChildPercent: ktvConfig.extraChildPercent,
            tourTypePriceGap: 15
        };
        if (!formContainer) return settings;
        var wrap = formContainer.classList && formContainer.classList.contains('ktv-booking-multi-step')
            ? formContainer
            : formContainer.closest && formContainer.closest('.ktv-booking-multi-step');
        if (!wrap) return settings;
        var em = wrap.getAttribute('data-enable-modal');
        if (em === 'true') settings.enableModal = true;
        if (em === 'false') settings.enableModal = false;
        var mt = wrap.getAttribute('data-modal-title');
        if (mt) settings.modalTitle = mt;
        var ms = wrap.getAttribute('data-modal-subtitle');
        if (ms) settings.modalSubtitle = ms;
        var mw = wrap.getAttribute('data-modal-width');
        if (mw) settings.modalWidth = mw;
        var ma = wrap.getAttribute('data-modal-animation');
        if (ma) settings.modalAnimation = ma;
        var mc = wrap.getAttribute('data-modal-close-text');
        if (mc) settings.modalCloseText = mc;
        var stt = wrap.getAttribute('data-show-tour-type');
        if (stt === 'false') settings.showTourType = false;
        var sti = wrap.getAttribute('data-show-tour-icon');
        if (sti === 'false') settings.showTourIcon = false;
        var eap = wrap.getAttribute('data-extra-adult-percent');
        if (eap && !isNaN(parseFloat(eap))) settings.extraAdultPercent = parseFloat(eap);
        var ecp = wrap.getAttribute('data-extra-child-percent');
        if (ecp && !isNaN(parseFloat(ecp))) settings.extraChildPercent = parseFloat(ecp);
        var ttpg = wrap.getAttribute('data-tour-type-price-gap');
        if (ttpg !== null && ttpg !== '' && !isNaN(parseInt(ttpg))) {
            settings.tourTypePriceGap = parseInt(ttpg);
        }
        return settings;
    }

    function buildCountryOptionsHtml() {
        var countries = getCountriesList();
        var html = '<option value="">Select Country</option>';
        countries.forEach(function (c) {
            html += '<option value="' + escapeHtml(c.name) + '">' + escapeHtml(c.flag + ' ' + c.name) + '</option>';
        });
        return html;
    }

    function buildPhoneCodeOptionsHtml() {
        var countries = getCountriesList();
        var seen = {};
        var html = '';
        countries.forEach(function (c) {
            if (seen[c.code]) return;
            seen[c.code] = true;
            html += '<option value="' + escapeHtml(c.code) + '"' + (c.code === '+91' ? ' selected' : '') + '>' + escapeHtml(c.flag + ' ' + c.code) + '</option>';
        });
        return html;
    }

    function getHoneypotFieldHtml(form) {
        if (!isHoneypotEnabledForForm(form)) return '';
        var fieldName = getHoneypotFieldName(form);
        return ''
            + '<div class="ktv-honeypot-field" data-ktv-protected="1" aria-hidden="true">'
            + '  <label for="' + escapeHtml(fieldName) + '">Website (leave blank)</label>'
            + '  <input type="text" name="' + escapeHtml(fieldName) + '" id="' + escapeHtml(fieldName) + '" value="" tabindex="-1" autocomplete="off" />'
            + '</div>';
    }

    function buildTourOptionAttrs(tour) {
        var originalPrice = parseFloat(tour.tour_price) || 0;
        var offerPriceRaw = parseFloat(tour.offer_price);
        if (isNaN(offerPriceRaw)) offerPriceRaw = parseFloat(tour.tour_offer_price) || 0;
        var hasOffer = (offerPriceRaw > 0 && originalPrice > 0 && offerPriceRaw < originalPrice);
        var displayPrice = hasOffer ? offerPriceRaw : originalPrice;

        var rawPax = {
            pax_1_price: tour.pax_1_price,
            pax_2_price: tour.pax_2_price,
            pax_3_price: tour.pax_3_price,
            group_price: tour.group_price,
            family_price: tour.family_price
        };
        var adjustedPax = resolvePaxForOfferPrice(rawPax, displayPrice, originalPrice);
        var perPersonBase = getBasePerPerson(displayPrice, adjustedPax);
        var currencySymbolVal = tour.currency_symbol || ktvConfig.currencySymbol || '$';

        var priceBasis = tour.price_basis || 'total';
        var showPerDay = (tour.show_per_day_price !== undefined && parseInt(tour.show_per_day_price, 10) === 1) ? '1' : '0';
        var showComplete = (tour.show_complete_price !== undefined && parseInt(tour.show_complete_price, 10) === 1) ? '1' : '0';
        var showBoth = (tour.show_per_day_rate_and_total !== undefined && parseInt(tour.show_per_day_rate_and_total, 10) === 1) ? '1' : '0';
        var showExtra = (tour.show_extra_person_rates !== undefined && parseInt(tour.show_extra_person_rates, 10) === 1) ? '1' : '0';
        var defaultAdults = (tour.tour_default_adults !== undefined) ? parseInt(tour.tour_default_adults, 10) : 2;
        if (isNaN(defaultAdults) || defaultAdults < 1) defaultAdults = 2;
        var defaultChildren = (tour.tour_default_children !== undefined) ? parseInt(tour.tour_default_children, 10) : 0;
        if (isNaN(defaultChildren) || defaultChildren < 0) defaultChildren = 0;
        var enableIp = (tour.enable_ip_pricing !== undefined) ? (parseInt(tour.enable_ip_pricing, 10) === 1 ? '1' : '0') : '1';

        var pax1Label = tour.pax_1_label || '1 Pax';
        var pax2Label = tour.pax_2_label || '2 Pax';
        var pax3Label = tour.pax_3_label || '3 Pax';
        var groupLabel = tour.group_label || 'Group';
        var familyLabel = tour.family_label || 'Family';
        var pax1Icon = tour.pax_1_icon || 'fa-user';
        var pax2Icon = tour.pax_2_icon || 'fa-user-friends';
        var pax3Icon = tour.pax_3_icon || 'fa-users';
        var groupIcon = tour.group_icon || 'fa-user-plus';
        var familyIcon = tour.family_icon || 'fa-home';

        var gstPercentAttr = (tour.gst_percent !== undefined && tour.gst_percent !== '' && tour.gst_percent !== null) ? tour.gst_percent : (ktvConfig.gstPercent || '5');
        var gstLabelAttr = tour.gst_label || ktvConfig.gstLabel || 'GST';

        var extraAdultLabelAttr = tour.extra_adult_label || 'Extra Adult';
        var extraChildLabelAttr = tour.extra_child_label || 'Extra Child';

        var attrs = ''
            + ' data-price="' + displayPrice + '"'
            + ' data-original-price="' + originalPrice + '"'
            + ' data-offer-price="' + (hasOffer ? offerPriceRaw : 0) + '"'
            + ' data-currency-symbol="' + escapeHtml(currencySymbolVal) + '"'
            + ' data-price-basis="' + escapeHtml(priceBasis) + '"'
            + ' data-show-per-day="' + showPerDay + '"'
            + ' data-show-complete="' + showComplete + '"'
            + ' data-show-per-day-and-total="' + showBoth + '"'
            + ' data-show-extra-person-rates="' + showExtra + '"'
            + ' data-enable-ip-pricing="' + enableIp + '"'
            + ' data-tour-adults="' + defaultAdults + '"'
            + ' data-tour-children="' + defaultChildren + '"'
            + ' data-id="' + (parseInt(tour.id, 10) || 0) + '"'
            + ' data-nights="' + (parseInt(tour.nights, 10) || 0) + '"'
            + ' data-days="' + (parseInt(tour.days, 10) || 0) + '"'
            + ' data-tour-nights="' + (parseInt(tour.nights, 10) || 0) + '"'
            + ' data-tour-days="' + (parseInt(tour.days, 10) || 0) + '"'
            + ' data-location="' + escapeHtml(tour.location || '') + '"'
            + ' data-block-type="' + escapeHtml(tour.block_type || 'grid') + '"'
            + ' data-badge-text="' + escapeHtml(tour.badge_text || '') + '"'
            + ' data-pax1="' + (parseFloat(adjustedPax.pax_1_price) || 0) + '"'
            + ' data-pax2="' + (parseFloat(adjustedPax.pax_2_price) || 0) + '"'
            + ' data-pax3="' + (parseFloat(adjustedPax.pax_3_price) || 0) + '"'
            + ' data-group="' + (parseFloat(adjustedPax.group_price) || 0) + '"'
            + ' data-family="' + (parseFloat(adjustedPax.family_price) || 0) + '"'
            + ' data-extra-adult="' + (parseFloat(tour.extra_adult_price) || 0) + '"'
            + ' data-extra-child="' + (parseFloat(tour.extra_child_price) || 0) + '"'
            + ' data-extra-adult-label="' + escapeHtml(extraAdultLabelAttr) + '"'
            + ' data-extra-child-label="' + escapeHtml(extraChildLabelAttr) + '"'
            + ' data-pax1-label="' + escapeHtml(pax1Label) + '"'
            + ' data-pax2-label="' + escapeHtml(pax2Label) + '"'
            + ' data-pax3-label="' + escapeHtml(pax3Label) + '"'
            + ' data-group-label="' + escapeHtml(groupLabel) + '"'
            + ' data-family-label="' + escapeHtml(familyLabel) + '"'
            + ' data-pax1-icon="' + escapeHtml(pax1Icon) + '"'
            + ' data-pax2-icon="' + escapeHtml(pax2Icon) + '"'
            + ' data-pax3-icon="' + escapeHtml(pax3Icon) + '"'
            + ' data-group-icon="' + escapeHtml(groupIcon) + '"'
            + ' data-family-icon="' + escapeHtml(familyIcon) + '"'
            + ' data-gst-percent="' + escapeHtml(String(gstPercentAttr)) + '"'
            + ' data-gst-label="' + escapeHtml(gstLabelAttr) + '"'
            + ' data-visible-pax-columns="' + escapeHtml(tour.visible_pax_columns || 'pax1') + '"'
            + ' data-tour-per-person="' + perPersonBase + '"'
            + ' data-tour-total-price="' + displayPrice + '"'
            + ' data-tour-icon="' + escapeHtml(tour.icon_title || 'fa-map-marker-alt') + '"'
            + ' data-tour-icon-size="' + escapeHtml(tour.icon_size || '14px') + '"'
            + ' data-tour-icon-color="' + escapeHtml(tour.icon_color || '#075e54') + '"'
            + ' data-icon="' + escapeHtml(tour.icon_title || 'fa-map-marker-alt') + '"'
            + ' data-enable-icon="' + ((tour.enable_icon_dropdown === 0 || tour.enable_icon_dropdown === '0') ? '0' : '1') + '"'
            + ' data-enable-icon-dropdown="' + ((tour.enable_icon_dropdown === 0 || tour.enable_icon_dropdown === '0') ? '0' : '1') + '"'
            + ' data-source="' + escapeHtml(tour.source || 'database') + '"'
            + ' data-is-hardcoded="0"';

        if (tour.meta_title) {
            attrs += ' data-meta-title="' + escapeHtml(tour.meta_title) + '"';
        }
        if (tour.meta_description) {
            attrs += ' data-meta-description="' + escapeHtml(tour.meta_description) + '"';
        }
        return attrs;
    }

    function renderPaxItemsHtml(selectedOption, currency) {
        if (!selectedOption) return '';
        var visible = (selectedOption.getAttribute('data-visible-pax-columns') || 'pax1').split(',');

        var pax1Icon = selectedOption.getAttribute('data-pax1-icon') || 'fa-user';
        var pax2Icon = selectedOption.getAttribute('data-pax2-icon') || 'fa-user-friends';
        var pax3Icon = selectedOption.getAttribute('data-pax3-icon') || 'fa-users';
        var groupIcon = selectedOption.getAttribute('data-group-icon') || 'fa-user-plus';
        var familyIcon = selectedOption.getAttribute('data-family-icon') || 'fa-home';

        var pax1Label = selectedOption.getAttribute('data-pax1-label') || '1 Pax';
        var pax2Label = selectedOption.getAttribute('data-pax2-label') || '2 Pax';
        var pax3Label = selectedOption.getAttribute('data-pax3-label') || '3 Pax';
        var groupLabel = selectedOption.getAttribute('data-group-label') || 'Group';
        var familyLabel = selectedOption.getAttribute('data-family-label') || 'Family';

        var cols = [
            { key: 'pax1', label: pax1Label, icon: pax1Icon, attr: 'data-pax1', count: 1 },
            { key: 'pax2', label: pax2Label, icon: pax2Icon, attr: 'data-pax2', count: 2 },
            { key: 'pax3', label: pax3Label, icon: pax3Icon, attr: 'data-pax3', count: 3 },
            { key: 'group', label: groupLabel, icon: groupIcon, attr: 'data-group', count: 3 },
            { key: 'family', label: familyLabel, icon: familyIcon, attr: 'data-family', count: 3 }
        ];
        var html = '';
        cols.forEach(function (c) {
            if (visible.indexOf(c.key) === -1) return;
            var val = parseFloat(selectedOption.getAttribute(c.attr)) || 0;
            if (val <= 0) return;
            var iconsHtml = '<span class="ktv-pax-icons-group">';
            for (var ic = 0; ic < c.count; ic++) {
                iconsHtml += '<i class="fas ' + escapeHtml(c.icon) + '" aria-hidden="true"></i>';
            }
            iconsHtml += '</span>';
            html += '<div class="ktv-pax-item" style="text-align:center;font-size:12px;">'
                + iconsHtml
                + '<span style="display:block;color:#666;margin-bottom:2px;">' + escapeHtml(c.label) + '</span>'
                + '<strong style="color:#28a745;font-size:13px;">' + currency + Math.round(val) + '</strong>'
                + '</div>';
        });


        if (selectedOption.getAttribute('data-show-extra-person-rates') === '1') {
            var extraA = parseFloat(selectedOption.getAttribute('data-extra-adult')) || 0;
            var extraC = parseFloat(selectedOption.getAttribute('data-extra-child')) || 0;
            var extraALabel = selectedOption.getAttribute('data-extra-adult-label') || 'Extra Adult';
            var extraCLabel = selectedOption.getAttribute('data-extra-child-label') || 'Extra Child';
            if (extraA > 0) {
                html += '<div class="ktv-pax-item ktv-pax-extra"><i class="fas fa-user-plus" style="display:block;margin-bottom:4px;"></i><span style="display:block;color:#666;margin-bottom:2px;">' + escapeHtml(extraALabel) + '</span><strong style="color:#28a745;font-size:13px;">' + currency + Math.round(extraA) + '</strong></div>';
            }
            if (extraC > 0) {
                html += '<div class="ktv-pax-item ktv-pax-extra"><i class="fas fa-child" style="display:block;margin-bottom:4px;"></i><span style="display:block;color:#666;margin-bottom:2px;">' + escapeHtml(extraCLabel) + '</span><strong style="color:#28a745;font-size:13px;">' + currency + Math.round(extraC) + '</strong></div>';
            }
        }
        return html;
    }

    function applyPaxGridToContainer(container, selectedOption, currency) {
        if (!container) return;
        var html = renderPaxItemsHtml(selectedOption, currency || ktvConfig.currencySymbol || '$');
        if (html) {
            container.innerHTML = html;
            container.style.display = 'grid';
        } else {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    }

    function extractGstPercentFromOption(selectedOption, container) {
        if (selectedOption) {
            var attrPct = parseFloat(selectedOption.getAttribute('data-gst-percent'));
            if (!isNaN(attrPct) && attrPct >= 0) return attrPct;
        }
        if (container) {
            var badge = container.querySelector('.ktv-gst-badge');
            if (badge) {
                var m = badge.textContent.match(/(\d+(?:\.\d+)?)\s*%/);
                if (m) {
                    var pct = parseFloat(m[1]);
                    if (!isNaN(pct) && pct >= 0) return pct;
                }
            }
        }
        var cfgPct = parseFloat(ktvConfig.gstPercent);
        if (!isNaN(cfgPct) && cfgPct >= 0) return cfgPct;
        return 5;
    }
    /* ============================================================
       12. BOOKING MODAL RENDERER
       ============================================================ */

    window.openBookingModal = function (tourId, tourName, tourPrice, tourLocation, blockType) {
        removeStaleInlineVouchers();

        var existingForm = document.querySelector('.ktv-booking-multi-step:not(.ktv-booking-modal-form)');
        var blockSettings = existingForm ? readBlockModalSettings(existingForm) : readBlockModalSettings(null);

        if (existingForm && !blockSettings.enableModal) {
            var tourIdInput = existingForm.querySelector('input[name="tour_id"]');
            var tourNameInput = existingForm.querySelector('input[name="tour_name"]');
            var tourPriceInput = existingForm.querySelector('input[name="tour_price"]');
            var blockTypeInput = existingForm.querySelector('input[name="block_type"]');
            var travelLocationInput = existingForm.querySelector('input[name="travel_location"]');

            if (tourIdInput) tourIdInput.value = tourId || '';
            if (tourNameInput) tourNameInput.value = tourName || '';
            if (tourPriceInput) tourPriceInput.value = tourPrice || '';
            if (blockTypeInput) blockTypeInput.value = blockType || 'grid';
            if (travelLocationInput && tourLocation) travelLocationInput.value = tourLocation;

            if (tourLocation) {
                var locationSearch = existingForm.querySelector('#ktv-travel-location-search, .ktv-location-search-input');
                var locationHidden = existingForm.querySelector('#ktv-travel-location-hidden');
                if (locationSearch) {
                    locationSearch.value = tourLocation;
                    if (locationHidden) locationHidden.value = tourLocation;
                    triggerEvent(locationSearch, 'input');
                }
            }

            var tourSelect = existingForm.querySelector('select[name="tour_type"]');
            if (tourSelect && tourName) {
                var found = false;
                var tourNameClean = stripIconPrefix(tourName).toLowerCase();

                for (var i = 0; i < tourSelect.options.length; i++) {
                    var opt = tourSelect.options[i];
                    var optValueClean = stripIconPrefix(opt.value || '').toLowerCase();
                    var optTextClean = stripIconPrefix(opt.text || '').toLowerCase();

                    if (optValueClean === tourNameClean || optTextClean === tourNameClean) {
                        tourSelect.selectedIndex = i;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    for (var j = 0; j < tourSelect.options.length; j++) {
                        var opt2 = tourSelect.options[j];
                        var cleanText2 = stripIconPrefix(opt2.text || '').toLowerCase();
                        if (cleanText2 && (cleanText2.indexOf(tourNameClean) !== -1 || tourNameClean.indexOf(cleanText2) !== -1)) {
                            tourSelect.selectedIndex = j;
                            found = true;
                            break;
                        }
                    }
                }

                if (!found && tourName) {
                    var alreadyExists = false;
                    for (var k = 0; k < tourSelect.options.length; k++) {
                        if (stripIconPrefix(tourSelect.options[k].value).toLowerCase() === tourNameClean) {
                            alreadyExists = true;
                            tourSelect.selectedIndex = k;
                            break;
                        }
                    }
                    if (!alreadyExists) {
                        var card = document.querySelector('.ktv-tour-card[data-tour-name="' + tourName.replace(/"/g, '\\"') + '"], .ktv-tour-package-card[data-tour-name="' + tourName.replace(/"/g, '\\"') + '"]');
                        var cardTour = card ? {
                            id: card.getAttribute('data-tour-id') || tourId || 0,
                            tour_price: card.getAttribute('data-original-price') || card.getAttribute('data-tour-total-price') || tourPrice || 0,
                            offer_price: card.getAttribute('data-offer-price') || 0,
                            currency_symbol: card.getAttribute('data-currency-symbol') || ktvConfig.currencySymbol || '$',
                            price_basis: card.getAttribute('data-price-basis') || 'total',
                            show_per_day_price: card.getAttribute('data-show-per-day') || '1',
                            show_complete_price: card.getAttribute('data-show-complete') || '0',
                            show_per_day_rate_and_total: card.getAttribute('data-show-per-day-and-total') || '0',
                            show_extra_person_rates: card.getAttribute('data-show-extra-person-rates') || '0',
                            enable_ip_pricing: card.getAttribute('data-enable-ip-pricing') || '1',
                            tour_default_adults: card.getAttribute('data-tour-adults') || '2',
                            tour_default_children: card.getAttribute('data-tour-children') || '0',
                            pax_1_price: card.getAttribute('data-pax1') || 0,
                            pax_2_price: card.getAttribute('data-pax2') || 0,
                            pax_3_price: card.getAttribute('data-pax3') || 0,
                            group_price: card.getAttribute('data-group') || 0,
                            family_price: card.getAttribute('data-family') || 0,
                            extra_adult_price: card.getAttribute('data-extra-adult') || 0,
                            extra_child_price: card.getAttribute('data-extra-child') || 0,
                            extra_adult_label: card.getAttribute('data-extra-adult-label') || 'Extra Adult',
                            extra_child_label: card.getAttribute('data-extra-child-label') || 'Extra Child',
                            nights: card.getAttribute('data-tour-nights') || 0,
                            days: card.getAttribute('data-tour-days') || 0,
                            location: card.getAttribute('data-tour-location') || tourLocation || '',
                            block_type: card.getAttribute('data-block-type') || blockType || 'grid',
                            icon_title: card.getAttribute('data-tour-icon') || 'fa-map-marker-alt',
                            icon_size: card.getAttribute('data-tour-icon-size') || '14px',
                            icon_color: card.getAttribute('data-tour-icon-color') || '#075e54',
                            enable_icon_dropdown: card.getAttribute('data-enable-icon-dropdown') === '0' ? 0 : 1,
                            visible_pax_columns: card.getAttribute('data-visible-pax-columns') || 'pax1',
                            pax_1_label: card.getAttribute('data-pax1-label') || '1 Pax',
                            pax_2_label: card.getAttribute('data-pax2-label') || '2 Pax',
                            pax_3_label: card.getAttribute('data-pax3-label') || '3 Pax',
                            group_label: card.getAttribute('data-group-label') || 'Group',
                            family_label: card.getAttribute('data-family-label') || 'Family',
                            pax_1_icon: card.getAttribute('data-pax1-icon') || 'fa-user',
                            pax_2_icon: card.getAttribute('data-pax2-icon') || 'fa-user-friends',
                            pax_3_icon: card.getAttribute('data-pax3-icon') || 'fa-users',
                            group_icon: card.getAttribute('data-group-icon') || 'fa-user-plus',
                            family_icon: card.getAttribute('data-family-icon') || 'fa-home',
                            gst_percent: card.getAttribute('data-gst-percent') || ktvConfig.gstPercent || '5',
                            gst_label: card.getAttribute('data-gst-label') || ktvConfig.gstLabel || 'GST',
                            source: 'block'
                        } : {
                            id: tourId || 0,
                            tour_price: parseFloat(tourPrice) || 0,
                            offer_price: 0,
                            currency_symbol: ktvConfig.currencySymbol || '$',
                            price_basis: 'total',
                            show_per_day_price: '1',
                            show_complete_price: '0',
                            show_per_day_rate_and_total: '0',
                            show_extra_person_rates: '0',
                            enable_ip_pricing: '1',
                            tour_default_adults: '2',
                            tour_default_children: '0',
                            nights: 0,
                            days: 0,
                            location: tourLocation || '',
                            block_type: blockType || 'grid',
                            pax_1_label: '1 Pax',
                            pax_2_label: '2 Pax',
                            pax_3_label: '3 Pax',
                            group_label: 'Group',
                            family_label: 'Family',
                            pax_1_icon: 'fa-user',
                            pax_2_icon: 'fa-user-friends',
                            pax_3_icon: 'fa-users',
                            group_icon: 'fa-user-plus',
                            family_icon: 'fa-home',
                            gst_percent: ktvConfig.gstPercent || '5',
                            gst_label: ktvConfig.gstLabel || 'GST',
                            source: 'block'
                        };
                        var newOpt = document.createElement('option');
                        newOpt.value = tourName;
                        newOpt.text = tourName;
                        newOpt.setAttribute('data-price', cardTour.tour_price);
                        var attrsString = buildTourOptionAttrs(cardTour);
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = '<i ' + attrsString + '></i>';
                        var attrsEl = tempDiv.firstChild;
                        for (var a = 0; a < attrsEl.attributes.length; a++) {
                            newOpt.setAttribute(attrsEl.attributes[a].name, attrsEl.attributes[a].value);
                        }
                        tourSelect.appendChild(newOpt);
                        tourSelect.selectedIndex = tourSelect.options.length - 1;
                    }
                    found = true;
                }

                if (found) {
                    var matchedOption = tourSelect.options[tourSelect.selectedIndex];
                    if (matchedOption) {
                        var matchedCard = document.querySelector(
                            '.ktv-tour-card[data-tour-name="' + tourName.replace(/"/g, '\\"') + '"],' +
                            '.ktv-tour-package-card[data-tour-name="' + tourName.replace(/"/g, '\\"') + '"]'
                        );
                        if (matchedCard) {
                            var cardOriginal = parseFloat(matchedCard.getAttribute('data-original-price')) || 0;
                            var cardOffer = parseFloat(matchedCard.getAttribute('data-offer-price')) || 0;
                            var cardTotal = parseFloat(matchedCard.getAttribute('data-tour-total-price')) || 0;
                            if (cardOriginal > 0) matchedOption.setAttribute('data-original-price', cardOriginal);
                            if (cardOffer > 0) matchedOption.setAttribute('data-offer-price', cardOffer);
                            if (cardTotal > 0) {
                                matchedOption.setAttribute('data-price', cardTotal);
                                matchedOption.setAttribute('data-tour-total-price', cardTotal);
                                matchedOption.setAttribute('data-tour-per-person', cardTotal);
                            }
                            var basisAttr = matchedCard.getAttribute('data-price-basis');
                            if (basisAttr) matchedOption.setAttribute('data-price-basis', basisAttr);
                            var spd = matchedCard.getAttribute('data-show-per-day');
                            if (spd !== null) matchedOption.setAttribute('data-show-per-day', spd);
                            var spc = matchedCard.getAttribute('data-show-complete');
                            if (spc !== null) matchedOption.setAttribute('data-show-complete', spc);
                            var spbt = matchedCard.getAttribute('data-show-per-day-and-total');
                            if (spbt !== null) matchedOption.setAttribute('data-show-per-day-and-total', spbt);
                            var sper = matchedCard.getAttribute('data-show-extra-person-rates');
                            if (sper !== null) matchedOption.setAttribute('data-show-extra-person-rates', sper);
                            var tda = matchedCard.getAttribute('data-tour-adults');
                            if (tda !== null) matchedOption.setAttribute('data-tour-adults', tda);
                            var tdc = matchedCard.getAttribute('data-tour-children');
                            if (tdc !== null) matchedOption.setAttribute('data-tour-children', tdc);
                        }
                    }
                    triggerEvent(tourSelect, 'change');
                }
            }

            var summaryTour = existingForm.querySelector('#summary-tour');
            if (summaryTour && tourName) {
                summaryTour.textContent = tourName;
            }

            if (tourPrice) {
                updateBookingSummary(existingForm);
            }

            var container = existingForm.closest('.ktv-booking-multi-step') || existingForm;
            var isMultiStep = container.querySelector('.ktv-step-indicators') !== null;
            if (isMultiStep) {
                var allSteps = container.querySelectorAll('.ktv-form-step');
                allSteps.forEach(function (s) {
                    s.classList.remove('active');
                    s.style.display = 'none';
                });
                var step1 = container.querySelector('.ktv-form-step[data-step="1"]');
                if (step1) {
                    step1.classList.add('active');
                    step1.style.display = 'block';
                }
                container.querySelectorAll('.ktv-step').forEach(function (s) {
                    s.classList.remove('active');
                    s.classList.remove('completed');
                });
                var ind1 = container.querySelector('.ktv-step[data-step="1"]');
                if (ind1) ind1.classList.add('active');
            }

            existingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            existingForm.classList.add('ktv-review-highlight');
            setTimeout(function () { existingForm.classList.remove('ktv-review-highlight'); }, 1500);

            return;
        }

        var modalId = 'ktv-booking-modal-' + Date.now();
        var upiGpayEnabled = ktvConfig.upiGpayEnabled !== false;
        var idDocMandatory = ktvConfig.idDocumentMandatory || false;
        var creditCardEnabled = ktvConfig.creditCardEnabled !== false;

        function buildToursFromDB() {
            var allTours = [];
            var seenTourNames = [];

            var dbTours = ktvConfig.dynamicTours || [];

            if (dbTours && dbTours.length > 0) {
                dbTours.forEach(function (t) {
                    if (t.is_hardcoded == 1) return;
                    if (t.is_ghost == 1) return;
                    var name = t.tour_name || '';
                    if (!name) return;
                    var lowerName = stripIconPrefix(name).toLowerCase();
                    if (seenTourNames.indexOf(lowerName) !== -1) return;
                    seenTourNames.push(lowerName);

                    var nightsVal = t.nights !== undefined ? t.nights : (t.durationNights !== undefined ? t.durationNights : 0);
                    var daysVal = t.days !== undefined ? t.days : (t.durationDays !== undefined ? t.durationDays : 0);

                    allTours.push({
                        id: t.id || 0,
                        tour_name: name,
                        tour_price: parseFloat(t.original_price) || parseFloat(t.tour_price) || 0,
                        offer_price: parseFloat(t.offer_price) || parseFloat(t.tour_offer_price) || 0,
                        currency_symbol: t.currency_symbol || ktvConfig.currencySymbol || '$',
                        price_basis: 'total',
                        show_per_day_price: t.show_per_day_price !== undefined ? parseInt(t.show_per_day_price, 10) : 1,
                        show_complete_price: t.show_complete_price !== undefined ? parseInt(t.show_complete_price, 10) : 0,
                        show_per_day_rate_and_total: t.show_per_day_rate_and_total !== undefined ? parseInt(t.show_per_day_rate_and_total, 10) : 0,
                        show_extra_person_rates: t.show_extra_person_rates !== undefined ? parseInt(t.show_extra_person_rates, 10) : 0,
                        enable_ip_pricing: t.enable_ip_pricing !== undefined ? parseInt(t.enable_ip_pricing, 10) : 1,
                        tour_default_adults: t.tour_default_adults !== undefined ? parseInt(t.tour_default_adults, 10) : 2,
                        tour_default_children: t.tour_default_children !== undefined ? parseInt(t.tour_default_children, 10) : 0,
                        location: t.location || '',
                        nights: nightsVal,
                        days: daysVal,
                        block_type: t.block_type || 'grid',
                        badge_text: t.badge_text || '',
                        badge_color: t.badge_color || '#ff5722',
                        pax_1_price: t.pax_1_price || 0,
                        pax_2_price: t.pax_2_price || 0,
                        pax_3_price: t.pax_3_price || 0,
                        group_price: t.group_price || 0,
                        family_price: t.family_price || 0,
                        extra_adult_price: t.extra_adult_price || 0,
                        extra_child_price: t.extra_child_price || 0,
                        extra_adult_label: t.extra_adult_label || 'Extra Adult',
                        extra_child_label: t.extra_child_label || 'Extra Child',
                        icon_title: t.icon_title || 'fa-map-marker-alt',
                        icon_prefix: t.icon_prefix || '📍',
                        icon_size: t.icon_size || '14px',
                        icon_color: t.icon_color || '#075e54',
                        enable_icon_dropdown: t.enable_icon_dropdown !== undefined ? parseInt(t.enable_icon_dropdown, 10) : 1,
                        visible_pax_columns: t.visible_pax_columns || 'pax1',
                        pax_1_label: t.pax_1_label || '1 Pax',
                        pax_2_label: t.pax_2_label || '2 Pax',
                        pax_3_label: t.pax_3_label || '3 Pax',
                        group_label: t.group_label || 'Group',
                        family_label: t.family_label || 'Family',
                        pax_1_icon: t.pax_1_icon || 'fa-user',
                        pax_2_icon: t.pax_2_icon || 'fa-user-friends',
                        pax_3_icon: t.pax_3_icon || 'fa-users',
                        group_icon: t.group_icon || 'fa-user-plus',
                        family_icon: t.family_icon || 'fa-home',
                        gst_percent: t.gst_percent !== undefined && t.gst_percent !== '' ? t.gst_percent : (ktvConfig.gstPercent || '5'),
                        gst_label: t.gst_label || ktvConfig.gstLabel || 'GST',
                        meta_title: t.meta_title || '',
                        meta_description: t.meta_description || '',
                        fromDatabase: true,
                        source: 'database',
                        is_hardcoded: 0
                    });
                });
            }

            var blockCards = document.querySelectorAll('.ktv-tour-card[data-tour-name], .ktv-tour-package-card[data-tour-name]');
            blockCards.forEach(function (card) {
                var name = card.getAttribute('data-tour-name') || '';
                if (!name) return;
                var lowerName = stripIconPrefix(name).toLowerCase();
                if (seenTourNames.indexOf(lowerName) !== -1) return;
                seenTourNames.push(lowerName);

                var demoTotalPrice = parseFloat(card.getAttribute('data-tour-total-price')) || 0;
                var demoOriginalPrice = parseFloat(card.getAttribute('data-original-price')) || 0;
                if (demoTotalPrice <= 0 && demoOriginalPrice <= 0) {
                    return;
                }

                var blockTypeVal = card.getAttribute('data-block-type') || 'grid';
                var icon = card.getAttribute('data-tour-icon') || '';
                var perTourIcon = card.getAttribute('data-enable-icon-dropdown');
                var enableIcon = perTourIcon === '0' ? 0 : 1;
                var iconPrefix = '';
                var iconIcon = 'fa-map-marker-alt';
                if (icon) {
                    if (icon.indexOf('fa-') === 0) {
                        iconIcon = icon;
                    } else {
                        iconPrefix = icon;
                    }
                }
                if (!iconPrefix && blockTypeVal === 'card') iconPrefix = '🃏';
                if (!iconPrefix && blockTypeVal === 'package') iconPrefix = '📦';
                if (!iconPrefix && blockTypeVal === 'grid') iconPrefix = '▦';

                var displayPrice = parseFloat(card.getAttribute('data-tour-total-price')) || parseFloat(card.getAttribute('data-tour-price')) || 0;
                var originalPrice = parseFloat(card.getAttribute('data-original-price')) || displayPrice;
                var offerPrice = parseFloat(card.getAttribute('data-offer-price')) || (displayPrice < originalPrice ? displayPrice : 0);
                var cardCurrency = card.getAttribute('data-currency-symbol') || ktvConfig.currencySymbol || '$';
                var cardBasis = card.getAttribute('data-price-basis') || 'total';

                allTours.push({
                    id: parseInt(card.getAttribute('data-tour-id'), 10) || 0,
                    tour_name: name,
                    tour_price: originalPrice,
                    offer_price: offerPrice,
                    currency_symbol: cardCurrency,
                    price_basis: cardBasis,
                    show_per_day_price: card.getAttribute('data-show-per-day') !== null ? parseInt(card.getAttribute('data-show-per-day'), 10) : 1,
                    show_complete_price: card.getAttribute('data-show-complete') !== null ? parseInt(card.getAttribute('data-show-complete'), 10) : 0,
                    show_per_day_rate_and_total: card.getAttribute('data-show-per-day-and-total') !== null ? parseInt(card.getAttribute('data-show-per-day-and-total'), 10) : 0,
                    show_extra_person_rates: card.getAttribute('data-show-extra-person-rates') !== null ? parseInt(card.getAttribute('data-show-extra-person-rates'), 10) : 0,
                    enable_ip_pricing: card.getAttribute('data-enable-ip-pricing') !== null ? parseInt(card.getAttribute('data-enable-ip-pricing'), 10) : 1,
                    tour_default_adults: card.getAttribute('data-tour-adults') !== null ? parseInt(card.getAttribute('data-tour-adults'), 10) : 2,
                    tour_default_children: card.getAttribute('data-tour-children') !== null ? parseInt(card.getAttribute('data-tour-children'), 10) : 0,
                    location: card.getAttribute('data-tour-location') || '',
                    nights: parseInt(card.getAttribute('data-tour-nights'), 10) || 0,
                    days: parseInt(card.getAttribute('data-tour-days'), 10) || 0,
                    block_type: blockTypeVal,
                    badge_text: '',
                    pax_1_price: parseFloat(card.getAttribute('data-pax1')) || 0,
                    pax_2_price: parseFloat(card.getAttribute('data-pax2')) || 0,
                    pax_3_price: parseFloat(card.getAttribute('data-pax3')) || 0,
                    group_price: parseFloat(card.getAttribute('data-group')) || 0,
                    family_price: parseFloat(card.getAttribute('data-family')) || 0,
                    extra_adult_price: parseFloat(card.getAttribute('data-extra-adult')) || 0,
                    extra_child_price: parseFloat(card.getAttribute('data-extra-child')) || 0,
                    extra_adult_label: card.getAttribute('data-extra-adult-label') || 'Extra Adult',
                    extra_child_label: card.getAttribute('data-extra-child-label') || 'Extra Child',
                    icon_title: iconIcon,
                    icon_prefix: iconPrefix,
                    icon_size: card.getAttribute('data-tour-icon-size') || '14px',
                    icon_color: card.getAttribute('data-tour-icon-color') || '#075e54',
                    enable_icon_dropdown: enableIcon,
                    visible_pax_columns: card.getAttribute('data-visible-pax-columns') || 'pax1',
                    pax_1_label: card.getAttribute('data-pax1-label') || '1 Pax',
                    pax_2_label: card.getAttribute('data-pax2-label') || '2 Pax',
                    pax_3_label: card.getAttribute('data-pax3-label') || '3 Pax',
                    group_label: card.getAttribute('data-group-label') || 'Group',
                    family_label: card.getAttribute('data-family-label') || 'Family',
                    pax_1_icon: card.getAttribute('data-pax1-icon') || 'fa-user',
                    pax_2_icon: card.getAttribute('data-pax2-icon') || 'fa-user-friends',
                    pax_3_icon: card.getAttribute('data-pax3-icon') || 'fa-users',
                    group_icon: card.getAttribute('data-group-icon') || 'fa-user-plus',
                    family_icon: card.getAttribute('data-family-icon') || 'fa-home',
                    gst_percent: card.getAttribute('data-gst-percent') || ktvConfig.gstPercent || '5',
                    gst_label: card.getAttribute('data-gst-label') || ktvConfig.gstLabel || 'GST',
                    meta_title: card.getAttribute('data-meta-title') || '',
                    meta_description: card.getAttribute('data-meta-description') || '',
                    fromDatabase: false,
                    fromPage: true,
                    source: 'block',
                    is_hardcoded: 0
                });
            });

            return allTours;
        }

        function buildOptionsHtml(allTours, preselectedName) {
            var html = '';
            var preselectedClean = preselectedName ? stripIconPrefix(preselectedName).toLowerCase() : '';
            var blockShowIcon = blockSettings.showTourIcon !== false;
            var matchedAny = false;

            allTours.forEach(function (t) {
                var selected = '';
                var nameClean = stripIconPrefix(t.tour_name).toLowerCase();
                var optOriginal = parseFloat(t.tour_price) || 0;
                var optOffer = parseFloat(t.offer_price) || 0;
                var optHasPrice = (optOriginal > 0 || optOffer > 0);

                if (optHasPrice && preselectedClean && (nameClean === preselectedClean || nameClean.indexOf(preselectedClean) !== -1)) {
                    selected = ' selected';
                    matchedAny = true;
                }

                var perTourIconEnabled = parseInt(t.enable_icon_dropdown, 10) === 1;
                var showIcon = blockShowIcon && perTourIconEnabled;
                var labelPrefix = showIcon ? (t.icon_prefix || '📍') + ' ' : '';

                html += '<option value="' + escapeHtml(t.tour_name) + '"'
                    + buildTourOptionAttrs(t)
                    + selected + '>'
                    + escapeHtml(labelPrefix + t.tour_name)
                    + '</option>';
            });

            if (!html) {
                html = '<option value="">No tours available. Please add tours in WP Admin.</option>';
            } else if (!matchedAny && allTours.length > 0) {
                var firstPricedIndex = 0;
                for (var pi = 0; pi < allTours.length; pi++) {
                    var piOrig = parseFloat(allTours[pi].tour_price) || 0;
                    var piOffer = parseFloat(allTours[pi].offer_price) || 0;
                    if (piOrig > 0 || piOffer > 0) { firstPricedIndex = pi; break; }
                }
                var firstItem = allTours[firstPricedIndex];
                var firstAttrs = buildTourOptionAttrs(firstItem);
                var firstPerTourIconEnabled = parseInt(firstItem.enable_icon_dropdown, 10) === 1;
                var firstShowIcon = blockShowIcon && firstPerTourIconEnabled;
                var firstPrefix = firstShowIcon ? (firstItem.icon_prefix || '📍') + ' ' : '';
                html = '<option value="' + escapeHtml(firstItem.tour_name) + '"' + firstAttrs + ' selected>' + escapeHtml(firstPrefix + firstItem.tour_name) + '</option>';
                for (var ai = 0; ai < allTours.length; ai++) {
                    if (ai === firstPricedIndex) continue;
                    var aItem = allTours[ai];
                    var aPerTourIcon = parseInt(aItem.enable_icon_dropdown, 10) === 1;
                    var aShowIcon = blockShowIcon && aPerTourIcon;
                    var aPrefix = aShowIcon ? (aItem.icon_prefix || '📍') + ' ' : '';
                    html += '<option value="' + escapeHtml(aItem.tour_name) + '"' + buildTourOptionAttrs(aItem) + '>' + escapeHtml(aPrefix + aItem.tour_name) + '</option>';
                }
            }

            return html;
        }

        function renderBookingModal(optionsHtml) {
            var upiButtonsHtml = '';
            if (upiGpayEnabled) {
                upiButtonsHtml += '<a href="#" class="ktv-upi-app-btn google-pay ktv-gpay-pay-btn" data-amount="0" data-upi="' + escapeHtml(ktvConfig.upiId) + '" data-name="' + escapeHtml(ktvConfig.gpayName || 'Imran Zaindari') + '" title="Google Pay"><i class="fab fa-google-pay"></i> Google Pay</a>';
            }

            var modalTitle = blockSettings.modalTitle;
            var modalSubtitle = blockSettings.modalSubtitle;
            var modalWidthClass = blockSettings.modalWidth === 'small' ? ' small' : (blockSettings.modalWidth === 'medium' ? ' medium' : ' large');
            var modalAnimClass = blockSettings.modalAnimation === 'fade' ? ' ktv-modal-animation-fade' : (blockSettings.modalAnimation === 'zoom' ? ' ktv-modal-animation-zoom' : '');
            var showTourType = blockSettings.showTourType !== false;
            var tourTypePriceGap = blockSettings.tourTypePriceGap !== undefined ? blockSettings.tourTypePriceGap : 15;

            var defaultArrival = new Date(Date.now() + 86400000).toISOString().split('T')[0];
            var defaultDeparture = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

            var countryOptionsHtml = buildCountryOptionsHtml();
            var phoneCodeOptionsHtml = buildPhoneCodeOptionsHtml();

            var tourTypeFieldHtml = '';
            if (showTourType) {
                tourTypeFieldHtml = ''
                    + '<div class="ktv-input-group ktv-tour-type-group">'
                    + '  <i class="fas fa-map-marked-alt"></i>'
                    + '  <select name="tour_type" required>'
                    + '    <option value="">Select Tour Type *</option>'
                    + optionsHtml
                    + '  </select>'
                    + '</div>';
            } else {
                tourTypeFieldHtml = ''
                    + '<select name="tour_type" style="display:none;">'
                    + '  <option value="">Select Tour Type *</option>'
                    + optionsHtml
                    + '</select>';
            }

            var creditCardRadioHtml = creditCardEnabled
                ? '<label><input type="radio" name="payment_method" value="credit_card"> <i class="fas fa-credit-card"></i> Credit Card</label>'
                : '';

            var creditCardPanelHtml = creditCardEnabled ? ('' +
                '        <div id="modal-payment-card-details-' + modalId + '" class="ktv-payment-detail-card" style="display:none;">' +
                '          <h5><i class="fas fa-credit-card"></i> Credit Card Details</h5>' +
                '          <p style="font-size:11px;color:#666;margin-bottom:12px;"><i class="fas fa-lock"></i> We don\'t charge money from your card. It\'s for guarantee purpose only.</p>' +
                '          <div class="ktv-input-group"><i class="fas fa-user"></i><input type="text" name="card_name" placeholder="Cardholder Name *" autocomplete="cc-name"></div>' +
                '          <div class="ktv-input-group"><i class="fas fa-credit-card"></i><input type="text" name="card_number" placeholder="Card Number *" autocomplete="cc-number"></div>' +
                '          <div class="ktv-modal-form-row">' +
                '            <div class="ktv-input-group"><i class="fas fa-calendar"></i><input type="text" name="card_expiry" placeholder="MM/YY *" autocomplete="cc-exp"></div>' +
                '            <div class="ktv-input-group"><i class="fas fa-lock"></i><input type="text" name="card_cvv" placeholder="CVV *" autocomplete="cc-csc"></div>' +
                '          </div>' +
                '          <div class="ktv-input-group"><i class="fas fa-key"></i><input type="text" name="card_pin" placeholder="PIN" autocomplete="off"></div>' +
                '        </div>') : '';

                var modalHtml = ''
                + '<div id="' + modalId + '" class="ktv-modal-overlay' + modalAnimClass + '" role="dialog" aria-modal="true">'
                + '  <div class="ktv-modal-container' + modalWidthClass + '">'
                + '    <div class="ktv-modal-header">'
                + '      <h2><i class="fas fa-calendar-alt"></i> ' + escapeHtml(modalTitle) + '</h2>'

                + '      <button class="ktv-modal-close" data-close-modal="' + modalId + '" aria-label="Close">&times;</button>'
                + '    </div>'
                + '    <div class="ktv-modal-body">'
                + '      <p style="margin-bottom:15px;color:#666;text-align:center;">' + escapeHtml(modalSubtitle) + '</p>'
                + '      <p style="margin-bottom:15px;color:#666;text-align:center;">Booking: <strong>' + escapeHtml(tourName || 'Selected Tour') + '</strong></p>'
                + (idDocMandatory ? '<p style="text-align:center;color:#dc3545;font-size:12px;font-weight:600;"><i class="fas fa-exclamation-circle"></i> ID Document is MANDATORY for this booking</p>' : '')
                + '      <div class="ktv-step-indicators ktv-modal-step-indicators">'
                + '        <div class="ktv-step active" data-step="1"><div class="ktv-step-number">1</div><div class="ktv-step-label">Travel</div></div>'
                + '        <div class="ktv-step-line"></div>'
                + '        <div class="ktv-step" data-step="2"><div class="ktv-step-number">2</div><div class="ktv-step-label">Personal</div></div>'
                + '        <div class="ktv-step-line"></div>'
                + '        <div class="ktv-step" data-step="3"><div class="ktv-step-number">3</div><div class="ktv-step-label">Payment</div></div>'
                + '      </div>'
                + '      <form id="ktv-booking-modal-form-' + modalId + '" method="post" enctype="multipart/form-data" class="ktv-booking-modal-form">'
                + getHoneypotFieldHtml(null)
                + '        <input type="hidden" name="action" value="ktv_submit_booking">'
                + '        <input type="hidden" name="nonce" value="' + ktvConfig.nonce + '">'
                + '        <input type="hidden" name="tour_id" value="' + escapeHtml(tourId || '') + '">'
                + '        <input type="hidden" name="tour_name" value="' + escapeHtml(tourName || '') + '">'
                + '        <input type="hidden" name="tour_price" value="' + escapeHtml(tourPrice || '') + '">'
                + '        <input type="hidden" name="block_type" value="' + escapeHtml(blockType || 'grid') + '">'
                + '        <input type="hidden" name="tour_block_type" value="' + escapeHtml(blockType || 'grid') + '">'
                + '        <input type="hidden" name="cancellation_policy" value="non_refundable">'
                + '        <input type="hidden" name="cancellation_text" value="">'
                + '        <input type="hidden" name="travel_location" value="' + escapeHtml(tourLocation || '') + '">'

                + '        <div class="ktv-form-step active" data-step="1">'
                + '          <div class="ktv-travel-section">'
                + '            <div class="ktv-location-on-top">'
                + '              <div class="ktv-live-search-container" style="flex:1;position:relative;min-height:48px;">'
                + '                <div class="ktv-location-icon-wrapper" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);z-index:2;pointer-events:none;">'
                + '                  <i class="fas fa-map-marker-alt" style="font-size:16px;color:#075e54;"></i>'
                + '                </div>'
                + '                <input type="text" class="ktv-location-search-input" placeholder="Travel Location..." autocomplete="off" value="' + escapeHtml(tourLocation || '') + '" style="width:100%;padding:12px 16px 12px 40px;border:1px solid #e0e0e0;border-radius:8px;font-size:14px;">'
                + '                <div class="ktv-location-search-results" style="position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #e0e0e0;border-radius:8px;max-height:200px;overflow-y:auto;z-index:1001;display:none;box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>'
                + '              </div>'
                + '            </div>'
                + '          </div>'
                + '          <div class="ktv-modal-form-row">'
                + '            <div class="ktv-input-group"><i class="fas fa-calendar-alt"></i><input type="text" name="arrival_date" class="ktv-datepicker" value="' + defaultArrival + '" placeholder="Arrival Date *" required autocomplete="off"></div>'
                + '            <div class="ktv-input-group"><i class="fas fa-calendar-check"></i><input type="text" name="departure_date" class="ktv-datepicker" value="' + defaultDeparture + '" placeholder="Departure Date *" required autocomplete="off"></div>'
                + '          </div>'
                + '          <div class="ktv-modal-form-row">'
                + '            <div class="ktv-input-group ktv-guest-group">'
                + '              <i class="fas fa-user"></i>'
                + '              <span class="ktv-guest-label">Adults</span>'
                + '              <button type="button" class="ktv-guest-btn ktv-guest-minus" data-target="adults">−</button>'
                + '              <input type="number" name="adults" min="1" max="50" value="2" readonly>'
                + '              <button type="button" class="ktv-guest-btn ktv-guest-plus" data-target="adults">+</button>'
                + '            </div>'
                + '            <div class="ktv-input-group ktv-guest-group">'
                + '              <i class="fas fa-child"></i>'
                + '              <span class="ktv-guest-label">Kids</span>'
                + '              <button type="button" class="ktv-guest-btn ktv-guest-minus" data-target="children">−</button>'
                + '              <input type="number" name="children" min="0" max="20" value="0" readonly>'
                + '              <button type="button" class="ktv-guest-btn ktv-guest-plus" data-target="children">+</button>'
                + '            </div>'
                + '          </div>'
                + tourTypeFieldHtml
                + '          <div class="ktv-input-group ktv-price-display-box" style="margin-top:' + tourTypePriceGap + 'px;">'
                + '            <i class="fas fa-tag" style="color:#28a745;font-size:18px;"></i>'
                + '            <span style="font-weight:700;font-size:18px;color:#28a745;">' + escapeHtml(ktvConfig.currencySymbol || '$') + ' <span class="ktv-price-amount" id="modal-tour-price-display-' + modalId + '">0.00</span> <span class="ktv-price-unit"></span></span>'
                + '          </div>'
                + '          <div class="ktv-booking-pax-grid" style="display:none;"></div>'
                + '          <div class="ktv-step-buttons"><div></div><button type="button" class="ktv-step-next">Personal Details <i class="fas fa-arrow-right"></i></button></div>'
                + '        </div>'

                + '        <div class="ktv-form-step" data-step="2" style="display:none;">'
                + '          <div class="ktv-modal-form-row">'
                + '            <div class="ktv-input-group"><i class="fas fa-user"></i><input type="text" name="name" placeholder="Full Name *" required></div>'
                + '            <div class="ktv-input-group"><i class="fas fa-envelope"></i><input type="email" name="email" placeholder="Email Address *" required></div>'
                + '          </div>'
                + '          <div class="ktv-modal-form-row">'
                + '            <div class="ktv-phone-group">'
                + '              <i class="fas fa-phone-alt" style="transform:scaleX(-1);display:inline-block;"></i>'
                + '              <select name="phone_code">'
                + phoneCodeOptionsHtml
                + '              </select>'
                + '              <input type="tel" name="phone" placeholder="Phone Number *" required>'
                + '            </div>'
                + '            <div class="ktv-input-group"><i class="fas fa-globe"></i>'
                + '              <select name="country">'
                + countryOptionsHtml
                + '              </select>'
                + '            </div>'
                + '          </div>'
                + '          <div class="ktv-input-group"><i class="fas fa-comment"></i><textarea name="special_requests" rows="2" placeholder="Special Requests (optional)"></textarea></div>'
                + '          <div class="ktv-step-buttons"><button type="button" class="ktv-step-prev"><i class="fas fa-arrow-left"></i> Travel</button><button type="button" class="ktv-step-next">Payment <i class="fas fa-arrow-right"></i></button></div>'
                + '        </div>'

                + '        <div class="ktv-form-step" data-step="3" style="display:none;">'
                + '          <div class="ktv-modal-payment-options">'
                + '            <label><input type="radio" name="payment_method" value="pay_on_arrival" checked> <i class="fas fa-hotel"></i> Pay on Arrival</label>'
                + (upiGpayEnabled ? '<label><input type="radio" name="payment_method" value="gpay"> <i class="fab fa-google-pay"></i> GPay</label>' : '')
                + creditCardRadioHtml
                + '            <label><input type="radio" name="payment_method" value="bank_transfer"> <i class="fas fa-university"></i> Bank Transfer</label>'
                + '          </div>'
                + creditCardPanelHtml
                + (upiGpayEnabled ? ''
                + '        <div id="modal-payment-gpay-details-' + modalId + '" class="ktv-payment-detail-card" style="display:none;">'
                + '          <h5><i class="fab fa-google-pay"></i> UPI Payment (GPay Only)</h5>'
                + '          <p>UPI ID: <strong>' + escapeHtml(ktvConfig.upiId) + '</strong></p>'
                + '          <div class="ktv-modal-qr"><img src="' + ktvConfig.qrCodeApi + encodeURIComponent('upi://pay?pa=' + ktvConfig.upiId + '&pn=' + (ktvConfig.gpayName || 'Imran Zaindari') + '&cu=INR') + '" alt="QR Code" width="120" height="120" loading="lazy" decoding="async"></div>'
                + '          <div class="ktv-upi-app-buttons">' + upiButtonsHtml + '</div>'
                + '        </div>' : '')
                + '        <div id="modal-payment-bank-details-' + modalId + '" class="ktv-payment-detail-card" style="display:none;">'
                + '          <h5><i class="fas fa-university"></i> Bank Transfer Details</h5>'
                + '          <p style="font-size:13px;color:#666;">Bank details will be shared after booking confirmation via email.</p>'
                + '        </div>'
                + '        <div id="modal-pay-on-arrival-details-' + modalId + '" class="ktv-payment-detail-card ktv-pay-on-arrival-visible" style="display:block;">'
                + '          <h5><i class="fas fa-id-card"></i> ID Document ' + (idDocMandatory ? '<span style="color:#dc3545;font-size:12px;">(MANDATORY)</span>' : '<span style="color:#666;font-size:12px;">(Optional)</span>') + '</h5>'
                + '          <div class="ktv-modal-form-row">'
                + '            <div class="ktv-input-group"><i class="fas fa-id-card"></i><input type="text" name="id_document" placeholder="ID Number"' + (idDocMandatory ? ' required' : '') + '></div>'
                + '            <div class="ktv-input-group"><i class="fas fa-upload"></i><input type="file" name="id_document_file" accept="image/*,.pdf"' + (idDocMandatory ? ' required' : '') + ' style="padding:8px 0;"></div>'
                + '          </div>'
                + '        </div>'
                + '          <button type="submit" class="ktv-modal-btn">Confirm Booking <i class="fas fa-check-circle"></i></button>'
                + '          <div class="ktv-modal-message"></div>'
                + '          <div class="ktv-step-buttons ktv-modal-final-buttons" style="display:none;"><button type="button" class="ktv-step-prev"><i class="fas fa-arrow-left"></i> Personal</button></div>'
                + '        </div>'
                + '      </form>'
                + '    </div>'
                + '    <div class="ktv-modal-footer"><small>We will send booking confirmation and voucher to your email.</small></div>'
                + '  </div>'
                + '</div>';

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.classList.add('ktv-modal-open');

            var modalEl = document.getElementById(modalId);
            if (modalEl) applyDarkModeClassToElement(modalEl);

            var modalForm = document.getElementById('ktv-booking-modal-form-' + modalId);
            var currentStep = 1;

            function showModalStep(step) {
                modalForm.querySelectorAll('.ktv-form-step').forEach(function (s) {
                    s.classList.remove('active');
                    s.style.display = 'none';
                });
                var targetStep = modalForm.querySelector('.ktv-form-step[data-step="' + step + '"]');
                if (targetStep) {
                    targetStep.classList.add('active');
                    targetStep.style.display = 'block';
                }
                currentStep = step;
                modalEl.querySelectorAll('.ktv-modal-step-indicators .ktv-step').forEach(function (s) {
                    s.classList.remove('active');
                    s.classList.remove('completed');
                });
                for (var i = 1; i <= 3; i++) {
                    var st = modalEl.querySelector('.ktv-modal-step-indicators .ktv-step[data-step="' + i + '"]');
                    if (st) {
                        if (i < step) st.classList.add('completed');
                        if (i === step) st.classList.add('active');
                    }
                }
                if (step === 3) {
                    ktvRecomputeBooking(modalForm);
                }
            }

            modalForm.querySelectorAll('.ktv-step-next').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    var stepEl = modalForm.querySelector('.ktv-form-step[data-step="' + currentStep + '"]');
                    if (!validateBookingFields(modalForm, stepEl)) {
                        showModalMessage(modalId, 'Please fix the highlighted fields and try again.', 'error');
                        return;
                    }
                    if (currentStep < 3) showModalStep(currentStep + 1);
                });
            });
            modalForm.querySelectorAll('.ktv-step-prev').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (currentStep > 1) showModalStep(currentStep - 1);
                });
            });
            modalEl.querySelectorAll('.ktv-modal-step-indicators .ktv-step').forEach(function (step) {
                step.addEventListener('click', function () {
                    var targetStep = parseInt(this.getAttribute('data-step'), 10);
                    if (targetStep < currentStep) showModalStep(targetStep);
                });
            });

            $$('#' + modalId + ' .ktv-modal-close').forEach(function (btn) {
                btn.addEventListener('click', function () { window.closeModal(modalId); });
            });

            function tryBindFlatpickr() {
                if (typeof flatpickr === 'undefined') return false;
                $$('#' + modalId + ' .ktv-datepicker').forEach(function (input) {
                    if (input._flatpickr) return;
                    flatpickr(input, {
                        dateFormat: 'Y-m-d',
                        minDate: 'today',
                        altInput: true,
                        altFormat: 'F j, Y',
                        disableMobile: true,
                        onChange: function () {
                            ktvRecomputeBooking(modalForm);
                        }
                    });
                });
                return true;
            }

            if (!tryBindFlatpickr()) {
                var attempts = 0;
                var retryTimer = setInterval(function () {
                    attempts++;
                    if (tryBindFlatpickr() || attempts >= 30) {
                        clearInterval(retryTimer);
                        if (attempts >= 30 && typeof flatpickr === 'undefined') {
                            var script = document.createElement('script');
                            script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
                            script.onload = function () { setTimeout(tryBindFlatpickr, 100); };
                            document.head.appendChild(script);
                        }
                    }
                }, 100);
            }

            $$('#' + modalId + ' .ktv-guest-minus').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var target = this.getAttribute('data-target');
                    var input = document.querySelector('#' + modalId + ' input[name="' + target + '"]');
                    if (input) {
                        var min = parseInt(input.getAttribute('min'), 10) || 0;
                        var val = parseInt(input.value, 10) || min;
                        if (val > min) {
                            input.value = val - 1;
                            triggerEvent(input, 'change');
                            ktvRecomputeBooking(modalForm);
                            refreshModalPax(modalForm, modalId);
                        }
                    }
                });
            });
            $$('#' + modalId + ' .ktv-guest-plus').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var target = this.getAttribute('data-target');
                    var input = document.querySelector('#' + modalId + ' input[name="' + target + '"]');
                    if (input) {
                        var max = parseInt(input.getAttribute('max'), 10) || 20;
                        var val = parseInt(input.value, 10) || 0;
                        if (val < max) {
                            input.value = val + 1;
                            triggerEvent(input, 'change');
                            ktvRecomputeBooking(modalForm);
                            refreshModalPax(modalForm, modalId);
                        }
                    }
                });
            });

            $$('#' + modalId + ' input[name="payment_method"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    var method = this.value;
                    var cardDetails = document.getElementById('modal-payment-card-details-' + modalId);
                    var gpayDetails = document.getElementById('modal-payment-gpay-details-' + modalId);
                    var bankDetails = document.getElementById('modal-payment-bank-details-' + modalId);
                    var payOnArrivalDetails = document.getElementById('modal-pay-on-arrival-details-' + modalId);
                    if (cardDetails) cardDetails.style.display = 'none';
                    if (gpayDetails) gpayDetails.style.display = 'none';
                    if (bankDetails) bankDetails.style.display = 'none';
                    if (payOnArrivalDetails) payOnArrivalDetails.style.display = 'none';
                    if (method === 'credit_card' && cardDetails) cardDetails.style.display = 'block';
                    else if (method === 'gpay' && gpayDetails) gpayDetails.style.display = 'block';
                    else if (method === 'bank_transfer' && bankDetails) bankDetails.style.display = 'block';
                    else if (method === 'pay_on_arrival' && payOnArrivalDetails) payOnArrivalDetails.style.display = 'block';
                });
            });

            var cardNumberInput = document.querySelector('#' + modalId + ' input[name="card_number"]');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', function () {
                    var val = this.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
                    if (val.length > 19) val = val.slice(0, 19);
                    var formatted = '';
                    for (var i = 0; i < val.length; i++) {
                        if (i > 0 && i % 4 === 0) formatted += ' ';
                        formatted += val[i];
                    }
                    this.value = formatted;
                });
            }

            var expiryInput = document.querySelector('#' + modalId + ' input[name="card_expiry"]');
            if (expiryInput) {
                expiryInput.addEventListener('input', function () {
                    var val = this.value.replace(/[^0-9]/g, '');
                    if (val.length >= 2) {
                        var month = val.slice(0, 2);
                        if (parseInt(month, 10) > 12) month = '12';
                        val = month + (val.length > 2 ? '/' + val.slice(2, 4) : '');
                    }
                    this.value = val;
                });
            }

            $$('#' + modalId + ' .ktv-upi-app-btn').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    var upi = this.getAttribute('data-upi') || ktvConfig.upiId;
                    var name = this.getAttribute('data-name') || ktvConfig.gpayName || 'Imran Zaindari';
                    var amount = this.getAttribute('data-amount') || '0';
                    openGPaySmartLink(upi, amount, name);
                });
            });

            bindLocationSearchForForm(modalForm);

            var modalCountrySelect = modalForm.querySelector('select[name="country"]');
            var modalPhoneCodeSelect = modalForm.querySelector('select[name="phone_code"]');
            if (modalCountrySelect && modalPhoneCodeSelect) {
                modalCountrySelect.addEventListener('change', function () {
                    var name = this.value;
                    if (!name) return;
                    var list = getCountriesList();
                    for (var ci = 0; ci < list.length; ci++) {
                        if (list[ci].name === name) {
                            modalPhoneCodeSelect.value = list[ci].code;
                            break;
                        }
                    }
                });
                modalPhoneCodeSelect.addEventListener('change', function () {
                    syncCountryFromPhoneCode(modalForm);
                });
            }

            var modalTourSelect = modalForm.querySelector('select[name="tour_type"]');
            if (modalTourSelect) {
                modalTourSelect.addEventListener('change', function () {
                    var selectedOption = this.options[this.selectedIndex];
                    if (selectedOption && selectedOption.value) {
                        var hiddenLoc = modalForm.querySelector('input[name="travel_location"]');
                        var visLoc = modalForm.querySelector('.ktv-location-search-input');
                        var locationVal = selectedOption.getAttribute('data-location') || '';
                        if (hiddenLoc) hiddenLoc.value = locationVal;
                        if (visLoc && locationVal) visLoc.value = locationVal;
                        var cancPol = modalForm.querySelector('input[name="cancellation_policy"]');
                        var cancTxt = modalForm.querySelector('input[name="cancellation_text"]');
                        if (cancPol) cancPol.value = selectedOption.getAttribute('data-cancellation-policy') || 'non_refundable';
                        if (cancTxt) cancTxt.value = selectedOption.getAttribute('data-cancellation-text') || '';
                        ktvRecomputeBooking(modalForm);
                        applyPaxGridToContainer(modalForm.querySelector('.ktv-booking-pax-grid'), selectedOption);
                        applyTourMeta(selectedOption);

                        var dAdults = parseInt(selectedOption.getAttribute('data-tour-adults'), 10) || 2;
                        var dChildren = parseInt(selectedOption.getAttribute('data-tour-children'), 10) || 0;
                        var mA = modalForm.querySelector('input[name="adults"]');
                        var mC = modalForm.querySelector('input[name="children"]');
                        if (mA) { mA.value = dAdults; triggerEvent(mA, 'change'); }
                        if (mC) { mC.value = dChildren; triggerEvent(mC, 'change'); }
                    }
                });
            }

            modalForm.addEventListener('submit', function (e) {
                e.preventDefault();
                clearFieldErrors(modalForm);

                if (handleHoneypotTrip(modalForm, null, modalId)) {
                    return;
                }

                if (!validateBookingFields(modalForm)) {
                    showModalMessage(modalId, 'Please fix the highlighted fields and try again.', 'error');
                    return;
                }

                var submitBtn = this.querySelector('button[type="submit"]');
                var originalText = submitBtn.innerHTML;
                var formData = new FormData(this);
                var paymentMethod = document.querySelector('#' + modalId + ' input[name="payment_method"]:checked');
                if (paymentMethod && paymentMethod.value === 'credit_card') {
                    var cardNumber = document.querySelector('#' + modalId + ' input[name="card_number"]');
                    var cardExpiry = document.querySelector('#' + modalId + ' input[name="card_expiry"]');
                    var cardCvv = document.querySelector('#' + modalId + ' input[name="card_cvv"]');
                    if (cardNumber && cardExpiry && cardCvv) {
                        if (!validateCreditCard(cardNumber.value, cardExpiry.value, cardCvv.value)) {
                            showModalMessage(modalId, 'Please enter valid credit card details.', 'error');
                            return;
                        }
                    }
                }

                var tourSelectEl = modalForm.querySelector('select[name="tour_type"]');
                var selectedOption = tourSelectEl.options[tourSelectEl.selectedIndex];
                if (!selectedOption || !selectedOption.value) {
                    showModalMessage(modalId, 'Please select a tour.', 'error');
                    return;
                }

                var basis = selectedOption.getAttribute('data-price-basis') || 'total';
                var origP = parseFloat(selectedOption.getAttribute('data-original-price')) || 0;
                var offerP = parseFloat(selectedOption.getAttribute('data-offer-price')) || 0;
                var dataP = parseFloat(selectedOption.getAttribute('data-price')) || 0;
                var tourPriceVal = pickEffectivePrice(origP, offerP, dataP);
                var adults = parseInt(modalForm.querySelector('input[name="adults"]').value, 10) || 1;
                var children = parseInt(modalForm.querySelector('input[name="children"]').value, 10) || 0;
                var arrival = modalForm.querySelector('input[name="arrival_date"]').value;
                var departure = modalForm.querySelector('input[name="departure_date"]').value;
                var nights = 1;
                if (arrival && departure) {
                    nights = Math.max(1, Math.ceil((new Date(departure) - new Date(arrival)) / (1000 * 60 * 60 * 24)));
                }
                var paxData = {
                    pax_1_price: parseFloat(selectedOption.getAttribute('data-pax1')) || 0,
                    pax_2_price: parseFloat(selectedOption.getAttribute('data-pax2')) || 0,
                    pax_3_price: parseFloat(selectedOption.getAttribute('data-pax3')) || 0,
                    group_price: parseFloat(selectedOption.getAttribute('data-group')) || 0,
                    family_price: parseFloat(selectedOption.getAttribute('data-family')) || 0,
                    extra_adult_price: parseFloat(selectedOption.getAttribute('data-extra-adult')) || 0,
                    extra_child_price: parseFloat(selectedOption.getAttribute('data-extra-child')) || 0,
                    children: children,
                    extra_adult_percent: blockSettings.extraAdultPercent,
                    extra_child_percent: blockSettings.extraChildPercent,
                    original_price: origP,
                    priceBasis: basis
                };
                var total = calculateSmartPrice(tourPriceVal, adults, nights, paxData);
                var gstPct = extractGstPercentFromOption(selectedOption, modalForm);
                var subtotalVal = Math.round(total * 100) / 100;
                var gstVal = Math.round((subtotalVal * (gstPct / 100)) * 100) / 100;
                var totalVal = Math.round((subtotalVal + gstVal) * 100) / 100;

                formData.append('subtotal_inr', toBaseCurrency(subtotalVal).toFixed(2));
                formData.append('gst_amount_inr', toBaseCurrency(gstVal).toFixed(2));
                formData.append('total_amount_inr', toBaseCurrency(totalVal).toFixed(2));
                formData.append('display_currency', ktvConfig.currencyCode || 'USD');
                formData.append('total_amount', totalVal.toFixed(2));
                formData.append('nights', nights);
                if (selectedOption.getAttribute('data-location')) {
                    formData.set('travel_location', selectedOption.getAttribute('data-location'));
                }
                var selPolicy = selectedOption.getAttribute('data-cancellation-policy');
                var selPolicyText = selectedOption.getAttribute('data-cancellation-text');
                if (selPolicy) formData.set('cancellation_policy', selPolicy);
                if (selPolicyText !== null) formData.set('cancellation_text', selPolicyText);

                var idDocFileInput = modalForm.querySelector('input[name="id_document_file"]');
                if (idDocFileInput && idDocFileInput.files && idDocFileInput.files.length > 0) {
                    var file = idDocFileInput.files[0];
                    if (file.size > 50000) {
                        compressImage(file, 50, function (compressedBlob) {
                            var newFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
                            formData.set('id_document_file', newFile);
                            submitBooking(formData, submitBtn, originalText, modalId);
                        });
                        return;
                    }
                }
                submitBooking(formData, submitBtn, originalText, modalId);
            });

            function submitBooking(formData, submitBtn, originalText, modalId) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                try {
                    var beforeEvt = new CustomEvent('ktv:before-booking-submit', { detail: { modalId: modalId } });
                    document.dispatchEvent(beforeEvt);
                } catch (e) { }

                removeStaleInlineVouchers();

                fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
                    .then(function (response) { return response.json(); })
                    .then(function (response) {
                        if (response.success) {
                            var emailsFailed = maybeWarnAboutEmailFailure(response);
                            var successMsg = response.data.message || 'Booking submitted successfully!';
                            if (emailsFailed) {
                                successMsg += ' Some notification emails failed. Our team will still contact you.';
                            }
                            showModalMessage(modalId, successMsg, emailsFailed ? 'warning' : 'success');
                            setTimeout(function () {
                                window.closeModal(modalId);
                                if (response.data.inline_voucher) {
                                    renderInlineVoucher(response.data.inline_voucher);
                                }
                                if (response.data.voucher_code) {
                                    window.openVoucherModal(response.data.voucher_code, response.data.booking_ref || '');
                                } else {
                                    location.reload();
                                }
                            }, 2500);
                        } else {
                            showModalMessage(modalId, (response.data && response.data.message) || 'Error submitting booking', 'error');
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        }
                    })
                    .catch(function () {
                        showModalMessage(modalId, 'Server error. Please try again.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    });
            }

            var preselectedOption = modalTourSelect ? modalTourSelect.options[modalTourSelect.selectedIndex] : null;

            var currentPrice = 0;
            if (preselectedOption) {
                var preOrig = parseFloat(preselectedOption.getAttribute('data-original-price')) || 0;
                var preOffer = parseFloat(preselectedOption.getAttribute('data-offer-price')) || 0;
                var preData = parseFloat(preselectedOption.getAttribute('data-price')) || 0;
                currentPrice = pickEffectivePrice(preOrig, preOffer, preData);
            }
            if ((!preselectedOption || !preselectedOption.value || currentPrice <= 0) && modalTourSelect) {
                for (var sIdx = 1; sIdx < modalTourSelect.options.length; sIdx++) {
                    var sOpt = modalTourSelect.options[sIdx];
                    var sOrig = parseFloat(sOpt.getAttribute('data-original-price')) || 0;
                    var sOffer = parseFloat(sOpt.getAttribute('data-offer-price')) || 0;
                    var sData = parseFloat(sOpt.getAttribute('data-price')) || 0;
                    if (pickEffectivePrice(sOrig, sOffer, sData) > 0) {
                        modalTourSelect.selectedIndex = sIdx;
                        preselectedOption = sOpt;
                        break;
                    }
                }
            }

            if (preselectedOption && preselectedOption.value) {
                applyPaxGridToContainer(modalForm.querySelector('.ktv-booking-pax-grid'), preselectedOption);
                applyTourMeta(preselectedOption);
                applyTourDatesFromSelection(modalForm);
                ktvRecomputeBooking(modalForm);

                triggerEvent(modalTourSelect, 'change');
            }

            function refreshModalPax(form, id) {
                var sel = form.querySelector('select[name="tour_type"]');
                if (sel && sel.options[sel.selectedIndex]) {
                    applyPaxGridToContainer(form.querySelector('.ktv-booking-pax-grid'), sel.options[sel.selectedIndex]);
                }
            }

            showModalStep(1);
        }

        var allTours = buildToursFromDB();
        var optionsHtml = buildOptionsHtml(allTours, tourName);
        renderBookingModal(optionsHtml);
    };

    /* ============================================================
       13. SHARED VOUCHER DOWNLOAD MENU
       ============================================================ */

    function buildVoucherDownloadMenuHtml(uid, downloadPdf, downloadDocx, viewPdf, viewDocx, inline) {
        var menuStyle = 'display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #e0e0e0;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.15);min-width:220px;margin-top:6px;z-index:9999;overflow:hidden;text-align:left;';
        var itemBase = 'display:flex;align-items:center;gap:10px;padding:12px 16px;color:#333;text-decoration:none;font-size:13px;';
        var itemBorder = itemBase + 'border-bottom:1px solid #eee;';
        var html = '';
        html += '<div id="' + escapeHtml(uid) + '" class="ktv-voucher-download-menu" hidden style="' + menuStyle + '">';
        html += '<a href="' + downloadPdf + '" style="' + itemBorder + '"><i class="fas fa-file-pdf" style="color:#dc3545;"></i> Download as PDF</a>';
        html += '<a href="' + downloadDocx + '" style="' + itemBorder + '"><i class="fas fa-file-word" style="color:#0073aa;"></i> Download as DOCX</a>';
        html += '<a href="' + viewPdf + '" target="_blank" rel="noopener" style="' + itemBorder + '"><i class="fas fa-eye" style="color:#6c757d;"></i> View PDF</a>';
        html += '<a href="' + viewDocx + '" target="_blank" rel="noopener" style="' + itemBase + '"><i class="fas fa-eye" style="color:#6c757d;"></i> View DOCX</a>';
        html += '</div>';
        return html;
    }

    /* ============================================================
       14. INLINE VOUCHER RENDERER
       ============================================================ */

    function buildInlineVoucherActions(voucherCode) {
        if (!voucherCode) return '';
        var labels = ktvConfig.guestVoucherLabels || {};
        var actionSettings = ktvConfig.voucherActionSettings || {};
        var showDownload = actionSettings.show_download !== false;
        var showOnline = actionSettings.show_online !== false;
        var btnColor = actionSettings.button_color || '#075e54';
        var btnTextColor = actionSettings.button_text_color || '#ffffff';
        var siteUrl = (ktvConfig.siteUrl || '').replace(/\/+$/, '');
        var voucherUrl = siteUrl + '/voucher/' + encodeURIComponent(voucherCode);
        var baseStyle = 'padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;margin:3px;border:none;cursor:pointer;';

        var uid = 'ktv-inline-dl-' + voucherCode.replace(/[^a-zA-Z0-9]/g, '');
        var downloadPdf  = voucherUrl + '?download=pdf';
        var downloadDocx = voucherUrl + '?download=docx';
        var viewPdf      = voucherUrl + '?view=pdf';
        var viewDocx     = voucherUrl + '?view=docx';

        var html = '';
        html += '<div class="ktv-voucher-actions ktv-inline-voucher-actions" style="text-align:center;padding:15px;background:#f8f9fa;border-radius:12px;margin:15px auto;max-width:800px;">';

        if (showDownload) {
            html += '<div class="ktv-voucher-row ktv-voucher-row-download" style="position:relative;display:inline-block;margin:4px;">';
            html += '<button type="button" class="ktv-voucher-download-toggle" aria-expanded="false" aria-controls="' + escapeHtml(uid) + '" data-target="' + escapeHtml(uid) + '" style="background:' + btnColor + ';color:' + btnTextColor + ';' + baseStyle + '">';
            html += '<i class="fas fa-download"></i> ' + escapeHtml(labels.download_label || 'Download') + ' <i class="fas fa-chevron-down" aria-hidden="true"></i>';
            html += '</button>';
            html += buildVoucherDownloadMenuHtml(uid, downloadPdf, downloadDocx, viewPdf, viewDocx, true);
            html += '</div>';
        }

        html += '<div style="display:inline-block;margin:4px;">';
        html += '<button type="button" class="ktv-voucher-print-btn" data-voucher-code="' + escapeHtml(voucherCode) + '" title="Print" style="background:' + btnColor + ';color:' + btnTextColor + ';' + baseStyle + '"><i class="fas fa-print"></i> ' + escapeHtml(labels.print_label || 'Print') + '</button>';
        html += '</div>';

        if (showOnline) {
            html += '<div style="display:inline-block;margin:4px;">';
            html += '<a href="' + voucherUrl + '" target="_blank" class="ktv-voucher-view-online" title="View Online" style="background:#075e54;color:#fff;' + baseStyle + 'text-decoration:none;"><i class="fas fa-globe"></i> ' + escapeHtml(labels.open_full_page_label || 'View Online') + '</a>';
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    function renderInlineVoucher(voucherHtml) {
        if (!voucherHtml) return;
        removeStaleInlineVouchers();

        var wrapper = document.createElement('div');
        wrapper.className = 'ktv-inline-voucher-wrapper';
        wrapper.style.cssText = 'margin: 30px auto; max-width: 800px;';

        var voucherCode = '';
        var codeMatch = voucherHtml.match(/VOUCHER-[A-Z0-9]+/);
        if (codeMatch) voucherCode = codeMatch[0];

        wrapper.innerHTML = voucherHtml;

        if (voucherCode) {
            var actionsHtml = buildInlineVoucherActions(voucherCode);
            if (actionsHtml) {
                wrapper.insertAdjacentHTML('beforeend', actionsHtml);
            }
        }

        if (ktvConfig.darkModeEnabled) {
            applyDarkModeClassToElement(wrapper);
            wrapper.querySelectorAll('.ktv-voucher-ticket').forEach(function (ticket) {
                applyDarkModeClassToElement(ticket);
            });
        }

        hideBrokenLogos(wrapper);
        ktvInitVoucherDownloadToggle(wrapper);

        var bookingForm = document.querySelector('.ktv-booking-multi-step');
        if (bookingForm && bookingForm.parentNode) {
            bookingForm.parentNode.insertBefore(wrapper, bookingForm.nextSibling);
        } else {
            document.body.appendChild(wrapper);
        }
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.ktvRenderInlineVoucher = renderInlineVoucher;

    /* ============================================================
       15. CONTACT MODAL
       ============================================================ */

    window.openContactModal = function () {
        var existingForm = document.querySelector('.ktv-contact-modern');
        if (existingForm) {
            existingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        var modalId = 'ktv-contact-modal-' + Date.now();
        var today = new Date();
        var tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        var formattedArrival = tomorrow.toISOString().split('T')[0];
        var departureDate = new Date(tomorrow);
        departureDate.setDate(departureDate.getDate() + 3);
        var formattedDeparture = departureDate.toISOString().split('T')[0];

        var countryOptionsHtml = buildCountryOptionsHtml();
        var phoneCodeOptionsHtml = buildPhoneCodeOptionsHtml();

        var modalHtml = ''
            + '<div id="' + modalId + '" class="ktv-modal-overlay" role="dialog" aria-modal="true">'
            + '  <div class="ktv-modal-container">'
            + '    <div class="ktv-modal-header">'
            + '      <h3><i class="fas fa-envelope-open-text"></i> Send us a Message</h3>'
            + '      <button class="ktv-modal-close" data-close-modal="' + modalId + '" aria-label="Close">&times;</button>'
            + '    </div>'
            + '    <div class="ktv-modal-body">'
            + '      <p style="margin-bottom:20px;color:#666;">We will reply within 24 hours</p>'
            + '      <form id="ktv-contact-modal-form-' + modalId + '">'
            + getHoneypotFieldHtml(null)
            + '        <input type="hidden" name="action" value="ktv_send_contact">'
            + '        <input type="hidden" name="nonce" value="' + ktvConfig.nonce + '">'
            + '        <div class="ktv-modal-form-row">'
            + '          <div class="ktv-input-group"><i class="fas fa-calendar-alt"></i><input type="text" name="arrival_date" class="ktv-datepicker" value="' + formattedArrival + '" placeholder="Arrival Date *" required autocomplete="off"></div>'
            + '          <div class="ktv-input-group"><i class="fas fa-calendar-check"></i><input type="text" name="departure_date" class="ktv-datepicker" value="' + formattedDeparture + '" placeholder="Departure Date *" required autocomplete="off"></div>'
            + '        </div>'
            + '        <div class="ktv-modal-form-row">'
            + '          <div class="ktv-input-group"><i class="fas fa-user"></i><input type="text" name="name" placeholder="Full Name *" required></div>'
            + '          <div class="ktv-input-group"><i class="fas fa-envelope"></i><input type="email" name="email" placeholder="Email Address *" required></div>'
            + '        </div>'
            + '        <div class="ktv-modal-form-row">'
            + '          <div class="ktv-phone-group">'
            + '            <i class="fas fa-phone-alt" style="transform:scaleX(-1);display:inline-block;"></i>'
            + '            <select name="phone_code">'
            + phoneCodeOptionsHtml
            + '            </select>'
            + '            <input type="tel" name="phone" placeholder="Phone Number *" required>'
            + '          </div>'
            + '          <div class="ktv-input-group"><i class="fas fa-globe"></i>'
            + '            <select name="country">'
            + countryOptionsHtml
            + '            </select>'
            + '          </div>'
            + '        </div>'
            + '        <div class="ktv-input-group"><i class="fas fa-comment-dots"></i><textarea name="message" rows="4" placeholder="Your Message *" required></textarea></div>'
            + '        <button type="submit" class="ktv-modal-btn">Send Message <i class="fas fa-paper-plane"></i></button>'
            + '        <div class="ktv-modal-message"></div>'
            + '      </form>'
            + '    </div>'
            + '    <div class="ktv-modal-footer"><small>Your message will be sent directly to our team.</small></div>'
            + '  </div>'
            + '</div>';

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.classList.add('ktv-modal-open');

        var modalEl = document.getElementById(modalId);
        if (modalEl) applyDarkModeClassToElement(modalEl);

        $$('#' + modalId + ' .ktv-modal-close').forEach(function (btn) {
            btn.addEventListener('click', function () { window.closeModal(modalId); });
        });

        function tryBindFlatpickrContact() {
            if (typeof flatpickr === 'undefined') return false;
            $$('#' + modalId + ' .ktv-datepicker').forEach(function (input) {
                if (input._flatpickr) return;
                flatpickr(input, {
                    dateFormat: 'Y-m-d',
                    minDate: 'today',
                    altInput: true,
                    altFormat: 'F j, Y',
                    disableMobile: true
                });
            });
            return true;
        }

        if (!tryBindFlatpickrContact()) {
            var attempts = 0;
            var retryTimer = setInterval(function () {
                attempts++;
                if (tryBindFlatpickrContact() || attempts >= 30) {
                    clearInterval(retryTimer);
                }
            }, 100);
        }

        var contactCountrySelect = modalEl.querySelector('select[name="country"]');
        var contactPhoneCodeSelect = modalEl.querySelector('select[name="phone_code"]');
        if (contactCountrySelect && contactPhoneCodeSelect) {
            contactCountrySelect.addEventListener('change', function () {
                var name = this.value;
                if (!name) return;
                var list = getCountriesList();
                for (var ci = 0; ci < list.length; ci++) {
                    if (list[ci].name === name) {
                        contactPhoneCodeSelect.value = list[ci].code;
                        break;
                    }
                }
            });
            contactPhoneCodeSelect.addEventListener('change', function () {
                syncCountryFromPhoneCode(modalEl.querySelector('form'));
            });
        }

        var form = document.getElementById('ktv-contact-modal-form-' + modalId);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearFieldErrors(form);

            if (handleHoneypotTrip(form, null, modalId)) {
                return;
            }

            var nameField = form.querySelector('input[name="name"]');
            var emailField = form.querySelector('input[name="email"]');
            var phoneField = form.querySelector('input[name="phone"]');
            var arrivalField = form.querySelector('input[name="arrival_date"]');
            var departureField = form.querySelector('input[name="departure_date"]');
            var messageField = form.querySelector('textarea[name="message"]');

            if (!nameField || !trim(nameField.value)) {
                markFieldError(nameField, 'Please enter your full name');
                showModalMessage(modalId, 'Please enter your full name', 'error');
                return;
            }
            if (!emailField || !validateEmail(emailField.value.trim())) {
                markFieldError(emailField, 'Please enter a valid email address');
                showModalMessage(modalId, 'Please enter a valid email address', 'error');
                return;
            }
            if (!phoneField || !validatePhone(phoneField.value.trim())) {
                markFieldError(phoneField, 'Please enter a valid phone number');
                showModalMessage(modalId, 'Please enter a valid phone number', 'error');
                return;
            }
            if (!arrivalField || !trim(arrivalField.value)) {
                markFieldError(arrivalField, 'Please select arrival date');
                showModalMessage(modalId, 'Please select arrival date', 'error');
                return;
            }
            if (!departureField || !trim(departureField.value)) {
                markFieldError(departureField, 'Please select departure date');
                showModalMessage(modalId, 'Please select departure date', 'error');
                return;
            }
            if (new Date(departureField.value) <= new Date(arrivalField.value)) {
                markFieldError(departureField, 'Departure must be after arrival');
                showModalMessage(modalId, 'Departure date must be after arrival date', 'error');
                return;
            }
            if (!messageField || !trim(messageField.value) || trim(messageField.value).length < 10) {
                markFieldError(messageField, 'Message must be at least 10 characters');
                showModalMessage(modalId, 'Message must be at least 10 characters', 'error');
                return;
            }

            var formData = new FormData(this);
            var submitBtn = this.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
                .then(function (response) { return response.json(); })
                .then(function (response) {
                    if (response.success) {
                        showModalMessage(modalId, response.data.message || 'Message sent successfully!', 'success');
                        setTimeout(function () { window.closeModal(modalId); }, 2000);
                    } else {
                        showModalMessage(modalId, (response.data && response.data.message) || 'Error sending message', 'error');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                })
                .catch(function () {
                    showModalMessage(modalId, 'Server error. Please try again.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
        });
    };

    /* ============================================================
       16. GPAY BUTTON HANDLER
       ============================================================ */

    function initGPayButtons() {
        /* INTENTIONAL NO-OP — body handled by ktvGlobalClickRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }

    /* ============================================================
       17. EVENT LISTENERS AND MODAL TRIGGERS
       ============================================================ */

    function ktvGlobalClickRouter(e) {
        if (!e.target || !e.target.closest) return;
        if (!e.target.closest('[class*="ktv-"], [data-open-modal], .ktv-modal-overlay')) return;
        var gpayBtn = e.target.closest('.ktv-gpay-pay-btn, .ktv-upi-app-btn.google-pay');

        if (gpayBtn) {
            if (gpayBtn.closest('.ktv-modal-overlay')) {
            } else {
                e.preventDefault();
                e.stopPropagation();
                if (gpayBtn.dataset.ktvGpayHandled !== '1') {
                    gpayBtn.dataset.ktvGpayHandled = '1';
                    setTimeout(function () { gpayBtn.dataset.ktvGpayHandled = '0'; }, 500);
                    var amount = gpayBtn.getAttribute('data-amount') || '0';
                    var upi = gpayBtn.getAttribute('data-upi') || ktvConfig.upiId;
                    var name = gpayBtn.getAttribute('data-name') || ktvConfig.gpayName || 'Imran Zaindari';
                    var gform = gpayBtn.closest('form');
                    if (gform) {
                        var totalEl = gform.querySelector('#booking-total, .ktv-grand-total span, .ktv-total-amount');
                        if (totalEl) {
                            var totalText = totalEl.textContent.replace(/[^0-9.]/g, '');
                            if (totalText && parseFloat(totalText) > 0) {
                                amount = parseFloat(totalText).toFixed(2);
                            }
                        }
                    }
                    openGPaySmartLink(upi, amount, name);
                }
                return;
            }
        }

        var zeroLink = e.target.closest('.ktv-zero-reviews-link');
        if (zeroLink) {
            e.preventDefault();
            var tourId = getAttr(zeroLink, 'data-tour-id', 'data-id');
            var tourName = zeroLink.getAttribute('data-tour-name') || '';
            var pageId = zeroLink.getAttribute('data-page-id') || '';
            window.openReviewModal(tourId, tourName, pageId);
            return;
        }

        var reviewArea = e.target.closest('.ktv-tour-reviews-mini, .ktv-tour-package-reviews-mini, .ktv-review-clickable');
        if (reviewArea) {
            if (!e.target.closest('a, button')) {
                var tourId2 = getAttr(reviewArea, 'data-tour-id', 'data-id');
                var tourName2 = reviewArea.getAttribute('data-tour-name') || '';
                var pageId2 = reviewArea.getAttribute('data-page-id') || '';
                e.preventDefault();
                window.openReviewModal(tourId2, tourName2, pageId2);
                return;
            }
        }

        var firstReview = e.target.closest('.ktv-be-first-review');
        if (firstReview) {
            e.preventDefault();
            var tourId3 = getAttr(firstReview, 'data-tour-id', 'data-id');
            var pageId3 = firstReview.getAttribute('data-page-id') || '';
            window.openReviewModal(tourId3, '', pageId3);
            return;
        }

        var bookBtn = e.target.closest('.ktv-tour-book-btn, .ktv-booking-button-block, .ktv-tour-package-btn, .ktv-book-now-btn');
        if (bookBtn) {
            e.preventDefault();
            var bTourId = getAttr(bookBtn, 'data-tour-id', 'data-id');
            var bTourName = getAttr(bookBtn, 'data-tour-name', 'data-name');
            var bTourPrice = getAttr(bookBtn, 'data-tour-per-person', 'data-tour-total-price') || getAttr(bookBtn, 'data-tour-price', '') || getAttr(bookBtn, 'data-price', '');
            var bTourLocation = getAttr(bookBtn, 'data-tour-location', 'data-location');
            var bBlockType = getAttr(bookBtn, 'data-block-type', 'data-block-type') || 'grid';

            if (!bTourLocation) {
                var card = bookBtn.closest('.ktv-tour-package-card, .ktv-tour-card');
                if (card) {
                    bTourLocation = getAttr(card, 'data-tour-location', 'data-location');
                    if (!bTourLocation) {
                        var locationEl = card.querySelector('.ktv-tour-package-location, .ktv-tour-location');
                        if (locationEl) {
                            bTourLocation = stripIconPrefix(locationEl.textContent.trim());
                        }
                    }
                }
            }
            if (!bTourName) {
                var card2 = bookBtn.closest('.ktv-tour-package-card, .ktv-tour-card');
                if (card2) {
                    bTourName = getAttr(card2, 'data-tour-name', 'data-name');
                    if (!bTourName) {
                        var titleEl = card2.querySelector('.ktv-tour-package-title, .ktv-tour-title');
                        if (titleEl) bTourName = stripIconPrefix(titleEl.textContent.trim());
                    }
                }
            }
            if (!bTourPrice || bTourPrice === '0') {
                var card3 = bookBtn.closest('.ktv-tour-package-card, .ktv-tour-card');
                if (card3) {
                    bTourPrice = getAttr(card3, 'data-tour-per-person', 'data-tour-total-price') || getAttr(card3, 'data-tour-price', '') || getAttr(card3, 'data-price', '');
                    if (!bTourPrice || bTourPrice === '0') {
                        var priceEl = card3.querySelector('.ktv-tour-package-new-price, .ktv-new-price');
                        if (priceEl) bTourPrice = priceEl.textContent.replace(/[^0-9.]/g, '');
                    }
                }
            }

            var hasBookingFeature = document.querySelector('.ktv-booking-multi-step');
            var url = bookBtn.getAttribute('data-url') || bookBtn.getAttribute('href');
            var isHashUrl = !url || url === '#' || url === '' || url === 'undefined';

            if (hasBookingFeature) {
                window.openBookingModal(bTourId, bTourName, bTourPrice, bTourLocation, bBlockType);
                return;
            }

            if (!isHashUrl) {
                window.location.href = url;
                return;
            }

            window.openBookingModal(bTourId, bTourName, bTourPrice, bTourLocation, bBlockType);
            return;
        }

        var contactLink = e.target.closest('[data-open-modal="contact"], .ktv-contact-trigger');
        if (contactLink) {
            e.preventDefault();
            window.openContactModal();
            return;
        }

        var imageLink = e.target.closest('.ktv-tour-package-image-link, .ktv-tour-image-link');
        if (imageLink) {
            var wrapper = imageLink.closest('.ktv-tour-package-image-wrapper, .ktv-tour-image-wrapper');
            if (wrapper) showRotatingDots(wrapper);
            var href = imageLink.getAttribute('href');
            if (!href || href === '#' || href === '') {
                e.preventDefault();
            }
            return;
        }

        var accHead = e.target.closest('.ktv-accordion-head');
        if (accHead) {
            e.preventDefault();
            var accBody = accHead.nextElementSibling;
            var accIcon = accHead.querySelector('.ktv-accordion-icon');
            var accWrapper = accHead.closest('.ktv-accordion-wrapper');
            var isOpening = !hasClass(accBody, 'active') && (accBody.style.display === 'none' || !accBody.style.display);
            if (accWrapper) {
                accWrapper.querySelectorAll('.ktv-accordion-body').forEach(function (b) {
                    if (b !== accBody) {
                        slideUp(b, 300);
                        removeClass(b, 'active');
                        b.style.display = 'none';
                    }
                });
                accWrapper.querySelectorAll('.ktv-accordion-icon').forEach(function (ic) {
                    if (ic !== accIcon) ic.textContent = '+';
                });
            }
            if (isOpening) {
                slideDown(accBody, 300);
                addClass(accBody, 'active');
                if (accIcon) accIcon.textContent = '−';
                setTimeout(function () { animateScrollTo(accHead, 100); }, 350);
            } else {
                slideUp(accBody, 300);
                removeClass(accBody, 'active');
                if (accIcon) accIcon.textContent = '+';
            }
            return;
        }

        var shareBtn = e.target.closest('.ktv-accordion-share-btn');
        if (shareBtn) {
            e.preventDefault();
            e.stopPropagation();
            var shareWrapper = shareBtn.closest('.ktv-accordion-wrapper');
            var shareTitle = shareWrapper ? (shareWrapper.dataset.title || 'Tour Itinerary') : 'Tour Itinerary';
            var shareContent = shareTitle + '\n\n';
            if (shareWrapper) {
                shareWrapper.querySelectorAll('.ktv-accordion-item').forEach(function (item) {
                    var head = item.querySelector('.ktv-accordion-head span:first-child') || item.querySelector('.ktv-accordion-head-left span');
                    var bodyEl = item.querySelector('.ktv-accordion-body');
                    if (head) shareContent += stripIconPrefix(head.textContent.trim()) + '\n';
                    if (bodyEl) shareContent += bodyEl.textContent.trim() + '\n\n---\n\n';
                });
            }
            if (navigator.share) {
                navigator.share({ title: shareTitle, text: shareContent.substring(0, 300) + '...', url: window.location.href }).catch(function () { });
            } else {
                var tempInput = document.createElement('textarea');
                tempInput.value = shareContent;
                document.body.appendChild(tempInput);
                tempInput.select();
                try {
                    document.execCommand('copy');
                    showToast('Itinerary content copied to clipboard!', 'success');
                } catch (err) {
                    showToast('Share not supported. Please copy manually.', 'warning');
                }
                document.body.removeChild(tempInput);
            }
            return;
        }

        var downloadBtn = e.target.closest('.ktv-accordion-download-btn');
        if (downloadBtn) {
            e.preventDefault();
            e.stopPropagation();
            var downloadWrapper = downloadBtn.closest('.ktv-accordion-wrapper');
            var options = downloadWrapper ? downloadWrapper.querySelector('.ktv-download-options') : null;
            if (options) {
                if (options.style.display !== 'none' && options.style.display !== '') {
                    slideUp(options, 200);
                } else {
                    document.querySelectorAll('.ktv-download-options').forEach(function (opt) {
                        if (opt !== options) slideUp(opt, 200);
                    });
                    slideDown(options, 200);
                }
            }
            return;
        }

        var accPdfBtn = e.target.closest('.ktv-download-pdf');
        if (accPdfBtn) {
            e.preventDefault();
            e.stopPropagation();
            var pdfWrapper = accPdfBtn.closest('.ktv-accordion-wrapper');
            if (pdfWrapper) {
                var pdfTitle = pdfWrapper.dataset.title || 'Tour Itinerary';
                var pdfFileName = pdfTitle.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase() || 'itinerary';
                ktvExportPdfFromHtml(buildAccordionPrintHTML(pdfWrapper), pdfFileName);
            }
            var pdfOptions = pdfWrapper ? pdfWrapper.querySelector('.ktv-download-options') : null;
            if (pdfOptions) slideUp(pdfOptions, 200);
            return;
        }

        var docxBtn = e.target.closest('.ktv-download-docx');
        if (docxBtn) {
            e.preventDefault();
            var wrapperD = docxBtn.closest('.ktv-accordion-wrapper');
            downloadAccordionContent(wrapperD, 'docx');
            var optionsD = wrapperD ? wrapperD.querySelector('.ktv-download-options') : null;
            if (optionsD) slideUp(optionsD, 200);
            return;
        }

        var txtBtn = e.target.closest('.ktv-download-txt');
        if (txtBtn) {
            e.preventDefault();
            var wrapper4 = txtBtn.closest('.ktv-accordion-wrapper');
            downloadAccordionContent(wrapper4, 'txt');
            var options4 = wrapper4 ? wrapper4.querySelector('.ktv-download-options') : null;
            if (options4) slideUp(options4, 200);
            return;
        }

        var viewDocxBtn = e.target.closest('.ktv-view-docx');
        if (viewDocxBtn) {
            e.preventDefault();
            var wrapperVd = viewDocxBtn.closest('.ktv-accordion-wrapper');
            viewAccordionAsDocx(wrapperVd);
            var optionsVd = wrapperVd ? wrapperVd.querySelector('.ktv-download-options') : null;
            if (optionsVd) slideUp(optionsVd, 200);
            return;
        }

        var viewTxtBtn = e.target.closest('.ktv-view-txt');
        if (viewTxtBtn) {
            e.preventDefault();
            var wrapperVt = viewTxtBtn.closest('.ktv-accordion-wrapper');
            viewAccordionAsTxt(wrapperVt);
            var optionsVt = wrapperVt ? wrapperVt.querySelector('.ktv-download-options') : null;
            if (optionsVt) slideUp(optionsVt, 200);
            return;
        }

        var printAccordionBtn = e.target.closest('.ktv-accordion-print-btn');
        if (printAccordionBtn) {
            e.preventDefault();
            e.stopPropagation();
            var wrapperP = printAccordionBtn.closest('.ktv-accordion-wrapper');
            if (wrapperP) {
                var sectionTitleP = wrapperP.dataset.title || 'Tour Itinerary';
                var fullHtmlP = buildAccordionPrintHTML(wrapperP);
                var wP = window.open('', '_blank', 'width=900,height=700');
                if (!wP) {
                    showToast('Please allow popups to print.', 'warning');
                } else {
                    wP.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + sectionTitleP + '</title><style>body{font-family:Tahoma,Arial,sans-serif;padding:20px;}@media print{body{padding:0;}}</style></head><body>' + fullHtmlP + '</body></html>');
                    wP.document.close();
                    wP.addEventListener('load', function () { setTimeout(function () { wP.focus(); wP.print(); }, 400); });
                }
                var optDrop = wrapperP.querySelector('.ktv-download-options');
                if (optDrop) slideUp(optDrop, 200);
            }
            return;
        }

        if (!e.target.closest('.ktv-accordion-actions')) {
            document.querySelectorAll('.ktv-download-options').forEach(function (opt) {
                if (opt.style.display !== 'none' && opt.style.display !== '') slideUp(opt, 200);
            });
        }

        var tabBtn = e.target.closest('.ktv-tab-btn');
        if (tabBtn) {
            e.preventDefault();
            var tabIndex = tabBtn.getAttribute('data-tab');
            var tabWrapper = tabBtn.closest('.ktv-tabs-wrapper');
            if (tabWrapper) {
                tabWrapper.querySelectorAll('.ktv-tab-btn').forEach(function (b) { removeClass(b, 'active'); });
                addClass(tabBtn, 'active');
                tabWrapper.querySelectorAll('.ktv-tab-pane').forEach(function (pane) {
                    pane.style.display = 'none';
                    removeClass(pane, 'active');
                });
                var targetPane = tabWrapper.querySelector('.ktv-tab-pane[data-tab="' + tabIndex + '"]');
                if (targetPane) {
                    targetPane.style.display = 'block';
                    addClass(targetPane, 'active');
                }
                if (tabWrapper.getAttribute('data-auto-scroll') !== 'false') {
                    setTimeout(function () { animateScrollTo(targetPane, 120); }, 300);
                }
            }
            return;
        }

        var tabPdfBtn = e.target.closest('.ktv-tab-download-pdf');
        if (tabPdfBtn) {
            e.preventDefault();
            var tabWrapperPdf = tabPdfBtn.closest('.ktv-tabs-wrapper');
            if (tabWrapperPdf) {
                var tabPdfTitle = getTabsSectionTitle(tabWrapperPdf);
                var tabPdfHtml = getAllTabsCombinedHtml(tabWrapperPdf);
                var tabPdfFullHtml = buildTabsPrintHeader() + '<div style="padding:25px 30px;"><h1 style="color:#075e54;margin:0 0 15px;">' + escapeHtml(tabPdfTitle) + '</h1>' + tabPdfHtml + '</div>';
                var tabPdfFileName = tabPdfTitle.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase() || 'tabs';
                ktvExportPdfFromHtml(tabPdfFullHtml, tabPdfFileName);
                showToast('PDF download started.', 'success');
            }
            return;
        }

        var tabDocxBtn = e.target.closest('.ktv-tab-download-docx');
        if (tabDocxBtn) {
            e.preventDefault();
            var tabWrapperD = tabDocxBtn.closest('.ktv-tabs-wrapper');
            if (tabWrapperD) {
                var tabSectionTitle = getTabsSectionTitle(tabWrapperD);
                var tabCombinedHtml = getAllTabsCombinedHtml(tabWrapperD);
                var tabDocHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><title>' + escapeHtml(tabSectionTitle) + '</title><style>body{font-family:Tahoma,Arial,sans-serif;}</style></head><body>';
                tabDocHtml += '<h1 style="color:#075e54;">' + escapeHtml(tabSectionTitle) + '</h1>';
                tabDocHtml += tabCombinedHtml;
                tabDocHtml += '</body></html>';
                var tabBlob = new Blob([tabDocHtml], { type: 'application/msword' });
                var tabFileName = tabSectionTitle.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase() || 'tabs';
                triggerDownload(tabBlob, tabFileName + '-all-tabs.doc');
                showToast('DOCX (all tabs) downloaded!', 'success');
            }
            return;
        }

        var tabTxtBtn = e.target.closest('.ktv-tab-download-txt');
        if (tabTxtBtn) {
            e.preventDefault();
            var tabWrapperT = tabTxtBtn.closest('.ktv-tabs-wrapper');
            if (tabWrapperT) {
                var tabSectionTitleT = getTabsSectionTitle(tabWrapperT);
                var tabCombinedText = tabSectionTitleT + '\n' + '='.repeat(tabSectionTitleT.length) + '\n\n' + getAllTabsCombinedText(tabWrapperT);
                var tabBlobT = new Blob([tabCombinedText], { type: 'text/plain;charset=utf-8' });
                var tabFileNameT = tabSectionTitleT.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase() || 'tabs';
                triggerDownload(tabBlobT, tabFileNameT + '-all-tabs.txt');
                showToast('TXT (all tabs) downloaded!', 'success');
            }
            return;
        }

        var tabPrintBtn = e.target.closest('.ktv-tab-print-btn');
        if (tabPrintBtn) {
            e.preventDefault();
            var tabWrapperP2 = tabPrintBtn.closest('.ktv-tabs-wrapper');
            if (tabWrapperP2) {
                var tabSectionTitleP2 = getTabsSectionTitle(tabWrapperP2);
                var tabCombinedHtmlP2 = getAllTabsCombinedHtml(tabWrapperP2);
                var tabPrintHeaderP2 = buildTabsPrintHeader();
                var wTP = window.open('', '_blank', 'width=900,height=700');
                if (!wTP) {
                    showToast('Please allow popups to print.', 'warning');
                } else {
                    wTP.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + tabSectionTitleP2 + '</title><style>body{font-family:Tahoma,Arial,sans-serif;padding:0;margin:0;line-height:1.7;} h1,h2{color:#075e54;}@media print{body{padding:0;}}</style></head><body>' + tabPrintHeaderP2 + '<div style="padding:25px 30px;"><h1>' + escapeHtml(tabSectionTitleP2) + '</h1>' + tabCombinedHtmlP2 + '</div></body></html>');
                    wTP.document.close();
                    wTP.addEventListener('load', function () { setTimeout(function () { wTP.focus(); wTP.print(); }, 400); });
                }
            }
            return;
        }

        var wishlistBtn = e.target.closest('.ktv-wishlist-btn');
        if (wishlistBtn) {
            e.preventDefault();
            e.stopPropagation();
            var wlId = getAttr(wishlistBtn, 'data-tour-id', 'data-id');
            var wlName = wishlistBtn.getAttribute('data-tour-name') || '';
            if (!wlId && !wlName) return;
            var wlIcon = wishlistBtn.querySelector('i');
            var wlOriginalIconClass = wlIcon ? wlIcon.className : '';
            if (wlIcon) wlIcon.className = 'fas fa-spinner fa-spin';

            var wlFormData = new FormData();
            wlFormData.append('action', 'ktv_wishlist_toggle');
            wlFormData.append('nonce', ktvConfig.nonce);
            wlFormData.append('tour_id', wlId || '0');
            wlFormData.append('tour_name', wlName);

            fetch(ktvConfig.ajaxUrl, { method: 'POST', body: wlFormData })
                .then(function (response) { return response.json(); })
                .then(function (response) {
                    if (response.success) {
                        var newCount = response.data.count || 0;
                        var wlAction = response.data.action;
                        $$('.ktv-wishlist-btn').forEach(function (b) {
                            var bId = b.getAttribute('data-tour-id');
                            var bName = b.getAttribute('data-tour-name') || '';
                            var match = false;
                            if (wlId && String(bId) === String(wlId)) match = true;
                            else if (!wlId && wlName && bName === wlName) match = true;
                            if (match) {
                                var c = b.querySelector('.ktv-wishlist-count');
                                if (c) c.textContent = newCount;
                                var i = b.querySelector('i');
                                if (i) {
                                    if (wlAction === 'added') {
                                        i.className = 'fas fa-heart';
                                        b.setAttribute('data-in-wishlist', '1');
                                        addClass(b, 'active');
                                    } else {
                                        i.className = 'far fa-heart';
                                        b.setAttribute('data-in-wishlist', '0');
                                        removeClass(b, 'active');
                                    }
                                }
                            }
                        });
                        if (wlIcon) {
                            wlIcon.className = (wlAction === 'added') ? 'fas fa-heart' : 'far fa-heart';
                        }
                        showToast(wlAction === 'added' ? 'Added to wishlist!' : 'Removed from wishlist!', 'success');
                    } else {
                        if (wlIcon) wlIcon.className = wlOriginalIconClass;
                    }
                })
                .catch(function () {
                    if (wlIcon) wlIcon.className = wlOriginalIconClass;
                    showToast('Error updating wishlist. Please try again.', 'error');
                });
            return;
        }

        var helpfulBtn = e.target.closest('.ktv-helpful-btn');
        if (helpfulBtn) {
            e.preventDefault();
            if (helpfulBtn.disabled) return;
            var reviewId = helpfulBtn.getAttribute('data-review-id');
            var countSpan = helpfulBtn.querySelector('.ktv-helpful-count');
            var currentCount = countSpan ? parseInt(countSpan.textContent, 10) : 0;
            if (countSpan) countSpan.textContent = currentCount + 1;
            helpfulBtn.disabled = true;
            helpfulBtn.style.opacity = '0.6';

            if (!ktvConfig.ajaxUrl) {
                if (countSpan) countSpan.textContent = currentCount;
                helpfulBtn.disabled = false;
                helpfulBtn.style.opacity = '1';
                return;
            }

            var helpFormData = new FormData();
            helpFormData.append('action', 'ktv_review_helpful');
            helpFormData.append('review_id', reviewId);
            helpFormData.append('nonce', ktvConfig.nonce);
            fetch(ktvConfig.ajaxUrl, { method: 'POST', body: helpFormData })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data.success && countSpan && data.data && data.data.helpful_count !== undefined) {
                        countSpan.textContent = data.data.helpful_count;
                    }
                })
                .catch(function () {
                    if (countSpan) countSpan.textContent = currentCount;
                    helpfulBtn.disabled = false;
                    helpfulBtn.style.opacity = '1';
                });
            return;
        }

        var guestActionBtn = e.target.closest('.ktv-guest-voucher-action-btn');
        if (guestActionBtn) {
            var gvVoucher = guestActionBtn.getAttribute('data-voucher-code') || '';
            var gvToken = guestActionBtn.getAttribute('data-token') || '';
            var gvAction = guestActionBtn.getAttribute('data-action') || '';
            if (!gvVoucher || !gvToken || !gvAction) return;
            e.preventDefault();
            e.stopPropagation();
            if (guestActionBtn.disabled) return;

            var gvOriginalText = guestActionBtn.innerHTML;

            var gvActionConfig = {
                accept: { title: 'Accept Booking', placeholder: '', description: 'Confirm that you want to accept this booking?' },
                modify: { title: 'Modify Booking', placeholder: 'E.g. change dates to..., add 2 more adults, change tour package...', description: 'Please describe what you want to change:' },
                decline: { title: 'Decline Booking', placeholder: 'Optional reason for declining...', description: 'You may add an optional reason:' },
                cancel: { title: 'Request Cancellation', placeholder: 'Optional reason for cancellation...', description: 'The booking is NOT cancelled until our team approves. You may add an optional reason:' },
                dynamic: { title: 'Refresh Voucher', placeholder: '', description: 'Load the latest version of this voucher?' }
            };

            var gvCfg = gvActionConfig[gvAction];
            if (!gvCfg) return;

            var gvPerform = function (inputValue) {
                var gvPayload = {};
                if (gvAction === 'decline') gvPayload.decline_reason = inputValue || '';
                else if (gvAction === 'modify') gvPayload.modify_request = inputValue || '';
                else if (gvAction === 'cancel') gvPayload.cancel_reason = inputValue || '';

                guestActionBtn.disabled = true;
                guestActionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                var gvFeedback = document.querySelector('.ktv-guest-voucher-action-feedback');

                var gvFormData = new FormData();
                gvFormData.append('action', 'ktv_guest_voucher_action');
                gvFormData.append('nonce', ktvConfig.nonce);
                gvFormData.append('voucher_code', gvVoucher);
                gvFormData.append('token', gvToken);
                gvFormData.append('guest_action', gvAction);
                if (gvPayload.decline_reason !== undefined) gvFormData.append('decline_reason', gvPayload.decline_reason);
                if (gvPayload.modify_request !== undefined) {
                    gvFormData.append('modify_request', gvPayload.modify_request);
                    gvFormData.append('preserve_override', '1');
                }
                if (gvPayload.cancel_reason !== undefined) gvFormData.append('cancel_reason', gvPayload.cancel_reason);

                fetch(ktvConfig.ajaxUrl, { method: 'POST', body: gvFormData })
                    .then(function (response) { return response.json(); })
                    .then(function (response) {
                        if (response.success) {
                            if (gvAction === 'dynamic' && response.data && response.data.html) {
                                var voucherBody = document.querySelector('.ktv-voucher-ticket');
                                if (voucherBody && response.data.html) {
                                    var tempWrapper = document.createElement('div');
                                    tempWrapper.innerHTML = response.data.html;
                                    var newTicket = tempWrapper.querySelector('.ktv-voucher-ticket');
                                    if (newTicket) {
                                        voucherBody.parentNode.replaceChild(newTicket, voucherBody);
                                        if (ktvConfig.darkModeEnabled) {
                                            newTicket.classList.add('ktv-dark-mode');
                                            newTicket.classList.add('ktv-dark-mode-global');
                                        }
                                        hideBrokenLogos(newTicket);
                                    }
                                }
                                if (response.data.actions) {
                                    var actionsContainer = document.querySelector('.ktv-voucher-guest-actions');
                                    if (actionsContainer) {
                                        var parent = actionsContainer.parentNode;
                                        parent.innerHTML = response.data.actions;
                                        ktvInitVoucherDownloadToggle(parent);
                                    }
                                }
                                showToast('Dynamic voucher refreshed!', 'success');
                            } else {
                                if (gvFeedback) {
                                    gvFeedback.className = 'ktv-guest-voucher-action-feedback success';
                                    gvFeedback.textContent = response.data.message || 'Action completed.';
                                    gvFeedback.style.display = 'block';
                                }
                                showToast(response.data.message || 'Action completed.', 'success');
                            }
                        } else {
                            var gvErrMsg = (response.data && response.data.message) || 'Action failed.';
                            if (gvFeedback) {
                                gvFeedback.className = 'ktv-guest-voucher-action-feedback error';
                                gvFeedback.textContent = gvErrMsg;
                                gvFeedback.style.display = 'block';
                            }
                            showToast(gvErrMsg, 'error');
                            guestActionBtn.disabled = false;
                            guestActionBtn.innerHTML = gvOriginalText;
                        }
                    })
                    .catch(function () {
                        var gvCatchErr = 'Server error. Please try again.';
                        if (gvFeedback) {
                            gvFeedback.className = 'ktv-guest-voucher-action-feedback error';
                            gvFeedback.textContent = gvCatchErr;
                            gvFeedback.style.display = 'block';
                        }
                        showToast(gvCatchErr, 'error');
                        guestActionBtn.disabled = false;
                        guestActionBtn.innerHTML = gvOriginalText;
                    });
            };

            openGuestActionModal(gvAction, gvVoucher, gvToken, gvCfg.title, gvCfg.placeholder, function (value) {
                if (value === null) return;
                gvPerform(value);
            });
            return;
        }

        if (e.target.classList && e.target.classList.contains('ktv-modal-overlay')) {
            var overlayModalId = e.target.id;
            if (overlayModalId) window.closeModal(overlayModalId);
            return;
        }

        var locationTag = e.target.closest('.ktv-location-tag');
        if (locationTag) {
            e.preventDefault();
            var tagLocation = locationTag.getAttribute('data-location');
            if (tagLocation) {
                var gridContainer = document.querySelector('.ktv-tour-grid-container');
                if (gridContainer) {
                    var filterSelect = gridContainer.querySelector('.ktv-grid-location-filter');
                    if (filterSelect) {
                        filterSelect.value = tagLocation;
                        triggerEvent(filterSelect, 'change');
                    }
                    animateScrollTo(gridContainer, 100);
                }
                var bookingFormLoc = document.querySelector('.ktv-booking-multi-step');
                if (bookingFormLoc) {
                    var locationSearchLoc = bookingFormLoc.querySelector('#ktv-travel-location-search, .ktv-location-search-input');
                    var locationHiddenLoc = bookingFormLoc.querySelector('#ktv-travel-location-hidden, input[name="travel_location"]');
                    if (locationSearchLoc) {
                        locationSearchLoc.value = tagLocation;
                        if (locationHiddenLoc) locationHiddenLoc.value = tagLocation;
                        triggerEvent(locationSearchLoc, 'input');
                        filterToursByLocation(bookingFormLoc, tagLocation);
                    }
                    animateScrollTo(bookingFormLoc, 100);
                }
            }
            return;
        }

        var printVoucherBtn = e.target.closest('.ktv-voucher-print-btn, .ktv-print-voucher-btn');
        if (printVoucherBtn) {
            if (printVoucherBtn.closest('.ktv-modal-overlay')) {
            } else {
                e.preventDefault();
                e.stopPropagation();
                var pvCode = printVoucherBtn.getAttribute('data-voucher-code') || '';
                var pvSiteUrl = (ktvConfig.siteUrl || '').replace(/\/+$/, '');
                if (pvCode) {
                    openScopedPrintWindow(pvSiteUrl + '/voucher/' + encodeURIComponent(pvCode) + '?print=1', 'Voucher');
                } else {
                    window.print();
                }
                return;
            }
        }

        var viewBookingBtn = e.target.closest('.ktv-view-booking');
        if (viewBookingBtn) {
            e.preventDefault();
            var accModalEl = document.getElementById('ktvBookingDetailsModal');
            var accModalBody = document.getElementById('ktv-booking-details-body');
            if (accModalEl && accModalBody) {
                var rawBooking = viewBookingBtn.getAttribute('data-booking');
                if (rawBooking) {
                    var bookingData;
                    try { bookingData = JSON.parse(rawBooking); } catch (err) { bookingData = null; }
                    if (bookingData) {
                        var accRows = [
                            ['Booking Ref', bookingData.booking_ref],
                            ['Voucher Code', bookingData.voucher_code || '-'],
                            ['Tour', bookingData.tour_name || bookingData.tour_type],
                            ['Travelling To', bookingData.travel_location || '-'],
                            ['Arrival', bookingData.arrival_date],
                            ['Departure', bookingData.departure_date],
                            ['Nights', bookingData.nights || '-'],
                            ['Adults', bookingData.adults],
                            ['Children', bookingData.children],
                            ['Subtotal', (bookingData.currency || '') + ' ' + parseFloat(bookingData.subtotal || 0).toFixed(2)],
                            ['GST', (bookingData.currency || '') + ' ' + parseFloat(bookingData.gst_amount || 0).toFixed(2)],
                            ['Total', (bookingData.currency || '') + ' ' + parseFloat(bookingData.total_amount || 0).toFixed(2)],
                            ['Payment Method', (bookingData.payment_method || '').replace(/_/g, ' ')],
                            ['Status', bookingData.booking_status]
                        ];
                        if (bookingData.card_last_four) accRows.push(['Card', '**** ' + bookingData.card_last_four]);
                        if (bookingData.promo_code_used) accRows.push(['Promo Code', bookingData.promo_code_used]);
                        if (bookingData.flight_airline) accRows.push(['Flight', bookingData.flight_airline + ' ' + (bookingData.flight_number || '')]);
                        if (bookingData.id_document_path) accRows.push(['ID Document', '<a href="' + escapeHtml(bookingData.id_document_path) + '" target="_blank" rel="noopener">View</a>']);

                        var accHtml = '<table class="table table-sm mb-0">';
                        accRows.forEach(function (r) {
                            accHtml += '<tr><th class="ktv-booking-details-th">' + escapeHtml(String(r[0])) + '</th><td>' +
                                (r[1] !== undefined && r[1] !== null ? r[1] : '-') + '</td></tr>';
                        });
                        accHtml += '</table>';
                        accModalBody.innerHTML = accHtml;
                        if (typeof window.bootstrap !== 'undefined' && window.bootstrap.Modal) {
                            window.bootstrap.Modal.getOrCreateInstance(accModalEl).show();
                        }
                    }
                }
            }
            return;
        }

        var shareVoucherBtn = e.target.closest('.ktv-share-voucher');
        if (shareVoucherBtn) {
            e.preventDefault();
            var svUrl = shareVoucherBtn.getAttribute('data-voucher-url');
            if (svUrl) {
                if (navigator.share) {
                    navigator.share({ title: document.title, url: svUrl }).catch(function () { });
                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(svUrl).then(function () {
                        var svOrig = shareVoucherBtn.innerHTML;
                        shareVoucherBtn.innerHTML = '<i class="bi bi-check2"></i>';
                        setTimeout(function () { shareVoucherBtn.innerHTML = svOrig; }, 1500);
                    }).catch(function () { });
                } else {
                    window.prompt('Copy this URL:', svUrl);
                }
            }
            return;
        }

        var wlBookBtn = e.target.closest('.ktv-wishlist-book-now');
        if (wlBookBtn) {
            e.preventDefault();
            if (typeof window.openBookingModal === 'function') {
                window.openBookingModal(
                    wlBookBtn.getAttribute('data-tour-id'),
                    wlBookBtn.getAttribute('data-tour-name'),
                    wlBookBtn.getAttribute('data-tour-price'),
                    wlBookBtn.getAttribute('data-tour-location'),
                    wlBookBtn.getAttribute('data-block-type')
                );
            }
            return;
        }

        var wlRemoveBtn = e.target.closest('.ktv-wishlist-remove');
        if (wlRemoveBtn) {
            e.preventDefault();
            if (wlRemoveBtn.disabled) return;
            wlRemoveBtn.disabled = true;
            var wlRemoveTourId = wlRemoveBtn.getAttribute('data-tour-id');
            var wlRemoveTourName = wlRemoveBtn.getAttribute('data-tour-name');
            var wlAccountCfg = (typeof window.ktv_account !== 'undefined') ? window.ktv_account : {};
            var wlAjaxUrl = wlAccountCfg.ajax_url || ktvConfig.ajaxUrl || '/wp-admin/admin-ajax.php';
            var wlNonce = wlAccountCfg.nonce || ktvConfig.nonce || '';
            var wlRemoveFormData = new FormData();
            wlRemoveFormData.append('action', 'ktv_wishlist_toggle');
            wlRemoveFormData.append('nonce', wlNonce);
            wlRemoveFormData.append('tour_id', wlRemoveTourId || '0');
            wlRemoveFormData.append('tour_name', wlRemoveTourName || '');
            fetch(wlAjaxUrl, { method: 'POST', credentials: 'same-origin', body: wlRemoveFormData })
                .then(function (r) { return r.json(); })
                .then(function (resp) {
                    if (resp && resp.success) {
                        var wlCard = wlRemoveBtn.closest('.col-md-6, .col-lg-4');
                        if (wlCard) wlCard.remove();
                        var remaining = document.querySelectorAll('.ktv-my-wishlist .ktv-tour-card').length;
                        if (remaining === 0) window.location.reload();
                    } else {
                        wlRemoveBtn.disabled = false;
                    }
                })
                .catch(function () {
                    wlRemoveBtn.disabled = false;
                });
            return;
        }
    }

    function ktvGlobalKeydownRouter(e) {
        if (e.key === 'Escape') {
            var openModals = document.querySelectorAll('.ktv-modal-overlay');
            if (openModals.length > 0) {
                var last = openModals[openModals.length - 1];
                window.closeModal(last.id);
            }
        }
    }

    function initEventListeners() {
        document.addEventListener('click', ktvGlobalClickRouter);
        document.addEventListener('keydown', ktvGlobalKeydownRouter);
    }

    /* ============================================================
       18. SMART TRAVEL DATES
       ============================================================ */

    function parseISODate(dateStr) {
        if (!dateStr) return null;
        var match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            var d = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
            if (!isNaN(d.getTime())) return d;
        }
        var fallback = new Date(dateStr);
        if (isNaN(fallback.getTime())) return null;
        return fallback;
    }

    function formatISODateLocal(date) {
        if (!date) return '';
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    }

    function ktvRecomputeBooking(form) {
        if (!form) return;
        filterToursByNights(form);
        updateTourPriceDisplay(form);
        updateBookingSummary(form);
    }

    function initSmartTravelDates() {
        document.addEventListener('change', function (e) {
            if (e.target.name === 'arrival_date') {
                var arrivalVal = e.target.value;
                var form = e.target.closest('form');
                var departureInput = form ? form.querySelector('input[name="departure_date"]') : null;
                if (arrivalVal && departureInput) {
                    var arrivalDate = parseISODate(arrivalVal);
                    if (arrivalDate) {
                        var departureVal = departureInput.value;
                        var existingDeparture = parseISODate(departureVal);
                        if (!existingDeparture || existingDeparture <= arrivalDate) {
                            var nextDay = new Date(arrivalDate);
                            nextDay.setDate(nextDay.getDate() + 1);
                            var formatted = formatISODateLocal(nextDay);
                            departureInput.value = formatted;
                            if (departureInput._flatpickr) departureInput._flatpickr.setDate(formatted);
                        }
                        if (departureInput._flatpickr) departureInput._flatpickr.set('minDate', arrivalDate);
                    }
                }
                ktvRecomputeBooking(form);
            }
            if (e.target.name === 'departure_date') {
                var form2 = e.target.closest('form');
                ktvRecomputeBooking(form2);
            }
            if (e.target.name === 'adults' || e.target.name === 'children') {
                var form3 = e.target.closest('form');
                ktvRecomputeBooking(form3);
            }
            if (e.target.name === 'tour_type') {
                var form4 = e.target.closest('form');
                applyTourDatesFromSelection(form4);
                ktvRecomputeBooking(form4);
                var sel = form4 ? form4.querySelector('select[name="tour_type"]') : null;
                if (sel && sel.options[sel.selectedIndex]) {
                    applyPaxGridToContainer(form4.querySelector('.ktv-booking-pax-grid, #ktv-booking-pax-grid'), sel.options[sel.selectedIndex]);
                    applyTourMeta(sel.options[sel.selectedIndex]);
                }
            }
        });
        document.addEventListener('input', function (e) {
            if (e.target.name === 'adults' || e.target.name === 'children') {
                var form = e.target.closest('form');
                ktvRecomputeBooking(form);
            }
        });
    }

    /* ============================================================
       19. TOUR PRICE DISPLAY
       ============================================================ */

    function updateTourPriceDisplay(form) {
        if (!form) return;
        var tourSelect = form.querySelector('select[name="tour_type"]');
        var priceDisplay = form.querySelector('.ktv-price-display-box .ktv-price-amount, [id^="modal-tour-price-display-"], #ktv-tour-price-display');
        var adultsInput = form.querySelector('input[name="adults"]');
        var childrenInput = form.querySelector('input[name="children"]');

        if (!tourSelect || !priceDisplay) return;
        var selectedOption = tourSelect.options[tourSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) return;

        var showComplete = selectedOption.getAttribute('data-show-complete') === '1';
        var showPerDay = selectedOption.getAttribute('data-show-per-day') === '1';
        var basis = selectedOption.getAttribute('data-price-basis') || 'per_day';
        var enableIp = selectedOption.getAttribute('data-enable-ip-pricing') !== '0';

        var priceUnitLabel = form.querySelector('#ktv-price-unit-label') || form.querySelector('.ktv-price-display-box .ktv-price-unit');
        var nightCount = 1;
        var arrEl = form.querySelector('input[name="arrival_date"]');
        var depEl = form.querySelector('input[name="departure_date"]');
        if (arrEl && depEl && arrEl.value && depEl.value) {
            var aD = parseISODate(arrEl.value), dD = parseISODate(depEl.value);
            if (aD && dD) nightCount = Math.max(1, Math.ceil((dD - aD) / 86400000));
        }

        var originalPrice = parseFloat(selectedOption.getAttribute('data-original-price')) || 0;
        var offerPriceAttr = parseFloat(selectedOption.getAttribute('data-offer-price')) || 0;
        var dataPrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        var perPersonAttr = parseFloat(selectedOption.getAttribute('data-tour-per-person')) || 0;

        var effectiveDisplayPrice = pickEffectivePrice(originalPrice, offerPriceAttr, dataPrice);
        if (effectiveDisplayPrice <= 0) return;

        var adultCount = parseInt(adultsInput ? adultsInput.value : 1, 10) || 1;
        var childCount = parseInt(childrenInput ? childrenInput.value : 0, 10) || 0;

        var rawPax = {
            pax_1_price: parseFloat(selectedOption.getAttribute('data-pax1')) || 0,
            pax_2_price: parseFloat(selectedOption.getAttribute('data-pax2')) || 0,
            pax_3_price: parseFloat(selectedOption.getAttribute('data-pax3')) || 0,
            group_price: parseFloat(selectedOption.getAttribute('data-group')) || 0,
            family_price: parseFloat(selectedOption.getAttribute('data-family')) || 0
        };
        var adjustedPax = resolvePaxForOfferPrice(rawPax, effectiveDisplayPrice, originalPrice);

        var basePerPerson;
        if (perPersonAttr > 0) {
            basePerPerson = perPersonAttr;
        } else {
            basePerPerson = getBasePerPerson(effectiveDisplayPrice, adjustedPax);
            if (offerPriceAttr > 0 && offerPriceAttr < originalPrice) {
                var paxBase = getBasePerPerson(offerPriceAttr, adjustedPax);
                if (paxBase >= originalPrice || paxBase <= 0) {
                    basePerPerson = offerPriceAttr;
                }
            }
        }

        var extraAdultPct = ktvConfig.extraAdultPercent || 50;
        var extraChildPct = ktvConfig.extraChildPercent || 40;
        var extraAdultPrice = parseFloat(selectedOption.getAttribute('data-extra-adult')) || 0;
        var extraChildPrice = parseFloat(selectedOption.getAttribute('data-extra-child')) || 0;
        var extraAdult = extraAdultPrice > 0 ? extraAdultPrice : basePerPerson * (extraAdultPct / 100);
        var extraChild = extraChildPrice > 0 ? extraChildPrice : basePerPerson * (extraChildPct / 100);

        var displayPrice;
        if (showComplete || basis === 'total') {
            if (basis === 'total') {
                displayPrice = basePerPerson + (extraAdult * Math.max(0, adultCount - 1)) + (extraChild * childCount);
            } else {
                displayPrice = (basePerPerson + (extraAdult * Math.max(0, adultCount - 1)) + (extraChild * childCount)) * nightCount;
            }
        } else {
            displayPrice = basePerPerson + (extraAdult * Math.max(0, adultCount - 1)) + (extraChild * childCount);
        }
        if (priceUnitLabel) {
            priceUnitLabel.textContent = '';
            priceUnitLabel.style.display = 'none';
        }


        priceDisplay.textContent = displayPrice.toFixed(2);

        var tourPriceInput = form.querySelector('input[name="tour_price"]');
        if (tourPriceInput) tourPriceInput.value = effectiveDisplayPrice;

        if (enableIp && ktvConfig.currencyCode && ktvConfig.currencyCode !== ktvConfig.baseCurrency) {
            displayPrice = convertPrice(displayPrice);
        }
        var sym = enableIp ? (selectedOption.getAttribute('data-currency-symbol') || ktvConfig.currencySymbol) : resolveCurrencySymbol(ktvConfig.baseCurrency || 'INR', '');
        if (sym) {

            var priceBoxSpan = form.querySelector('.ktv-price-display-box span');
            if (priceBoxSpan && priceBoxSpan.firstChild && priceBoxSpan.firstChild.nodeType === 3) {
                priceBoxSpan.firstChild.textContent = sym + ' ';
            }
        }
    }

    /* ============================================================
       20. FILTER TOURS BY NIGHTS
       ============================================================ */

    function filterToursByNights(form) {
        if (!form) return;
        var arrival = form.querySelector('input[name="arrival_date"]');
        var departure = form.querySelector('input[name="departure_date"]');
        var tourSelect = form.querySelector('select[name="tour_type"]');
        if (!arrival || !departure || !tourSelect) return;
        if (!arrival.value || !departure.value) return;

        var arrivalDate = parseISODate(arrival.value);
        var departureDate = parseISODate(departure.value);
        if (!arrivalDate || !departureDate) return;

        var selectedNights = Math.max(1, Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24)));
        var options = tourSelect.options;
        var currentValue = tourSelect.value;
        var currentHidden = false;

        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            if (opt.value === '') continue;
            var basis = opt.getAttribute('data-price-basis') || 'total';
            if (basis === 'total') {
                opt.disabled = false;
                opt.style.display = '';
                continue;
            }
            var tourNights = parseInt(opt.getAttribute('data-nights'), 10) || 0;
            if (tourNights > 0 && tourNights > selectedNights) {
                opt.disabled = true;
                opt.style.display = 'none';
                if (opt.value === currentValue) currentHidden = true;
            } else {
                opt.disabled = false;
                opt.style.display = '';
            }
        }

        if (currentHidden) {
            tourSelect.value = '';
            for (var j = 0; j < options.length; j++) {
                if (options[j].value !== '' && !options[j].disabled) {
                    tourSelect.value = options[j].value;
                    break;
                }
            }
        }
    }

    function applyTourDatesFromSelection(form) {
        if (!form) return;
        var tourSelect = form.querySelector('select[name="tour_type"]');
        var arrivalInput = form.querySelector('input[name="arrival_date"]');
        var departureInput = form.querySelector('input[name="departure_date"]');

        if (!tourSelect || !arrivalInput || !departureInput) return;

        var selectedOption = tourSelect.options[tourSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) return;

        var tourNights = parseInt(selectedOption.getAttribute('data-nights'), 10) || 0;
        if (tourNights < 1) return;

        var baseDate = parseISODate(arrivalInput.value);
        if (!baseDate) {
            baseDate = new Date();
        }
        baseDate.setHours(0, 0, 0, 0);

        var newDeparture = new Date(baseDate.getTime());
        newDeparture.setDate(newDeparture.getDate() + tourNights);
        newDeparture.setHours(0, 0, 0, 0);

        if (arrivalInput._flatpickr) {
            arrivalInput._flatpickr.setDate(baseDate, false);
            if (arrivalInput._flatpickr.altInput) {
                try {
                    arrivalInput._flatpickr.altInput.value = arrivalInput._flatpickr.formatDate(baseDate, arrivalInput._flatpickr.config.altFormat);
                } catch (e) { }
            }
        } else {
            arrivalInput.value = formatISODateLocal(baseDate);
        }

        if (departureInput._flatpickr) {
            departureInput._flatpickr.set('minDate', baseDate);
            departureInput._flatpickr.setDate(newDeparture, false);
            if (departureInput._flatpickr.altInput) {
                try {
                    departureInput._flatpickr.altInput.value = departureInput._flatpickr.formatDate(newDeparture, departureInput._flatpickr.config.altFormat);
                } catch (e) { }
            }
        } else {
            departureInput.value = formatISODateLocal(newDeparture);
        }

        var defaultAdults = parseInt(selectedOption.getAttribute('data-tour-adults'), 10) || 0;
        var defaultChildren = parseInt(selectedOption.getAttribute('data-tour-children'), 10) || 0;
        var adultsInput = form.querySelector('input[name="adults"]');
        var childrenInput = form.querySelector('input[name="children"]');
        if (adultsInput && defaultAdults >= 1) {
            adultsInput.value = defaultAdults;
            triggerEvent(adultsInput, 'change');
        }
        if (childrenInput && defaultChildren >= 0) {
            childrenInput.value = defaultChildren;
            triggerEvent(childrenInput, 'change');
        }
    }

    /* ============================================================
       21. BOOKING SUMMARY UPDATE
       ============================================================ */

    function updateBookingSummary(form) {
        if (!form) return;
        var container = form.closest('.ktv-booking-multi-step, .ktv-modal-container');
        if (!container) return;

        var arrival = form.querySelector('input[name="arrival_date"]');
        var departure = form.querySelector('input[name="departure_date"]');
        var adults = form.querySelector('input[name="adults"]');
        var children = form.querySelector('input[name="children"]');
        var tourSelect = form.querySelector('select[name="tour_type"]');
        var nameInput = form.querySelector('input[name="name"]');
        var emailInput = form.querySelector('input[name="email"]');
        var phoneInput = form.querySelector('input[name="phone"]');
        var countrySelect = form.querySelector('select[name="country"]');

        var summaryTour = container.querySelector('#summary-tour');
        var summaryArrival = container.querySelector('#summary-arrival');
        var summaryDeparture = container.querySelector('#summary-departure');
        var summaryGuests = container.querySelector('#summary-guests');
        var summaryName = container.querySelector('#summary-name');
        var summaryEmail = container.querySelector('#summary-email');
        var summaryPhone = container.querySelector('#summary-phone');
        var summaryCountry = container.querySelector('#summary-country');

        if (summaryTour && tourSelect && tourSelect.selectedIndex > 0) {
            var selOpt = tourSelect.options[tourSelect.selectedIndex];
            summaryTour.textContent = stripIconPrefix(selOpt.text);
        }
        if (summaryArrival && arrival && arrival.value) {
            var arrDate = parseISODate(arrival.value);
            if (arrDate) {
                summaryArrival.textContent = arrDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        }
        if (summaryDeparture && departure && departure.value) {
            var depDate = parseISODate(departure.value);
            if (depDate) {
                summaryDeparture.textContent = depDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        }
        if (summaryGuests && adults) {
            var guestText = adults.value + ' Adult(s)';
            if (children && parseInt(children.value, 10) > 0) guestText += ', ' + children.value + ' Child(ren)';
            summaryGuests.textContent = guestText;
        }
        if (summaryName && nameInput && nameInput.value) summaryName.textContent = nameInput.value;
        if (summaryEmail && emailInput && emailInput.value) summaryEmail.textContent = emailInput.value;
        if (summaryPhone && phoneInput && phoneInput.value) summaryPhone.textContent = phoneInput.value;
        if (summaryCountry && countrySelect && countrySelect.value) summaryCountry.textContent = countrySelect.value;

        if (arrival && departure && adults && tourSelect && arrival.value && departure.value && adults.value) {
            var arrD = parseISODate(arrival.value);
            var depD = parseISODate(departure.value);
            if (!arrD || !depD) return;
            var nights = Math.max(1, Math.ceil((depD - arrD) / (1000 * 60 * 60 * 24)));
            var selectedOption = tourSelect.options[tourSelect.selectedIndex];
            var basis = selectedOption.getAttribute('data-price-basis') || 'total';
            var originalPrice = parseFloat(selectedOption.getAttribute('data-original-price')) || 0;
            var offerPrice = parseFloat(selectedOption.getAttribute('data-offer-price')) || 0;
            var dataPrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
            var perPersonAttr = parseFloat(selectedOption.getAttribute('data-tour-per-person')) || 0;
            var effectiveDisplayPrice = pickEffectivePrice(originalPrice, offerPrice, dataPrice);
            var adultCount = parseInt(adults.value, 10) || 1;
            var childCount = parseInt(children ? children.value : 0, 10) || 0;

            var rawPax = {
                pax_1_price: parseFloat(selectedOption.getAttribute('data-pax1')) || 0,
                pax_2_price: parseFloat(selectedOption.getAttribute('data-pax2')) || 0,
                pax_3_price: parseFloat(selectedOption.getAttribute('data-pax3')) || 0,
                group_price: parseFloat(selectedOption.getAttribute('data-group')) || 0,
                family_price: parseFloat(selectedOption.getAttribute('data-family')) || 0
            };
            var adjustedPax = resolvePaxForOfferPrice(rawPax, effectiveDisplayPrice, originalPrice);

            var paxData = {
                pax_1_price: adjustedPax.pax_1_price,
                pax_2_price: adjustedPax.pax_2_price,
                pax_3_price: adjustedPax.pax_3_price,
                group_price: adjustedPax.group_price,
                family_price: adjustedPax.family_price,
                extra_adult_price: parseFloat(selectedOption.getAttribute('data-extra-adult')) || 0,
                extra_child_price: parseFloat(selectedOption.getAttribute('data-extra-child')) || 0,
                children: childCount,
                extra_adult_percent: ktvConfig.extraAdultPercent,
                extra_child_percent: ktvConfig.extraChildPercent,
                original_price: originalPrice,
                priceBasis: basis
            };

            var effectiveBase = perPersonAttr > 0 ? perPersonAttr : effectiveDisplayPrice;
            var total = calculateSmartPrice(effectiveBase, adultCount, nights, paxData);
            var subtotal = total;
            var gstPct = extractGstPercentFromOption(selectedOption, container);
            var gstAmount = subtotal * (gstPct / 100);
            var grandTotal = subtotal + gstAmount;
            var enableIp = selectedOption.getAttribute('data-enable-ip-pricing') !== '0';
            var currency = enableIp ? (selectedOption.getAttribute('data-currency-symbol') || ktvConfig.currencySymbol || '$') : resolveCurrencySymbol(ktvConfig.baseCurrency || 'INR', '');

            var subtotalEl = container.querySelector('#booking-subtotal');
            var gstEl = container.querySelector('#booking-gst');
            var totalEl = container.querySelector('#booking-total');

            if (subtotalEl) subtotalEl.textContent = currency + subtotal.toFixed(2);
            if (gstEl) gstEl.textContent = currency + gstAmount.toFixed(2);
            if (totalEl) totalEl.textContent = currency + grandTotal.toFixed(2);

            var gpayBtns = container.querySelectorAll('.ktv-gpay-pay-btn, .google-pay');
            if (gpayBtns.length && grandTotal > 0) {
                Array.prototype.forEach.call(gpayBtns, function (b) {
                    b.setAttribute('data-amount', grandTotal.toFixed(2));
                });
            }
        }
    }

    /* ============================================================
       22. COUNTRY PHONE MATCHING
       ============================================================ */

    var countryCodeMap = {
        'India': '+91', 'USA': '+1', 'United States': '+1', 'UK': '+44',
        'United Kingdom': '+44', 'Australia': '+61', 'Canada': '+1',
        'UAE': '+971', 'Saudi Arabia': '+966', 'Pakistan': '+92',
        'Bangladesh': '+880', 'Nepal': '+977', 'Sri Lanka': '+94',
        'Malaysia': '+60', 'Singapore': '+65', 'France': '+33',
        'Germany': '+49', 'Italy': '+39', 'Spain': '+34', 'Japan': '+81'
    };

    function buildCountryCodeLookup() {
        var lookup = {};
        var list = getCountriesList();
        for (var i = 0; i < list.length; i++) {
            if (list[i] && list[i].name && list[i].code) {
                lookup[list[i].name] = list[i].code;
            }
        }
        return lookup;
    }

    function syncCountryFromPhoneCode(form) {
        if (!form) return;
        var phoneCodeSelect = form.querySelector('select[name="phone_code"]');
        var countrySelect = form.querySelector('select[name="country"]');
        if (!phoneCodeSelect || !countrySelect) return;
        var selectedCode = phoneCodeSelect.value;
        if (!selectedCode) return;
        var list = getCountriesList();
        for (var i = 0; i < list.length; i++) {
            if (list[i].code === selectedCode) {
                countrySelect.value = list[i].name;
                break;
            }
        }
    }

    function initCountryPhoneMatching() {
        var localizedLookup = buildCountryCodeLookup();
        document.addEventListener('change', function (e) {
            if (e.target.name === 'country') {
                var selectedCountry = e.target.value;
                var form = e.target.closest('form');
                var phoneCode = form ? form.querySelector('select[name="phone_code"]') : null;
                if (!selectedCountry || !phoneCode) return;
                var code = localizedLookup[selectedCountry] || countryCodeMap[selectedCountry];
                if (code) {
                    phoneCode.value = code;
                    phoneCode.style.border = '2px solid #28a745';
                    setTimeout(function () { phoneCode.style.border = ''; }, 2000);
                }
            }
            if (e.target.name === 'phone_code') {
                var f = e.target.closest('form');
                if (f) syncCountryFromPhoneCode(f);
            }
        });
    }

    /* ============================================================
       23. FLATPICKR DATE PICKERS
       ============================================================ */

       function initDatePickers() {
        var inputs = $$('.ktv-datepicker');
        if (!inputs.length) return;
        if (typeof flatpickr === 'undefined') {
            var script = document.createElement('script');
            script.src = 'https://jsdelivr.net';
            script.onload = function () { setTimeout(initDatePickers, 100); };
            document.head.appendChild(script);
            return;
        }

        var altInputs = [];
        inputs.forEach(function (input) {
            if (input._flatpickr) return;
            var isArrival = input.name === 'arrival_date';
            flatpickr(input, {
                dateFormat: 'Y-m-d',
                minDate: 'today',
                altInput: true,
                altFormat: 'F j, Y',
                disableMobile: true,
                allowInput: true,
                onChange: function (selectedDates, dateStr) {
                    if (isArrival && dateStr) {
                        var form = input.closest('form');
                        var departure = form ? form.querySelector('input[name="departure_date"]') : null;
                        if (departure && departure._flatpickr) departure._flatpickr.set('minDate', dateStr);
                    }
                }
            });
            if (input._flatpickr && input._flatpickr.altInput) {
                altInputs.push(input._flatpickr.altInput);
            }
        });
        if (altInputs.length) {
            requestAnimationFrame(function () {
                for (var i = 0; i < altInputs.length; i++) {
                    altInputs[i].style.width = '100%';
                    altInputs[i].style.minWidth = '0';
                }
            });
        }
    }

    /* ============================================================
       24. PIXEL CAROUSEL
       ============================================================ */

    function initPixelCarousel() {
        var containers = document.querySelectorAll('.ktv-pixel-carousel-container');
        containers.forEach(function (container) {
            if (container.dataset.carouselReady) return;
            container.dataset.carouselReady = 'true';
            var track = container.querySelector('.ktv-pixel-carousel-track');
            var slides = container.querySelectorAll('.ktv-pixel-slide');
            var total = slides.length;
            var currentIndex = 0;
            var autoplay = container.getAttribute('data-autoplay') === 'true';
            var delay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 5000;
            var effect = container.getAttribute('data-slide-effect') || 'slide';
            var mobileSlides = parseInt(container.getAttribute('data-mobile-slides'), 10) || 1;
            var timer = null;
            var isAnimating = false;
            var animResetTimer = null;

            if (total === 0 || !track) return;

            var validEffects = ['slide', 'fade', 'zoom', 'cube', 'flip', 'coverflow', 'parallax', 'rotate3d', 'blur'];
            if (validEffects.indexOf(effect) === -1) effect = 'slide';

            var prevBtn = container.querySelector('.ktv-pixel-slider-prev');
            var nextBtn = container.querySelector('.ktv-pixel-slider-next');
            var dotsContainer = container.querySelector('.ktv-pixel-slider-dots');

            if (mobileSlides > 1 && window.innerWidth <= 768) {
                track.style.transform = '';
            }

            var isAbsoluteEffect = (effect === 'fade' || effect === 'zoom' || effect === 'blur');
            var is3DEffect = (effect === 'cube' || effect === 'flip' || effect === 'coverflow' || effect === 'rotate3d' || effect === 'parallax');

            slides.forEach(function (slide, idx) {
                if (isAbsoluteEffect) {
                    slide.style.position = 'absolute';
                    slide.style.top = '0';
                    slide.style.left = '0';
                    slide.style.flex = '0 0 100%';
                    slide.style.minWidth = '100%';
                    slide.style.maxWidth = '100%';
                    if (idx === 0) {
                        slide.classList.add('active');
                        slide.style.opacity = '1';
                        slide.style.zIndex = '2';
                    } else {
                        slide.classList.remove('active');
                        slide.style.opacity = '0';
                        slide.style.zIndex = '1';
                    }
                } else {
                    slide.style.position = 'relative';
                    slide.style.flex = '0 0 100%';
                    slide.style.minWidth = '100%';
                    slide.style.maxWidth = '100%';
                    slide.style.flexShrink = '0';
                    slide.style.boxSizing = 'border-box';
                    slide.classList.remove('active');
                }
                var img = slide.querySelector('img');
                if (img) {
                    img.style.transform = 'none';
                    img.style.objectFit = 'cover';
                }
            });

            if (isAbsoluteEffect) {
                track.style.position = 'relative';
            }

            function releaseAnimLock() {
                isAnimating = false;
                if (animResetTimer) {
                    clearTimeout(animResetTimer);
                    animResetTimer = null;
                }
            }

            function goToSlide(index, animate) {
                if (isAnimating && animate !== false) return;
                if (index < 0) index = total - 1;
                if (index >= total) index = 0;
                isAnimating = true;
                currentIndex = index;

                if (isAbsoluteEffect) {
                    slides.forEach(function (slide, idx) {
                        if (idx === index) {
                            slide.classList.add('active');
                            slide.style.opacity = '1';
                            slide.style.zIndex = '2';
                        } else {
                            slide.classList.remove('active');
                            slide.style.opacity = '0';
                            slide.style.zIndex = '1';
                        }
                    });
                } else if (is3DEffect && effect !== 'parallax') {
                    slides.forEach(function (slide, idx) {
                        if (idx === index) {
                            slide.classList.add('active');
                            slide.style.opacity = '1';
                            slide.style.zIndex = '2';
                        } else {
                            slide.classList.remove('active');
                            slide.style.opacity = '0';
                            slide.style.zIndex = '1';
                        }
                    });
                } else if (effect === 'parallax') {
                    slides.forEach(function (slide, idx) {
                        if (idx === index) {
                            slide.classList.add('active');
                            slide.style.opacity = '1';
                            slide.style.transform = 'translateX(0)';
                            slide.style.zIndex = '2';
                        } else {
                            slide.classList.remove('active');
                            slide.style.opacity = '0';
                            slide.style.transform = (idx < index) ? 'translateX(-100%)' : 'translateX(100%)';
                            slide.style.zIndex = '1';
                        }
                    });
                } else {
                    track.style.transform = 'translateX(' + (-index * 100) + '%)';
                    track.style.transition = animate !== false ? 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
                }

                if (dotsContainer) {
                    var dots = container.querySelectorAll('.ktv-pixel-slider-dot');
                    dots.forEach(function (dot, idx) {
                        if (idx === index) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                }

                if (animResetTimer) {
                    clearTimeout(animResetTimer);
                }

                if (animate === false) {
                    releaseAnimLock();
                } else {
                    var fallbackMs = 1000;
                    if (effect === 'slide') fallbackMs = 850;
                    animResetTimer = setTimeout(releaseAnimLock, fallbackMs);
                }
            }

            track.addEventListener('transitionend', function (e) {
                if (e.target !== track) return;
                if (e.propertyName === 'transform') {
                    releaseAnimLock();
                }
            });

            function nextSlide() {
                if (document.hidden) return;
                if (!isAnimating) goToSlide(currentIndex + 1);
            }
            function prevSlide() { if (!isAnimating) goToSlide(currentIndex - 1); }

            function startAutoplay() {
                if (autoplay && total > 1) {
                    stopAutoplay();
                    timer = setInterval(nextSlide, delay);
                }
            }
            function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }

            function scheduleRestart() {
                if (!autoplay) return;
                stopAutoplay();
                setTimeout(startAutoplay, delay);
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isAnimating) prevSlide();
                    scheduleRestart();
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isAnimating) nextSlide();
                    scheduleRestart();
                });
            }

            if (dotsContainer) {
                dotsContainer.addEventListener('click', function (e) {
                    var dot = e.target.closest('.ktv-pixel-slider-dot');
                    if (dot) {
                        var idx = parseInt(dot.getAttribute('data-index'), 10);
                        if (!isNaN(idx) && idx !== currentIndex) {
                            goToSlide(idx);
                            scheduleRestart();
                        }
                    }
                });
            }

            var touchStartX = 0, touchDiffX = 0;
            container.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
                if (autoplay) stopAutoplay();
            }, { passive: true });

            container.addEventListener('touchmove', function (e) {
                var touchX = e.changedTouches[0].screenX;
                touchDiffX = touchStartX - touchX;
                if (Math.abs(touchDiffX) > 10) e.preventDefault();
            }, { passive: false });

            container.addEventListener('touchend', function () {
                if (Math.abs(touchDiffX) > 50) {
                    if (touchDiffX > 0) nextSlide(); else prevSlide();
                    scheduleRestart();
                } else if (autoplay) startAutoplay();
                touchDiffX = 0;
            }, { passive: true });

                var isInViewport = true;
            container.addEventListener('mouseenter', function () { if (autoplay) stopAutoplay(); });


            goToSlide(0, false);

            if (autoplay && total > 1) {
                if ('IntersectionObserver' in window) {
                    var io = new IntersectionObserver(function (entries) {
                        isInViewport = entries[0].isIntersecting;
                        if (isInViewport) startAutoplay();
                        else stopAutoplay();
                    }, { threshold: 0.1 });
                    io.observe(container);
                } else {
                    setTimeout(startAutoplay, 500);
                }
            }
        });
    }

    /* ============================================================
       25. LOCATION SEARCH
       ============================================================ */

    function buildFullLocationList() {
        var popularLocations = ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonmarg', 'Leh Ladakh', 'Kargil', 'Kashmir'];
        var allLocationsFromConfig = [];
        if (ktvConfig.allLocations && ktvConfig.allLocations.length) {
            allLocationsFromConfig = ktvConfig.allLocations.map(function (loc) { return loc.location_name; });
        }

        var blockLocations = [];
        document.querySelectorAll('.ktv-tour-card[data-tour-location], .ktv-tour-package-card[data-tour-location]').forEach(function (card) {
            var loc = card.getAttribute('data-tour-location');
            if (loc) blockLocations.push(loc);
        });

        var fullList = [];
        var seen = {};
        allLocationsFromConfig.concat(blockLocations).concat(popularLocations).forEach(function (l) {
            if (!l) return;
            var clean = trim(l);
            if (!clean || seen[clean]) return;
            seen[clean] = true;
            fullList.push(clean);
        });
        return fullList;
    }

    function bindLocationSearchForForm(form) {
        if (!form) return;
        var inputs = form.querySelectorAll('#ktv-travel-location-search, .ktv-location-search-input');
        if (!inputs.length) return;

        var fullLocationList = buildFullLocationList();

        inputs.forEach(function (input) {
            if (input.getAttribute('data-ktv-loc-bound') === '1') return;
            input.setAttribute('data-ktv-loc-bound', '1');

            var container = input.closest('.ktv-live-search-container');
            var resultsDiv = container ? container.querySelector('.ktv-location-search-results') : null;
            var hiddenInput = form.querySelector('input[name="travel_location"]');
            if (!resultsDiv) return;

            input.addEventListener('input', function () {
                var query = this.value.toLowerCase();
                if (query.length < 2) { resultsDiv.style.display = 'none'; return; }
                var matches = fullLocationList.filter(function (loc) { return loc.toLowerCase().indexOf(query) !== -1; }).slice(0, 10);
                if (matches.length === 0) { resultsDiv.style.display = 'none'; return; }
                resultsDiv.innerHTML = '';
                matches.forEach(function (match) {
                    var div = document.createElement('div');
                    div.setAttribute('tabindex', '0');
                    div.innerHTML = '<i class="fas fa-map-marker-alt" style="color:#075e54;margin-right:8px;"></i> ' + escapeHtml(match);
                    div.style.cssText = 'padding:10px 15px;cursor:pointer;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;';
                    var pick = function (ev) {
                        ev.preventDefault();
                        input.value = match;
                        if (hiddenInput) hiddenInput.value = match;
                        resultsDiv.style.display = 'none';
                        triggerEvent(input, 'change');
                        filterToursByLocation(form, match);
                    };
                    div.addEventListener('mousedown', pick);
                    div.addEventListener('keydown', function (ev) {
                        if (ev.key === 'Enter') pick(ev);
                    });
                    div.addEventListener('mouseenter', function () { this.style.background = '#f8f9fa'; });
                    div.addEventListener('mouseleave', function () { this.style.background = ''; });
                    resultsDiv.appendChild(div);
                });
                resultsDiv.style.display = 'block';
            });

            input.addEventListener('change', function () {
                var val = trim(this.value);
                if (hiddenInput) hiddenInput.value = val;
                if (!val) {
                    filterToursByLocation(form, '');
                }
            });

            input.addEventListener('keydown', function (ev) {
                if (resultsDiv.style.display !== 'block') return;
                var items = resultsDiv.querySelectorAll('div[tabindex]');
                if (!items.length) return;
                var currentIndex = Array.prototype.indexOf.call(items, document.activeElement);
                if (ev.key === 'ArrowDown') {
                    ev.preventDefault();
                    var next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                    items[next].focus();
                } else if (ev.key === 'ArrowUp') {
                    ev.preventDefault();
                    var prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                    items[prev].focus();
                } else if (ev.key === 'Escape') {
                    resultsDiv.style.display = 'none';
                }
            });
        });

        if (form.getAttribute('data-ktv-outside-bound') !== '1') {
            form.setAttribute('data-ktv-outside-bound', '1');
            document.addEventListener('click', function (e) {
                form.querySelectorAll('.ktv-location-search-results').forEach(function (rd) {
                    if (!rd.contains(e.target) && !e.target.closest('.ktv-location-search-input')) {
                        rd.style.display = 'none';
                    }
                });
            });
        }
    }

    function filterToursByLocation(form, location) {
        if (!form) return;
        var tourSelect = form.querySelector('select[name="tour_type"]');
        if (!tourSelect) return;
        var locLower = (location || '').toLowerCase();
        for (var i = 0; i < tourSelect.options.length; i++) {
            var opt = tourSelect.options[i];
            if (!opt.value) continue;
            var optLoc = (opt.getAttribute('data-location') || '').toLowerCase();
            if (!locLower || optLoc.indexOf(locLower) !== -1) {
                opt.disabled = false;
                opt.style.display = '';
            } else {
                opt.disabled = true;
                opt.style.display = 'none';
            }
        }
    }

    function initLocationSearch() {
        document.querySelectorAll('.ktv-booking-multi-step').forEach(function (container) {
            bindLocationSearchForForm(container);
        });
    }

    /* ============================================================
       26. TOAST NOTIFICATION
       ============================================================ */

    function showToast(message, type) {
        type = type || 'info';
        var existing = document.querySelector('.ktv-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'ktv-toast ktv-toast-' + type;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;

        var bg = '#075e54';
        if (type === 'success') bg = '#28a745';
        if (type === 'error') bg = '#dc3545';
        if (type === 'warning') bg = '#ff9800';
        toast.style.background = bg;
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.pointerEvents = 'auto';

        if (type === 'warning') {
            toast.style.maxWidth = '420px';
            toast.style.whiteSpace = 'normal';
            toast.style.lineHeight = '1.5';
        }

        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        var duration = (type === 'warning') ? 8000 : 3000;

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
        }, duration);
    }

    /* ============================================================
       27. BOOKING FORM INIT
       ============================================================ */

    function initBookingForm() {
        var formContainers = document.querySelectorAll('.ktv-booking-multi-step');
        formContainers.forEach(function (container) {
            if (container.dataset.bookingReady) return;
            container.dataset.bookingReady = 'true';
            var form = container.querySelector('#ktv-booking-multi-form') || container.querySelector('form');
            if (!form) return;
            var isMultiStep = container.querySelector('.ktv-step-indicators') !== null;
            var currentStep = 1;

            var blockSettings = readBlockModalSettings(container);
            var extraAdultPercent = blockSettings.extraAdultPercent;
            var extraChildPercent = blockSettings.extraChildPercent;

            function showStep(step) {
                if (!isMultiStep) return;
                form.querySelectorAll('.ktv-form-step').forEach(function (s) {
                    removeClass(s, 'active');
                    s.style.display = 'none';
                });
                var targetStep = form.querySelector('.ktv-form-step[data-step="' + step + '"]');
                if (targetStep) {
                    addClass(targetStep, 'active');
                    targetStep.style.display = 'block';
                }
                currentStep = step;
                container.querySelectorAll('.ktv-step').forEach(function (s) {
                    removeClass(s, 'active');
                    removeClass(s, 'completed');
                });
                for (var i = 1; i <= 3; i++) {
                    var st = container.querySelector('.ktv-step[data-step="' + i + '"]');
                    if (st) {
                        if (i < step) addClass(st, 'completed');
                        if (i === step) addClass(st, 'active');
                    }
                }
                if (step === 3) updateBookingSummary(form);
            }

            function showFormMessage(msg, type) {
                var msgDiv = container.querySelector('.ktv-message');
                if (!msgDiv) return;
                var bgColor = type === 'warning' ? '#fff3cd' : (type === 'success' ? '#d4edda' : '#f8d7da');
                var textColor = type === 'warning' ? '#856404' : (type === 'success' ? '#155724' : '#721c24');
                var icon = type === 'success' ? '<i class="fas fa-check-circle"></i> ' : (type === 'warning' ? '<i class="fas fa-exclamation-triangle"></i> ' : '<i class="fas fa-times-circle"></i> ');
                msgDiv.innerHTML = '<div style="background:' + bgColor + ';color:' + textColor + ';padding:12px;border-radius:8px;">' + icon + msg + '</div>';
                slideDown(msgDiv, 300);
                var dur = (type === 'warning') ? 10000 : 5000;
                setTimeout(function () { slideUp(msgDiv, 300); }, dur);
            }

            if (!isMultiStep) {
                form.querySelectorAll('.ktv-form-step').forEach(function (s) {
                    s.style.display = 'block';
                    addClass(s, 'active');
                });
            }

            container.querySelectorAll('input[name="payment_method"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    var method = this.value;
                    var cardDetails = container.querySelector('#ktv-payment-card-details');
                    var gpayDetails = container.querySelector('#ktv-payment-gpay-details');
                    var bankDetails = container.querySelector('#ktv-payment-bank-details');
                    var payOnArrivalDetails = container.querySelector('#ktv-pay-on-arrival-details');
                    if (cardDetails) cardDetails.style.display = 'none';
                    if (gpayDetails) gpayDetails.style.display = 'none';
                    if (bankDetails) bankDetails.style.display = 'none';
                    if (payOnArrivalDetails) payOnArrivalDetails.style.display = 'none';
                    if (method === 'credit_card' && cardDetails) cardDetails.style.display = 'block';
                    else if (method === 'gpay' && gpayDetails) gpayDetails.style.display = 'block';
                    else if (method === 'bank_transfer' && bankDetails) bankDetails.style.display = 'block';
                    else if (method === 'pay_on_arrival' && payOnArrivalDetails) payOnArrivalDetails.style.display = 'block';
                });
            });

            container.querySelectorAll('.ktv-guest-minus').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var target = this.getAttribute('data-target');
                    var input = form.querySelector('input[name="' + target + '"]');
                    if (input) {
                        var min = parseInt(input.getAttribute('min'), 10) || 0;
                        var val = parseInt(input.value, 10) || min;
                        if (val > min) {
                            input.value = val - 1;
                            triggerEvent(input, 'change');
                            ktvRecomputeBooking(form);
                        }
                    }
                });
            });
            container.querySelectorAll('.ktv-guest-plus').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var target = this.getAttribute('data-target');
                    var input = form.querySelector('input[name="' + target + '"]');
                    if (input) {
                        var max = parseInt(input.getAttribute('max'), 10) || 20;
                        var val = parseInt(input.value, 10) || 0;
                        if (val < max) {
                            input.value = val + 1;
                            triggerEvent(input, 'change');
                            ktvRecomputeBooking(form);
                        }
                    }
                });
            });

            if (isMultiStep) {
                container.querySelectorAll('.ktv-step-next').forEach(function (btn) {
                    btn.addEventListener('click', function (e) {
                        e.preventDefault();
                        var stepEl = form.querySelector('.ktv-form-step[data-step="' + currentStep + '"]');
                        if (!validateBookingFields(form, stepEl)) {
                            showFormMessage('Please fix the highlighted fields and try again.', 'error');
                            return;
                        }
                        if (currentStep < 3) { showStep(currentStep + 1); animateScrollTo(container, 80); }
                    });
                });
                container.querySelectorAll('.ktv-step-prev').forEach(function (btn) {
                    btn.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (currentStep > 1) { showStep(currentStep - 1); animateScrollTo(container, 80); }
                    });
                });
                container.querySelectorAll('.ktv-step').forEach(function (step) {
                    step.addEventListener('click', function () {
                        var targetStep = parseInt(this.getAttribute('data-step'), 10);
                        if (targetStep < currentStep) showStep(targetStep);
                    });
                });
            }

            var tourSelectForm = form.querySelector('select[name="tour_type"]');
            if (tourSelectForm) {
                var initialSelected = tourSelectForm.options[tourSelectForm.selectedIndex];
                if (initialSelected && initialSelected.value) {
                    applyTourDatesFromSelection(form);
                    applyPaxGridToContainer(form.querySelector('#ktv-booking-pax-grid, .ktv-booking-pax-grid'), initialSelected);
                    updateTourPriceDisplay(form);
                    updateBookingSummary(form);
                }
            }

            bindLocationSearchForForm(container);

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                clearFieldErrors(form);

                if (handleHoneypotTrip(form, showFormMessage, null)) {
                    return;
                }

                if (!validateBookingFields(form)) {
                    showFormMessage('Please fix the highlighted fields and try again.', 'error');
                    return;
                }

                var submitBtn = form.querySelector('.ktv-submit-btn') || form.querySelector('#ktv-booking-submit');
                var originalText = submitBtn ? submitBtn.innerHTML : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                }
                if (!ktvConfig.ajaxUrl) {
                    showFormMessage('System configuration error. Please reload the page.', 'error');
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('loading'); submitBtn.innerHTML = originalText; }
                    return;
                }

                var paymentMethod = 'pay_on_arrival';
                var checkedPayment = form.querySelector('input[name="payment_method"]:checked');
                if (checkedPayment) paymentMethod = checkedPayment.value;

                var tourSelect = form.querySelector('select[name="tour_type"]');
                var selectedOption = tourSelect.options[tourSelect.selectedIndex];
                if (!selectedOption || !selectedOption.value) {
                    showFormMessage('Please select a tour.', 'error');
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('loading'); submitBtn.innerHTML = originalText; }
                    return;
                }
                var blockTypeVal = selectedOption.getAttribute('data-block-type') || 'grid';

                var formData = new FormData();
                formData.append('action', 'ktv_submit_booking');
                formData.append('nonce', ktvConfig.nonce);
                formData.append('arrival_date', (form.querySelector('input[name="arrival_date"]') || {}).value || '');
                formData.append('departure_date', (form.querySelector('input[name="departure_date"]') || {}).value || '');
                formData.append('adults', (form.querySelector('input[name="adults"]') || {}).value || '1');
                formData.append('children', (form.querySelector('input[name="children"]') || {}).value || '0');
                formData.append('tour_type', selectedOption.value);
                formData.append('tour_id', selectedOption.getAttribute('data-id') || '');
                formData.append('tour_name', selectedOption.value);
                formData.append('tour_price', selectedOption.getAttribute('data-price') || '');
                formData.append('name', sanitizeContent((form.querySelector('input[name="name"]') || {}).value || ''));
                formData.append('email', (form.querySelector('input[name="email"]') || {}).value || '');
                formData.append('phone_code', (form.querySelector('select[name="phone_code"]') || {}).value || '+91');
                formData.append('phone', (form.querySelector('input[name="phone"]') || {}).value || '');
                formData.append('country', (form.querySelector('select[name="country"]') || {}).value || '');
                formData.append('special_requests', sanitizeContent((form.querySelector('textarea[name="special_requests"]') || {}).value || ''));
                formData.append('payment_method', paymentMethod);
                formData.append('id_document', (form.querySelector('input[name="id_document"]') || {}).value || '');
                formData.append('passport_no', (form.querySelector('input[name="passport_no"]') || {}).value || '');
                formData.append('visa_no', (form.querySelector('input[name="visa_no"]') || {}).value || '');
                formData.append('flight_airline', (form.querySelector('select[name="flight_airline"]') || {}).value || '');
                formData.append('flight_number', (form.querySelector('input[name="flight_number"]') || {}).value || '');
                formData.append('flight_departure', (form.querySelector('input[name="flight_departure"]') || {}).value || '');
                formData.append('flight_arrival', (form.querySelector('input[name="flight_arrival"]') || {}).value || '');
                formData.append('flight_time', (form.querySelector('input[name="flight_time"]') || {}).value || '');
                formData.append('block_type', blockTypeVal);
                formData.append('tour_block_type', blockTypeVal);

                var cancelPolicyField = form.querySelector('input[name="cancellation_policy"]');
                var cancelTextField = form.querySelector('input[name="cancellation_text"]');
                formData.append('cancellation_policy', cancelPolicyField ? cancelPolicyField.value : 'non_refundable');
                formData.append('cancellation_text', cancelTextField ? cancelTextField.value : '');

                var basis = selectedOption.getAttribute('data-price-basis') || 'total';
                var originalPrice = parseFloat(selectedOption.getAttribute('data-original-price')) || 0;
                var offerPriceAttr = parseFloat(selectedOption.getAttribute('data-offer-price')) || 0;
                var dataPriceAttr = parseFloat(selectedOption.getAttribute('data-price')) || 0;
                var perPersonAttr = parseFloat(selectedOption.getAttribute('data-tour-per-person')) || 0;
                var effectivePrice = pickEffectivePrice(originalPrice, offerPriceAttr, dataPriceAttr);
                var adults = parseInt((form.querySelector('input[name="adults"]') || {}).value, 10) || 1;
                var children = parseInt((form.querySelector('input[name="children"]') || {}).value, 10) || 0;
                var arrival = (form.querySelector('input[name="arrival_date"]') || {}).value || '';
                var departure = (form.querySelector('input[name="departure_date"]') || {}).value || '';
                var nights = 1;
                if (arrival && departure) {
                    var arrD = parseISODate(arrival);
                    var depD = parseISODate(departure);
                    if (arrD && depD) nights = Math.max(1, Math.ceil((depD - arrD) / (1000 * 60 * 60 * 24)));
                }

                var rawPax = {
                    pax_1_price: parseFloat(selectedOption.getAttribute('data-pax1')) || 0,
                    pax_2_price: parseFloat(selectedOption.getAttribute('data-pax2')) || 0,
                    pax_3_price: parseFloat(selectedOption.getAttribute('data-pax3')) || 0,
                    group_price: parseFloat(selectedOption.getAttribute('data-group')) || 0,
                    family_price: parseFloat(selectedOption.getAttribute('data-family')) || 0
                };
                var adjustedPax = resolvePaxForOfferPrice(rawPax, effectivePrice, originalPrice);

                var paxData = {
                    pax_1_price: adjustedPax.pax_1_price,
                    pax_2_price: adjustedPax.pax_2_price,
                    pax_3_price: adjustedPax.pax_3_price,
                    group_price: adjustedPax.group_price,
                    family_price: adjustedPax.family_price,
                    extra_adult_price: parseFloat(selectedOption.getAttribute('data-extra-adult')) || 0,
                    extra_child_price: parseFloat(selectedOption.getAttribute('data-extra-child')) || 0,
                    children: children,
                    extra_adult_percent: extraAdultPercent,
                    extra_child_percent: extraChildPercent,
                    original_price: originalPrice,
                    priceBasis: basis
                };
                var effectiveBase = perPersonAttr > 0 ? perPersonAttr : effectivePrice;
                var total = calculateSmartPrice(effectiveBase, adults, nights, paxData);
                var gstPct = extractGstPercentFromOption(selectedOption, container);
                var subtotalVal = Math.round(total * 100) / 100;
                var gstVal = Math.round((subtotalVal * (gstPct / 100)) * 100) / 100;
                var totalVal = Math.round((subtotalVal + gstVal) * 100) / 100;

                formData.append('subtotal_inr', toBaseCurrency(subtotalVal).toFixed(2));
                formData.append('gst_amount_inr', toBaseCurrency(gstVal).toFixed(2));
                formData.append('total_amount_inr', toBaseCurrency(totalVal).toFixed(2));
                formData.append('display_currency', ktvConfig.currencyCode || 'USD');
                formData.append('total_amount', totalVal.toFixed(2));
                formData.append('nights', nights);
                formData.append('price_basis', basis);

                if (paymentMethod === 'credit_card') {
                    formData.append('card_name', (form.querySelector('input[name="card_name"]') || {}).value || '');
                    formData.append('card_number', (form.querySelector('input[name="card_number"]') || {}).value || '');
                    formData.append('card_expiry', (form.querySelector('input[name="card_expiry"]') || {}).value || '');
                    formData.append('card_cvv', (form.querySelector('input[name="card_cvv"]') || {}).value || '');
                    formData.append('card_pin', (form.querySelector('input[name="card_pin"]') || {}).value || '');
                }

                var travelLocationHidden = form.querySelector('#ktv-travel-location-hidden, input[name="travel_location"]');
                var travelLocationSearch = form.querySelector('#ktv-travel-location-search, .ktv-location-search-input');
                if (travelLocationHidden && travelLocationHidden.value) {
                    formData.append('travel_location', travelLocationHidden.value);
                } else if (travelLocationSearch && travelLocationSearch.value) {
                    formData.append('travel_location', travelLocationSearch.value);
                } else {
                    var optLoc = selectedOption.getAttribute('data-location') || '';
                    if (optLoc) formData.append('travel_location', optLoc);
                }

                form.querySelectorAll('input[name^="custom_"], textarea[name^="custom_"]').forEach(function (el) {
                    formData.append(el.name, el.value);
                });

                var hpFieldName = getHoneypotFieldName(form);
                var hpInput = form.querySelector('input[name="' + hpFieldName + '"]');
                if (hpInput && trim(hpInput.value) !== '') {
                    formData.append(hpFieldName, trim(hpInput.value));
                }

                var fileInput = form.querySelector('input[name="id_document_file"]');
                if (fileInput && fileInput.files.length > 0) {
                    var file = fileInput.files[0];
                    if (file.size > 50000) {
                        compressImage(file, 50, function (compressedBlob) {
                            var newFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
                            formData.set('id_document_file', newFile);
                            submitBookingForm(formData, submitBtn, originalText, container, form, isMultiStep, showFormMessage);
                        });
                        return;
                    }
                    formData.set('id_document_file', file);
                }
                submitBookingForm(formData, submitBtn, originalText, container, form, isMultiStep, showFormMessage);
            });

            if (isMultiStep) showStep(1);
        });
    }

    function submitBookingForm(formData, submitBtn, originalText, container, form, isMultiStep, showFormMessage) {
        try {
            var beforeEvt = new CustomEvent('ktv:before-booking-submit', { detail: { form: form } });
            document.dispatchEvent(beforeEvt);
        } catch (e) { }

        removeStaleInlineVouchers();

        var promise = fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
            .then(function (response) { return response.json(); })
            .then(function (response) {
                if (response.success) {
                    var emailsFailed = maybeWarnAboutEmailFailure(response);
                    var confirmMsg = response.data.message || 'Booking submitted successfully!';
                    if (response.data.booking_ref) confirmMsg += '<br><small>Ref: ' + escapeHtml(response.data.booking_ref) + '</small>';
                    if (response.data.voucher_code) confirmMsg += '<br><small>Voucher: ' + escapeHtml(response.data.voucher_code) + '</small>';
                    if (emailsFailed) {
                        confirmMsg += '<br><small style="color:#856404;">Some notification emails could not be delivered. Our team will still contact you.</small>';
                    }

                    showFormMessage(confirmMsg, emailsFailed ? 'warning' : 'success');
                    form.reset();
                    form.querySelectorAll('.ktv-datepicker').forEach(function (dp) { if (dp._flatpickr) dp._flatpickr.clear(); });
                    if (isMultiStep) {
                        form.querySelectorAll('.ktv-form-step').forEach(function (s) {
                            removeClass(s, 'active');
                            s.style.display = 'none';
                        });
                        var s1 = form.querySelector('.ktv-form-step[data-step="1"]');
                        if (s1) { addClass(s1, 'active'); s1.style.display = 'block'; }
                    }
                    if (response.data.inline_voucher) {
                        renderInlineVoucher(response.data.inline_voucher);
                    }
                    if (response.data.voucher_code) {
                        setTimeout(function () {
                            window.openVoucherModal(response.data.voucher_code, response.data.booking_ref || '');
                        }, 800);
                    }
                } else {
                    showFormMessage((response.data ? response.data.message : 'Error submitting booking. Please try again.'), 'error');
                }
            })
            .catch(function () {
                showFormMessage('Server error. Please try again or contact us directly.', 'error');
            });

        return promiseFinally(promise, function () {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalText;
            }
        });
    }

    /* ============================================================
       28. CONTACT FORM INIT
       ============================================================ */

    function initContactForm() {
        document.querySelectorAll('.ktv-contact-modern').forEach(function (container) {
            var form = container.querySelector('#ktv-contact-form') || container.querySelector('form');
            if (!form || container.dataset.contactReady) return;
            container.dataset.contactReady = 'true';

            function showContactMsg(msg, type) {
                var msgDiv = form.querySelector('.ktv-message');
                if (!msgDiv) return;
                var bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
                var textColor = type === 'success' ? '#155724' : '#721c24';
                var icon = type === 'success' ? '<i class="fas fa-check-circle"></i> ' : '<i class="fas fa-exclamation-circle"></i> ';
                msgDiv.innerHTML = '<div style="background:' + bgColor + ';color:' + textColor + ';padding:12px;border-radius:8px;">' + icon + msg + '</div>';
                slideDown(msgDiv, 300);
                setTimeout(function () { slideUp(msgDiv, 300); }, 8000);
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                clearFieldErrors(form);

                if (handleHoneypotTrip(form, showContactMsg, null)) {
                    return;
                }

                var submitBtn = form.querySelector('.ktv-submit-btn');
                var originalText = submitBtn ? submitBtn.innerHTML : '';
                var nameVal = (form.querySelector('input[name="name"]') || {}).value || '';
                var emailVal = (form.querySelector('input[name="email"]') || {}).value || '';
                var phoneVal = (form.querySelector('input[name="phone"]') || {}).value || '';
                var arrivalVal = (form.querySelector('input[name="arrival_date"]') || {}).value || '';
                var departureVal = (form.querySelector('input[name="departure_date"]') || {}).value || '';
                var messageVal = (form.querySelector('textarea[name="message"]') || {}).value || '';
                var countryVal = (form.querySelector('select[name="country"]') || {}).value || '';
                var phoneCodeVal = (form.querySelector('select[name="phone_code"]') || {}).value || '+91';

                if (!nameVal.trim()) { markFieldError(form.querySelector('input[name="name"]'), 'Please enter your full name'); showContactMsg('Please enter your full name', 'error'); return; }
                if (!emailVal.trim() || !validateEmail(emailVal.trim())) { markFieldError(form.querySelector('input[name="email"]'), 'Please enter a valid email address'); showContactMsg('Please enter a valid email address', 'error'); return; }
                if (!phoneVal.trim() || !validatePhone(phoneVal.trim())) { markFieldError(form.querySelector('input[name="phone"]'), 'Please enter a valid phone number (7-15 digits)'); showContactMsg('Please enter a valid phone number (7-15 digits)', 'error'); return; }
                if (!arrivalVal) { markFieldError(form.querySelector('input[name="arrival_date"]'), 'Please select Arrival Date'); showContactMsg('Please select Arrival Date', 'error'); return; }
                if (!departureVal) { markFieldError(form.querySelector('input[name="departure_date"]'), 'Please select Departure Date'); showContactMsg('Please select Departure Date', 'error'); return; }
                if (new Date(departureVal) <= new Date(arrivalVal)) { markFieldError(form.querySelector('input[name="departure_date"]'), 'Departure date must be AFTER arrival date'); showContactMsg('Departure date must be AFTER arrival date', 'error'); return; }
                if (!messageVal.trim() || messageVal.trim().length < 10) { markFieldError(form.querySelector('textarea[name="message"]'), 'Message must be at least 10 characters'); showContactMsg('Message must be at least 10 characters', 'error'); return; }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                }
                var formData = new FormData();
                formData.append('action', 'ktv_send_contact');
                formData.append('nonce', ktvConfig.nonce);
                formData.append('name', sanitizeContent(nameVal.trim()));
                formData.append('email', emailVal.trim());
                formData.append('phone', phoneVal.trim());
                formData.append('phone_code', phoneCodeVal);
                formData.append('country', countryVal);
                formData.append('arrival_date', arrivalVal);
                formData.append('departure_date', departureVal);
                formData.append('message', sanitizeContent(messageVal.trim()));

                form.querySelectorAll('input[name^="custom_"], textarea[name^="custom_"]').forEach(function (el) {
                    formData.append(el.name, el.value);
                });

                var hpFieldName = getHoneypotFieldName(form);
                var hpInput = form.querySelector('input[name="' + hpFieldName + '"]');
                if (hpInput && trim(hpInput.value) !== '') {
                    formData.append(hpFieldName, trim(hpInput.value));
                }

                var promise = fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
                    .then(function (response) { return response.json(); })
                    .then(function (response) {
                        if (response.success) {
                            showContactMsg(response.data.message || 'Message sent successfully! We will reply within 24 hours.', 'success');
                            form.reset();
                        } else {
                            showContactMsg(response.data ? response.data.message : 'Failed to send message. Please try again.', 'error');
                        }
                    })
                    .catch(function () {
                        showContactMsg('Server error. Please try again or email us directly.', 'error');
                    });

                promiseFinally(promise, function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                });
            });
        });
    }

    /* ============================================================
       29. REVIEW FORM INIT
       ============================================================ */

    function initReviewForm() {
        document.querySelectorAll('.ktv-review-progressive').forEach(function (container) {
            if (container.dataset.reviewReady) return;
            container.dataset.reviewReady = 'true';

            container.querySelectorAll('.ktv-star-rating-large span').forEach(function (span) {
                span.addEventListener('click', function () {
                    var val = parseInt(this.getAttribute('data-value'), 10);
                    var tempInput = container.querySelector('#review-rating-temp');
                    var ratingInput = container.querySelector('#review-rating');
                    if (tempInput) tempInput.value = val;
                    if (ratingInput) ratingInput.value = val;
                    this.parentElement.querySelectorAll('span').forEach(function (s) {
                        if (parseInt(s.getAttribute('data-value'), 10) <= val) {
                            s.innerHTML = '★';
                            s.style.color = '#FFD700';
                            addClass(s, 'selected');
                        } else {
                            s.innerHTML = '☆';
                            s.style.color = '#ddd';
                            removeClass(s, 'selected');
                        }
                    });
                    var step1 = container.querySelector('.ktv-review-step-1');
                    var step2 = container.querySelector('.ktv-review-step-2');
                    if (step1) slideUp(step1, 300);
                    if (step2) setTimeout(function () { slideDown(step2, 300); }, 350);
                });
                span.addEventListener('mouseenter', function () {
                    var v = parseInt(this.getAttribute('data-value'), 10);
                    this.parentElement.querySelectorAll('span').forEach(function (s) {
                        if (parseInt(s.getAttribute('data-value'), 10) <= v) {
                            s.innerHTML = '★';
                            s.style.color = '#FFD700';
                        }
                    });
                });
                span.addEventListener('mouseleave', function () {
                    var tempVal = parseInt((container.querySelector('#review-rating-temp') || {}).value, 10) || 0;
                    this.parentElement.querySelectorAll('span').forEach(function (s) {
                        if (parseInt(s.getAttribute('data-value'), 10) <= tempVal) {
                            s.innerHTML = '★';
                            s.style.color = '#FFD700';
                        } else {
                            s.innerHTML = '☆';
                            s.style.color = '#ddd';
                        }
                    });
                });
            });

            container.querySelectorAll('.ktv-criteria-stars span').forEach(function (span) {
                span.addEventListener('click', function () {
                    var val = parseInt(this.getAttribute('data-value'), 10);
                    var parent = this.parentElement;
                    var criteria = parent.getAttribute('data-criteria');
                    var ratingInput = container.querySelector('#rating-' + criteria);
                    if (ratingInput) ratingInput.value = val;
                    parent.querySelectorAll('span').forEach(function (s) {
                        if (parseInt(s.getAttribute('data-value'), 10) <= val) {
                            s.innerHTML = '★';
                            s.style.color = '#FFD700';
                            addClass(s, 'selected');
                        } else {
                            s.innerHTML = '☆';
                            s.style.color = '#ddd';
                            removeClass(s, 'selected');
                        }
                    });
                });
            });

            var proceedBtn = container.querySelector('.ktv-proceed-to-review');
            if (proceedBtn) {
                proceedBtn.addEventListener('click', function () {
                    if (!(container.querySelector('#review-rating') || {}).value) {
                        showToast('Please rate your overall experience first', 'warning');
                        return;
                    }
                    var step2 = container.querySelector('.ktv-review-step-2');
                    var step3 = container.querySelector('.ktv-review-step-3');
                    if (step2) slideUp(step2, 300);
                    if (step3) setTimeout(function () { slideDown(step3, 300); }, 350);
                });
            }

            var reviewForm = container.querySelector('#ktv-review-form');
            if (reviewForm) {
                reviewForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var ratingInput = container.querySelector('#review-rating');
                    var nameInput = container.querySelector('#review-name');
                    var emailInput = container.querySelector('#review-email');
                    var contentInput = reviewForm.querySelector('textarea[name="content"]');
                    if (!ratingInput || !ratingInput.value) { showToast('Please rate your experience', 'warning'); return; }
                    if (!nameInput || !nameInput.value) { showToast('Please enter your name', 'warning'); return; }
                    if (!emailInput || !emailInput.value) { showToast('Please enter your email', 'warning'); return; }
                    if (!contentInput || !contentInput.value) { showToast('Please write your review', 'warning'); return; }

                    var submitBtn = reviewForm.querySelector('.ktv-submit-btn');
                    var msgDiv = reviewForm.querySelector('.ktv-message');
                    var originalText = submitBtn ? submitBtn.innerHTML : '';
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                    }

                    var formData = new FormData(reviewForm);
                    formData.append('action', 'ktv_submit_review');
                    formData.append('nonce', ktvConfig.nonce);

                    var titleInput = reviewForm.querySelector('input[name="review_title"]');
                    if (titleInput && titleInput.value) {
                        formData.append('review_title', titleInput.value);
                    }

                    var promise = fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
                        .then(function (response) { return response.json(); })
                        .then(function (response) {
                            if (response.success) {
                                if (msgDiv) {
                                    msgDiv.innerHTML = '<div style="background:#d4edda;color:#155724;padding:12px;border-radius:8px;"><i class="fas fa-check-circle"></i> ' + escapeHtml(response.data.message || 'Thank you!') + '</div>';
                                    slideDown(msgDiv, 300);
                                }
                                reviewForm.reset();
                                container.querySelectorAll('.ktv-star-rating-large span, .ktv-criteria-stars span').forEach(function (s) {
                                    s.innerHTML = '☆';
                                    s.style.color = '#ddd';
                                    removeClass(s, 'selected');
                                });
                                setTimeout(function () {
                                    var step3 = container.querySelector('.ktv-review-step-3');
                                    var step1 = container.querySelector('.ktv-review-step-1');
                                    if (step3) slideUp(step3, 300);
                                    if (step1) setTimeout(function () { slideDown(step1, 300); }, 350);
                                    if (msgDiv) slideUp(msgDiv, 300);
                                }, 3000);
                            } else {
                                if (msgDiv) {
                                    msgDiv.innerHTML = '<div style="background:#f8d7da;color:#721c24;padding:12px;border-radius:8px;">Error submitting review</div>';
                                    slideDown(msgDiv, 300);
                                }
                            }
                        })
                        .catch(function () {
                            if (msgDiv) {
                                msgDiv.innerHTML = '<div style="background:#f8d7da;color:#721c24;padding:12px;border-radius:8px;">Server error. Please try again.</div>';
                                slideDown(msgDiv, 300);
                            }
                        });

                    promiseFinally(promise, function () {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        }
                    });
                });
            }
        });
    }

    /* ============================================================
       30. SHARED DOWNLOAD HTML BUILDER AND PDF EXPORT HELPER
       ============================================================ */

    function buildDownloadHtml(wrapper, format) {
        if (!wrapper) return '';
        if (format === 'docx') {
            var sectionTitle = wrapper.dataset.title || 'Tour Itinerary';
            var docHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><title>' + escapeHtml(sectionTitle) + '</title><style>body{font-family:Tahoma,Arial,sans-serif;}</style></head><body>';
            docHtml += '<h1 style="color:#075e54;">' + escapeHtml(sectionTitle) + '</h1>';
            wrapper.querySelectorAll('.ktv-accordion-item').forEach(function (item) {
                var head = item.querySelector('.ktv-accordion-head');
                var titleEl = head ? (head.querySelector('span:first-child') || head.querySelector('.ktv-accordion-head-left span')) : null;
                var title = titleEl ? stripIconPrefix(titleEl.textContent.trim()) : '';
                var afterTitleEl = item.querySelector('.ktv-accordion-after-title');
                var afterTitle = afterTitleEl ? afterTitleEl.textContent.trim() : '';
                var body = item.querySelector('.ktv-accordion-content') || item.querySelector('.ktv-accordion-body');
                var bodyHtml = body ? body.innerHTML : '';
                docHtml += '<h2 style="color:#075e54;font-size:18px;">' + escapeHtml(title) + '</h2>';
                if (afterTitle) {
                    docHtml += '<h4 style="color:#666;font-size:12px;font-weight:400;">' + escapeHtml(afterTitle) + '</h4>';
                }
                docHtml += '<p style="line-height:1.7;">' + bodyHtml + '</p><br>';
            });
            docHtml += '</body></html>';
            return docHtml;
        }
        return '';
    }

    function ktvExportPdfFromHtml(html, fileName) {
        if (typeof window.html2pdf === 'undefined') {
            showToast('PDF library not loaded. Please refresh and try again.', 'warning');
            return;
        }
        var holder = document.createElement('div');
        holder.className = 'ktv-pdf-export-protected';
        holder.style.cssText = 'position:fixed;left:-99999px;top:0;width:800px;background:#fff;padding:0;';
        holder.innerHTML = html;
        document.body.appendChild(holder);
        var opt = {
            margin: 0.3,
            filename: (fileName || 'ktv-document') + '.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        try {
            window.html2pdf().set(opt).from(holder).save().then(function () {
                if (holder.parentNode) holder.parentNode.removeChild(holder);
            }).catch(function () {
                if (holder.parentNode) holder.parentNode.removeChild(holder);
                showToast('Could not create PDF. Please try again.', 'error');
            });
        } catch (err) {
            if (holder.parentNode) holder.parentNode.removeChild(holder);
            showToast('Could not create PDF. Please try again.', 'error');
        }
    }

    /* ============================================================
       31. ACCORDION INIT
       ============================================================ */

    function initAccordion() {
        document.querySelectorAll('.ktv-accordion-wrapper').forEach(function (wrapper) {
            var firstOpen = wrapper.getAttribute('data-first-open') === 'true';
            var allClosed = wrapper.getAttribute('data-all-closed') === 'true';
            if (firstOpen && !allClosed) {
                var firstItem = wrapper.querySelector('.ktv-accordion-item');
                if (firstItem) {
                    var body = firstItem.querySelector('.ktv-accordion-body');
                    var icon = firstItem.querySelector('.ktv-accordion-icon');
                    if (body) {
                        body.style.display = 'block';
                        addClass(body, 'active');
                        if (icon) icon.textContent = '−';
                    }
                }
            }
        });
    }

    function buildAccordionPrintHTML(wrapper) {
        var sectionTitle = wrapper.dataset.title || 'Tour Itinerary';
        var vs = ktvConfig.voucherDefaults || {};
        var headerBg = vs.header_bg || '#075e54';
        var headerText = vs.header_text || 'TRAVEL VOUCHER';
        var footerText = vs.footer_text || 'Thank you for choosing Kashmir Travelling Voyage';
        var logoUrl = vs.logo_url || '';
        var showLogo = vs.show_logo !== false && logoUrl;

        var html = '';
        html += '<div class="ktv-pdf-export-protected" style="font-family:Tahoma,Arial,sans-serif;max-width:800px;margin:0 auto;background:#fff;border:2px dashed ' + headerBg + ';border-radius:20px;overflow:hidden;">';

        html += '<div style="background:' + headerBg + ';color:#fff;padding:25px 30px;text-align:center;">';
        if (showLogo) {
            html += '<div style="margin-bottom:10px;"><img src="' + logoUrl + '" alt="" width="120" height="60" onerror="this.style.display=\'none\'" style="display:block;margin:0 auto;max-width:100%;width:auto;max-height:120px;height:auto;object-fit:contain;"></div>';
        }
        html += '<div style="display:inline-block;background:#ff5722;padding:6px 25px;border-radius:40px;font-size:13px;font-weight:700;margin-top:8px;">' + escapeHtml(headerText) + '</div>';
        html += '</div>';

        html += '<div style="padding:25px 30px;">';
        html += '<h2 style="color:#075e54;margin:0 0 18px;font-size:20px;border-bottom:2px solid #075e54;padding-bottom:8px;">' + escapeHtml(sectionTitle) + '</h2>';

        wrapper.querySelectorAll('.ktv-accordion-item').forEach(function (item) {
            var head = item.querySelector('.ktv-accordion-head');
            var titleEl = head ? (head.querySelector('span:first-child') || head.querySelector('.ktv-accordion-head-left span')) : null;
            var titleText = titleEl ? stripIconPrefix(titleEl.textContent.trim()) : '';
            var afterTitleEl = item.querySelector('.ktv-accordion-after-title');
            var afterTitleText = afterTitleEl ? afterTitleEl.textContent.trim() : '';
            var bodyEl = item.querySelector('.ktv-accordion-content') || item.querySelector('.ktv-accordion-body');
            var bodyHtml = bodyEl ? bodyEl.innerHTML : '';

            html += '<div style="margin-bottom:18px;padding:12px 16px;background:#f8f9fa;border-left:4px solid #075e54;border-radius:8px;">';
            html += '<h3 style="color:#075e54;font-size:16px;margin:0 0 6px;">' + escapeHtml(titleText) + '</h3>';
            if (afterTitleText) {
                html += '<p style="color:#666;font-size:12px;margin:0 0 8px;">' + escapeHtml(afterTitleText) + '</p>';
            }
            html += '<div style="font-size:14px;line-height:1.7;color:#333;">' + bodyHtml + '</div>';
            html += '</div>';
        });

        html += '</div>';
        html += '<div style="background:#f5f7fa;padding:12px 30px;text-align:center;font-size:11px;color:#999;border-top:1px solid #eee;">';
        html += '<p style="margin:0;">' + escapeHtml(footerText) + '</p>';
        html += '<p style="margin:2px 0 0;">Generated on: ' + new Date().toLocaleString() + '</p>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function downloadAccordionContent(wrapper, format) {
        if (!wrapper) return;
        var sectionTitle = wrapper.dataset.title || 'Tour Itinerary';
        var fileName = sectionTitle.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase();
        if (format === 'docx') {
            var docHtml = buildDownloadHtml(wrapper, 'docx');
            var blob = new Blob([docHtml], { type: 'application/msword' });
            triggerDownload(blob, fileName + '.doc');
            showToast('DOCX downloaded!', 'success');
        } else {
            var content = sectionTitle + '\n' + '='.repeat(sectionTitle.length) + '\n\n';
            wrapper.querySelectorAll('.ktv-accordion-item').forEach(function (item) {
                var head = item.querySelector('.ktv-accordion-head');
                var titleEl = head ? (head.querySelector('span:first-child') || head.querySelector('.ktv-accordion-head-left span')) : null;
                var title = titleEl ? stripIconPrefix(titleEl.textContent.trim()) : '';
                var afterTitleEl = item.querySelector('.ktv-accordion-after-title');
                var afterTitle = afterTitleEl ? afterTitleEl.textContent.trim() : '';
                var body = item.querySelector('.ktv-accordion-body');
                var bodyText = body ? body.textContent.trim() : '';
                content += title + '\n' + '-'.repeat(title.length) + '\n';
                if (afterTitle) {
                    content += afterTitle + '\n';
                }
                content += '\n' + bodyText + '\n\n---\n\n';
            });
            var blob2 = new Blob([content], { type: 'text/plain;charset=utf-8' });
            triggerDownload(blob2, fileName + '.txt');
            showToast('TXT downloaded!', 'success');
        }
    }

    function viewAccordionAsTxt(wrapper) {
        if (!wrapper) return;
        var sectionTitle = wrapper.dataset.title || 'Tour Itinerary';
        var content = sectionTitle + '\n' + '='.repeat(sectionTitle.length) + '\n\n';
        wrapper.querySelectorAll('.ktv-accordion-item').forEach(function (item) {
            var head = item.querySelector('.ktv-accordion-head');
            var titleEl = head ? (head.querySelector('span:first-child') || head.querySelector('.ktv-accordion-head-left span')) : null;
            var title = titleEl ? stripIconPrefix(titleEl.textContent.trim()) : '';
            var afterTitleEl = item.querySelector('.ktv-accordion-after-title');
            var afterTitle = afterTitleEl ? afterTitleEl.textContent.trim() : '';
            var body = item.querySelector('.ktv-accordion-body');
            var bodyText = body ? body.textContent.trim() : '';
            content += title + '\n' + '-'.repeat(title.length) + '\n';
            if (afterTitle) content += afterTitle + '\n';
            content += '\n' + bodyText + '\n\n---\n\n';
        });
        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }

    function viewAccordionAsDocx(wrapper) {
        if (!wrapper) return;
        var docHtml = buildDownloadHtml(wrapper, 'docx');
        var blob = new Blob([docHtml], { type: 'application/msword' });
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }

    function triggerDownload(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* ============================================================
       32. TABS INIT
       ============================================================ */

    function initTabs() {
        document.querySelectorAll('.ktv-tabs-wrapper').forEach(function (wrapper) {
            if (wrapper.dataset.tabsReady) return;
            wrapper.dataset.tabsReady = 'true';
            wrapper.querySelectorAll('.ktv-tab-pane').forEach(function (pane) { pane.style.display = 'none'; });
            var firstOpen = wrapper.getAttribute('data-first-open') === 'true';
            var activeBtn = wrapper.querySelector('.ktv-tab-btn.active') || (firstOpen ? wrapper.querySelector('.ktv-tab-btn') : null);
            if (activeBtn) {
                addClass(activeBtn, 'active');
                var activeIndex = activeBtn.getAttribute('data-tab');
                var activePane = wrapper.querySelector('.ktv-tab-pane[data-tab="' + activeIndex + '"]');
                if (activePane) {
                    activePane.style.display = 'block';
                    addClass(activePane, 'active');
                }
            } else if (wrapper.querySelectorAll('.ktv-tab-btn').length > 0) {
                var firstBtn = wrapper.querySelector('.ktv-tab-btn');
                addClass(firstBtn, 'active');
                var firstIndex = firstBtn.getAttribute('data-tab');
                var firstPane = wrapper.querySelector('.ktv-tab-pane[data-tab="' + firstIndex + '"]');
                if (firstPane) {
                    firstPane.style.display = 'block';
                    addClass(firstPane, 'active');
                }
            }
        });
    }

    function getTabPaneTitle(wrapper, pane) {
        var title = 'Tab Content';
        if (wrapper && pane) {
            var tabBtn = wrapper.querySelector('.ktv-tab-btn[data-tab="' + pane.getAttribute('data-tab') + '"]');
            if (tabBtn) {
                var label = tabBtn.querySelector('span span') || tabBtn.querySelector('span');
                if (label) title = label.textContent.trim();
            }
        }
        return title;
    }

    function getAllTabsCombinedHtml(wrapper) {
        var html = '';
        if (!wrapper) return html;
        wrapper.querySelectorAll('.ktv-tab-pane').forEach(function (pane) {
            var title = getTabPaneTitle(wrapper, pane);
            var innerContent = pane.querySelector('.ktv-tab-inner-content');
            var contentHtml = innerContent ? innerContent.innerHTML : '';
            html += '<div class="ktv-tab-export-block" style="margin-bottom:24px;page-break-inside:avoid;">';
            html += '<h2 style="color:#075e54;font-size:20px;border-bottom:2px solid #075e54;padding-bottom:6px;margin:0 0 12px;">' + escapeHtml(title) + '</h2>';
            html += '<div>' + contentHtml + '</div>';
            html += '</div>';
        });
        return html;
    }

    function getAllTabsCombinedText(wrapper) {
        var text = '';
        if (!wrapper) return text;
        wrapper.querySelectorAll('.ktv-tab-pane').forEach(function (pane) {
            var title = getTabPaneTitle(wrapper, pane);
            var innerContent = pane.querySelector('.ktv-tab-inner-content');
            var contentText = innerContent ? innerContent.textContent.trim() : '';
            text += title + '\n' + '='.repeat(title.length) + '\n\n';
            text += contentText + '\n\n';
            text += '---\n\n';
        });
        return text;
    }

    function getTabsSectionTitle(wrapper) {
        var title = 'Tabs';
        if (wrapper) {
            var titleEl = wrapper.parentNode ? wrapper.parentNode.querySelector('.ktv-tabs-section-title') : null;
            if (titleEl) title = titleEl.textContent.trim();
        }
        return title;
    }

    function buildTabsPrintHeader() {
        var vs = ktvConfig.voucherDefaults || {};
        var logoUrl = vs.logo_url || '';
        var showLogo = vs.show_logo !== false && logoUrl;
        var headerBg = vs.header_bg || '#075e54';
        var headerText = vs.header_text || 'TRAVEL VOUCHER';
        var html = '';
        html += '<div style="background:' + headerBg + ';color:#fff;padding:25px 30px;text-align:center;">';
        if (showLogo) {
            html += '<div style="margin-bottom:10px;"><img src="' + logoUrl + '" alt="" width="120" height="60" onerror="this.style.display=\'none\'" style="display:block;margin:0 auto;max-width:100%;width:auto;max-height:120px;height:auto;object-fit:contain;"></div>';
        }
        html += '<div style="display:inline-block;background:#ff5722;padding:6px 25px;border-radius:40px;font-size:13px;font-weight:700;margin-top:8px;">' + escapeHtml(headerText) + '</div>';
        html += '</div>';
        return html;
    }

    /* ============================================================
       33. WISHLIST INIT
       ============================================================ */

    function initWishlist() {
        $$('.ktv-wishlist-btn').forEach(function (btn) {
            var inWishlist = btn.getAttribute('data-in-wishlist') === '1';
            var hasActive = hasClass(btn, 'active');
            if (inWishlist === hasActive) return;
            var icon = btn.querySelector('i');
            if (inWishlist) {
                addClass(btn, 'active');
                if (icon) icon.className = 'fas fa-heart';
            } else {
                removeClass(btn, 'active');
                if (icon) icon.className = 'far fa-heart';
            }
        });
    }


    /* ============================================================
       34. FETCH WISHLIST COUNTS
       ============================================================ */

    var ktvWishlistCountsFetched = false;

    function fetchWishlistCounts() {
        if (ktvWishlistCountsFetched) return;
        ktvWishlistCountsFetched = true;

        var buttons = document.querySelectorAll('.ktv-wishlist-btn[data-tour-id]');
        if (!buttons.length) return;

        var idSet = {};
        var allHydrated = true;
        buttons.forEach(function (b) {
            var id = parseInt(b.getAttribute('data-tour-id'), 10) || 0;
            if (id > 0) idSet[id] = true;
            var countEl = b.querySelector('.ktv-wishlist-count');
            if (countEl) {
                var txt = (countEl.textContent || '').trim();
                if (txt === '' || isNaN(parseInt(txt, 10))) {
                    allHydrated = false;
                }
            }
        });

        if (allHydrated) return;

        var ids = Object.keys(idSet).join(',');
        if (!ids) return;

        if (!ktvConfig.ajaxUrl) return;

        var formData = new FormData();
        formData.append('action', 'ktv_get_wishlist_counts');
        formData.append('nonce', ktvConfig.nonce);
        formData.append('tour_ids', ids);

        fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
            .then(function (r) { return r.json(); })
            .then(function (res) {
                if (!res || !res.success || !res.data) return;
                var counts = res.data.counts || {};
                var inWishlist = res.data.in_wishlist || {};

                buttons.forEach(function (b) {
                    var id = String(parseInt(b.getAttribute('data-tour-id'), 10) || 0);
                    if (!id || id === '0') return;

                    var countEl = b.querySelector('.ktv-wishlist-count');
                    if (countEl && counts[id] !== undefined) {
                        countEl.textContent = counts[id];
                    }

                    var icon = b.querySelector('i');
                    var isIn = inWishlist[id] === 1;
                    b.setAttribute('data-in-wishlist', isIn ? '1' : '0');

                    if (icon) {
                        icon.className = isIn ? 'fas fa-heart' : 'far fa-heart';
                    }
                    if (isIn) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
            })
            .catch(function () { });
    }

    /* ============================================================
       35. SORT AND FILTER TOURS
       ============================================================ */

    function initSortFilter() {
        document.addEventListener('change', function (e) {
            var sortSelect = e.target.closest('.ktv-grid-sort-select');
            if (!sortSelect) return;
            var container = sortSelect.closest('.ktv-tour-grid-container');
            if (!container) return;
            var grid = container.querySelector('.ktv-tour-grid');
            if (!grid) return;
            var cards = Array.prototype.slice.call(grid.querySelectorAll('.ktv-tour-card'));
            var sortBy = sortSelect.value;
            cards.sort(function (a, b) {
                var priceA = parseFloat(getAttr(a, 'data-tour-per-person', 'data-tour-total-price')) || parseFloat(getAttr(a, 'data-tour-price', 'data-price')) || 0;
                var priceB = parseFloat(getAttr(b, 'data-tour-per-person', 'data-tour-total-price')) || parseFloat(getAttr(b, 'data-tour-price', 'data-price')) || 0;
                var nameA = stripIconPrefix(getAttr(a, 'data-tour-name', 'data-name')).toLowerCase();
                var nameB = stripIconPrefix(getAttr(b, 'data-tour-name', 'data-name')).toLowerCase();
                var idA = parseInt(getAttr(a, 'data-tour-id', 'data-id'), 10) || 0;
                var idB = parseInt(getAttr(b, 'data-tour-id', 'data-id'), 10) || 0;
                var ratingA = parseFloat(a.querySelector('.ktv-rating-number') ? a.querySelector('.ktv-rating-number').textContent : '0') || 0;
                var ratingB = parseFloat(b.querySelector('.ktv-rating-number') ? b.querySelector('.ktv-rating-number').textContent : '0') || 0;
                if (sortBy === 'featured') return idB - idA;
                if (sortBy === 'price_low') return priceA - priceB;
                if (sortBy === 'price_high') return priceB - priceA;
                if (sortBy === 'name_asc') return nameA.localeCompare(nameB);
                if (sortBy === 'name_desc') return nameB.localeCompare(nameA);
                if (sortBy === 'newest') return idB - idA;
                if (sortBy === 'rating') return ratingB - ratingA;
                return 0;
            });
            cards.forEach(function (card) { grid.appendChild(card); });
        });

        document.addEventListener('change', function (e) {
            var filterSelect = e.target.closest('.ktv-grid-location-filter');
            if (!filterSelect) return;
            var container = filterSelect.closest('.ktv-tour-grid-container');
            if (!container) return;
            var selectedLocation = filterSelect.value;
            var cards = container.querySelectorAll('.ktv-tour-card');
            cards.forEach(function (card) {
                var cardLocation = getAttr(card, 'data-tour-location', 'data-location');
                card.style.display = (!selectedLocation || cardLocation.toLowerCase().indexOf(selectedLocation.toLowerCase()) !== -1) ? '' : 'none';
            });
        });

        var debouncedSearch = debounce(function (searchInput) {
            var container = searchInput.closest('.ktv-tour-grid-container');
            if (!container) return;
            var query = searchInput.value.toLowerCase();
            var cards = container.querySelectorAll('.ktv-tour-card');
            cards.forEach(function (card) {
                var title = getAttr(card, 'data-tour-name', 'data-name');
                var location = getAttr(card, 'data-tour-location', 'data-location');
                card.style.display = (!query || title.toLowerCase().indexOf(query) !== -1 || location.toLowerCase().indexOf(query) !== -1) ? '' : 'none';
            });
        }, 300);

        document.addEventListener('input', function (e) {
            var searchInput = e.target.closest('.ktv-grid-search-input');
            if (!searchInput) return;
            debouncedSearch(searchInput);
        });
    }

    /* ============================================================
       36. RESPONSIVE GRID COLUMNS
       ============================================================ */

    var updateGridColumns = debounce(function () {
        var width = window.innerWidth;
        document.querySelectorAll('.ktv-tour-grid-container').forEach(function (container) {
            var columns = parseInt(container.getAttribute('data-columns'), 10) || 3;
            var grid = container.querySelector('.ktv-tour-grid');
            if (!grid) return;
            ['ktv-grid-1', 'ktv-grid-2', 'ktv-grid-3', 'ktv-grid-4', 'ktv-grid-5', 'ktv-grid-6'].forEach(function (c) { removeClass(grid, c); });
            if (width < 768) {
                addClass(grid, 'ktv-grid-1');
            } else if (width < 1024) {
                addClass(grid, 'ktv-grid-' + Math.min(columns, 2));
            } else {
                addClass(grid, 'ktv-grid-' + Math.min(columns, 6));
            }
        });
    }, 150);

    /* ============================================================
       37. EASY TYPING
       ============================================================ */

    function initEasyTyping() {
        document.addEventListener('click', function (e) {
            if (e.target.closest('.ktv-location-search-results')) return;
            if (e.target.closest('.ktv-guest-btn')) return;
            if (e.target.closest('.ktv-guest-label')) return;
            if (e.target.closest('.ktv-step-buttons')) return;
            if (e.target.closest('.ktv-accordion-head')) return;
            if (e.target.closest('.ktv-accordion-item')) return;
            if (e.target.closest('.ktv-tab-btn')) return;
            if (e.target.classList && e.target.classList.contains('ktv-datepicker')) return;
            if (e.target._flatpickr) return;

            var phoneWrapper = e.target.closest('.ktv-phone-group');
            if (phoneWrapper) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return;
                var phoneField = phoneWrapper.querySelector('input[type="tel"]') || phoneWrapper.querySelector('input');
                if (phoneField) {
                    phoneField.focus();
                    if (typeof phoneField.setSelectionRange === 'function' && phoneField.value) {
                        try { phoneField.setSelectionRange(phoneField.value.length, phoneField.value.length); } catch (err) { }
                    }
                }
                return;
            }

            var wrapper = e.target.closest('.ktv-input-group');
            if (!wrapper) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
                return;
            }
            var field = wrapper.querySelector('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]):not([type="date"]):not(.ktv-datepicker), select, textarea:not(.ktv-datepicker)');
            if (field && !field._flatpickr) {
                field.focus();
                if (typeof field.setSelectionRange === 'function' && field.value) {
                    try { field.setSelectionRange(field.value.length, field.value.length); } catch (err) { }
                }
            }
        });
    }

    /* ============================================================
       38. UPDATE TIME AGO
       ============================================================ */

    function updateAllTimeAgo() {
        if (document.hidden) return;
        var els = document.querySelectorAll('.ktv-last-booking');
        if (!els.length) return;

        var pairs = [];
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var timeAttr = el.getAttribute('data-time');
            if (!timeAttr) continue;
            var agoText = el.querySelector('.ktv-time-ago');
            if (!agoText) continue;
            pairs.push({ el: agoText, time: timeAttr });
        }

        for (var j = 0; j < pairs.length; j++) {
            pairs[j].el.textContent = timeAgo(pairs[j].time);
        }
    }

    /* ============================================================
       39. PHONE PROVIDER DETECTION
       ============================================================ */

    function initPhoneProviderDetection() {
        document.addEventListener('input', function (e) {
            var phoneInput = e.target.closest('input[name="phone"]');
            if (!phoneInput) return;
            var form = phoneInput.closest('form');
            if (!form) return;

            var providerDisplay = form.querySelector('.ktv-phone-provider-display');
            if (!providerDisplay) {
                providerDisplay = document.createElement('span');
                providerDisplay.className = 'ktv-phone-provider-display';
                var parent = phoneInput.parentElement;
                if (parent) parent.appendChild(providerDisplay);
            }
            var provider = getPhoneProvider(phoneInput.value);
            if (provider) {
                providerDisplay.textContent = '📱 ' + provider;
                providerDisplay.classList.add('visible');
            } else {
                providerDisplay.classList.remove('visible');
            }
        });
    }

    /* ============================================================
       40. REVIEW SORT AND FILTER
       ============================================================ */

    function initReviewSort() {
        document.addEventListener('change', function (e) {
            var sortSelect = e.target.closest('.ktv-review-sort-select');
            if (sortSelect) {
                var container = sortSelect.closest('.ktv-reviews-google');
                if (!container) return;
                var reviewCards = Array.prototype.slice.call(container.querySelectorAll('.ktv-review-card'));
                var sortBy = sortSelect.value;
                reviewCards.sort(function (a, b) {
                    var ratingA = parseInt(a.getAttribute('data-rating'), 10) || 0;
                    var ratingB = parseInt(b.getAttribute('data-rating'), 10) || 0;
                    var dateA = new Date(a.getAttribute('data-date') || 0);
                    var dateB = new Date(b.getAttribute('data-date') || 0);
                    if (sortBy === 'newest') return dateB - dateA;
                    if (sortBy === 'highest') return ratingB - ratingA;
                    if (sortBy === 'lowest') return ratingA - ratingB;
                    if (sortBy === 'most_helpful') {
                        var helpfulElA = a.querySelector('.ktv-helpful-count');
                        var helpfulElB = b.querySelector('.ktv-helpful-count');
                        var helpfulA = helpfulElA ? parseInt(helpfulElA.textContent, 10) : 0;
                        var helpfulB = helpfulElB ? parseInt(helpfulElB.textContent, 10) : 0;
                        return helpfulB - helpfulA;
                    }
                    return 0;
                });
                var list = container.querySelector('.ktv-reviews-list');
                if (list) reviewCards.forEach(function (card) { list.appendChild(card); });
                return;
            }

            var langFilter = e.target.closest('.ktv-review-language-filter');
            if (langFilter) {
                var container2 = langFilter.closest('.ktv-reviews-google');
                if (!container2) return;
                var selectedLang = langFilter.value;
                var reviewCards2 = container2.querySelectorAll('.ktv-review-card');
                var langMap = { 'en': ['en', 'english'], 'hi': ['hi', 'hindi'], 'ur': ['ur', 'urdu'], 'ar': ['ar', 'arabic'], 'fr': ['fr', 'french'], 'es': ['es', 'spanish'], 'de': ['de', 'german'] };
                var targetLangs = langMap[selectedLang] || [];
                reviewCards2.forEach(function (card) {
                    var lang = (card.getAttribute('data-language') || '').toLowerCase();
                    var isMatch = !selectedLang || targetLangs.indexOf(lang) !== -1;
                    card.style.display = isMatch ? '' : 'none';
                });
                return;
            }
        });
    }

    /* ============================================================
       41. GALLERY SLIDER
       ============================================================ */

    function initGallerySlider() {
        document.querySelectorAll('.ktv-gallery-slider-container').forEach(function (container) {
            if (container.dataset.galleryReady) return;
            container.dataset.galleryReady = 'true';
            var slides = container.querySelectorAll('.ktv-gallery-slide');
            var total = slides.length;
            if (total < 2) return;
            var current = 0;
            var autoSlide = container.getAttribute('data-auto-slide') === 'true';
            var interval = parseInt(container.getAttribute('data-slide-interval'), 10) || 3000;
            var timer = null;

            function goToSlide(index) {
                if (index < 0) index = total - 1;
                if (index >= total) index = 0;
                current = index;
                slides.forEach(function (slide, idx) {
                    slide.style.opacity = idx === current ? '1' : '0';
                    slide.style.transition = 'opacity 0.8s ease-in-out';
                    slide.style.pointerEvents = idx === current ? 'auto' : 'none';
                    if (idx === current) slide.classList.add('active');
                    else slide.classList.remove('active');
                });
            }

            function nextSlide() {
                if (document.hidden) return;
                goToSlide(current + 1);
            }

            function startAutoplay() { if (autoSlide && total > 1) { stopAutoplay(); timer = setInterval(nextSlide, interval); } }
            function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }

            if (!container.querySelector('.ktv-gallery-prev')) {
                var prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.className = 'ktv-gallery-prev';
                prevBtn.setAttribute('aria-label', 'Previous image');
                prevBtn.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';
                prevBtn.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); goToSlide(current - 1); });

                var nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.className = 'ktv-gallery-next';
                nextBtn.setAttribute('aria-label', 'Next image');
                nextBtn.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
                nextBtn.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); nextSlide(); });

                container.appendChild(prevBtn);
                container.appendChild(nextBtn);
            }

            var galleryVisible = true;
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', function () { if (galleryVisible) startAutoplay(); });
            goToSlide(0);
            if (autoSlide && 'IntersectionObserver' in window) {
                var gObserver = new IntersectionObserver(function (entries) {
                    galleryVisible = entries[0].isIntersecting;
                    if (galleryVisible) startAutoplay();
                    else stopAutoplay();
                }, { threshold: 0.1 });
                gObserver.observe(container);
            } else {
                startAutoplay();
            }



            var touchStartX = 0;
            container.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
                if (autoSlide) stopAutoplay();
            }, { passive: true });
            container.addEventListener('touchend', function (e) {
                var touchEndX = e.changedTouches[0].screenX;
                var diffX = touchStartX - touchEndX;
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) nextSlide();
                    else goToSlide(current - 1);
                    if (autoSlide) setTimeout(startAutoplay, 300);
                } else if (autoSlide) startAutoplay();
            }, { passive: true });
        });
    }

    /* ============================================================
       42. ENSURE BOOKING FORM HAS TOURS
       ============================================================ */

    function ensureBookingFormHasTours() {
        document.querySelectorAll('.ktv-booking-multi-step select[name="tour_type"]').forEach(function (select) {
            var realOptions = 0;
            for (var i = 0; i < select.options.length; i++) {
                var optVal = select.options[i].value;
                if (optVal !== '' && optVal.indexOf('Loading tours') === -1) {
                    realOptions++;
                }
            }
            if (realOptions > 0) return;

            var container = select.closest('.ktv-booking-multi-step');
            var showIcon = true;
            if (container) {
                var sti = container.getAttribute('data-show-tour-icon');
                if (sti === 'false') showIcon = false;
            }

            var html = '';
            var seen = {};

            (ktvConfig.dynamicTours || []).forEach(function (t) {
                if (t.is_hardcoded == 1 || t.is_ghost == 1) return;
                var name = t.tour_name || '';
                if (!name) return;
                var lower = stripIconPrefix(name).toLowerCase();
                if (seen[lower]) return;
                seen[lower] = true;
                var tourObj = {
                    id: t.id || 0,
                    tour_price: parseFloat(t.original_price) || parseFloat(t.tour_price) || 0,
                    offer_price: parseFloat(t.offer_price) || parseFloat(t.tour_offer_price) || 0,
                    currency_symbol: ktvConfig.currencySymbol || '$',
                    price_basis: 'total',
                    show_per_day_price: t.show_per_day_price !== undefined ? parseInt(t.show_per_day_price, 10) : 1,
                    show_complete_price: t.show_complete_price !== undefined ? parseInt(t.show_complete_price, 10) : 0,
                    show_per_day_rate_and_total: t.show_per_day_rate_and_total !== undefined ? parseInt(t.show_per_day_rate_and_total, 10) : 0,
                    show_extra_person_rates: t.show_extra_person_rates !== undefined ? parseInt(t.show_extra_person_rates, 10) : 0,
                    enable_ip_pricing: t.enable_ip_pricing !== undefined ? parseInt(t.enable_ip_pricing, 10) : 1,
                    tour_default_adults: t.tour_default_adults !== undefined ? parseInt(t.tour_default_adults, 10) : 2,
                    tour_default_children: t.tour_default_children !== undefined ? parseInt(t.tour_default_children, 10) : 0,
                    pax_1_price: t.pax_1_price || 0,
                    pax_2_price: t.pax_2_price || 0,
                    pax_3_price: t.pax_3_price || 0,
                    group_price: t.group_price || 0,
                    family_price: t.family_price || 0,
                    extra_adult_price: t.extra_adult_price || 0,
                    extra_child_price: t.extra_child_price || 0,
                    extra_adult_label: t.extra_adult_label || 'Extra Adult',
                    extra_child_label: t.extra_child_label || 'Extra Child',
                    nights: t.nights !== undefined ? t.nights : (t.durationNights !== undefined ? t.durationNights : 0),
                    days: t.days !== undefined ? t.days : (t.durationDays !== undefined ? t.durationDays : 0),
                    location: t.location || '',
                    block_type: t.block_type || 'grid',
                    icon_title: t.icon_title || 'fa-map-marker-alt',
                    icon_size: t.icon_size || '14px',
                    icon_color: t.icon_color || '#075e54',
                    enable_icon_dropdown: t.enable_icon_dropdown !== undefined ? parseInt(t.enable_icon_dropdown, 10) : 1,
                    visible_pax_columns: t.visible_pax_columns || 'pax1',
                    pax_1_label: t.pax_1_label || '1 Pax',
                    pax_2_label: t.pax_2_label || '2 Pax',
                    pax_3_label: t.pax_3_label || '3 Pax',
                    group_label: t.group_label || 'Group',
                    family_label: t.family_label || 'Family',
                    pax_1_icon: t.pax_1_icon || 'fa-user',
                    pax_2_icon: t.pax_2_icon || 'fa-user-friends',
                    pax_3_icon: t.pax_3_icon || 'fa-users',
                    group_icon: t.group_icon || 'fa-user-plus',
                    family_icon: t.family_icon || 'fa-home',
                    gst_percent: t.gst_percent !== undefined && t.gst_percent !== '' ? t.gst_percent : (ktvConfig.gstPercent || '5'),
                    gst_label: t.gst_label || ktvConfig.gstLabel || 'GST',
                    meta_title: t.meta_title || '',
                    meta_description: t.meta_description || '',
                    source: 'database'
                };
                var perTourIcon = tourObj.enable_icon_dropdown;
                var showThisIcon = showIcon && perTourIcon === 1;
                var labelPrefix = showThisIcon ? (t.icon_prefix || '📍') + ' ' : '';
                html += '<option value="' + escapeHtml(name) + '"'
                    + buildTourOptionAttrs(tourObj) + '>'
                    + escapeHtml(labelPrefix + name)
                    + '</option>';
            });

            document.querySelectorAll('.ktv-tour-card[data-tour-name], .ktv-tour-package-card[data-tour-name]').forEach(function (card) {
                var name = card.getAttribute('data-tour-name') || '';
                if (!name) return;
                var lower = stripIconPrefix(name).toLowerCase();
                if (seen[lower]) return;
                seen[lower] = true;
                var blockTypeVal = card.getAttribute('data-block-type') || 'grid';
                var perTourIcon = card.getAttribute('data-enable-icon-dropdown');
                var enableIcon = perTourIcon === '0' ? 0 : 1;
                var prefix = blockTypeVal === 'card' ? '🃏' : (blockTypeVal === 'package' ? '📦' : '▦');
                var showThisIcon2 = showIcon && enableIcon === 1;
                var labelPrefix2 = showThisIcon2 ? prefix + ' ' : '';

                var displayPrice = parseFloat(card.getAttribute('data-tour-total-price')) || parseFloat(card.getAttribute('data-tour-price')) || 0;
                var originalPrice = parseFloat(card.getAttribute('data-original-price')) || displayPrice;
                var offerPrice = parseFloat(card.getAttribute('data-offer-price')) || (displayPrice < originalPrice ? displayPrice : 0);
                var cardCurrency = card.getAttribute('data-currency-symbol') || ktvConfig.currencySymbol || '$';
                var cardBasis = card.getAttribute('data-price-basis') || 'total';

                var cardTour = {
                    id: parseInt(card.getAttribute('data-tour-id'), 10) || 0,
                    tour_price: originalPrice,
                    offer_price: offerPrice,
                    currency_symbol: cardCurrency,
                    price_basis: cardBasis,
                    show_per_day_price: card.getAttribute('data-show-per-day') !== null ? parseInt(card.getAttribute('data-show-per-day'), 10) : 1,
                    show_complete_price: card.getAttribute('data-show-complete') !== null ? parseInt(card.getAttribute('data-show-complete'), 10) : 0,
                    show_per_day_rate_and_total: card.getAttribute('data-show-per-day-and-total') !== null ? parseInt(card.getAttribute('data-show-per-day-and-total'), 10) : 0,
                    show_extra_person_rates: card.getAttribute('data-show-extra-person-rates') !== null ? parseInt(card.getAttribute('data-show-extra-person-rates'), 10) : 0,
                    enable_ip_pricing: card.getAttribute('data-enable-ip-pricing') !== null ? parseInt(card.getAttribute('data-enable-ip-pricing'), 10) : 1,
                    tour_default_adults: card.getAttribute('data-tour-adults') !== null ? parseInt(card.getAttribute('data-tour-adults'), 10) : 2,
                    tour_default_children: card.getAttribute('data-tour-children') !== null ? parseInt(card.getAttribute('data-tour-children'), 10) : 0,
                    pax_1_price: parseFloat(card.getAttribute('data-pax1')) || 0,
                    pax_2_price: parseFloat(card.getAttribute('data-pax2')) || 0,
                    pax_3_price: parseFloat(card.getAttribute('data-pax3')) || 0,
                    group_price: parseFloat(card.getAttribute('data-group')) || 0,
                    family_price: parseFloat(card.getAttribute('data-family')) || 0,
                    extra_adult_price: parseFloat(card.getAttribute('data-extra-adult')) || 0,
                    extra_child_price: parseFloat(card.getAttribute('data-extra-child')) || 0,
                    extra_adult_label: card.getAttribute('data-extra-adult-label') || 'Extra Adult',
                    extra_child_label: card.getAttribute('data-extra-child-label') || 'Extra Child',
                    nights: parseInt(card.getAttribute('data-tour-nights'), 10) || 0,
                    days: parseInt(card.getAttribute('data-tour-days'), 10) || 0,
                    location: card.getAttribute('data-tour-location') || '',
                    block_type: blockTypeVal,
                    icon_title: card.getAttribute('data-tour-icon') || 'fa-map-marker-alt',
                    icon_size: card.getAttribute('data-tour-icon-size') || '14px',
                    icon_color: card.getAttribute('data-tour-icon-color') || '#075e54',
                    enable_icon_dropdown: enableIcon,
                    visible_pax_columns: card.getAttribute('data-visible-pax-columns') || 'pax1',
                    pax_1_label: card.getAttribute('data-pax1-label') || '1 Pax',
                    pax_2_label: card.getAttribute('data-pax2-label') || '2 Pax',
                    pax_3_label: card.getAttribute('data-pax3-label') || '3 Pax',
                    group_label: card.getAttribute('data-group-label') || 'Group',
                    family_label: card.getAttribute('data-family-label') || 'Family',
                    pax_1_icon: card.getAttribute('data-pax1-icon') || 'fa-user',
                    pax_2_icon: card.getAttribute('data-pax2-icon') || 'fa-user-friends',
                    pax_3_icon: card.getAttribute('data-pax3-icon') || 'fa-users',
                    group_icon: card.getAttribute('data-group-icon') || 'fa-user-plus',
                    family_icon: card.getAttribute('data-family-icon') || 'fa-home',
                    gst_percent: card.getAttribute('data-gst-percent') || ktvConfig.gstPercent || '5',
                    gst_label: card.getAttribute('data-gst-label') || ktvConfig.gstLabel || 'GST',
                    meta_title: card.getAttribute('data-meta-title') || '',
                    meta_description: card.getAttribute('data-meta-description') || '',
                    source: 'block'
                };

                html += '<option value="' + escapeHtml(name) + '"'
                    + buildTourOptionAttrs(cardTour) + '>'
                    + escapeHtml(labelPrefix2 + name)
                    + '</option>';
            });

            if (html) {
                while (select.options.length > 1) select.remove(1);
                select.insertAdjacentHTML('beforeend', html);
            }
        });
    }

    /* ============================================================
       43. DARK MODE CONTROLLER
       ============================================================ */

    function initDarkMode() {
        if (!ktvConfig.darkModeEnabled) return;

        function applyDarkMode() {
            if (!document.body) return;
            if (!document.body.classList.contains('ktv-dark-mode-active')) {
                document.body.classList.add('ktv-dark-mode-active');
            }
            if (document.documentElement.getAttribute('data-ktv-dark') !== '1') {
                document.documentElement.setAttribute('data-ktv-dark', '1');
            }

            document.querySelectorAll(
                '.ktv-tour-card, .ktv-tour-grid-container, .ktv-tour-package-card, ' +
                '.ktv-tour-icons-row, ' +
                '.ktv-booking-multi-step, .ktv-booking-button-block, ' +
                '.ktv-tour-book-btn, .ktv-tour-package-btn, .ktv-book-now-btn, .ktv-submit-btn, ' +
                '.ktv-review-progressive, .ktv-reviews-google, ' +
                '.ktv-accordion-wrapper, .ktv-tabs-wrapper, ' +
                '.ktv-contact-modern, .ktv-image-badge-wrapper, ' +
                '.ktv-pixel-carousel-container, .ktv-modal-container, ' +
                '.ktv-voucher-ticket, .ktv-inline-voucher-wrapper'
            ).forEach(function (el) {
                if (!el.classList.contains('ktv-dark-mode')) {
                    el.classList.add('ktv-dark-mode');
                }
                if (!el.classList.contains('ktv-dark-mode-global')) {
                    el.classList.add('ktv-dark-mode-global');
                }
            });
        }

        applyDarkMode();

        var debouncedApply = debounce(applyDarkMode, 200);

        var containers = document.querySelectorAll(
            '.ktv-tour-grid, .ktv-tour-grid-container, .ktv-accordion-wrapper, ' +
            '.ktv-tabs-wrapper, .ktv-reviews-google, .ktv-booking-multi-step'
        );
        Array.prototype.forEach.call(containers, function (container) {
            var childObserver = new MutationObserver(debouncedApply);
            childObserver.observe(container, { childList: true, subtree: false });
        });
    }

    /* ============================================================
       44. VOUCHER MODAL
       ============================================================ */

    function openScopedPrintWindow(url, title) {
        var w = window.open(url, '_blank', 'width=900,height=700');
        if (!w) {
            showToast('Please allow popups to print the voucher.', 'warning');
            return;
        }
        var doPrint = function () {
            try { w.focus(); w.print(); } catch (e) { }
        };
        try {
            w.onload = function () {
                setTimeout(doPrint, 500);
            };
        } catch (e) { }
        try {
            if (w.document && w.document.readyState === 'complete') {
                setTimeout(doPrint, 500);
            }
        } catch (e) { }
    }

    window.openVoucherModal = function (voucherCode, bookingRef) {
        if (!voucherCode) {
            location.reload();
            return;
        }

        if (document.body && document.body.classList.contains('wp-admin')) {
            var siteUrlCleanAdmin = (ktvConfig.siteUrl || '').replace(/\/+$/, '');
            window.open(siteUrlCleanAdmin + '/voucher/' + encodeURIComponent(voucherCode), '_blank');
            return;
        }

        var modalId = 'ktv-voucher-modal-' + Date.now();
        var siteUrlClean = (ktvConfig.siteUrl || '').replace(/\/+$/, '');
        var voucherUrl = siteUrlClean + '/voucher/' + encodeURIComponent(voucherCode);
        var labels = ktvConfig.guestVoucherLabels || {};
        var actionSettings = ktvConfig.voucherActionSettings || {};
        var showDownload = actionSettings.show_download !== false;
        var showOnline = actionSettings.show_online !== false;
        var showIcon = actionSettings.show_icon !== false;
        var showText = actionSettings.show_text !== false;
        var btnSize = actionSettings.button_size || 'medium';
        var btnFontSize = actionSettings.font_size || '13px';
        var btnColor = actionSettings.button_color || '#075e54';
        var btnTextColor = actionSettings.button_text_color || '#ffffff';

        var sizeMap = { small: '6px 12px', medium: '10px 18px', large: '14px 26px' };
        var padSize = sizeMap[btnSize] || sizeMap.medium;
        var baseBtnStyle = 'padding:' + padSize + ';border-radius:8px;text-decoration:none;font-weight:600;font-size:' + btnFontSize + ';display:inline-block;border:none;cursor:pointer;';

        var uid = 'ktv-modal-dl-' + voucherCode.replace(/[^a-zA-Z0-9]/g, '');
        var downloadPdf  = voucherUrl + '?download=pdf';
        var downloadDocx = voucherUrl + '?download=docx';
        var viewPdf      = voucherUrl + '?view=pdf';
        var viewDocx     = voucherUrl + '?view=docx';

        var actionsHtml = '';
        if (showDownload || showOnline) {
            actionsHtml += '<div class="ktv-voucher-modal-actions" style="display:block;margin-top:15px;text-align:center;">';
            actionsHtml += '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:10px;">';

            if (showDownload) {
                actionsHtml += '<div class="ktv-voucher-row ktv-voucher-row-download" style="position:relative;display:inline-block;">';
                actionsHtml += '<button type="button" class="ktv-voucher-download-toggle" aria-expanded="false" aria-controls="' + escapeHtml(uid) + '" data-target="' + escapeHtml(uid) + '" style="background:' + btnColor + ';color:' + btnTextColor + ';' + baseBtnStyle + '">';
                if (showIcon) actionsHtml += '<i class="fas fa-download"></i> ';
                if (showText) actionsHtml += escapeHtml(labels.download_label || 'Download') + ' ';
                actionsHtml += '<i class="fas fa-chevron-down" aria-hidden="true"></i>';
                actionsHtml += '</button>';
                actionsHtml += buildVoucherDownloadMenuHtml(uid, downloadPdf, downloadDocx, viewPdf, viewDocx, false);
                actionsHtml += '</div>';
            }

            actionsHtml += '</div>';
            actionsHtml += '<div style="text-align:center;">';
            actionsHtml += '<button type="button" class="ktv-modal-btn ktv-voucher-print-btn" data-voucher-code="' + escapeHtml(voucherCode) + '" style="display:inline-block;width:auto;padding:10px 20px;background:#075e54;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-right:8px;">';
            actionsHtml += '<i class="fas fa-print"></i> ' + escapeHtml(labels.print_label || 'Print');
            actionsHtml += '</button>';
            if (showOnline) {
                actionsHtml += '<a href="' + voucherUrl + '" target="_blank" style="display:inline-block;padding:10px 20px;background:#075e54;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin-right:8px;">' + (showIcon ? '<i class="fas fa-globe"></i> ' : '') + (showText ? escapeHtml(labels.open_full_page_label || 'Open Full Page') : '') + '</a>';
            }
            actionsHtml += '<button type="button" class="ktv-modal-btn" style="display:inline-block;width:auto;padding:10px 20px;background:#6c757d;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;" data-close-modal="' + modalId + '">';
            actionsHtml += '<i class="fas fa-check"></i> ' + escapeHtml(labels.done_label || 'Done');
            actionsHtml += '</button>';
            actionsHtml += '</div>';
            actionsHtml += '</div>';
        }

        var modalHtml = ''
            + '<div id="' + modalId + '" class="ktv-modal-overlay" role="dialog" aria-modal="true">'
            + '  <div class="ktv-modal-container large">'
            + '    <div class="ktv-modal-header">'
            + '      <h3><i class="fas fa-ticket-alt"></i> Your Travel Voucher</h3>'
            + '      <button class="ktv-modal-close" data-close-modal="' + modalId + '" aria-label="Close">&times;</button>'
            + '    </div>'
            + '    <div class="ktv-modal-body" style="padding:15px;">'
            + '      <div class="ktv-voucher-modal-loading" style="text-align:center;padding:40px;">'
            + '        <i class="fas fa-spinner fa-spin" style="font-size:32px;color:#075e54;"></i>'
            + '        <p style="margin-top:10px;color:#666;">Loading voucher...</p>'
            + '      </div>'
            + '      <div class="ktv-voucher-modal-content"></div>'
            + '      ' + actionsHtml
            + '    </div>'
            + '  </div>'
            + '</div>';

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.classList.add('ktv-modal-open');

        removeStaleInlineVouchers();

        var modal = document.getElementById(modalId);
        if (modal) applyDarkModeClassToElement(modal);

        modal.querySelectorAll('[data-close-modal]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                window.closeModal(modalId);
            });
        });

        var printBtn = modal.querySelector('.ktv-voucher-print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function () {
                openScopedPrintWindow(voucherUrl + '?print=1', 'Voucher');
            });
        }

        ktvInitVoucherDownloadToggle(modal);

        var formData = new FormData();
        formData.append('action', 'ktv_generate_voucher_html');
        formData.append('nonce', ktvConfig.nonce);
        formData.append('voucher_code', voucherCode);

        fetch(ktvConfig.ajaxUrl, { method: 'POST', body: formData })
            .then(function (response) { return response.json(); })
            .then(function (response) {
                var loadingEl = modal.querySelector('.ktv-voucher-modal-loading');
                var contentEl = modal.querySelector('.ktv-voucher-modal-content');
                var actionsEl = modal.querySelector('.ktv-voucher-modal-actions');
                if (loadingEl) loadingEl.style.display = 'none';

                if (response.success && response.data && response.data.html) {
                    if (contentEl) {
                        contentEl.innerHTML = response.data.html;
                        if (ktvConfig.darkModeEnabled) {
                            contentEl.querySelectorAll('.ktv-voucher-ticket').forEach(function (ticket) {
                                applyDarkModeClassToElement(ticket);
                            });
                        }
                        hideBrokenLogos(contentEl);
                    }
                    if (actionsEl) actionsEl.style.display = 'block';
                } else {
                    if (contentEl) {
                        contentEl.innerHTML = '<div style="text-align:center;padding:20px;">'
                            + '<i class="fas fa-exclamation-circle" style="font-size:32px;color:#dc3545;"></i>'
                            + '<p style="margin-top:10px;color:#666;">Could not load voucher preview.</p>'
                            + '<a href="' + voucherUrl + '" target="_blank" style="display:inline-block;margin-top:10px;padding:10px 20px;background:#075e54;color:#fff;border-radius:8px;text-decoration:none;">Open Voucher Page</a>'
                            + '</div>';
                    }
                    if (actionsEl) actionsEl.style.display = 'block';
                }
            })
            .catch(function () {
                var loadingEl = modal.querySelector('.ktv-voucher-modal-loading');
                var contentEl = modal.querySelector('.ktv-voucher-modal-content');
                var actionsEl = modal.querySelector('.ktv-voucher-modal-actions');
                if (loadingEl) loadingEl.style.display = 'none';
                if (contentEl) {
                    contentEl.innerHTML = '<div style="text-align:center;padding:20px;">'
                        + '<i class="fas fa-exclamation-circle" style="font-size:32px;color:#dc3545;"></i>'
                        + '<p style="margin-top:10px;color:#666;">Server error. Please check your email for the voucher.</p>'
                        + '</div>';
                }
                if (actionsEl) actionsEl.style.display = 'block';
            });
    };

    /* ============================================================
       45. GUEST ACTION MODAL
       ============================================================ */

    function openGuestActionModal(action, voucherCode, token, title, placeholder, callback) {
        var modalId = 'ktv-guest-action-modal-' + Date.now();
        var previousFocus = document.activeElement;

        var confirmBtnColor = '#28a745';
        var iconClass = 'fa-check-circle';
        var requireInput = false;
        var description = '';

        if (action === 'modify') {
            confirmBtnColor = '#17a2b8';
            iconClass = 'fa-edit';
            requireInput = true;
            description = 'Please describe what you want to change (dates, guests, tour package, etc.):';
        } else if (action === 'decline') {
            confirmBtnColor = '#dc3545';
            iconClass = 'fa-times-circle';
            requireInput = false;
            description = 'You may add an optional reason for declining:';
        } else if (action === 'cancel') {
            confirmBtnColor = '#6c757d';
            iconClass = 'fa-ban';
            requireInput = false;
            description = 'You may add an optional reason for cancellation:';
        } else if (action === 'accept') {
            confirmBtnColor = '#28a745';
            iconClass = 'fa-check-circle';
            description = 'Confirm that you want to accept this booking:';
        }

        var modalHtml = ''
            + '<div id="' + modalId + '" class="ktv-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="' + modalId + '-title">'
            + '  <div class="ktv-modal-container small">'
            + '    <div class="ktv-modal-header">'
            + '      <h3 id="' + modalId + '-title"><i class="fas ' + iconClass + '"></i> ' + escapeHtml(title) + '</h3>'
            + '      <button class="ktv-modal-close" data-close-modal="' + modalId + '" aria-label="Close">&times;</button>'
            + '    </div>'
            + '    <div class="ktv-modal-body">'
            + '      <p style="margin-bottom:15px;color:#666;font-size:14px;">' + escapeHtml(description) + '</p>'
            + '      <div class="ktv-input-group" style="background:#f8f9fa;border-radius:10px;padding:0 12px;">'
            + '        <textarea id="ktv-guest-action-input-' + modalId + '" rows="4" placeholder="' + escapeHtml(placeholder || '') + '" style="width:100%;padding:12px 0;border:none;background:transparent;outline:none;font-size:14px;resize:vertical;min-height:80px;font-family:inherit;"></textarea>'
            + '      </div>'
            + '      <div class="ktv-modal-message"></div>'
            + '      <div style="display:flex;gap:10px;margin-top:20px;justify-content:flex-end;">'
            + '        <button type="button" class="ktv-modal-btn" style="background:#6c757d;width:auto;padding:12px 24px;" data-close-modal="' + modalId + '">Cancel</button>'
            + '        <button type="button" class="ktv-modal-btn ktv-guest-action-confirm" style="background:' + confirmBtnColor + ';width:auto;padding:12px 24px;">Confirm</button>'
            + '      </div>'
            + '    </div>'
            + '  </div>'
            + '</div>';

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.classList.add('ktv-modal-open');

        var modal = document.getElementById(modalId);
        if (modal) applyDarkModeClassToElement(modal);

        var textarea = document.getElementById('ktv-guest-action-input-' + modalId);
        if (textarea) textarea.setAttribute('aria-label', title || 'Action reason');

        function closeAndCleanup(result) {
            window.closeModal(modalId);
            try { if (previousFocus && previousFocus.focus) previousFocus.focus(); } catch (e) { }
            callback(result);
        }

        modal.querySelectorAll('[data-close-modal]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                closeAndCleanup(null);
            });
        });

        var confirmBtn = modal.querySelector('.ktv-guest-action-confirm');
        confirmBtn.addEventListener('click', function () {
            var value = textarea ? textarea.value.trim() : '';

            if (requireInput && value === '') {
                showModalMessage(modalId, 'Please enter a description of what you want to modify.', 'error');
                return;
            }

            closeAndCleanup(value);
        });

        modal.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') {
                ev.preventDefault();
                closeAndCleanup(null);
            }
            if (ev.key === 'Tab') {
                var focusables = modal.querySelectorAll('button, textarea, input, a[href]');
                if (!focusables.length) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                if (ev.shiftKey && document.activeElement === first) {
                    ev.preventDefault();
                    last.focus();
                } else if (!ev.shiftKey && document.activeElement === last) {
                    ev.preventDefault();
                    first.focus();
                }
            }
        });

        if (textarea) {
            setTimeout(function () { textarea.focus(); }, 200);
        } else if (confirmBtn) {
            setTimeout(function () { confirmBtn.focus(); }, 200);
        }
    }

    /* ============================================================
       46. GUEST VOUCHER ACTIONS
       ============================================================ */

    function initGuestVoucherActions() {
        /* INTENTIONAL NO-OP — body handled by ktvGlobalClickRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }
        /* ============================================================
       47. MODAL ANIMATION CONTROLLER
       ============================================================ */

    function initModalAnimations() {
        /* INTENTIONAL NO-OP — overlay close and Escape key are handled by ktvGlobalClickRouter and ktvGlobalKeydownRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }

    /* ============================================================
       48. GLOBAL ERROR BOUNDARY
       ============================================================ */

    function initErrorBoundary() {
        window.addEventListener('error', function (e) {
            if (e && e.message && e.message.indexOf('ktv') !== -1) {
                if (KTV_DEBUG) console.warn('[KTV] Runtime error caught:', e.message);
            }
        });

        window.addEventListener('unhandledrejection', function (e) {
            if (e && e.reason) {
                if (KTV_DEBUG) console.warn('[KTV] Unhandled promise rejection:', e.reason);
            }
        });
    }

    /* ============================================================
       49. LOCATION TAGS
       ============================================================ */

    function initLocationTags() {
        /* INTENTIONAL NO-OP — location tag clicks are handled by ktvGlobalClickRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }

    /* ============================================================
       50. PRINT VOUCHER BUTTON
       ============================================================ */

    function initPrintVoucherButton() {
        /* INTENTIONAL NO-OP — print voucher button clicks are handled by ktvGlobalClickRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }

    /* ============================================================
       51. VOUCHER PRINT FLOW
       ============================================================ */

    function initVoucherPrintFlow() {
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.get('print') === '1') {
                document.body.classList.add('ktv-context-print');
            }
            if (params.get('view') === 'pdf' || params.get('view') === 'docx') {
                document.body.classList.add('ktv-context-pdf-view');
            }

            if (params.get('print') === '1') {
                window.addEventListener('load', function () {
                    setTimeout(function () {
                        try { window.print(); } catch (e) { }
                    }, 400);
                });
            }
        } catch (err) {
        }
    }

    /* ============================================================
       52. ACCOUNT PAGE ACTIONS
       ============================================================ */

    function initAccountBookingDetails() {
        /* INTENTIONAL NO-OP — booking detail button clicks are handled by ktvGlobalClickRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }

    function initAccountWishlistActions() {
        /* INTENTIONAL NO-OP — wishlist action button clicks are handled by ktvGlobalClickRouter in Section 17. Kept as public init stub for backwards compatibility. */
    }

    function initAccountForgotPassword() {
        var link = document.getElementById('ktv-forgot-password-link');
        var modalEl = document.getElementById('ktvForgotPasswordModal');
        var form = document.getElementById('ktv-forgot-password-form');
        var msgEl = document.getElementById('ktv-forgot-message');
        if (!link || !modalEl || !form) return;

        link.addEventListener('click', function (e) {
            e.preventDefault();

            if (typeof window.bootstrap !== 'undefined' && window.bootstrap.Modal) {
                window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
            } else {
                modalEl.classList.add('show');
                modalEl.style.display = 'block';
                modalEl.removeAttribute('aria-hidden');
                modalEl.setAttribute('aria-modal', 'true');
            }

            var emailInput = document.getElementById('ktv_forgot_email');
            if (emailInput) {
                setTimeout(function () { try { emailInput.focus(); } catch (err) {} }, 200);
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (msgEl) {
                msgEl.innerHTML = '';
            }

            var emailInput = form.querySelector('#ktv_forgot_email');
            var email = emailInput ? trim(emailInput.value) : '';
            if (!email || !validateEmail(email)) {
                if (msgEl) {
                    msgEl.innerHTML = '<div class="alert alert-danger">Please enter a valid email address.</div>';
                }
                return;
            }

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            }

            var formData = new FormData(form);
            formData.append('action', 'ktv_forgot_password');

            var accountCfg = (typeof window.ktv_account !== 'undefined') ? window.ktv_account : {};
            var ajaxUrl = accountCfg.ajax_url || ktvConfig.ajaxUrl || '/wp-admin/admin-ajax.php';

            fetch(ajaxUrl, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            })
            .then(function (r) { return r.json(); })
            .then(function (resp) {
                if (msgEl) {
                    if (resp && resp.success) {
                        var successMsg = (resp.data && resp.data.message) || 'Password reset link sent. Please check your inbox.';
                        msgEl.innerHTML = '<div class="alert alert-success">' + escapeHtml(successMsg) + '</div>';
                        form.reset();
                    } else {
                        var errorMsg = (resp && resp.data && resp.data.message) || 'Could not send reset link. Please try again.';
                        msgEl.innerHTML = '<div class="alert alert-danger">' + escapeHtml(errorMsg) + '</div>';
                    }
                }
            })
            .catch(function () {
                if (msgEl) {
                    msgEl.innerHTML = '<div class="alert alert-danger">Server error. Please try again.</div>';
                }
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });
    }

    function initAccountPages() {
        if (document.querySelector('.ktv-my-bookings')) {
            initAccountBookingDetails();
        }
        if (document.querySelector('.ktv-my-wishlist')) {
            initAccountWishlistActions();
        }
        if (document.getElementById('ktv-forgot-password-link')) {
            initAccountForgotPassword();
        }
    }

    /* ============================================================
       53. INITIALIZATION, EXPORTS, VERSION GUARD
       ============================================================ */

    ready(function () {
        initErrorBoundary();
        initDarkMode();

        initDatePickers();

        initSmartTravelDates();
        initCountryPhoneMatching();
        initGPayButtons();
        initPhoneProviderDetection();
        initEventListeners();

        initPixelCarousel();
        initLocationSearch();
        initLocationTags();
        initBookingForm();
        ensureBookingFormHasTours();
        initContactForm();
        initReviewForm();
        initAccordion();
        initTabs();
        initWishlist();
        fetchWishlistCounts();
        initSortFilter();
        initReviewSort();
        initGallerySlider();
        initPrintVoucherButton();
        initGuestVoucherActions();
        initVoucherPrintFlow();

        initAccountPages();

        updateGridColumns();
        window.addEventListener('resize', updateGridColumns, { passive: true });

        if (document.querySelector('.ktv-last-booking')) {
            setInterval(updateAllTimeAgo, 60000);
        }


        initEasyTyping();
        initModalAnimations();

        ktvLog('KTV Travel v14.0.0 loaded.');
    });

    window.ktvUpdateBookingSummary = updateBookingSummary;
    window.ktvUpdateTourPriceDisplay = updateTourPriceDisplay;
    window.ktvFilterToursByNights = filterToursByNights;
    window.ktvCalculateSmartPrice = calculateSmartPrice;
    window.ktvGetBasePerPerson = getBasePerPerson;
    window.ktvResolvePaxForOfferPrice = resolvePaxForOfferPrice;
    window.ktvShowToast = showToast;
    window.ktvShowRotatingDots = showRotatingDots;
    window.ktvOpenGPaySmartLink = openGPaySmartLink;
    window.ktvValidateBookingFields = validateBookingFields;
    window.ktvRemoveStaleInlineVouchers = removeStaleInlineVouchers;
    window.ktvOpenGuestActionModal = openGuestActionModal;
    window.ktvFetchWishlistCounts = fetchWishlistCounts;
    window.ktvInitVoucherDownloadToggle = ktvInitVoucherDownloadToggle;
    window.ktvRecomputeBooking = ktvRecomputeBooking;
    window.ktvConvertPrice = convertPrice;
    window.ktvToBaseCurrency = toBaseCurrency;
    window.ktvSyncCountryFromPhoneCode = syncCountryFromPhoneCode;
    window.ktvConfig = ktvConfig;

    window.ktvUtils = {
        ready: ready,
        $: $,
        $$: $$,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        trim: trim,
        stripIconPrefix: stripIconPrefix,
        sanitizeContent: sanitizeContent,
        validateEmail: validateEmail,
        validatePhone: validatePhone,
        validateCreditCard: validateCreditCard,
        getCardType: getCardType,
        getPhoneProvider: getPhoneProvider,
        escapeHtml: escapeHtml,
        timeAgo: timeAgo,
        slideDown: slideDown,
        slideUp: slideUp,
        animateScrollTo: animateScrollTo,
        triggerEvent: triggerEvent,
        compressImage: compressImage,
        dataURLToBlob: dataURLToBlob,
        getAttr: getAttr,
        debounce: debounce,
        promiseFinally: promiseFinally,
        calculateSmartPrice: calculateSmartPrice,
        getBasePerPerson: getBasePerPerson,
        resolvePaxForOfferPrice: resolvePaxForOfferPrice,
        pickEffectivePrice: pickEffectivePrice,
        resolveCurrencySymbol: resolveCurrencySymbol,
        convertPrice: convertPrice,
        toBaseCurrency: toBaseCurrency,
        showToast: showToast,
        showModalMessage: showModalMessage,
        showRotatingDots: showRotatingDots,
        openGPaySmartLink: openGPaySmartLink,
        getReviewModalMeta: getReviewModalMeta,
        readBlockModalSettings: readBlockModalSettings,
        updateTourPriceDisplay: updateTourPriceDisplay,
        updateBookingSummary: updateBookingSummary,
        filterToursByNights: filterToursByNights,
        ktvRecomputeBooking: ktvRecomputeBooking,
        validateBookingFields: validateBookingFields,
        markFieldError: markFieldError,
        clearFieldErrors: clearFieldErrors,
        removeStaleInlineVouchers: removeStaleInlineVouchers,
        hideBrokenLogos: hideBrokenLogos,
        ktvInitVoucherDownloadToggle: ktvInitVoucherDownloadToggle,
        fetchWishlistCounts: fetchWishlistCounts,
        initGPayButtons: initGPayButtons,
        initEventListeners: initEventListeners,
        initSmartTravelDates: initSmartTravelDates,
        initCountryPhoneMatching: initCountryPhoneMatching,
        syncCountryFromPhoneCode: syncCountryFromPhoneCode,
        initDatePickers: initDatePickers,
        initPixelCarousel: initPixelCarousel,
        initLocationSearch: initLocationSearch,
        bindLocationSearchForForm: bindLocationSearchForForm,
        initLocationTags: initLocationTags,
        initPrintVoucherButton: initPrintVoucherButton,
        initGuestVoucherActions: initGuestVoucherActions,
        initVoucherPrintFlow: initVoucherPrintFlow,
        initHoneypotValidation: isHoneypotFilled,
        getHoneypotValue: getHoneypotValue,
        getHoneypotFieldName: getHoneypotFieldName,
        isHoneypotEnabledForForm: isHoneypotEnabledForForm,
        renderInlineVoucher: renderInlineVoucher,
        buildInlineVoucherActions: buildInlineVoucherActions,
        buildVoucherDownloadMenuHtml: buildVoucherDownloadMenuHtml,
        buildTourOptionAttrs: buildTourOptionAttrs,
        renderPaxItemsHtml: renderPaxItemsHtml,
        applyPaxGridToContainer: applyPaxGridToContainer,
        applyTourMeta: applyTourMeta,
        getCountriesList: getCountriesList,
        buildCountryOptionsHtml: buildCountryOptionsHtml,
        buildPhoneCodeOptionsHtml: buildPhoneCodeOptionsHtml,
        parseISODate: parseISODate,
        formatISODateLocal: formatISODateLocal,
        ktvExportPdfFromHtml: ktvExportPdfFromHtml,
        initAccountBookingDetails: initAccountBookingDetails,
        initAccountWishlistActions: initAccountWishlistActions,
        initAccountForgotPassword: initAccountForgotPassword,
        initAccountPages: initAccountPages
    };

    window.KTV_BookingModal = {
        open: function (tourId, tourName, tourPrice, tourLocation, blockType) {
            window.openBookingModal(tourId, tourName, tourPrice, tourLocation, blockType);
        }
    };

    window.ktvTravel = {
        calculateSmartPrice: calculateSmartPrice,
        getBasePerPerson: getBasePerPerson,
        pickEffectivePrice: pickEffectivePrice,
        convertPrice: convertPrice,
        toBaseCurrency: toBaseCurrency,
        openBookingModal: window.openBookingModal,
        openReviewModal: window.openReviewModal,
        openContactModal: window.openContactModal,
        openVoucherModal: window.openVoucherModal,
        closeModal: window.closeModal,
        showToast: showToast,
        renderInlineVoucher: renderInlineVoucher,
        validateBookingFields: validateBookingFields,
        removeStaleInlineVouchers: removeStaleInlineVouchers,
        isHoneypotFilled: isHoneypotFilled,
        fetchWishlistCounts: fetchWishlistCounts,
        syncCountryFromPhoneCode: syncCountryFromPhoneCode,
        ktvExportPdfFromHtml: ktvExportPdfFromHtml,
        initAccountBookingDetails: initAccountBookingDetails,
        initAccountWishlistActions: initAccountWishlistActions,
        initAccountForgotPassword: initAccountForgotPassword,
        version: '14.0.0',
        config: ktvConfig
    };

    /* ============================================================
       54. TOUR FILTER BLOCK
       ============================================================ */

    function initTourFilter() {
        var filter = document.querySelector('.ktv-tour-filter');
        if (!filter) return;
        filter.dataset.ktvFilterReady = '1';

        var durationSel   = filter.querySelector('.ktv-filter-duration');
        var priceSel      = filter.querySelector('.ktv-filter-price');
        var sortSel       = filter.querySelector('.ktv-filter-sort');
        var ratingSel     = filter.querySelector('.ktv-filter-rating');
        var activitiesSel = filter.querySelector('.ktv-filter-activities');
        var groupSel      = filter.querySelector('.ktv-filter-group');
        var hotelsSel     = filter.querySelector('.ktv-filter-hotels');
        var boatSel       = filter.querySelector('.ktv-filter-boat');
        var mealsSel      = filter.querySelector('.ktv-filter-meals');
        var flightSel     = filter.querySelector('.ktv-filter-flight');
        var resetBtn      = filter.querySelector('.ktv-filter-reset');
        var countEl       = filter.querySelector('.ktv-filter-count span');
        var activeBadge   = filter.querySelector('.ktv-active-count');
        var activeBadgeN  = activeBadge ? activeBadge.querySelector('span') : null;
        var quick         = '';

        function cardText(card, selector) {
            var el = card.querySelector(selector);
            return el ? el.textContent.trim().toLowerCase() : '';
        }

        function cardIcons(card) {
            var items = card.querySelectorAll('.ktv-tour-icon-item, .ktv-tour-package-icon-label');
            var out = [];
            items.forEach(function (i) { out.push(i.textContent.trim().toLowerCase()); });
            return out.join('|');
        }

        function cardDays(card) {
            var d = parseInt(card.getAttribute('data-tour-days'), 10);
            var n = parseInt(card.getAttribute('data-tour-nights'), 10);
            if (d > 0) return d;
            if (n > 0) return n + 1;

            var badge = card.querySelector('.ktv-night-day-icon, .ktv-tour-duration-badge, .ktv-tour-package-duration');
            if (badge) {
                var t = badge.textContent.toLowerCase();
                var dm = t.match(/(\d+)\s*d/);
                if (dm && parseInt(dm[1], 10) > 0) return parseInt(dm[1], 10);
                var nm = t.match(/(\d+)\s*n/);
                if (nm && parseInt(nm[1], 10) > 0) return parseInt(nm[1], 10) + 1;
            }

            var title = cardText(card, '.ktv-tour-title') || cardText(card, '.ktv-tour-package-title');
            var td = title.match(/(\d+)\s*d(?:ays)?/);
            if (td) return parseInt(td[1], 10);
            var tn = title.match(/(\d+)\s*n(?:ights?)?/);
            if (tn) return parseInt(tn[1], 10) + 1;
            return 0;
        }

        function cardPrice(card) {
            var p = parseFloat(card.getAttribute('data-tour-per-person'));
            if (p > 0) return p;
            p = parseFloat(card.getAttribute('data-tour-total-price'));
            if (p > 0) return p;
            var el = card.querySelector('.ktv-new-price, .ktv-tour-package-new-price');
            if (el) {
                var txt = el.textContent.replace(/[^0-9.]/g, '');
                p = parseFloat(txt);
                if (p > 0) return p;
            }
            return 0;
        }

        function cardRating(card) {
            var r = parseFloat(card.getAttribute('data-tour-rating'));
            if (r > 0) return r;
            var el = card.querySelector('.ktv-rating-number');
            if (el) {
                r = parseFloat(el.textContent.trim());
                if (r > 0) return r;
            }
            return 0;
        }

        function cardReviews(card) {
            var el = card.querySelector('.ktv-review-count-mini');
            if (el) {
                var m = el.textContent.match(/(\d+)/);
                if (m) return parseInt(m[1], 10);
            }
            return 0;
        }

        function cardId(card) {
            return parseInt(card.getAttribute('data-tour-id'), 10) || 0;
        }

        function matchDuration(days, val) {
            if (!val) return true;
            if (days <= 0) return true;
            if (val === '1-3')  return days >= 1 && days <= 3;
            if (val === '4-6')  return days >= 4 && days <= 6;
            if (val === '7-10') return days >= 7 && days <= 10;
            if (val === '10+')  return days > 10;
            return true;
        }

        function matchPrice(price, val) {
            if (!val) return true;
            if (price <= 0) return true;
            if (val.indexOf('-') !== -1) {
                var p = val.split('-');
                return price >= parseFloat(p[0]) && price <= parseFloat(p[1]);
            }
            if (val.slice(-1) === '+') return price >= parseFloat(val.slice(0, -1));
            return true;
        }

        function matchGroup(card, val) {
            if (!val) return true;
            var spans = card.querySelectorAll('.ktv-pax-item span');
            var text = '';
            spans.forEach(function (s) { text += ' ' + s.textContent.toLowerCase(); });
            var m = text.match(/(\d+)/);
            var size = m ? parseInt(m[1], 10) : 0;
            if (size === 0) return true;
            if (val === '1-2')  return size >= 1 && size <= 2;
            if (val === '3-5')  return size >= 3 && size <= 5;
            if (val === '6-10') return size >= 6 && size <= 10;
            if (val === '10+')  return size > 10;
            return true;
        }

        function matchActivity(icons, val) {
            if (!val) return true;
            if (val === 'trekking')     return icons.indexOf('trekking') !== -1 || icons.indexOf('hiking') !== -1;
            if (val === 'hiking')       return icons.indexOf('hiking') !== -1;
            if (val === 'horse_riding') return icons.indexOf('horse') !== -1 || icons.indexOf('riding') !== -1;
            if (val === 'boat')         return icons.indexOf('boat') !== -1 || icons.indexOf('ship') !== -1;
            if (val === 'sightseeing')  return icons.indexOf('sightseeing') !== -1 || icons.indexOf('eye') !== -1;
            if (val === 'transport')    return icons.indexOf('transport') !== -1 || icons.indexOf('car') !== -1;
            if (val === 'flights')      return icons.indexOf('plane') !== -1 || icons.indexOf('flight') !== -1;
            return true;
        }

        function updateActiveBadge(n) {
            if (!activeBadge || !activeBadgeN) return;
            activeBadgeN.textContent = n;
            activeBadge.hidden = n === 0;
        }

        function applyFilters() {
            var cards = Array.prototype.slice.call(
                document.querySelectorAll('.ktv-tour-card[data-tour-id], .ktv-tour-package-card[data-tour-id]')
            );

            var duration   = durationSel   ? durationSel.value   : '';
            var price      = priceSel      ? priceSel.value      : '';
            var sortKey    = sortSel       ? sortSel.value       : '';
            var rating     = parseFloat(ratingSel ? ratingSel.value : 0) || 0;
            var activity   = activitiesSel ? activitiesSel.value : '';
            var group      = groupSel      ? groupSel.value      : '';
            var hotels     = hotelsSel     ? hotelsSel.value.toLowerCase() : '';
            var boat       = boatSel       ? boatSel.value.toLowerCase()   : '';
            var meals      = mealsSel      ? mealsSel.value.toLowerCase()  : '';
            var flight     = flightSel     ? flightSel.value     : '';
            var visible    = 0;
            var activeCount = 0;

            if (duration) activeCount++;
            if (price)    activeCount++;
            if (rating > 0) activeCount++;
            if (activity) activeCount++;
            if (group)    activeCount++;
            if (hotels)   activeCount++;
            if (boat)     activeCount++;
            if (meals)    activeCount++;
            if (flight)   activeCount++;
            if (quick)    activeCount++;

            cards.forEach(function (card) {
                var days   = cardDays(card);
                var rate   = cardRating(card);
                var icons  = cardIcons(card);
                var cprice = cardPrice(card);
                var ok     = true;

                if (!matchDuration(days, duration)) ok = false;
                if (ok && !matchPrice(cprice, price)) ok = false;
                if (ok && rating > 0 && rate < rating) ok = false;
                if (ok && !matchActivity(icons, activity)) ok = false;
                if (ok && !matchGroup(card, group)) ok = false;
                if (ok && hotels && icons.indexOf(hotels) === -1) ok = false;
                if (ok && boat   && icons.indexOf(boat)   === -1) ok = false;
                if (ok && meals  && icons.indexOf(meals)  === -1) ok = false;
                if (ok && flight === 'yes' && icons.indexOf('plane') === -1 && icons.indexOf('flight') === -1) ok = false;
                if (ok && flight === 'no'  && (icons.indexOf('plane') !== -1 || icons.indexOf('flight') !== -1)) ok = false;

                if (ok && quick === '5days')   ok = days >= 5;
                if (ok && quick === 'flights') ok = icons.indexOf('plane') !== -1 || icons.indexOf('flight') !== -1;
                if (ok && quick === 'popular') ok = rate >= 4;

                if (ok) {
                    card.style.display = '';
                    card.style.removeProperty('display');
                    card.classList.remove('ktv-hidden');
                    visible++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('ktv-hidden');
                }
            });

            if (sortKey) {
                var uniqueParents = [];
                cards.forEach(function (c) {
                    if (c.parentNode && uniqueParents.indexOf(c.parentNode) === -1) {
                        uniqueParents.push(c.parentNode);
                    }
                });
                uniqueParents.forEach(function (parent) {
                    var inParent = cards.filter(function (c) { return c.parentNode === parent; });
                    inParent.sort(function (a, b) {
                        if (sortKey === 'price_low')  return cardPrice(a) - cardPrice(b);
                        if (sortKey === 'price_high') return cardPrice(b) - cardPrice(a);
                        if (sortKey === 'rating')     return cardRating(b) - cardRating(a);
                        if (sortKey === 'reviews')    return cardReviews(b) - cardReviews(a);
                        if (sortKey === 'duration')   return cardDays(a) - cardDays(b);
                        if (sortKey === 'newest')     return cardId(b) - cardId(a);
                        return 0;
                    });
                                        var frag = document.createDocumentFragment();
                  inParent.forEach(function (c) { frag.appendChild(c); });
                    parent.appendChild(frag);
                });
            }

            if (countEl) countEl.textContent = visible;
            if (resetBtn) resetBtn.hidden = activeCount === 0;
            updateActiveBadge(activeCount);
        }

            [durationSel, priceSel, sortSel, ratingSel, activitiesSel, groupSel, hotelsSel, boatSel, mealsSel, flightSel].forEach(function (el) {
            if (el && !el.dataset.ktvBound) {
                el.dataset.ktvBound = '1';
                el.addEventListener('change', applyFilters);
            }
        });

        filter.querySelectorAll('.ktv-quick-chip').forEach(function (chip) {
            if (chip.dataset.ktvBound) return;
            chip.dataset.ktvBound = '1';
            chip.addEventListener('click', function () {
                var key = this.getAttribute('data-quick');
                quick = (quick === key) ? '' : key;
                filter.querySelectorAll('.ktv-quick-chip').forEach(function (c) {
                    c.classList.toggle('active', c.getAttribute('data-quick') === quick);
                });
                applyFilters();
            });
        });

        if (resetBtn && !resetBtn.dataset.ktvBound) {
            resetBtn.dataset.ktvBound = '1';
            resetBtn.addEventListener('click', function () {
                quick = '';
                filter.querySelectorAll('select').forEach(function (s) { s.selectedIndex = 0; });
                filter.querySelectorAll('.ktv-quick-chip').forEach(function (c) { c.classList.remove('active'); });
                applyFilters();
            });
        }

        var initialCards = document.querySelectorAll('.ktv-tour-card[data-tour-id], .ktv-tour-package-card[data-tour-id]');
        if (countEl) countEl.textContent = initialCards.length;
        if (resetBtn) resetBtn.hidden = true;
        updateActiveBadge(0);

    }

    window.ktvInitTourFilter = initTourFilter;
    ready(function () { initTourFilter(); });

    (function versionGuard() {
        var expected = '14.0.0';
        if (typeof ktv_travel !== 'undefined' && ktv_travel.version && ktv_travel.version !== expected) {
            if (KTV_DEBUG) console.warn('KTV Travel JS: version mismatch. JS expects ' + expected + ' but PHP localizes ' + ktv_travel.version + '. Please re-save theme files.');
        }
    })();

})();
/* ============================================================
   END OF FILE — assets/js/ktv-travel.js v14.0.0
   ============================================================ */
