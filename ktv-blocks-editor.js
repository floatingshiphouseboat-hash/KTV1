/**
 * Kashmir Travelling Voyage Theme - Blocks Editor JS
 * @package Kashmir-Travelling-Voyage
 * Version: 14.0.0
 * Compatible: WordPress 6.0+ / Future Versions
 */

(function () {
    'use strict';

    function waitForWP(callback, attempts) {
        attempts = attempts || 0;
        if (
            typeof wp !== 'undefined' &&
            wp.blocks && wp.blockEditor && wp.components && wp.element && wp.data
        ) {
            try {
                callback();
            } catch (err) {
                if (window.console && console.error) {
                    console.error('KTV Blocks: init callback failed —', err);
                }
            }
        } else if (attempts < 100) {
            setTimeout(function () { waitForWP(callback, attempts + 1); }, 150);
        } else {
            if (window.console && console.error) {
                console.error('KTV Blocks: WordPress editor APIs not available');
            }
        }
    }

    waitForWP(function () {
        var el = wp.element.createElement;
        var Fragment = wp.element.Fragment;
        var useBlockProps = wp.blockEditor.useBlockProps;
        var InspectorControls = wp.blockEditor.InspectorControls;
        var MediaUpload = wp.blockEditor.MediaUpload;
        var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
        var Button = wp.components.Button;
        var TextControl = wp.components.TextControl;
        var TextareaControl = wp.components.TextareaControl;
        var SelectControl = wp.components.SelectControl;
        var ToggleControl = wp.components.ToggleControl;
        var PanelBody = wp.components.PanelBody;
        var RangeControl = wp.components.RangeControl;
        var ColorPalette = wp.components.ColorPalette;

        /* ============================================================
           1. STATIC OPTION LISTS
           ============================================================ */

        var fontSizes = [
            { label: '10px', value: '10px' }, { label: '11px', value: '11px' },
            { label: '12px', value: '12px' }, { label: '13px', value: '13px' },
            { label: '14px', value: '14px' }, { label: '15px', value: '15px' },
            { label: '16px', value: '16px' }, { label: '18px', value: '18px' },
            { label: '20px', value: '20px' }, { label: '22px', value: '22px' },
            { label: '24px', value: '24px' }, { label: '28px', value: '28px' },
            { label: '32px', value: '32px' }, { label: '36px', value: '36px' },
            { label: '42px', value: '42px' }, { label: '48px', value: '48px' },
            { label: '56px', value: '56px' }, { label: '64px', value: '64px' }
        ];

        var iconSizes = [
            { label: '10px', value: '10px' }, { label: '12px', value: '12px' },
            { label: '14px', value: '14px' }, { label: '16px', value: '16px' },
            { label: '18px', value: '18px' }, { label: '20px', value: '20px' },
            { label: '22px', value: '22px' }, { label: '24px', value: '24px' },
            { label: '28px', value: '28px' }, { label: '32px', value: '32px' },
            { label: '36px', value: '36px' }, { label: '42px', value: '42px' },
            { label: '48px', value: '48px' }
        ];

        var headingTypes = [
            { label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' }, { label: 'H4', value: 'h4' },
            { label: 'H5', value: 'h5' }, { label: 'H6', value: 'h6' },
            { label: 'Paragraph', value: 'p' }
        ];

        var sectionHeadingTypes = [
            { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' }, { label: 'H5', value: 'h5' },
            { label: 'H6', value: 'h6' }
        ];

        var fontWeightOptions = [
            { label: 'Normal (400)', value: '400' },
            { label: 'Medium (500)', value: '500' },
            { label: 'Semi Bold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },
            { label: 'Extra Bold (800)', value: '800' },
            { label: 'Black (900)', value: '900' }
        ];

        var fontFamilyOptions = [
            { label: 'Inherit', value: 'inherit' },
            { label: 'Tahoma', value: 'Tahoma, sans-serif' },
            { label: 'Arial', value: 'Arial, sans-serif' },
            { label: 'Helvetica', value: 'Helvetica, sans-serif' },
            { label: 'Segoe UI', value: '"Segoe UI", sans-serif' },
            { label: 'Georgia', value: 'Georgia, serif' },
            { label: 'Times New Roman', value: '"Times New Roman", serif' },
            { label: 'Courier New', value: '"Courier New", monospace' },
            { label: 'Verdana', value: 'Verdana, sans-serif' }
        ];

        var colorOptions = [
            { label: 'Default Green', value: '#075e54' },
            { label: 'Primary Green', value: '#28a745' },
            { label: 'Orange', value: '#ff5722' },
            { label: 'Red', value: '#dc3545' },
            { label: 'Blue', value: '#0073aa' },
            { label: 'Purple', value: '#9c27b0' },
            { label: 'Black', value: '#333333' },
            { label: 'White', value: '#ffffff' },
            { label: 'Gold', value: '#FFD700' },
            { label: 'Pink', value: '#e91e63' },
            { label: 'Teal', value: '#009688' },
            { label: 'Navy', value: '#1a1a2e' },
            { label: 'Grey', value: '#666666' },
            { label: 'Yellow', value: '#ffc107' }
        ];

        var iconOptions = [
            { label: 'Star', value: 'fa-star' },
            { label: 'Star Half', value: 'fa-star-half-alt' },
            { label: 'Tag', value: 'fa-tag' },
            { label: 'Crown', value: 'fa-crown' },
            { label: 'Heart', value: 'fa-heart' },
            { label: 'Mountain', value: 'fa-mountain' },
            { label: 'Calendar Check', value: 'fa-calendar-check' },
            { label: 'Calendar', value: 'fa-calendar-alt' },
            { label: 'Calendar Day', value: 'fa-calendar-day' },
            { label: 'Plane', value: 'fa-plane' },
            { label: 'Hotel', value: 'fa-hotel' },
            { label: 'Car', value: 'fa-car' },
            { label: 'Utensils', value: 'fa-utensils' },
            { label: 'Phone', value: 'fa-phone-alt' },
            { label: 'Envelope', value: 'fa-envelope' },
            { label: 'Envelope Open', value: 'fa-envelope-open-text' },
            { label: 'User', value: 'fa-user' },
            { label: 'User Friends', value: 'fa-user-friends' },
            { label: 'Users', value: 'fa-users' },
            { label: 'User Plus', value: 'fa-user-plus' },
            { label: 'User Circle', value: 'fa-user-circle' },
            { label: 'Child', value: 'fa-child' },
            { label: 'Home', value: 'fa-home' },
            { label: 'Info', value: 'fa-info-circle' },
            { label: 'Check', value: 'fa-check-circle' },
            { label: 'Times', value: 'fa-times-circle' },
            { label: 'Paper Plane', value: 'fa-paper-plane' },
            { label: 'Arrow Right', value: 'fa-arrow-right' },
            { label: 'Arrow Left', value: 'fa-arrow-left' },
            { label: 'Map Marker', value: 'fa-map-marker-alt' },
            { label: 'Map Pin', value: 'fa-map-pin' },
            { label: 'Map', value: 'fa-map' },
            { label: 'Map Marked', value: 'fa-map-marked-alt' },
            { label: 'Moon', value: 'fa-moon' },
            { label: 'Sun', value: 'fa-sun' },
            { label: 'Cloud Moon', value: 'fa-cloud-moon' },
            { label: 'Cloud Sun', value: 'fa-cloud-sun' },
            { label: 'Bed', value: 'fa-bed' },
            { label: 'Eye', value: 'fa-eye' },
            { label: 'Ticket', value: 'fa-ticket-alt' },
            { label: 'Credit Card', value: 'fa-credit-card' },
            { label: 'Mobile', value: 'fa-mobile-alt' },
            { label: 'Bank', value: 'fa-university' },
            { label: 'Lock', value: 'fa-lock' },
            { label: 'Key', value: 'fa-key' },
            { label: 'Upload', value: 'fa-upload' },
            { label: 'List', value: 'fa-list' },
            { label: 'File', value: 'fa-file-alt' },
            { label: 'File PDF', value: 'fa-file-pdf' },
            { label: 'File Word', value: 'fa-file-word' },
            { label: 'File Code', value: 'fa-file-code' },
            { label: 'Download', value: 'fa-download' },
            { label: 'External Link', value: 'fa-external-link-alt' },
            { label: 'Print', value: 'fa-print' },
            { label: 'Image', value: 'fa-image' },
            { label: 'Comment', value: 'fa-comment' },
            { label: 'Comment Dots', value: 'fa-comment-dots' },
            { label: 'Heading', value: 'fa-heading' },
            { label: 'Globe', value: 'fa-globe' },
            { label: 'Clock', value: 'fa-clock' },
            { label: 'Shield', value: 'fa-shield-alt' },
            { label: 'Gift', value: 'fa-gift' },
            { label: 'Camera', value: 'fa-camera' },
            { label: 'Flag', value: 'fa-flag' },
            { label: 'Flag Checkered', value: 'fa-flag-checkered' },
            { label: 'Hiking', value: 'fa-hiking' },
            { label: 'Ship', value: 'fa-ship' },
            { label: 'Snowflake', value: 'fa-snowflake' },
            { label: 'Skiing', value: 'fa-skiing' },
            { label: 'Share', value: 'fa-share-alt' },
            { label: 'Landmark', value: 'fa-landmark' },
            { label: 'Shoe Prints', value: 'fa-shoe-prints' },
            { label: 'Leaf', value: 'fa-leaf' },
            { label: 'Tree', value: 'fa-tree' },
            { label: 'Water', value: 'fa-water' },
            { label: 'Umbrella Beach', value: 'fa-umbrella-beach' },
            { label: 'Campground', value: 'fa-campground' },
            { label: 'Fire', value: 'fa-fire' },
            { label: 'Coffee', value: 'fa-coffee' },
            { label: 'Wine Glass', value: 'fa-wine-glass-alt' },
            { label: 'Horse', value: 'fa-horse' },
            { label: 'Cable Car', value: 'fa-cable-car' },
            { label: 'Passport', value: 'fa-passport' },
            { label: 'ID Card', value: 'fa-id-card' },
            { label: 'Suitcase', value: 'fa-suitcase-rolling' },
            { label: 'Receipt', value: 'fa-receipt' },
            { label: 'City', value: 'fa-city' },
            { label: 'Table', value: 'fa-table' },
            { label: 'Google Pay', value: 'fa-google-pay' },
            { label: 'Thumbs Up', value: 'fa-thumbs-up' },
            { label: 'Search', value: 'fa-search' },
            { label: 'Filter', value: 'fa-filter' },
            { label: 'Sort', value: 'fa-sort-amount-down' }
        ];

        var paxIconOptions = [
            { label: 'User (Single)', value: 'fa-user' },
            { label: 'User Friends (Couple)', value: 'fa-user-friends' },
            { label: 'Users (Group)', value: 'fa-users' },
            { label: 'User Plus (Extra)', value: 'fa-user-plus' },
            { label: 'Home (Family)', value: 'fa-home' },
            { label: 'Hotel', value: 'fa-hotel' },
            { label: 'Bed', value: 'fa-bed' },
            { label: 'Crown (VIP)', value: 'fa-crown' }
        ];

        var nightDayIconOptions = [
            { label: 'Moon (Night)', value: 'fa-moon' },
            { label: 'Star (Night)', value: 'fa-star' },
            { label: 'Cloud Moon', value: 'fa-cloud-moon' },
            { label: 'Sun (Day)', value: 'fa-sun' },
            { label: 'Cloud Sun', value: 'fa-cloud-sun' }
        ];

        var sortOptions = [
            { label: 'Featured', value: 'featured' },
            { label: 'Price: Low to High', value: 'price_low' },
            { label: 'Price: High to Low', value: 'price_high' },
            { label: 'Name: A to Z', value: 'name_asc' },
            { label: 'Name: Z to A', value: 'name_desc' },
            { label: 'Newest', value: 'newest' },
            { label: 'Highest Rated', value: 'rating' }
        ];

        var sortFilterStyleOptions = [
            { label: 'Classic (Select Dropdowns)', value: 'classic' },
            { label: 'Next-Gen (Dynamic Chips + Select)', value: 'nextgen' }
        ];

        var carouselWidthOptions = [
            { label: 'Full Width', value: 'full' },
            { label: 'Wide (1200px)', value: 'wide' },
            { label: 'Narrow (800px)', value: 'boxed' }
        ];

        var carouselEffectOptions = [
            { label: '⬅️ Slide (default)', value: 'slide' },
            { label: '🌫️ Fade', value: 'fade' },
            { label: '🔍 Zoom', value: 'zoom' },
            { label: '🎲 Cube (3D rotate)', value: 'cube' },
            { label: '🔄 Flip', value: 'flip' },
            { label: '📚 Coverflow', value: 'coverflow' },
            { label: '🌊 Parallax', value: 'parallax' },
            { label: '🌀 Rotate3D', value: 'rotate3d' },
            { label: '💨 Blur', value: 'blur' }
        ];

        var buttonSizeOptions = [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xlarge' }
        ];

        var tabStyleOptions = [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' }
        ];

        var borderWidthOptions = [
            { label: 'None (0px)', value: '0px' },
            { label: 'Thin (1px)', value: '1px' },
            { label: 'Medium (2px)', value: '2px' },
            { label: 'Thick (3px)', value: '3px' },
            { label: 'Extra Thick (4px)', value: '4px' }
        ];

        var borderRadiusOptions = [
            { label: 'None (0px)', value: '0px' },
            { label: 'Small (4px)', value: '4px' },
            { label: 'Medium (8px)', value: '8px' },
            { label: 'Large (12px)', value: '12px' },
            { label: 'Extra Large (16px)', value: '16px' },
            { label: 'Round (20px)', value: '20px' },
            { label: 'Circle (24px)', value: '24px' },
            { label: 'Pill (30px)', value: '30px' },
            { label: 'Full Round (50px)', value: '50px' }
        ];

        var formWidthOptions = [
            { label: 'Full Width', value: 'full' },
            { label: 'Wide (900px)', value: 'wide' },
            { label: 'Compact (600px)', value: 'compact' }
        ];

        var lastBookingCountryOptions = [
            { label: 'India', value: 'India' },
            { label: 'USA', value: 'USA' },
            { label: 'United Kingdom', value: 'United Kingdom' },
            { label: 'Canada', value: 'Canada' },
            { label: 'Australia', value: 'Australia' },
            { label: 'UAE', value: 'UAE' },
            { label: 'Germany', value: 'Germany' },
            { label: 'France', value: 'France' },
            { label: 'Italy', value: 'Italy' },
            { label: 'Spain', value: 'Spain' },
            { label: 'Japan', value: 'Japan' },
            { label: 'China', value: 'China' },
            { label: 'Pakistan', value: 'Pakistan' },
            { label: 'Nepal', value: 'Nepal' },
            { label: 'Bangladesh', value: 'Bangladesh' }
        ];

        var gstOptions = [
            { label: '0%', value: '0' },
            { label: '5%', value: '5' },
            { label: '12%', value: '12' },
            { label: '18%', value: '18' },
            { label: '28%', value: '28' }
        ];

        var reviewSortOptions = [
            { label: 'Newest First', value: 'newest' },
            { label: 'Highest Rated', value: 'highest' },
            { label: 'Lowest Rated', value: 'lowest' },
            { label: 'Most Helpful', value: 'most_helpful' }
        ];

        var languageOptions = [
            { label: 'All Languages', value: '' },
            { label: 'English', value: 'en' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Urdu', value: 'ur' },
            { label: 'Arabic', value: 'ar' },
            { label: 'French', value: 'fr' },
            { label: 'Spanish', value: 'es' },
            { label: 'German', value: 'de' }
        ];

        var cancellationPolicyOptions = [
            { label: 'Fully Refundable', value: 'fully_refundable' },
            { label: 'Partial Refundable', value: 'partial_refundable' },
            { label: 'Non-Refundable', value: 'non_refundable' }
        ];

        var imageDisplaySizeOptions = [
            { label: 'Thumbnail', value: 'thumbnail' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Full Size', value: 'full' }
        ];

        var badgePositionOptions = [
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Right', value: 'bottom-right' }
        ];

        var badgeStyleOptions = [
            { label: 'Pill (Rounded)', value: 'pill' },
            { label: 'Square', value: 'square' },
            { label: 'Oval', value: 'oval' },
            { label: 'Round (Circle)', value: 'round' },
            { label: 'Plain (No Shape)', value: 'plain' }
        ];

        var bookNowPositionOptions = [
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom Center (default)', value: 'bottom-center' }
        ];

        var nightsDaysPositionOptions = [
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Right', value: 'bottom-right' }
        ];

        var wishlistPositionOptions = [
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Right', value: 'bottom-right' }
        ];

        var modalWidthOptions = [
            { label: 'Narrow (450px)', value: 'small' },
            { label: 'Normal (550px)', value: 'medium' },
            { label: 'Wide (700px)', value: 'large' }
        ];

        var modalAnimationOptions = [
            { label: 'Slide Down', value: 'slide-down' },
            { label: 'Fade In', value: 'fade' },
            { label: 'Zoom In', value: 'zoom' }
        ];

        var iconPositionOptions = [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
        ];

        var tourIconsShapeOptions = [
            { label: 'Plain (no shape)', value: 'plain' },
            { label: 'Pill', value: 'pill' },
            { label: 'Square', value: 'square' },
            { label: 'Oval', value: 'oval' },
            { label: 'Round', value: 'round' }
        ];

        var paxColumnOptions = [
            { key: 'pax1',   label: '1 Pax',  icon: 'fa-user' },
            { key: 'pax2',   label: '2 Pax',  icon: 'fa-user-friends' },
            { key: 'pax3',   label: '3 Pax',  icon: 'fa-users' },
            { key: 'group',  label: 'Group',  icon: 'fa-users' },
            { key: 'family', label: 'Family', icon: 'fa-users' }
        ];

        var currencySymbolMap = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹',
            'AUD': 'A$', 'CAD': 'C$', 'JPY': '¥', 'AED': 'د.إ',
            'SAR': '﷼', 'SGD': 'S$', 'MYR': 'RM',
            'IRR': '﷼', 'IQD': 'ع.د', 'KWD': 'د.ك', 'QAR': 'ر.ق',
            'OMR': 'ر.ع.', 'BHD': '.د.ب', 'TRY': '₺', 'RUB': '₽',
            'BRL': 'R$', 'MXN': '$', 'ZAR': 'R', 'NZD': 'NZ$',
            'CHF': 'Fr', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr',
            'PLN': 'zł', 'THB': '฿', 'IDR': 'Rp', 'PHP': '₱',
            'VND': '₫', 'KRW': '₩', 'ILS': '₪', 'EGP': 'E£',
            'MAD': 'د.م.', 'NGN': '₦', 'KES': 'KSh', 'ARS': 'AR$',
            'ALL': 'L', 'AFN': '؋', 'DZD': 'دج', 'BTN': 'Nu.',
            'COP': '$', 'PEN': 'S/', 'CLP': '$', 'RON': 'lei',
            'HUF': 'Ft', 'CZK': 'Kč', 'PKR': '₨', 'BDT': '৳',
            'NPR': '₨', 'LKR': '₨', 'CNY': '¥'
        };

        /* ============================================================
           2. HELPERS
           ============================================================ */

        function getDynamicTours() {
            var allTours = [];
            var seenNames = [];

            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.dynamic_tours) {
                ktv_editor_data.dynamic_tours.forEach(function (tour) {
                    if (!tour.tour_name) return;
                    if (tour.is_hardcoded == 1) return;
                    if (tour.is_ghost == 1) return;
                    var lowerName = tour.tour_name.toLowerCase();
                    if (seenNames.indexOf(lowerName) !== -1) return;
                    seenNames.push(lowerName);

                    var nightsVal = (tour.nights !== undefined && tour.nights !== null && tour.nights !== '')
                        ? parseInt(tour.nights)
                        : (tour.durationNights !== undefined ? parseInt(tour.durationNights) : 0);
                    var daysVal = (tour.days !== undefined && tour.days !== null && tour.days !== '')
                        ? parseInt(tour.days)
                        : (tour.durationDays !== undefined ? parseInt(tour.durationDays) : 0);

                    var imageIdNormalized = tour.image_id || tour.tour_image_id || tour.imageId || 0;

                    var visiblePaxNormalized = 'pax1';
                    if (tour.visible_pax_columns) {
                        visiblePaxNormalized = tour.visible_pax_columns;
                    } else if (tour.visiblePaxColumns) {
                        if (Array.isArray(tour.visiblePaxColumns)) {
                            visiblePaxNormalized = tour.visiblePaxColumns.join(',');
                        } else if (typeof tour.visiblePaxColumns === 'string') {
                            visiblePaxNormalized = tour.visiblePaxColumns;
                        }
                    }

                    var originalPrice = parseFloat(tour.original_price) || parseFloat(tour.tour_price) || 0;
                    var offerPriceRaw = parseFloat(tour.offer_price) || parseFloat(tour.tour_offer_price) || 0;

                    var showPerDayVal = tour.show_per_day_price;
                    if (showPerDayVal === undefined && tour.showPerDayPrice !== undefined) {
                        showPerDayVal = tour.showPerDayPrice;
                    }
                    if (showPerDayVal === undefined) showPerDayVal = 1;
                    showPerDayVal = parseInt(showPerDayVal) === 1 ? 1 : 0;

                    var showCompleteVal = tour.show_complete_price;
                    if (showCompleteVal === undefined && tour.showCompletePrice !== undefined) {
                        showCompleteVal = tour.showCompletePrice;
                    }
                    if (showCompleteVal === undefined) showCompleteVal = 0;
                    showCompleteVal = parseInt(showCompleteVal) === 1 ? 1 : 0;

                    var defaultAdultsVal = tour.tour_default_adults !== undefined ? parseInt(tour.tour_default_adults) : (tour.defaultAdults !== undefined ? parseInt(tour.defaultAdults) : 2);
                    if (isNaN(defaultAdultsVal) || defaultAdultsVal < 1) defaultAdultsVal = 2;

                    var defaultChildrenVal = tour.tour_default_children !== undefined ? parseInt(tour.tour_default_children) : (tour.defaultChildren !== undefined ? parseInt(tour.defaultChildren) : 0);
                    if (isNaN(defaultChildrenVal) || defaultChildrenVal < 0) defaultChildrenVal = 0;

                    allTours.push({
                        id: tour.id || 0,
                        tour_name: tour.tour_name,
                        tour_price: originalPrice,
                        original_price: originalPrice,
                        tour_offer_price: offerPriceRaw,
                        offer_price: offerPriceRaw,
                        location: tour.location || '',
                        tour_location: tour.location || '',
                        nights: nightsVal,
                        days: daysVal,
                        tour_duration_nights: nightsVal,
                        tour_duration_days: daysVal,
                        durationNights: nightsVal,
                        durationDays: daysVal,
                        block_type: tour.block_type || 'grid',
                        tour_block_type: tour.block_type || 'grid',
                        badge_text: tour.badge_text || '',
                        badge_color: tour.badge_color || '#ff5722',
                        badge_icon: tour.badge_icon || 'fa-star',
                        badge_position: tour.badge_position || 'top-left',
                        deal_badge_color: tour.deal_badge_color || '#ff5722',
                        deal_badge_text_color: tour.deal_badge_text_color || '#ffffff',
                        deal_badge_position: tour.deal_badge_position || 'bottom-right',
                        pax_1_price: parseFloat(tour.pax_1_price) || 0,
                        pax_2_price: parseFloat(tour.pax_2_price) || 0,
                        pax_3_price: parseFloat(tour.pax_3_price) || 0,
                        group_price: parseFloat(tour.group_price) || 0,
                        family_price: parseFloat(tour.family_price) || 0,
                        extra_adult_price: parseFloat(tour.extra_adult_price) || 0,
                        extra_child_price: parseFloat(tour.extra_child_price) || 0,
                        pax_1_label: tour.pax_1_label || '1 Pax',
                        pax_2_label: tour.pax_2_label || '2 Pax',
                        pax_3_label: tour.pax_3_label || '3 Pax',
                        group_label: tour.group_label || 'Group',
                        family_label: tour.family_label || 'Family',
                        pax_1_icon: tour.pax_1_icon || 'fa-user',
                        pax_2_icon: tour.pax_2_icon || 'fa-user-friends',
                        pax_3_icon: tour.pax_3_icon || 'fa-users',
                        group_icon: tour.group_icon || 'fa-users',
                        family_icon: tour.family_icon || 'fa-users',
                        group_max_persons: parseInt(tour.group_max_persons) || 0,
                        family_max_persons: parseInt(tour.family_max_persons) || 0,
                        visible_pax_columns: visiblePaxNormalized,
                        tour_rating: parseFloat(tour.tour_rating) || 0,
                        rating: parseFloat(tour.tour_rating) || 0,
                        total_reviews: tour.total_reviews || 0,
                        icon_title: tour.icon_title || 'fa-map-marker-alt',
                        icon_prefix: tour.icon_prefix || '📍',
                        tour_brief_text: tour.tour_brief_text || '',
                        tour_after_title_text: tour.tour_after_title_text || '',
                        tour_image_id: imageIdNormalized,
                        image_id: imageIdNormalized,
                        imageId: imageIdNormalized,
                        image_link_url: tour.image_link || tour.image_link_url || '',
                        image_display_size: tour.image_display_size || 'medium',
                        tour_gallery: tour.tour_gallery || '',
                        gallery_auto_slide: !!tour.gallery_auto_slide,
                        gallery_slide_interval: parseInt(tour.gallery_slide_interval) || 3000,
                        gst_percent: tour.gst_percent || '5',
                        gst_label: tour.gst_label || 'GST',
                        cancellation_policy: tour.cancellation_policy || 'non_refundable',
                        cancellation_text: tour.cancellation_text || '',
                        button_text: tour.button_text || 'Book Now',
                        button_url: tour.button_url || '#',
                        button_color: tour.button_color || '#ff5722',
                        button_text_color: tour.button_text_color || '#ffffff',
                        title_color: tour.title_color || '#333333',
                        title_font_size: tour.title_font_size || '18px',
                        price_color: tour.price_color || '#28a745',
                        price_font_size: tour.price_font_size || '24px',
                        heading_type: tour.heading_type || 'h4',
                        icon_color: tour.icon_color || '#075e54',
                        icon_size: tour.icon_size || '14px',
                        icon_title_size: tour.icon_title_size || '20px',
                        icon_title_color: tour.icon_title_color || '#075e54',
                        enable_icon_dropdown: tour.enable_icon_dropdown !== undefined ? parseInt(tour.enable_icon_dropdown) : 1,
                        enable_dark_mode: tour.enable_dark_mode !== undefined ? parseInt(tour.enable_dark_mode) : 0,
                        location_icon: tour.location_icon || 'fa-map-marker-alt',
                        location_icon_size: tour.location_icon_size || '12px',
                        location_icon_color: tour.location_icon_color || '#075e54',
                        location_text_size: tour.location_text_size || '13px',
                        location_text_color: tour.location_text_color || '#666666',
                        review_star_color: tour.review_star_color || '#FFD700',
                        review_star_size: tour.review_star_size || '14px',
                        night_icon: tour.night_icon || 'fa-moon',
                        night_icon_size: tour.night_icon_size || '14px',
                        night_icon_color: tour.night_icon_color || '#FFD700',
                        day_icon: tour.day_icon || 'fa-sun',
                        day_icon_size: tour.day_icon_size || '14px',
                        day_icon_color: tour.day_icon_color || '#FFA500',
                        show_night_day_icons: tour.show_night_day_icons !== undefined ? !!tour.show_night_day_icons : true,
                        show_wishlist: tour.show_wishlist !== undefined ? !!tour.show_wishlist : true,
                        show_reviews: tour.show_reviews !== undefined ? !!tour.show_reviews : true,
                        show_badge: tour.show_badge !== undefined ? !!tour.show_badge : true,
                        show_icons: tour.show_icons !== undefined ? !!tour.show_icons : true,
                        show_pax: tour.show_pax !== undefined ? !!tour.show_pax : true,
                        show_icon_enabled: tour.show_icon_enabled !== undefined ? !!tour.show_icon_enabled : true,
                        show_per_day_price: showPerDayVal,
                        show_complete_price: showCompleteVal,
                        tour_default_adults: defaultAdultsVal,
                        tour_default_children: defaultChildrenVal,
                        wishlist_count: tour.wishlist_count || 0,
                        last_booking_name: tour.last_booking_name || '',
                        last_booking_country: tour.last_booking_country || 'India',
                        last_booking_time: tour.last_booking_time || '',
                        last_booking_count: tour.last_booking_count || 0,
                        promo_code: tour.promo_code || '',
                        promo_discount: tour.promo_discount || 0,
                        promo_code_valid_until: tour.promo_code_valid_until || '',
                        hotels_icon: tour.hotels_icon || 'fa-hotel',
                        hotels_label: tour.hotels_label || 'Hotels',
                        meals_icon: tour.meals_icon || 'fa-utensils',
                        meals_label: tour.meals_label || 'Meals',
                        transport_icon: tour.transport_icon || 'fa-car',
                        transport_label: tour.transport_label || 'Transport',
                        sightseeing_icon: tour.sightseeing_icon || 'fa-eye',
                        sightseeing_label: tour.sightseeing_label || 'Sightseeing',
                        flight_icon: tour.flight_icon || 'fa-plane',
                        flight_label: tour.flight_label || 'Flight',
                        boat_icon: tour.boat_icon || 'fa-ship',
                        boat_label: tour.boat_label || 'Boat',
                        horse_riding_icon: tour.horse_riding_icon || 'fa-horse',
                        horse_riding_label: tour.horse_riding_label || 'Horse Riding',
                        trekking_icon: tour.trekking_icon || 'fa-hiking',
                        trekking_label: tour.trekking_label || 'Trekking',
                        hiking_icon: tour.hiking_icon || 'fa-mountain',
                        hiking_label: tour.hiking_label || 'Hiking',
                        is_hardcoded: tour.is_hardcoded || 0
                    });
                });
            }

            return allTours;
        }

        function getTourById(tourId) {
            var tours = getDynamicTours();
            for (var i = 0; i < tours.length; i++) {
                if (tours[i].id == tourId && tours[i].is_hardcoded != 1) {
                    return tours[i];
                }
            }
            return null;
        }

        function getImageUrl(imageId, size) {
            try {
                if (imageId && wp.data.select('core') && wp.data.select('core').getMedia) {
                    var media = wp.data.select('core').getMedia(imageId);
                    if (media) {
                        var sizes = media.media_details && media.media_details.sizes;
                        if (sizes && sizes[size]) {
                            return sizes[size].source_url || media.source_url;
                        }
                        return media.source_url || '';
                    }
                }
            } catch (e) { }
            return '';
        }

        function getCurrencySymbol(currency) {
            if (currency && currencySymbolMap[currency]) {
                return currencySymbolMap[currency];
            }
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.currency_symbol) {
                return ktv_editor_data.currency_symbol;
            }
            return '$';
        }

        function normalizeVisiblePaxColumns(value) {
            var defaultKeys = 'pax1';
            if (!value) return defaultKeys;
            if (Array.isArray(value)) {
                var cleaned = value.filter(function (k) { return typeof k === 'string' && k.length > 0; });
                return cleaned.length ? cleaned.join(',') : defaultKeys;
            }
            if (typeof value === 'string') {
                return value.length ? value : defaultKeys;
            }
            return defaultKeys;
        }

        function parseVisiblePaxToArray(value) {
            var str = normalizeVisiblePaxColumns(value);
            return str.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
        }

        function normalizeWishlistCount(value) {
            var n = parseInt(value);
            if (isNaN(n) || n < 0) return 0;
            return n;
        }

        function getEditorHoneypotFieldName() {
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.honeypot_field) {
                return ktv_editor_data.honeypot_field;
            }
            return 'ktv_hp_website';
        }

        function isEditorHoneypotEnabled() {
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.honeypot_enabled !== undefined) {
                return ktv_editor_data.honeypot_enabled === true || ktv_editor_data.honeypot_enabled === '1' || ktv_editor_data.honeypot_enabled === 1;
            }
            return true;
        }

        function isEditorSpamFilterEnabled() {
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.spam_filter_enabled !== undefined) {
                return ktv_editor_data.spam_filter_enabled === true || ktv_editor_data.spam_filter_enabled === '1' || ktv_editor_data.spam_filter_enabled === 1;
            }
            return true;
        }

        function isEditorRateLimitEnabled() {
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.rate_limit_enabled !== undefined) {
                return ktv_editor_data.rate_limit_enabled === true || ktv_editor_data.rate_limit_enabled === '1' || ktv_editor_data.rate_limit_enabled === 1;
            }
            return true;
        }

        function getEditorLocations() {
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.all_locations && ktv_editor_data.all_locations.length) {
                return ktv_editor_data.all_locations;
            }
            return [];
        }

        function buildLocationOptions() {
            var locations = getEditorLocations();
            var opts = [{ label: 'All Locations', value: '' }];
            locations.forEach(function (loc) {
                if (!loc || !loc.location_name) return;
                opts.push({ label: loc.location_name, value: loc.location_name });
            });
            return opts;
        }

        function buildCustomTourFromDb(tour) {
            if (!tour || tour.is_hardcoded == 1) return null;
            var nightsVal = (tour.durationNights !== undefined && tour.durationNights !== null) ? tour.durationNights : (tour.nights || 0);
            var daysVal = (tour.durationDays !== undefined && tour.durationDays !== null) ? tour.durationDays : (tour.days || 0);
            var visiblePax = normalizeVisiblePaxColumns(tour.visible_pax_columns);

            var originalPrice = parseFloat(tour.original_price) || parseFloat(tour.tour_price) || 0;
            var offerPriceRaw = parseFloat(tour.offer_price) || parseFloat(tour.tour_offer_price) || 0;

            var showPerDayVal = tour.show_per_day_price !== undefined ? parseInt(tour.show_per_day_price) : (tour.showPerDayPrice !== undefined ? parseInt(tour.showPerDayPrice) : 1);
            showPerDayVal = showPerDayVal === 1 ? 1 : 0;
            var showCompleteVal = tour.show_complete_price !== undefined ? parseInt(tour.show_complete_price) : (tour.showCompletePrice !== undefined ? parseInt(tour.showCompletePrice) : 0);
            showCompleteVal = showCompleteVal === 1 ? 1 : 0;

            var defaultAdultsVal = tour.tour_default_adults !== undefined ? parseInt(tour.tour_default_adults) : (tour.defaultAdults !== undefined ? parseInt(tour.defaultAdults) : 2);
            if (isNaN(defaultAdultsVal) || defaultAdultsVal < 1) defaultAdultsVal = 2;
            var defaultChildrenVal = tour.tour_default_children !== undefined ? parseInt(tour.tour_default_children) : (tour.defaultChildren !== undefined ? parseInt(tour.defaultChildren) : 0);
            if (isNaN(defaultChildrenVal) || defaultChildrenVal < 0) defaultChildrenVal = 0;

            return {
                id: tour.id || 0,
                title: tour.tour_name || 'Tour',
                price: originalPrice,
                offerPrice: offerPriceRaw,
                imageId: tour.tour_image_id || 0,
                imageLink: tour.image_link_url || '',
                imageDisplaySize: tour.image_display_size || 'medium',
                location: tour.location || '',
                briefText: tour.tour_brief_text || '',
                badgeText: tour.badge_text || '',
                badgeColor: tour.badge_color || '#ff5722',
                badgePosition: tour.badge_position || 'top-left',
                rating: tour.tour_rating || 0,
                reviews: tour.total_reviews || 0,
                durationNights: nightsVal,
                durationDays: daysVal,
                afterTitleText: tour.tour_after_title_text || '',
                iconTitle: tour.icon_title || 'fa-map-marker-alt',
                lastBookingName: tour.last_booking_name || '',
                lastBookingCountry: tour.last_booking_country || 'India',
                lastBookingTime: tour.last_booking_time || '',
                lastBookingCount: tour.last_booking_count || 0,
                promoCode: tour.promo_code || '',
                promoDiscount: tour.promo_discount || 0,
                promoCodeValidUntil: tour.promo_code_valid_until || '',
                cancellationPolicy: tour.cancellation_policy || 'non_refundable',
                cancellationText: tour.cancellation_text || '',
                buttonUrl: tour.button_url || '#',
                nightIcon: tour.night_icon || 'fa-moon',
                dayIcon: tour.day_icon || 'fa-sun',
                nightIconSize: tour.night_icon_size || '14px',
                dayIconSize: tour.day_icon_size || '14px',
                nightIconColor: tour.night_icon_color || '#FFD700',
                dayIconColor: tour.day_icon_color || '#FFA500',
                showNightDayIcons: tour.show_night_day_icons !== undefined ? !!tour.show_night_day_icons : true,
                tour_block_type: tour.block_type || 'grid',
                visiblePaxColumns: visiblePax,
                wishlistCount: normalizeWishlistCount(tour.wishlist_count || 0),
                showWishlist: tour.show_wishlist !== undefined ? !!tour.show_wishlist : true,
                showPerDayPrice: showPerDayVal,
                showCompletePrice: showCompleteVal,
                defaultAdults: defaultAdultsVal,
                defaultChildren: defaultChildrenVal,
                pax1Label: tour.pax_1_label || '1 Pax',
                pax1Icon: tour.pax_1_icon || 'fa-user',
                pax1Price: tour.pax_1_price || 0,
                pax2Label: tour.pax_2_label || '2 Pax',
                pax2Icon: tour.pax_2_icon || 'fa-user-friends',
                pax2Price: tour.pax_2_price || 0,
                pax3Label: tour.pax_3_label || '3 Pax',
                pax3Icon: tour.pax_3_icon || 'fa-users',
                pax3Price: tour.pax_3_price || 0,
                groupLabel: tour.group_label || 'Group',
                groupIcon: tour.group_icon || 'fa-users',
                groupPrice: tour.group_price || 0,
                groupMaxPersons: tour.group_max_persons || 0,
                familyLabel: tour.family_label || 'Family',
                familyIcon: tour.family_icon || 'fa-users',
                familyPrice: tour.family_price || 0,
                familyMaxPersons: tour.family_max_persons || 0,
                extraAdultPrice: tour.extra_adult_price || 0,
                extraChildPrice: tour.extra_child_price || 0,
                pax_1_price: tour.pax_1_price || 0,
                pax_2_price: tour.pax_2_price || 0,
                pax_3_price: tour.pax_3_price || 0,
                group_price: tour.group_price || 0,
                family_price: tour.family_price || 0,
                extra_adult_price: tour.extra_adult_price || 0,
                extra_child_price: tour.extra_child_price || 0,
                pax_1_label: tour.pax_1_label || '1 Pax',
                pax_2_label: tour.pax_2_label || '2 Pax',
                pax_3_label: tour.pax_3_label || '3 Pax',
                group_label: tour.group_label || 'Group',
                family_label: tour.family_label || 'Family',
                pax_1_icon: tour.pax_1_icon || 'fa-user',
                pax_2_icon: tour.pax_2_icon || 'fa-user-friends',
                pax_3_icon: tour.pax_3_icon || 'fa-users',
                group_icon: tour.group_icon || 'fa-users',
                family_icon: tour.family_icon || 'fa-users',
                group_max_persons: tour.group_max_persons || 0,
                family_max_persons: tour.family_max_persons || 0,
                hotelsLabel: tour.hotels_label || 'Hotels',
                hotelsIcon: tour.hotels_icon || 'fa-hotel',
                mealsLabel: tour.meals_label || 'Meals',
                mealsIcon: tour.meals_icon || 'fa-utensils',
                transportLabel: tour.transport_label || 'Transport',
                transportIcon: tour.transport_icon || 'fa-car',
                sightseeingLabel: tour.sightseeing_label || 'Sightseeing',
                sightseeingIcon: tour.sightseeing_icon || 'fa-eye',
                flightLabel: tour.flight_label || 'Flight',
                flightIcon: tour.flight_icon || 'fa-plane',
                boatLabel: tour.boat_label || 'Boat',
                boatIcon: tour.boat_icon || 'fa-ship',
                horseRidingLabel: tour.horse_riding_label || 'Horse Riding',
                horseRidingIcon: tour.horse_riding_icon || 'fa-horse',
                trekkingLabel: tour.trekking_label || 'Trekking',
                trekkingIcon: tour.trekking_icon || 'fa-hiking',
                hikingLabel: tour.hiking_label || 'Hiking',
                hikingIcon: tour.hiking_icon || 'fa-mountain',
                is_hardcoded: 0
            };
        }

        function buildTourDataFromAtts(atts, blockType) {
            blockType = blockType || 'grid';
            var showPerDayVal = atts.showPerDayPrice !== undefined ? (atts.showPerDayPrice ? 1 : 0) : 1;
            var showCompleteVal = atts.showCompletePrice !== undefined ? (atts.showCompletePrice ? 1 : 0) : 0;
            return {
                id: atts.tourId || 0,
                tour_name: atts.title || '',
                tour_price: atts.price || 0,
                tour_offer_price: atts.offerPrice || 0,
                tour_location: atts.location || '',
                tour_block_type: blockType,
                tour_duration_nights: atts.durationNights || atts.nights || 0,
                tour_duration_days: atts.durationDays || atts.days || 0,
                badge_text: atts.badgeText || '',
                badge_color: atts.badgeColor || '#ff5722',
                badge_icon: atts.badgeIcon || 'fa-star',
                badge_position: atts.badgePosition || 'top-left',
                deal_badge_color: atts.dealBadgeColor || '#ff5722',
                deal_badge_text_color: atts.dealBadgeTextColor || '#ffffff',
                deal_badge_position: atts.dealBadgePosition || 'bottom-right',
                tour_image_id: atts.imageId || 0,
                image_link_url: atts.imageLink || '',
                image_display_size: atts.imageDisplaySize || 'medium',
                tour_brief_text: atts.briefText || '',
                tour_after_title_text: atts.afterTitleText || '',
                tour_description: atts.description || '',
                icon_title: atts.iconTitle || 'fa-map-marker-alt',
                night_icon: atts.nightIcon || 'fa-moon',
                night_icon_color: atts.nightIconColor || '#FFD700',
                night_icon_size: atts.nightIconSize || '14px',
                day_icon: atts.dayIcon || 'fa-sun',
                day_icon_color: atts.dayIconColor || '#FFA500',
                day_icon_size: atts.dayIconSize || '14px',
                show_night_day_icons: atts.showNightDayIcons !== undefined ? (atts.showNightDayIcons ? 1 : 0) : 1,
                pax_1_price: atts.pax1Price || 0,
                pax_2_price: atts.pax2Price || 0,
                pax_3_price: atts.pax3Price || 0,
                group_price: atts.groupPrice || 0,
                family_price: atts.familyPrice || 0,
                extra_adult_price: atts.extraAdultPrice || 0,
                extra_child_price: atts.extraChildPrice || 0,
                pax_1_label: atts.pax1Label || '1 Pax',
                pax_2_label: atts.pax2Label || '2 Pax',
                pax_3_label: atts.pax3Label || '3 Pax',
                group_label: atts.groupLabel || 'Group',
                family_label: atts.familyLabel || 'Family',
                pax_1_icon: atts.pax1Icon || 'fa-user',
                pax_2_icon: atts.pax2Icon || 'fa-user-friends',
                pax_3_icon: atts.pax3Icon || 'fa-users',
                group_icon: atts.groupIcon || 'fa-users',
                family_icon: atts.familyIcon || 'fa-users',
                group_max_persons: atts.groupMaxPersons || 0,
                family_max_persons: atts.familyMaxPersons || 0,
                visible_pax_columns: normalizeVisiblePaxColumns(atts.visiblePaxColumns),
                hotels_label: atts.hotelsLabel || 'Hotels',
                hotels_icon: atts.hotelsIcon || 'fa-hotel',
                meals_label: atts.mealsLabel || 'Meals',
                meals_icon: atts.mealsIcon || 'fa-utensils',
                transport_label: atts.transportLabel || 'Transport',
                transport_icon: atts.transportIcon || 'fa-car',
                sightseeing_label: atts.sightseeingLabel || 'Sightseeing',
                sightseeing_icon: atts.sightseeingIcon || 'fa-eye',
                flight_label: atts.flightLabel || 'Flight',
                flight_icon: atts.flightIcon || 'fa-plane',
                boat_label: atts.boatLabel || 'Boat',
                boat_icon: atts.boatIcon || 'fa-ship',
                horse_riding_label: atts.horseRidingLabel || 'Horse Riding',
                horse_riding_icon: atts.horseRidingIcon || 'fa-horse',
                trekking_label: atts.trekkingLabel || 'Trekking',
                trekking_icon: atts.trekkingIcon || 'fa-hiking',
                hiking_label: atts.hikingLabel || 'Hiking',
                hiking_icon: atts.hikingIcon || 'fa-mountain',
                gst_percent: atts.gstPercent || '5',
                gst_label: atts.gstLabel || 'GST',
                cancellation_policy: atts.cancellationPolicy || 'non_refundable',
                cancellation_text: atts.cancellationText || '',
                button_text: atts.buttonText || 'Book Now',
                button_url: atts.buttonUrl || '#',
                button_color: atts.buttonColor || '#ff5722',
                button_text_color: atts.buttonTextColor || '#ffffff',
                title_color: atts.titleColor || '#333333',
                title_font_size: atts.titleFontSize || '18px',
                price_color: atts.priceColor || '#28a745',
                price_font_size: atts.priceFontSize || '24px',
                heading_type: atts.headingType || 'h4',
                icon_color: atts.iconColor || '#075e54',
                icon_size: atts.iconSize || '14px',
                icon_title_size: atts.iconTitleSize || '20px',
                icon_title_color: atts.iconTitleColor || '#075e54',
                enable_icon_dropdown: atts.enableIconInDropdown !== false ? 1 : 0,
                enable_dark_mode: atts.darkMode === true ? 1 : 0,
                location_icon: atts.locationIcon || 'fa-map-marker-alt',
                location_icon_size: atts.locationIconSize || '12px',
                location_icon_color: atts.locationIconColor || '#075e54',
                location_text_size: atts.locationTextSize || '13px',
                location_text_color: atts.locationTextColor || '#666666',
                review_star_color: atts.reviewStarColor || '#FFD700',
                review_star_size: atts.reviewStarSize || '14px',
                show_wishlist: atts.showWishlist !== undefined ? (atts.showWishlist ? 1 : 0) : 1,
                show_reviews: atts.showReviews !== undefined ? (atts.showReviews ? 1 : 0) : 1,
                show_badge: atts.showBadge !== undefined ? (atts.showBadge ? 1 : 0) : 1,
                show_icons: atts.showIcons !== undefined ? (atts.showIcons ? 1 : 0) : 1,
                show_pax: atts.showPax !== undefined ? (atts.showPax ? 1 : 0) : 1,
                show_icon_enabled: atts.enableIcon !== undefined ? (atts.enableIcon ? 1 : 0) : 1,
                show_per_day_price: showPerDayVal,
                show_complete_price: showCompleteVal,
                tour_default_adults: atts.defaultAdults !== undefined ? Math.max(1, parseInt(atts.defaultAdults)) : 2,
                tour_default_children: atts.defaultChildren !== undefined ? Math.max(0, parseInt(atts.defaultChildren)) : 0,
                is_hardcoded: 0,
                status: 'published'
            };
        }

        /* ============================================================
           3. COLOR CONTROL
           ============================================================ */

        function ColorControl(label, value, onChange) {
            return el('div', { style: { marginBottom: '12px' } },
                el('label', {
                    style: {
                        display: 'block', marginBottom: '4px', fontSize: '11px',
                        fontWeight: '600', textTransform: 'uppercase', color: '#555'
                    }
                }, label),
                el(ColorPalette, {
                    value: value || '',
                    onChange: onChange,
                    colors: [
                        { name: 'KTV Primary Green', color: '#28a745' },
                        { name: 'KTV Secondary Green', color: '#075e54' },
                        { name: 'KTV Orange', color: '#ff5722' },
                        { name: 'Red', color: '#dc3545' },
                        { name: 'Blue', color: '#0073aa' },
                        { name: 'Purple', color: '#9c27b0' },
                        { name: 'Black', color: '#333333' },
                        { name: 'White', color: '#ffffff' },
                        { name: 'Gold', color: '#FFD700' },
                        { name: 'Pink', color: '#e91e63' },
                        { name: 'Teal', color: '#009688' },
                        { name: 'Navy', color: '#1a1a2e' },
                        { name: 'Grey', color: '#666666' },
                        { name: 'Light Grey', color: '#999999' },
                        { name: 'Light Grey BG', color: '#f0f0f0' },
                        { name: 'Yellow', color: '#ffc107' },
                        { name: 'Brown', color: '#795548' }
                    ]
                })
            );
        }

        /* ============================================================
           4. ICON CONTROLS
           ============================================================ */

        function IconControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var iconKey = props.iconKey;
            var sizeKey = props.sizeKey || (iconKey + 'Size');
            var colorKey = props.colorKey || (iconKey + 'Color');
            var label = props.label || 'Icon';
            var enableKey = props.enableKey || 'enableIcon';

            return el(Fragment, {},
                el(ToggleControl, {
                    label: 'Enable Icon',
                    checked: atts[enableKey] !== undefined ? atts[enableKey] : true,
                    onChange: function (v) { var o = {}; o[enableKey] = v; setAtts(o); }
                }),
                atts[enableKey] !== false ? el(Fragment, {},
                    el(SelectControl, {
                        label: label,
                        value: atts[iconKey] || 'fa-star',
                        options: iconOptions,
                        onChange: function (v) { var o = {}; o[iconKey] = v; setAtts(o); }
                    }),
                    el(SelectControl, {
                        label: 'Icon Size',
                        value: atts[sizeKey] || '16px',
                        options: iconSizes,
                        onChange: function (v) { var o = {}; o[sizeKey] = v; setAtts(o); }
                    }),
                    ColorControl('Icon Color', atts[colorKey] || '#075e54', function (v) { var o = {}; o[colorKey] = v; setAtts(o); })
                ) : null
            );
        }

        function TitleIconControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(PanelBody, { title: '🎨 Title Icon', initialOpen: false },
                el(ToggleControl, {
                    label: 'Show Title Icon',
                    checked: atts.enableIcon !== undefined ? atts.enableIcon : true,
                    onChange: function (v) { setAtts({ enableIcon: v }); }
                }),
                atts.enableIcon !== false ? el(Fragment, {},
                    el(SelectControl, {
                        label: 'Title Icon',
                        value: atts.iconTitle || 'fa-star',
                        options: iconOptions,
                        onChange: function (v) { setAtts({ iconTitle: v }); }
                    }),
                    el(SelectControl, {
                        label: 'Title Icon Size',
                        value: atts.iconTitleSize || '20px',
                        options: iconSizes,
                        onChange: function (v) { setAtts({ iconTitleSize: v }); }
                    }),
                    ColorControl('Title Icon Color', atts.iconTitleColor || '#075e54', function (v) { setAtts({ iconTitleColor: v }); })
                ) : null
            );
        }

        function NightDayIconControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(Fragment, {},
                el(ToggleControl, {
                    label: 'Show Night/Day Icons',
                    checked: atts.showNightDayIcons !== undefined ? atts.showNightDayIcons : true,
                    onChange: function (v) { setAtts({ showNightDayIcons: v }); }
                }),
                atts.showNightDayIcons !== false ? el(Fragment, {},
                    el(SelectControl, {
                        label: 'Night Icon',
                        value: atts.nightIcon || 'fa-moon',
                        options: nightDayIconOptions,
                        onChange: function (v) { setAtts({ nightIcon: v }); }
                    }),
                    el(SelectControl, {
                        label: 'Night Icon Size',
                        value: atts.nightIconSize || '14px',
                        options: iconSizes,
                        onChange: function (v) { setAtts({ nightIconSize: v }); }
                    }),
                    ColorControl('Night Icon Color', atts.nightIconColor || '#FFD700', function (v) { setAtts({ nightIconColor: v }); }),
                    el(SelectControl, {
                        label: 'Day Icon',
                        value: atts.dayIcon || 'fa-sun',
                        options: nightDayIconOptions,
                        onChange: function (v) { setAtts({ dayIcon: v }); }
                    }),
                    el(SelectControl, {
                        label: 'Day Icon Size',
                        value: atts.dayIconSize || '14px',
                        options: iconSizes,
                        onChange: function (v) { setAtts({ dayIconSize: v }); }
                    }),
                    ColorControl('Day Icon Color', atts.dayIconColor || '#FFA500', function (v) { setAtts({ dayIconColor: v }); })
                ) : null
            );
        }

        /* ============================================================
           5. PAX AND ACTIVITY ICON CONTROLS
           ============================================================ */

        function PaxControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var paxKey = props.paxKey;
            var labelKey = paxKey + 'Label';
            var iconKey = paxKey + 'Icon';
            var priceKey = paxKey + 'Price';
            var label = props.label || 'Pax';

            var isGroupOrFamily = (paxKey === 'group' || paxKey === 'family');
            var maxKey = paxKey + 'MaxPersons';

            return el('div', { style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' } },
                el('h4', { style: { margin: '0 0 10px', fontSize: '13px' } }, label),
                el(TextControl, {
                    label: 'Label',
                    value: atts[labelKey] || '',
                    onChange: function (v) { var o = {}; o[labelKey] = v; setAtts(o); }
                }),
                el(SelectControl, {
                    label: 'Icon',
                    value: atts[iconKey] || 'fa-user',
                    options: paxIconOptions,
                    onChange: function (v) { var o = {}; o[iconKey] = v; setAtts(o); }
                }),
                el(TextControl, {
                    label: 'Price',
                    type: 'number',
                    value: atts[priceKey] || 0,
                    onChange: function (v) { var o = {}; o[priceKey] = parseFloat(v) || 0; setAtts(o); }
                }),
                isGroupOrFamily ? el(TextControl, {
                    label: 'Max Persons Allowed (0 = unlimited)',
                    type: 'number',
                    value: atts[maxKey] || 0,
                    onChange: function (v) { var o = {}; o[maxKey] = parseInt(v) || 0; setAtts(o); }
                }) : null
            );
        }

        function PaxColumnsToggleControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var visible = parseVisiblePaxToArray(atts.visiblePaxColumns);

            function toggle(key, checked) {
                var current = visible.slice();
                var idx = current.indexOf(key);
                if (checked && idx === -1) {
                    current.push(key);
                } else if (!checked && idx !== -1) {
                    current.splice(idx, 1);
                }
                if (current.length === 0) {
                    current = ['pax1'];
                }
                setAtts({ visiblePaxColumns: current.join(',') });
            }

            return el(PanelBody, { title: '👥 Pax Columns Visibility', initialOpen: false },
                el('p', { style: { fontSize: '11px', color: '#666', marginBottom: '10px' } },
                    'Toggle which pax columns are displayed on the frontend. Default is 1 Pax only. At least one must remain enabled.'
                ),
                el('div', { className: 'ktv-pax-columns-toggle' },
                    paxColumnOptions.map(function (opt) {
                        var checked = visible.indexOf(opt.key) !== -1;
                        return el('label', { key: opt.key, style: { opacity: checked ? '1' : '0.55' } },
                            el('input', {
                                type: 'checkbox',
                                checked: checked,
                                onChange: function (e) { toggle(opt.key, e.target.checked); }
                            }),
                            el('i', { className: 'fas ' + opt.icon, style: { marginRight: '4px' } }),
                            el('span', null, opt.label)
                        );
                    })
                ),
                el(SelectControl, {
                    label: 'Quick Preset',
                    value: '',
                    options: [
                        { label: '— Choose preset —', value: '' },
                        { label: '🟢 Only 1 Pax (default)', value: 'pax1' },
                        { label: '👤 1 & 2 Pax', value: 'pax1,pax2' },
                        { label: '👥 1, 2 & 3 Pax', value: 'pax1,pax2,pax3' },
                        { label: '🔵 All columns', value: 'all' },
                        { label: 'Custom (current)', value: 'custom' }
                    ],
                    onChange: function (v) {
                        if (!v || v === 'custom') return;
                        if (v === 'all') {
                            setAtts({ visiblePaxColumns: 'pax1,pax2,pax3,group,family' });
                        } else {
                            setAtts({ visiblePaxColumns: v });
                        }
                    }
                })
            );
        }

        function ActivityIconControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var iconKey = props.iconKey;
            var labelKey = props.labelKey;
            var label = props.label;

            return el('div', { style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' } },
                el('h4', { style: { margin: '0 0 10px', fontSize: '13px' } }, label),
                el(TextControl, {
                    label: 'Label',
                    value: atts[labelKey] || label,
                    onChange: function (v) { var o = {}; o[labelKey] = v; setAtts(o); }
                }),
                el(SelectControl, {
                    label: 'Icon',
                    value: atts[iconKey] || 'fa-hotel',
                    options: iconOptions,
                    onChange: function (v) { var o = {}; o[iconKey] = v; setAtts(o); }
                })
            );
        }

        /* ============================================================
           6. FIELD ICON CONTROL
           ============================================================ */

        function FieldIconControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var fieldKey = props.fieldKey;
            var fieldLabel = props.fieldLabel || 'Field';
            var defaultIcon = props.defaultIcon || 'fa-circle';
            var defaultSize = props.defaultSize || '16px';
            var defaultColor = props.defaultColor || '#075e54';

            var sizeKey = fieldKey + 'Size';
            var colorKey = fieldKey + 'Color';

            var iconValue = atts[fieldKey] !== undefined && atts[fieldKey] !== '' ? atts[fieldKey] : defaultIcon;
            var sizeValue = atts[sizeKey] !== undefined && atts[sizeKey] !== '' ? atts[sizeKey] : defaultSize;
            var colorValue = atts[colorKey] !== undefined && atts[colorKey] !== '' ? atts[colorKey] : defaultColor;

            return el('div', {
                className: 'ktv-field-icon-control-card',
                style: {
                    marginBottom: '12px',
                    padding: '10px 12px',
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }
            },
                el('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                    }
                },
                    el('span', {
                        className: 'ktv-field-icon-preview',
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            background: '#fff',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            flexShrink: 0
                        }
                    },
                        el('i', {
                            className: 'fas ' + iconValue,
                            style: {
                                fontSize: sizeValue,
                                color: colorValue
                            }
                        })
                    ),
                    el('strong', {
                        style: { fontSize: '12px', color: '#333', fontWeight: '600' }
                    }, fieldLabel + ' Icon')
                ),
                el(SelectControl, {
                    label: 'Icon',
                    value: iconValue,
                    options: iconOptions,
                    onChange: function (v) { var o = {}; o[fieldKey] = v; setAtts(o); }
                }),
                el(SelectControl, {
                    label: 'Icon Size',
                    value: sizeValue,
                    options: iconSizes,
                    onChange: function (v) { var o = {}; o[sizeKey] = v; setAtts(o); }
                }),
                ColorControl('Icon Color', colorValue, function (v) { var o = {}; o[colorKey] = v; setAtts(o); })
            );
        }

        function FieldIconGroup(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var title = props.title || '🎯 Field Icons';
            var initialOpen = props.initialOpen || false;
            var fields = props.fields || [];

            return el(PanelBody, { title: title, initialOpen: initialOpen },
                fields.map(function (f) {
                    return el(FieldIconControl, {
                        key: f.fieldKey,
                        attributes: atts,
                        setAttributes: setAtts,
                        fieldKey: f.fieldKey,
                        fieldLabel: f.fieldLabel,
                        defaultIcon: f.defaultIcon,
                        defaultSize: f.defaultSize,
                        defaultColor: f.defaultColor
                    });
                })
            );
        }

        /* ============================================================
           7. MISC CONTROLS
           ============================================================ */

        function LastBookingControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var showKey = props.showKey || 'showLastBooking';
            var nameKey = props.nameKey || 'lastBookingName';
            var countryKey = props.countryKey || 'lastBookingCountry';
            var timeKey = props.timeKey || 'lastBookingTime';
            var countKey = props.countKey || 'lastBookingCount';
            var label = props.label || 'Last Booking';

            return el(PanelBody, { title: '📋 ' + label, initialOpen: false },
                el(ToggleControl, {
                    label: 'Show ' + label,
                    checked: atts[showKey] !== undefined ? atts[showKey] : true,
                    onChange: function (v) { var o = {}; o[showKey] = v; setAtts(o); }
                }),
                atts[showKey] !== false ? el(Fragment, {},
                    el(TextControl, {
                        label: 'Last Booking Name',
                        value: atts[nameKey] || '',
                        onChange: function (v) { var o = {}; o[nameKey] = v; setAtts(o); }
                    }),
                    el(SelectControl, {
                        label: 'Last Booking Country',
                        value: atts[countryKey] || 'India',
                        options: lastBookingCountryOptions,
                        onChange: function (v) { var o = {}; o[countryKey] = v; setAtts(o); }
                    }),
                    el(TextControl, {
                        label: 'Last Booking Time (ISO datetime)',
                        value: atts[timeKey] || '',
                        onChange: function (v) { var o = {}; o[timeKey] = v; setAtts(o); },
                        placeholder: '2026-01-15 10:30:00'
                    }),
                    el(TextControl, {
                        label: 'Booking Count',
                        type: 'number',
                        value: atts[countKey] || 0,
                        onChange: function (v) { var o = {}; o[countKey] = parseInt(v) || 0; setAtts(o); },
                        placeholder: '2'
                    })
                ) : null
            );
        }

        function PromoCodeControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(PanelBody, { title: '🏷️ Promo Code', initialOpen: false },
                el(TextControl, {
                    label: 'Promo Code',
                    value: atts.promoCode || '',
                    onChange: function (v) { setAtts({ promoCode: v }); },
                    placeholder: 'SUMMER20'
                }),
                el(TextControl, {
                    label: 'Discount %',
                    type: 'number',
                    value: atts.promoDiscount || 0,
                    onChange: function (v) { setAtts({ promoDiscount: parseInt(v) || 0 }); },
                    placeholder: '20'
                }),
                el(TextControl, {
                    label: 'Valid Until (ISO datetime)',
                    value: atts.promoCodeValidUntil || '',
                    onChange: function (v) { setAtts({ promoCodeValidUntil: v }); },
                    placeholder: '2026-12-31 23:59:59'
                })
            );
        }

        function CancellationPolicyControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(PanelBody, { title: '📋 Cancellation Policy', initialOpen: false },
                el(SelectControl, {
                    label: 'Cancellation Policy',
                    value: atts.cancellationPolicy || 'non_refundable',
                    options: cancellationPolicyOptions,
                    onChange: function (v) { setAtts({ cancellationPolicy: v }); }
                }),
                el(TextareaControl, {
                    label: 'Custom Cancellation Text',
                    value: atts.cancellationText || '',
                    rows: 2,
                    onChange: function (v) { setAtts({ cancellationText: v }); }
                })
            );
        }

        function GSTControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(PanelBody, { title: '💰 GST Settings', initialOpen: false },
                el(SelectControl, {
                    label: 'GST Percentage',
                    value: atts.gstPercent || '5',
                    options: gstOptions,
                    onChange: function (v) { setAtts({ gstPercent: v }); }
                }),
                el(TextControl, {
                    label: 'GST Label',
                    value: atts.gstLabel || 'GST',
                    onChange: function (v) { setAtts({ gstLabel: v }); }
                }),
                el(ToggleControl, {
                    label: 'Show GST Badge',
                    checked: atts.showGst !== undefined ? atts.showGst : true,
                    onChange: function (v) { setAtts({ showGst: v }); }
                })
            );
        }

        function PlaceholderControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(PanelBody, { title: '✍️ Placeholder Styles', initialOpen: false },
                el(SelectControl, {
                    label: 'Placeholder Font Size',
                    value: atts.placeholderFontSize || '14px',
                    options: fontSizes,
                    onChange: function (v) { setAtts({ placeholderFontSize: v }); }
                }),
                el(SelectControl, {
                    label: 'Placeholder Font Weight',
                    value: atts.placeholderFontWeight || '400',
                    options: fontWeightOptions,
                    onChange: function (v) { setAtts({ placeholderFontWeight: v }); }
                }),
                ColorControl('Placeholder Color', atts.placeholderColor || '#999999', function (v) { setAtts({ placeholderColor: v }); })
            );
        }

        function MediaUploadControl(imageId, onChange, label, imageLink, onLinkChange, imageSize, onSizeChange) {
            return el('div', { style: { marginBottom: '12px' } },
                el('p', { style: { fontSize: '11px', color: '#666', marginBottom: '8px' } },
                    imageId ? (label || 'Image') + ' (ID: ' + imageId + ')' : 'No ' + (label || 'image') + ' selected'
                ),
                el(MediaUploadCheck, {},
                    el(MediaUpload, {
                        onSelect: function (media) { onChange(media.id); },
                        allowedTypes: ['image'],
                        value: imageId ? [imageId] : [],
                        render: function (obj) {
                            return el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                                el(Button, { onClick: obj.open, variant: 'primary', style: { flex: 1 } }, imageId ? 'Change Image' : 'Upload Image'),
                                imageId ? el(Button, { onClick: function () { onChange(0); }, variant: 'secondary', isDestructive: true }, 'Remove') : null
                            );
                        }
                    })
                ),
                imageLink !== undefined && imageLink !== null ? el(TextControl, {
                    label: 'Image Link URL',
                    value: imageLink || '',
                    onChange: function (v) { if (onLinkChange) onLinkChange(v); },
                    placeholder: 'https://example.com/page'
                }) : null,
                imageSize !== undefined && imageSize !== null ? el(SelectControl, {
                    label: 'Image Display Size',
                    value: imageSize || 'medium',
                    options: imageDisplaySizeOptions,
                    onChange: function (v) { if (onSizeChange) onSizeChange(v); }
                }) : null
            );
        }

        function GalleryControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;

            return el(PanelBody, { title: '🖼️ Gallery Settings', initialOpen: false },
                el(TextareaControl, {
                    label: 'Gallery Images (comma separated IDs)',
                    value: atts.galleryImages || '',
                    onChange: function (v) { setAtts({ galleryImages: v }); },
                    placeholder: '123,456,789'
                }),
                el(ToggleControl, {
                    label: 'Auto Slide Gallery',
                    checked: atts.galleryAutoSlide || false,
                    onChange: function (v) { setAtts({ galleryAutoSlide: v }); }
                }),
                atts.galleryAutoSlide ? el(RangeControl, {
                    label: 'Slide Interval (ms)',
                    value: atts.gallerySlideInterval || 3000,
                    onChange: function (v) { setAtts({ gallerySlideInterval: v }); },
                    min: 1000, max: 10000, step: 500
                }) : null
            );
        }

        function ButtonLinkControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var label = props.label || 'Button URL';

            return el(PanelBody, { title: '🔗 ' + label, initialOpen: false },
                el(TextControl, {
                    label: 'Button URL',
                    value: atts.buttonUrl || '#',
                    onChange: function (v) { setAtts({ buttonUrl: v }); },
                    placeholder: 'https://example.com/booking'
                })
            );
        }

        function BadgePositionControl(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            return el(SelectControl, {
                label: 'Badge Position',
                value: atts.badgePosition || 'top-left',
                options: badgePositionOptions,
                onChange: function (v) { setAtts({ badgePosition: v }); }
            });
        }

        function BlockIconPanel(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var globalDark = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.dark_mode_enabled) ? true : false;
            return el(PanelBody, { title: '🎨 Block Appearance', initialOpen: false },
                el(ToggleControl, {
                    label: 'Enable Icons on this block',
                    checked: atts.enableIcon !== undefined ? atts.enableIcon : true,
                    onChange: function (v) { setAtts({ enableIcon: v }); }
                }),
                atts.enableIcon !== false ? el(Fragment, {},
                    el(SelectControl, {
                        label: 'Block Icon Color',
                        value: atts.iconColor || '#075e54',
                        options: colorOptions,
                        onChange: function (v) { setAtts({ iconColor: v }); }
                    }),
                    el(SelectControl, {
                        label: 'Block Icon Size',
                        value: atts.iconSize || '14px',
                        options: iconSizes,
                        onChange: function (v) { setAtts({ iconSize: v }); }
                    })
                ) : null,
                globalDark ? el('p', { style: { fontSize: '11px', color: '#666', fontStyle: 'italic' } }, '🌙 Dark mode is globally enabled in KTV Settings.') : null,
                el(ToggleControl, {
                    label: 'Enable Dark Mode for this block',
                    checked: atts.darkMode === true,
                    onChange: function (v) { setAtts({ darkMode: v }); }
                })
            );
        }

        function CurrencyIpPanel(props) {
            var atts = props.attributes;
            var setAtts = props.setAttributes;
            var enabled = atts.enableIpPricing === undefined ? true : atts.enableIpPricing;
            return el(PanelBody, { title: '💱 Currency', initialOpen: false },
                el('p', { style: { fontSize: '11px', color: '#666', marginBottom: '10px' } },
                    'When IP-based pricing is enabled, prices are converted to the visitor country currency using the currency rates configured in KTV Settings. Disable to always show prices in the manual currency from KTV Settings.'
                ),
                el(ToggleControl, {
                    label: 'Enable IP-Based Prices for this block',
                    checked: enabled,
                    onChange: function (v) { setAtts({ enableIpPricing: v }); }
                })
            );
        }

        /* ============================================================
           8. AJAX TOUR PERSISTENCE
           ============================================================ */

        function saveTourToDatabase(tourData) {
            var ajaxUrl = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.ajax_url)
                ? ktv_editor_data.ajax_url : '/wp-admin/admin-ajax.php';
            var nonce = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.nonce)
                ? ktv_editor_data.nonce : '';

            tourData.is_hardcoded = 0;

            var formData = new FormData();
            formData.append('action', 'ktv_save_tour');
            formData.append('nonce', nonce);
            formData.append('tour_data', JSON.stringify(tourData));

            return fetch(ajaxUrl, { method: 'POST', body: formData })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    if (data.success) return data.data;
                    throw new Error((data.data && data.data.message) || 'Failed to save tour');
                });
        }

        function deleteTourFromDatabase(tourId) {
            var ajaxUrl = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.ajax_url)
                ? ktv_editor_data.ajax_url : '/wp-admin/admin-ajax.php';
            var nonce = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.nonce)
                ? ktv_editor_data.nonce : '';

            var formData = new FormData();
            formData.append('action', 'ktv_delete_tour');
            formData.append('nonce', nonce);
            formData.append('tour_id', tourId);

            return fetch(ajaxUrl, { method: 'POST', body: formData })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    if (data.success) return data.data;
                    throw new Error((data.data && data.data.message) || 'Failed to delete tour');
                });
        }

        function loadAllToursFromDatabase(blockType) {
            var ajaxUrl = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.ajax_url)
                ? ktv_editor_data.ajax_url : '/wp-admin/admin-ajax.php';
            var nonce = (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.nonce)
                ? ktv_editor_data.nonce : '';

            var formData = new FormData();
            formData.append('action', 'ktv_get_tours');
            formData.append('nonce', nonce);
            formData.append('block_type', blockType || 'all');

            return fetch(ajaxUrl, { method: 'POST', body: formData })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    if (data.success) return data.data.tours || [];
                    throw new Error((data.data && data.data.message) || 'Failed to load tours');
                });
        }
                /* ============================================================
           9. BLOCK — KTV TOUR CARD
           ============================================================ */

        wp.blocks.registerBlockType('ktv/tour-card', {
            title: 'KTV Tour Card',
            description: 'Single tour card with image, badge, pricing, heading type, brief text, location, reviews, last booking, night/day icons.',
            icon: 'tickets-alt',
            category: 'ktv-travel',
            keywords: ['tour', 'card', 'package', 'travel', 'booking'],
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                title: { type: 'string', default: '' },
                location: { type: 'string', default: '' },
                description: { type: 'string', default: '' },
                briefText: { type: 'string', default: '' },
                afterTitleText: { type: 'string', default: '' },
                price: { type: 'number', default: 0 },
                offerPrice: { type: 'number', default: 0 },
                durationDays: { type: 'number', default: 0 },
                durationNights: { type: 'number', default: 0 },
                badgeText: { type: 'string', default: '' },
                badgeColor: { type: 'string', default: '#ff5722' },
                badgeIcon: { type: 'string', default: 'fa-star' },
                badgePosition: { type: 'string', default: 'top-left' },
                showBadge: { type: 'boolean', default: true },
                dealBadgeColor: { type: 'string', default: '#ff5722' },
                dealBadgeTextColor: { type: 'string', default: '#ffffff' },
                dealBadgePosition: { type: 'string', default: 'bottom-right' },
                buttonText: { type: 'string', default: 'Book Now' },
                buttonUrl: { type: 'string', default: '#' },
                buttonColor: { type: 'string', default: '#ff5722' },
                buttonTextColor: { type: 'string', default: '#ffffff' },
                buttonPadding: { type: 'string', default: '12px 24px' },
                buttonBorderRadius: { type: 'string', default: '30px' },
                buttonFontSize: { type: 'string', default: '14px' },
                buttonFontWeight: { type: 'string', default: '600' },
                titleFontSize: { type: 'string', default: '18px' },
                titleColor: { type: 'string', default: '#333333' },
                titleFontFamily: { type: 'string', default: 'inherit' },
                titleFontWeight: { type: 'string', default: '700' },
                priceFontSize: { type: 'string', default: '24px' },
                priceColor: { type: 'string', default: '#28a745' },
                priceFontFamily: { type: 'string', default: 'inherit' },
                priceFontWeight: { type: 'string', default: '700' },
                imageId: { type: 'number', default: 0 },
                imageLink: { type: 'string', default: '' },
                imageDisplaySize: { type: 'string', default: 'medium' },
                galleryImages: { type: 'string', default: '' },
                galleryAutoSlide: { type: 'boolean', default: false },
                gallerySlideInterval: { type: 'number', default: 3000 },
                showWishlist: { type: 'boolean', default: true },
                wishlistCount: { type: 'number', default: 0 },
                headingType: { type: 'string', default: 'h4' },
                showReviews: { type: 'boolean', default: true },
                reviewStarColor: { type: 'string', default: '#FFD700' },
                reviewStarSize: { type: 'string', default: '14px' },
                avgRating: { type: 'number', default: 0 },
                totalReviews: { type: 'number', default: 0 },
                locationIcon: { type: 'string', default: 'fa-map-marker-alt' },
                locationIconSize: { type: 'string', default: '12px' },
                locationIconColor: { type: 'string', default: '#075e54' },
                locationTextSize: { type: 'string', default: '13px' },
                locationTextColor: { type: 'string', default: '#666666' },
                textFontSize: { type: 'string', default: '14px' },
                textColor: { type: 'string', default: '#666666' },
                textFontFamily: { type: 'string', default: 'inherit' },
                textFontWeight: { type: 'string', default: '400' },
                briefFontSize: { type: 'string', default: '14px' },
                briefColor: { type: 'string', default: '#555555' },
                afterTitleFontSize: { type: 'string', default: '12px' },
                afterTitleColor: { type: 'string', default: '#075e54' },
                cardBgColor: { type: 'string', default: '#ffffff' },
                cardBorderColor: { type: 'string', default: '#e0e0e0' },
                cardBorderSize: { type: 'string', default: '1px' },
                cardBorderRadius: { type: 'string', default: '16px' },
                tourId: { type: 'number', default: 0 },
                showLastBooking: { type: 'boolean', default: true },
                lastBookingName: { type: 'string', default: '' },
                lastBookingCountry: { type: 'string', default: 'India' },
                lastBookingTime: { type: 'string', default: '' },
                lastBookingCount: { type: 'number', default: 0 },
                promoCode: { type: 'string', default: '' },
                promoDiscount: { type: 'number', default: 0 },
                promoCodeValidUntil: { type: 'string', default: '' },
                hotelsIcon: { type: 'string', default: 'fa-hotel' },
                hotelsLabel: { type: 'string', default: 'Hotels' },
                mealsIcon: { type: 'string', default: 'fa-utensils' },
                mealsLabel: { type: 'string', default: 'Meals' },
                transportIcon: { type: 'string', default: 'fa-car' },
                transportLabel: { type: 'string', default: 'Transport' },
                sightseeingIcon: { type: 'string', default: 'fa-eye' },
                sightseeingLabel: { type: 'string', default: 'Sightseeing' },
                flightIcon: { type: 'string', default: 'fa-plane' },
                flightLabel: { type: 'string', default: 'Flight' },
                boatIcon: { type: 'string', default: 'fa-ship' },
                boatLabel: { type: 'string', default: 'Boat' },
                horseRidingIcon: { type: 'string', default: 'fa-horse' },
                horseRidingLabel: { type: 'string', default: 'Horse Riding' },
                trekkingIcon: { type: 'string', default: 'fa-hiking' },
                trekkingLabel: { type: 'string', default: 'Trekking' },
                hikingIcon: { type: 'string', default: 'fa-mountain' },
                hikingLabel: { type: 'string', default: 'Hiking' },
                gstPercent: { type: 'string', default: '5' },
                gstLabel: { type: 'string', default: 'GST' },
                showGst: { type: 'boolean', default: true },
                cancellationPolicy: { type: 'string', default: 'non_refundable' },
                cancellationText: { type: 'string', default: '' },
                enableIcon: { type: 'boolean', default: true },
                enableIconInDropdown: { type: 'boolean', default: true },
                enableIpPricing: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-map-marker-alt' },
                iconTitleSize: { type: 'string', default: '20px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                iconSize: { type: 'string', default: '14px' },
                iconColor: { type: 'string', default: '#075e54' },
                nightIcon: { type: 'string', default: 'fa-moon' },
                nightIconSize: { type: 'string', default: '14px' },
                nightIconColor: { type: 'string', default: '#FFD700' },
                dayIcon: { type: 'string', default: 'fa-sun' },
                dayIconSize: { type: 'string', default: '14px' },
                dayIconColor: { type: 'string', default: '#FFA500' },
                showNightDayIcons: { type: 'boolean', default: true },
                showIcons: { type: 'boolean', default: true },
                showPax: { type: 'boolean', default: true },
                visiblePaxColumns: { type: 'string', default: 'pax1' },
                showPerDayPrice: { type: 'boolean', default: true },
                showCompletePrice: { type: 'boolean', default: false },
                defaultAdults: { type: 'number', default: 2 },
                defaultChildren: { type: 'number', default: 0 },
                pax1Label: { type: 'string', default: '1 Pax' },
                pax1Icon: { type: 'string', default: 'fa-user' },
                pax1Price: { type: 'number', default: 0 },
                pax2Label: { type: 'string', default: '2 Pax' },
                pax2Icon: { type: 'string', default: 'fa-user-friends' },
                pax2Price: { type: 'number', default: 0 },
                pax3Label: { type: 'string', default: '3 Pax' },
                pax3Icon: { type: 'string', default: 'fa-users' },
                pax3Price: { type: 'number', default: 0 },
                groupLabel: { type: 'string', default: 'Group' },
                groupIcon: { type: 'string', default: 'fa-users' },
                groupPrice: { type: 'number', default: 0 },
                groupMaxPersons: { type: 'number', default: 0 },
                familyLabel: { type: 'string', default: 'Family' },
                familyIcon: { type: 'string', default: 'fa-users' },
                familyPrice: { type: 'number', default: 0 },
                familyMaxPersons: { type: 'number', default: 0 },
                extraAdultPrice: { type: 'number', default: 0 },
                extraChildPrice: { type: 'number', default: 0 }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-tour-card' });
                var hasDiscount = atts.offerPrice && atts.offerPrice < atts.price;
                var displayPrice = hasDiscount ? atts.offerPrice : atts.price;
                var calculatedPercent = hasDiscount ? Math.round((atts.price - atts.offerPrice) / atts.price * 100) : 0;
                var imgUrl = getImageUrl(atts.imageId, atts.imageDisplaySize);
                var cs = getCurrencySymbol((typeof ktv_editor_data !== 'undefined' && ktv_editor_data.currency_code) ? ktv_editor_data.currency_code : 'USD');
                var heading_tag = atts.headingType || 'h4';
                var visiblePax = parseVisiblePaxToArray(atts.visiblePaxColumns);

                var dynamicTours = getDynamicTours();
                var tourOptions = [{ label: 'Select a Tour from Database', value: '' }];
                dynamicTours.forEach(function (tour) {
                    if (tour.is_hardcoded == 1) return;
                    tourOptions.push({ label: tour.tour_name + ' (' + tour.block_type + ')', value: String(tour.id) });
                });

                var badgePosStyles = {
                    'top-left': { top: '12px', left: '12px', right: 'auto', bottom: 'auto' },
                    'top-right': { top: '12px', right: '12px', left: 'auto', bottom: 'auto' },
                    'bottom-left': { bottom: '12px', left: '12px', top: 'auto', right: 'auto' },
                    'bottom-right': { bottom: '12px', right: '12px', top: 'auto', left: 'auto' }
                };
                var badgePos = badgePosStyles[atts.badgePosition] || badgePosStyles['top-left'];
                var dealBadgePos = badgePosStyles[atts.dealBadgePosition || 'bottom-right'] || badgePosStyles['bottom-right'];

                function loadTourFromDatabase(tourId) {
                    var tour = getTourById(parseInt(tourId));
                    if (!tour || tour.is_hardcoded == 1) return;
                    var nightsVal = (tour.durationNights !== undefined && tour.durationNights !== null) ? tour.durationNights : (tour.nights || 0);
                    var daysVal = (tour.durationDays !== undefined && tour.durationDays !== null) ? tour.durationDays : (tour.days || 0);
                    setAtts({
                        title: tour.tour_name || '',
                        location: tour.location || '',
                        briefText: tour.tour_brief_text || '',
                        afterTitleText: tour.tour_after_title_text || '',
                        price: tour.tour_price || 0,
                        offerPrice: tour.tour_offer_price || 0,
                        durationDays: daysVal,
                        durationNights: nightsVal,
                        badgeText: tour.badge_text || '',
                        badgeColor: tour.badge_color || '#ff5722',
                        badgeIcon: tour.badge_icon || 'fa-star',
                        badgePosition: tour.badge_position || 'top-left',
                        dealBadgeColor: tour.deal_badge_color || '#ff5722',
                        dealBadgeTextColor: tour.deal_badge_text_color || '#ffffff',
                        dealBadgePosition: tour.deal_badge_position || 'bottom-right',
                        imageId: tour.tour_image_id || 0,
                        imageLink: tour.image_link_url || '',
                        imageDisplaySize: tour.image_display_size || 'medium',
                        galleryImages: tour.tour_gallery || '',
                        galleryAutoSlide: tour.gallery_auto_slide || false,
                        gallerySlideInterval: tour.gallery_slide_interval || 3000,
                        avgRating: tour.tour_rating || 0,
                        totalReviews: tour.total_reviews || 0,
                        wishlistCount: normalizeWishlistCount(tour.wishlist_count || 0),
                        lastBookingName: tour.last_booking_name || '',
                        lastBookingCountry: tour.last_booking_country || 'India',
                        lastBookingTime: tour.last_booking_time || '',
                        lastBookingCount: tour.last_booking_count || 0,
                        promoCode: tour.promo_code || '',
                        promoDiscount: tour.promo_discount || 0,
                        promoCodeValidUntil: tour.promo_code_valid_until || '',
                        hotelsLabel: tour.hotels_label || 'Hotels',
                        hotelsIcon: tour.hotels_icon || 'fa-hotel',
                        mealsLabel: tour.meals_label || 'Meals',
                        mealsIcon: tour.meals_icon || 'fa-utensils',
                        transportLabel: tour.transport_label || 'Transport',
                        transportIcon: tour.transport_icon || 'fa-car',
                        sightseeingLabel: tour.sightseeing_label || 'Sightseeing',
                        sightseeingIcon: tour.sightseeing_icon || 'fa-eye',
                        flightLabel: tour.flight_label || 'Flight',
                        flightIcon: tour.flight_icon || 'fa-plane',
                        boatLabel: tour.boat_label || 'Boat',
                        boatIcon: tour.boat_icon || 'fa-ship',
                        horseRidingLabel: tour.horse_riding_label || 'Horse Riding',
                        horseRidingIcon: tour.horse_riding_icon || 'fa-horse',
                        trekkingLabel: tour.trekking_label || 'Trekking',
                        trekkingIcon: tour.trekking_icon || 'fa-hiking',
                        hikingLabel: tour.hiking_label || 'Hiking',
                        hikingIcon: tour.hiking_icon || 'fa-mountain',
                        gstPercent: tour.gst_percent || '5',
                        gstLabel: tour.gst_label || 'GST',
                        cancellationPolicy: tour.cancellation_policy || 'non_refundable',
                        cancellationText: tour.cancellation_text || '',
                        buttonText: tour.button_text || 'Book Now',
                        buttonUrl: tour.button_url || '#',
                        buttonColor: tour.button_color || '#ff5722',
                        buttonTextColor: tour.button_text_color || '#ffffff',
                        titleColor: tour.title_color || '#333333',
                        titleFontSize: tour.title_font_size || '18px',
                        priceColor: tour.price_color || '#28a745',
                        priceFontSize: tour.price_font_size || '24px',
                        headingType: tour.heading_type || 'h4',
                        iconColor: tour.icon_color || '#075e54',
                        iconSize: tour.icon_size || '14px',
                        iconTitle: tour.icon_title || 'fa-map-marker-alt',
                        iconTitleSize: tour.icon_title_size || '20px',
                        iconTitleColor: tour.icon_title_color || '#075e54',
                        enableIconInDropdown: tour.enable_icon_dropdown !== undefined ? !!parseInt(tour.enable_icon_dropdown) : true,
                        darkMode: tour.enable_dark_mode !== undefined ? !!parseInt(tour.enable_dark_mode) : false,
                        locationIcon: tour.location_icon || 'fa-map-marker-alt',
                        locationIconSize: tour.location_icon_size || '12px',
                        locationIconColor: tour.location_icon_color || '#075e54',
                        locationTextSize: tour.location_text_size || '13px',
                        locationTextColor: tour.location_text_color || '#666666',
                        reviewStarColor: tour.review_star_color || '#FFD700',
                        reviewStarSize: tour.review_star_size || '14px',
                        nightIcon: tour.night_icon || 'fa-moon',
                        nightIconSize: tour.night_icon_size || '14px',
                        nightIconColor: tour.night_icon_color || '#FFD700',
                        dayIcon: tour.day_icon || 'fa-sun',
                        dayIconSize: tour.day_icon_size || '14px',
                        dayIconColor: tour.day_icon_color || '#FFA500',
                        showNightDayIcons: tour.show_night_day_icons !== undefined ? !!tour.show_night_day_icons : true,
                        tourId: tour.id || 0,
                        visiblePaxColumns: normalizeVisiblePaxColumns(tour.visible_pax_columns),
                        showPerDayPrice: tour.show_per_day_price !== undefined ? parseInt(tour.show_per_day_price) === 1 : true,
                        showCompletePrice: tour.show_complete_price !== undefined ? parseInt(tour.show_complete_price) === 1 : false,
                        defaultAdults: tour.tour_default_adults !== undefined ? Math.max(1, parseInt(tour.tour_default_adults)) : 2,
                        defaultChildren: tour.tour_default_children !== undefined ? Math.max(0, parseInt(tour.tour_default_children)) : 0,
                        pax1Label: tour.pax_1_label || '1 Pax',
                        pax1Icon: tour.pax_1_icon || 'fa-user',
                        pax1Price: tour.pax_1_price || 0,
                        pax2Label: tour.pax_2_label || '2 Pax',
                        pax2Icon: tour.pax_2_icon || 'fa-user-friends',
                        pax2Price: tour.pax_2_price || 0,
                        pax3Label: tour.pax_3_label || '3 Pax',
                        pax3Icon: tour.pax_3_icon || 'fa-users',
                        pax3Price: tour.pax_3_price || 0,
                        groupLabel: tour.group_label || 'Group',
                        groupIcon: tour.group_icon || 'fa-users',
                        groupPrice: tour.group_price || 0,
                        groupMaxPersons: tour.group_max_persons || 0,
                        familyLabel: tour.family_label || 'Family',
                        familyIcon: tour.family_icon || 'fa-users',
                        familyPrice: tour.family_price || 0,
                        familyMaxPersons: tour.family_max_persons || 0,
                        extraAdultPrice: tour.extra_adult_price || 0,
                        extraChildPrice: tour.extra_child_price || 0
                    });
                }

                function saveThisTour() {
                    var tourData = buildTourDataFromAtts(atts, 'card');
                    saveTourToDatabase(tourData).then(function (result) {
                        if (result.id) {
                            setAtts({ tourId: result.id });
                            window.alert('Tour saved to database. ID: ' + result.id);
                        }
                    }).catch(function (err) {
                        window.alert('Error saving tour: ' + err.message);
                    });
                }

                var paxPreviewItems = [];
                paxColumnOptions.forEach(function (col) {
                    if (visiblePax.indexOf(col.key) === -1) return;
                    var priceKey = col.key + 'Price';
                    var labelKey = col.key + 'Label';
                    var iconKey = col.key + 'Icon';
                    var maxKey = col.key + 'MaxPersons';
                    var labelText = atts[labelKey] || col.label;
                    if ((col.key === 'group' || col.key === 'family') && atts[maxKey] > 0) {
                        labelText += ' (up to ' + atts[maxKey] + ')';
                    }
                    paxPreviewItems.push({
                        label: labelText,
                        price: atts[priceKey] || 0,
                        icon: atts[iconKey] || col.icon
                    });
                });

                var cardClasses = 'ktv-editor-preview-tour-card';
                if (atts.darkMode === true) cardClasses += ' ktv-dark-mode';

                var priceUnitLabel = '';
                if (atts.showCompletePrice === true) {
                    priceUnitLabel = '/ total';
                } else if (atts.showPerDayPrice !== false) {
                    priceUnitLabel = '/ day';
                }

                var wishlistPreviewHtml = null;
                if (atts.showWishlist !== false) {
                    wishlistPreviewHtml = el('div', {
                        className: 'ktv-editor-wishlist-preview',
                        style: {
                            position: 'absolute', top: '12px', right: '12px',
                            background: 'rgba(255,255,255,0.9)', border: 'none',
                            minWidth: '36px', height: '36px', borderRadius: '25px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '5px', padding: '0 12px', zIndex: '20',
                            color: '#ff4757', pointerEvents: 'none'
                        },
                        title: 'Wishlist count comes from the database on the frontend.'
                    },
                        el('i', { className: 'far fa-heart' }),
                        el('span', {
                            className: 'ktv-wishlist-count',
                            style: {
                                fontSize: '11px', fontWeight: '700', color: '#ff4757',
                                background: 'rgba(255,71,87,0.1)', padding: '2px 6px',
                                borderRadius: '10px', minWidth: '18px', textAlign: 'center'
                            }
                        }, normalizeWishlistCount(atts.wishlistCount || 0))
                    );
                }

                var defaultAdultsPreview = atts.defaultAdults !== undefined ? Math.max(1, parseInt(atts.defaultAdults)) : 2;
                var defaultChildrenPreview = atts.defaultChildren !== undefined ? Math.max(0, parseInt(atts.defaultChildren)) : 0;
                var includedPaxHtml = null;
                if (atts.showPax !== false && (defaultAdultsPreview > 0 || defaultChildrenPreview > 0)) {
                    var paxLabelParts = [];
                    if (defaultAdultsPreview > 0) paxLabelParts.push(defaultAdultsPreview + ' Adult' + (defaultAdultsPreview === 1 ? '' : 's'));
                    if (defaultChildrenPreview > 0) paxLabelParts.push(defaultChildrenPreview + ' Kid' + (defaultChildrenPreview === 1 ? '' : 's'));
                    includedPaxHtml = el('div', {
                        className: 'ktv-editor-included-pax',
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '6px',
                            padding: '3px 10px',
                            borderRadius: '15px',
                            background: '#e8f5e9',
                            fontSize: '11px',
                            color: '#075e54',
                            fontWeight: '600'
                        }
                    },
                        defaultAdultsPreview > 0 ? el('i', { className: 'fas fa-user', style: { fontSize: atts.iconSize || '14px', color: atts.iconColor || '#075e54' } }) : null,
                        defaultChildrenPreview > 0 ? el('i', { className: 'fas fa-child', style: { fontSize: atts.iconSize || '14px', color: atts.iconColor || '#075e54' } }) : null,
                        el('span', null, paxLabelParts.join(' · '))
                    );
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        CurrencyIpPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🎯 Tour Icon (Booking Form dropdown)', initialOpen: false },
                            el(SelectControl, {
                                label: 'Icon',
                                value: atts.iconTitle || 'fa-map-marker-alt',
                                options: iconOptions,
                                onChange: function (v) { setAtts({ iconTitle: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Enable icon in Booking Form dropdown',
                                checked: atts.enableIconInDropdown !== false,
                                onChange: function (v) { setAtts({ enableIconInDropdown: v }); }
                            })
                        ),
                        el(PanelBody, { title: '📝 Content', initialOpen: true },
                            el(SelectControl, {
                                label: 'Load Tour from Database',
                                value: atts.tourId ? String(atts.tourId) : '',
                                options: tourOptions,
                                onChange: function (v) { if (v) loadTourFromDatabase(v); }
                            }),
                            el('div', { style: { background: '#f0f4f8', padding: '8px 12px', borderRadius: '4px', marginBottom: '10px' } },
                                el('strong', null, 'Tour ID: '),
                                el('span', { style: { color: '#075e54', fontWeight: '600' } }, atts.tourId || 'Not saved yet')
                            ),
                            el(TextControl, { label: 'Tour Title', value: atts.title, onChange: function (v) { setAtts({ title: v }); } }),
                            el(TextControl, { label: 'After Title Text', value: atts.afterTitleText || '', onChange: function (v) { setAtts({ afterTitleText: v }); } }),
                            el(TextControl, { label: 'Brief Text', value: atts.briefText || '', onChange: function (v) { setAtts({ briefText: v }); } }),
                            el(TextControl, { label: 'Location', value: atts.location, onChange: function (v) { setAtts({ location: v }); } }),
                            el(TextareaControl, { label: 'Description', value: atts.description, rows: 3, onChange: function (v) { setAtts({ description: v }); } }),
                            el(TextControl, { label: 'Tour ID', value: atts.tourId, type: 'number', onChange: function (v) { setAtts({ tourId: parseInt(v) || 0 }); } }),
                            el(Button, {
                                onClick: saveThisTour,
                                variant: 'primary',
                                style: { width: '100%', marginTop: '10px' }
                            }, '💾 Save Tour to Database')
                        ),
                        TitleIconControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🖼️ Image & Gallery', initialOpen: false },
                            MediaUploadControl(
                                atts.imageId,
                                function (id) { setAtts({ imageId: id }); },
                                'Main Tour Image',
                                atts.imageLink,
                                function (v) { setAtts({ imageLink: v }); },
                                atts.imageDisplaySize,
                                function (v) { setAtts({ imageDisplaySize: v }); }
                            ),
                            GalleryControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '❤️ Wishlist', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Wishlist Button',
                                checked: atts.showWishlist !== false,
                                onChange: function (v) { setAtts({ showWishlist: v }); }
                            }),
                            atts.showWishlist !== false ? el(TextControl, {
                                label: 'Wishlist Preview Count',
                                type: 'number',
                                value: atts.wishlistCount || 0,
                                onChange: function (v) { setAtts({ wishlistCount: normalizeWishlistCount(v) }); },
                                help: 'Preview only. Real count is fetched server-side.'
                            }) : null
                        ),
                        el(PanelBody, { title: '🌙 Night/Day Icons', initialOpen: false },
                            NightDayIconControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '💵 Price Display Mode', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Per Day Price (/ day)',
                                checked: atts.showPerDayPrice !== false,
                                onChange: function (v) { setAtts({ showPerDayPrice: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Show Complete Tour Price (/ total)',
                                checked: atts.showCompletePrice === true,
                                onChange: function (v) { setAtts({ showCompletePrice: v }); }
                            })
                        ),
                        el(PanelBody, { title: '👥 Default Adults / Kids', initialOpen: false },
                            el(TextControl, {
                                label: 'Default Adults',
                                type: 'number',
                                value: atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                onChange: function (v) { setAtts({ defaultAdults: Math.max(1, parseInt(v) || 1) }); }
                            }),
                            el(TextControl, {
                                label: 'Default Kids',
                                type: 'number',
                                value: atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                onChange: function (v) { setAtts({ defaultChildren: Math.max(0, parseInt(v) || 0) }); }
                            })
                        ),
                        el(PanelBody, { title: '💰 Pricing & GST', initialOpen: false },
                            el(TextControl, { label: 'Original Price', value: atts.price, type: 'number', onChange: function (v) { setAtts({ price: parseInt(v) || 0 }); } }),
                            el(TextControl, { label: 'Offer Price', value: atts.offerPrice, type: 'number', onChange: function (v) { setAtts({ offerPrice: parseInt(v) || 0 }); } }),
                            calculatedPercent > 0 ? el('p', { style: { color: '#28a745', fontSize: '12px', fontWeight: 'bold' } }, calculatedPercent + '% OFF') : null,
                            el(SelectControl, { label: 'Price Size', value: atts.priceFontSize, options: fontSizes, onChange: function (v) { setAtts({ priceFontSize: v }); } }),
                            ColorControl('Price Color', atts.priceColor, function (v) { setAtts({ priceColor: v }); }),
                            GSTControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '👥 Pax Columns', initialOpen: false },
                            el(ToggleControl, { label: 'Show Pax Columns', checked: atts.showPax !== false, onChange: function (v) { setAtts({ showPax: v }); } }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax1', label: '1 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax2', label: '2 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax3', label: '3 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'group', label: 'Group' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'family', label: 'Family' }),
                            el(TextControl, { label: 'Extra Adult Price', type: 'number', value: atts.extraAdultPrice || 0, onChange: function (v) { setAtts({ extraAdultPrice: parseFloat(v) || 0 }); } }),
                            el(TextControl, { label: 'Extra Child Price', type: 'number', value: atts.extraChildPrice || 0, onChange: function (v) { setAtts({ extraChildPrice: parseFloat(v) || 0 }); } })
                        ),
                        PaxColumnsToggleControl({ attributes: atts, setAttributes: setAtts }),
                        PromoCodeControl({ attributes: atts, setAttributes: setAtts }),
                        CancellationPolicyControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📅 Duration', initialOpen: false },
                            el(TextControl, { label: 'Nights', value: atts.durationNights, type: 'number', onChange: function (v) { setAtts({ durationNights: parseInt(v) || 0 }); } }),
                            el(TextControl, { label: 'Days', value: atts.durationDays, type: 'number', onChange: function (v) { setAtts({ durationDays: parseInt(v) || 0 }); } })
                        ),
                        el(PanelBody, { title: '🏷️ Badge', initialOpen: false },
                            el(ToggleControl, { label: 'Show Badge', checked: atts.showBadge !== false, onChange: function (v) { setAtts({ showBadge: v }); } }),
                            el(TextControl, { label: 'Badge Text', value: atts.badgeText, onChange: function (v) { setAtts({ badgeText: v }); } }),
                            ColorControl('Badge Color', atts.badgeColor, function (v) { setAtts({ badgeColor: v }); }),
                            el(SelectControl, { label: 'Badge Icon', value: atts.badgeIcon || 'fa-star', options: iconOptions, onChange: function (v) { setAtts({ badgeIcon: v }); } }),
                            BadgePositionControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '🏷️ Deal Badge (-X% OFF)', initialOpen: false },
                            ColorControl('Deal Badge Color', atts.dealBadgeColor || '#ff5722', function (v) { setAtts({ dealBadgeColor: v }); }),
                            ColorControl('Deal Badge Text Color', atts.dealBadgeTextColor || '#ffffff', function (v) { setAtts({ dealBadgeTextColor: v }); }),
                            el(SelectControl, { label: 'Deal Badge Position', value: atts.dealBadgePosition || 'bottom-right', options: badgePositionOptions, onChange: function (v) { setAtts({ dealBadgePosition: v }); } })
                        ),
                        ButtonLinkControl({ attributes: atts, setAttributes: setAtts, label: 'Button URL' }),
                        el(PanelBody, { title: '🔘 Button Styling', initialOpen: false },
                            el(TextControl, { label: 'Button Text', value: atts.buttonText, onChange: function (v) { setAtts({ buttonText: v }); } }),
                            ColorControl('Button Color', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                            ColorControl('Button Text Color', atts.buttonTextColor, function (v) { setAtts({ buttonTextColor: v }); }),
                            el(SelectControl, { label: 'Button Border Radius', value: atts.buttonBorderRadius, options: borderRadiusOptions, onChange: function (v) { setAtts({ buttonBorderRadius: v }); } }),
                            el(SelectControl, { label: 'Button Font Size', value: atts.buttonFontSize, options: fontSizes, onChange: function (v) { setAtts({ buttonFontSize: v }); } }),
                            el(SelectControl, { label: 'Button Font Weight', value: atts.buttonFontWeight, options: fontWeightOptions, onChange: function (v) { setAtts({ buttonFontWeight: v }); } })
                        ),
                        el(PanelBody, { title: '🔤 Title Typography', initialOpen: false },
                            el(SelectControl, { label: 'Heading Type', value: atts.headingType, options: headingTypes, onChange: function (v) { setAtts({ headingType: v }); } }),
                            el(SelectControl, { label: 'Title Size', value: atts.titleFontSize, options: fontSizes, onChange: function (v) { setAtts({ titleFontSize: v }); } }),
                            ColorControl('Title Color', atts.titleColor, function (v) { setAtts({ titleColor: v }); }),
                            el(SelectControl, { label: 'Title Font Family', value: atts.titleFontFamily, options: fontFamilyOptions, onChange: function (v) { setAtts({ titleFontFamily: v }); } }),
                            el(SelectControl, { label: 'Title Font Weight', value: atts.titleFontWeight, options: fontWeightOptions, onChange: function (v) { setAtts({ titleFontWeight: v }); } })
                        ),
                        el(PanelBody, { title: '📍 Location Settings', initialOpen: false },
                            IconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'locationIcon', sizeKey: 'locationIconSize', colorKey: 'locationIconColor', label: 'Location Icon' }),
                            el(SelectControl, { label: 'Location Text Size', value: atts.locationTextSize, options: fontSizes, onChange: function (v) { setAtts({ locationTextSize: v }); } }),
                            ColorControl('Location Text Color', atts.locationTextColor, function (v) { setAtts({ locationTextColor: v }); })
                        ),
                        el(PanelBody, { title: '⭐ Google-Style Reviews', initialOpen: false },
                            el(ToggleControl, { label: 'Show Reviews', checked: atts.showReviews, onChange: function (v) { setAtts({ showReviews: v }); } }),
                            atts.showReviews ? el(Fragment, {},
                                ColorControl('Star Color', atts.reviewStarColor, function (v) { setAtts({ reviewStarColor: v }); }),
                                el(SelectControl, { label: 'Star Size', value: atts.reviewStarSize, options: iconSizes, onChange: function (v) { setAtts({ reviewStarSize: v }); } }),
                                el(TextControl, { label: 'Avg Rating', value: atts.avgRating, type: 'number', step: '0.1', onChange: function (v) { setAtts({ avgRating: parseFloat(v) || 0 }); } }),
                                el(TextControl, { label: 'Total Reviews', value: atts.totalReviews, type: 'number', onChange: function (v) { setAtts({ totalReviews: parseInt(v) || 0 }); } })
                            ) : null
                        ),
                        el(PanelBody, { title: '📄 Text Typography', initialOpen: false },
                            el(SelectControl, { label: 'Brief Text Size', value: atts.briefFontSize, options: fontSizes, onChange: function (v) { setAtts({ briefFontSize: v }); } }),
                            ColorControl('Brief Text Color', atts.briefColor, function (v) { setAtts({ briefColor: v }); }),
                            el(SelectControl, { label: 'After Title Size', value: atts.afterTitleFontSize, options: fontSizes, onChange: function (v) { setAtts({ afterTitleFontSize: v }); } }),
                            ColorControl('After Title Color', atts.afterTitleColor, function (v) { setAtts({ afterTitleColor: v }); }),
                            el(SelectControl, { label: 'Description Size', value: atts.textFontSize, options: fontSizes, onChange: function (v) { setAtts({ textFontSize: v }); } }),
                            ColorControl('Description Color', atts.textColor, function (v) { setAtts({ textColor: v }); })
                        ),
                        el(PanelBody, { title: '🔄 Activity Icons', initialOpen: false },
                            el(ToggleControl, { label: 'Show Activity Icons', checked: atts.showIcons !== false, onChange: function (v) { setAtts({ showIcons: v }); } }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'hotelsIcon', labelKey: 'hotelsLabel', label: 'Hotels' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'mealsIcon', labelKey: 'mealsLabel', label: 'Meals' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'transportIcon', labelKey: 'transportLabel', label: 'Transport' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'sightseeingIcon', labelKey: 'sightseeingLabel', label: 'Sightseeing' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'flightIcon', labelKey: 'flightLabel', label: 'Flight' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'boatIcon', labelKey: 'boatLabel', label: 'Boat' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'horseRidingIcon', labelKey: 'horseRidingLabel', label: 'Horse Riding' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'trekkingIcon', labelKey: 'trekkingLabel', label: 'Trekking' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'hikingIcon', labelKey: 'hikingLabel', label: 'Hiking' })
                        ),
                        el(PanelBody, { title: '🎨 Card Styling', initialOpen: false },
                            ColorControl('Card Background', atts.cardBgColor, function (v) { setAtts({ cardBgColor: v }); }),
                            ColorControl('Border Color', atts.cardBorderColor, function (v) { setAtts({ cardBorderColor: v }); }),
                            el(SelectControl, { label: 'Border Size', value: atts.cardBorderSize, options: borderWidthOptions, onChange: function (v) { setAtts({ cardBorderSize: v }); } }),
                            el(SelectControl, { label: 'Border Radius', value: atts.cardBorderRadius, options: borderRadiusOptions, onChange: function (v) { setAtts({ cardBorderRadius: v }); } })
                        ),
                        LastBookingControl({ attributes: atts, setAttributes: setAtts })
                    ),
                    el('div', blockProps,
                        el('div', { className: cardClasses, style: atts.darkMode ? { background: '#1a1a2e', borderColor: '#2a2a3e', color: '#e0e0e0' } : {} },
                            el('div', { className: 'ktv-tour-image-wrapper', style: { position: 'relative', aspectRatio: '4/3', background: '#f0f0f0', overflow: 'hidden' } },
                                imgUrl ? (
                                    atts.imageLink && atts.imageLink !== '#' ?
                                        el('a', { href: atts.imageLink, className: 'ktv-tour-image-link', target: '_blank', style: { display: 'block', width: '100%', height: '100%' } },
                                            el('img', { src: imgUrl, alt: atts.title, width: 400, height: 300, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                        ) :
                                        el('img', { src: imgUrl, alt: atts.title, width: 400, height: 300, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                ) :
                                    el('div', { className: 'ktv-image-placeholder', style: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#999' } },
                                        '📷', el('span', null, 'Click to upload image')
                                    ),
                                (atts.badgeText && atts.showBadge !== false) ? el('div', {
                                    className: 'ktv-tour-badge',
                                    style: Object.assign({
                                        position: 'absolute', background: atts.badgeColor, color: '#fff',
                                        padding: '6px 14px', borderRadius: '25px', fontSize: '12px',
                                        fontWeight: '600', zIndex: '10', display: 'flex', alignItems: 'center', gap: '5px'
                                    }, badgePos)
                                },
                                    el('i', { className: 'fas ' + (atts.badgeIcon || 'fa-star') }),
                                    ' ', atts.badgeText
                                ) : null,
                                calculatedPercent > 0 ? el('div', {
                                    className: 'ktv-tour-badge ktv-badge-deal',
                                    style: Object.assign({
                                        position: 'absolute',
                                        background: atts.dealBadgeColor || '#ff5722',
                                        color: atts.dealBadgeTextColor || '#ffffff',
                                        padding: '6px 14px', borderRadius: '25px',
                                        fontSize: '12px', fontWeight: '700', zIndex: '10'
                                    }, dealBadgePos)
                                }, '-' + calculatedPercent + '% OFF') : null,
                                wishlistPreviewHtml,
                                atts.showNightDayIcons ? el('div', {
                                    className: 'ktv-night-day-icon',
                                    style: {
                                        position: 'absolute', bottom: '12px', left: '12px',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: 'rgba(0,0,0,0.7)', padding: '4px 12px',
                                        borderRadius: '15px', zIndex: '10'
                                    }
                                },
                                    el('i', {
                                        className: 'fas ' + (atts.nightIcon || 'fa-moon'),
                                        style: { fontSize: atts.nightIconSize || '14px', color: atts.nightIconColor || '#FFD700' }
                                    }),
                                    el('span', { style: { fontSize: '11px', color: '#fff', fontWeight: '600' } }, atts.durationNights || 0, 'N'),
                                    el('i', {
                                        className: 'fas ' + (atts.dayIcon || 'fa-sun'),
                                        style: { fontSize: atts.dayIconSize || '14px', color: atts.dayIconColor || '#FFA500' }
                                    }),
                                    el('span', { style: { fontSize: '11px', color: '#fff', fontWeight: '600' } }, atts.durationDays || 0, 'D')
                                ) : el('div', {
                                    className: 'ktv-tour-duration-badge',
                                    style: {
                                        position: 'absolute', bottom: '12px', left: '12px',
                                        background: 'rgba(0,0,0,0.7)', color: '#fff',
                                        padding: '5px 12px', borderRadius: '20px',
                                        fontSize: '12px', display: 'flex', gap: '8px', zIndex: '10'
                                    }
                                },
                                    el('i', { className: 'fas fa-moon' }), ' ', atts.durationNights || 0, 'N ',
                                    el('i', { className: 'fas fa-sun' }), ' ', atts.durationDays || 0, 'D'
                                )
                            ),
                            el('div', { className: 'ktv-tour-details', style: { padding: '18px' } },
                                atts.afterTitleText ? el('div', { className: 'ktv-tour-after-title', style: { fontSize: atts.afterTitleFontSize, color: atts.afterTitleColor, fontWeight: '600', marginBottom: '6px' } }, atts.afterTitleText) : null,
                                el(heading_tag, { className: 'ktv-tour-title', style: { fontSize: atts.titleFontSize, color: atts.titleColor, fontFamily: atts.titleFontFamily, fontWeight: atts.titleFontWeight, margin: '0 0 5px' } },
                                    atts.title || 'Tour Title'
                                ),
                                includedPaxHtml,
                                atts.briefText ? el('p', { className: 'ktv-tour-brief', style: { fontSize: atts.briefFontSize, color: atts.briefColor, marginBottom: '8px' } }, atts.briefText) : null,
                                atts.location ? el('div', { className: 'ktv-tour-location', style: { fontSize: atts.locationTextSize, color: atts.locationTextColor, marginBottom: '12px' } },
                                    el('i', { className: 'fas ' + atts.locationIcon, style: { fontSize: atts.locationIconSize, color: atts.locationIconColor } }),
                                    ' ', atts.location
                                ) : null,
                                (atts.showIcons !== false) ? el('div', { className: 'ktv-tour-icons', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' } },
                                    atts.hotelsLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.hotelsIcon }), ' ', atts.hotelsLabel) : null,
                                    atts.mealsLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.mealsIcon }), ' ', atts.mealsLabel) : null,
                                    atts.transportLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.transportIcon }), ' ', atts.transportLabel) : null,
                                    atts.sightseeingLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.sightseeingIcon }), ' ', atts.sightseeingLabel) : null,
                                    atts.flightLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.flightIcon }), ' ', atts.flightLabel) : null,
                                    atts.boatLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.boatIcon }), ' ', atts.boatLabel) : null,
                                    atts.horseRidingLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.horseRidingIcon }), ' ', atts.horseRidingLabel) : null,
                                    atts.trekkingLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.trekkingIcon }), ' ', atts.trekkingLabel) : null,
                                    atts.hikingLabel ? el('span', { className: 'ktv-tour-icon-item', style: { fontSize: atts.iconSize, color: atts.iconColor, background: '#e8f5e9', padding: '3px 10px', borderRadius: '15px' } }, el('i', { className: 'fas ' + atts.hikingIcon }), ' ', atts.hikingLabel) : null
                                ) : null,
                                (atts.showPax !== false && paxPreviewItems.length > 0) ? el('div', {
                                    className: 'ktv-tour-pax-grid',
                                    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', marginBottom: '12px', fontSize: '12px', textAlign: 'center', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }
                                },
                                    paxPreviewItems.map(function (p, i) {
                                        return el('div', { className: 'ktv-pax-item', key: i },
                                            el('i', { className: 'fas ' + (p.icon || 'fa-user'), style: { fontSize: atts.iconSize, color: atts.iconColor, display: 'block', marginBottom: '4px' } }),
                                            el('span', { style: { display: 'block', color: '#666', marginBottom: '2px' } }, p.label),
                                            el('strong', { style: { display: 'block', color: '#28a745', fontSize: '13px' } }, cs + (p.price || 0))
                                        );
                                    })
                                ) : null,
                                atts.showReviews ? el('div', {
                                    className: 'ktv-tour-reviews-mini ktv-review-clickable',
                                    style: { display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 8px', cursor: 'pointer' }
                                },
                                    atts.totalReviews > 0 ? el(Fragment, {},
                                        el('span', { style: { fontWeight: '700', fontSize: '16px', color: '#333' } }, parseFloat(atts.avgRating || 0).toFixed(1)),
                                        el('span', { style: { color: atts.reviewStarColor, fontSize: atts.reviewStarSize } },
                                            (function () {
                                                var stars = '';
                                                var r = atts.avgRating || 0;
                                                var fullStars = Math.floor(r);
                                                var hasHalf = (r - fullStars) >= 0.5;
                                                for (var i = 1; i <= 5; i++) {
                                                    if (i <= fullStars) stars += '★';
                                                    else if (i === fullStars + 1 && hasHalf) stars += '★';
                                                    else stars += '☆';
                                                }
                                                return stars;
                                            })()
                                        ),
                                        el('span', { style: { fontSize: '12px', color: '#666' } }, '(' + atts.totalReviews + ' reviews)')
                                    ) : el('span', { className: 'ktv-zero-reviews-link', style: { fontSize: '12px', color: '#666', cursor: 'pointer' } }, '0 Reviews')
                                ) : null,
                                atts.showLastBooking && atts.lastBookingName ? el('div', {
                                    className: 'ktv-last-booking',
                                    style: {
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: '#e8f5e9', padding: '8px 12px',
                                        borderRadius: '8px', fontSize: '12px', marginBottom: '12px'
                                    }
                                },
                                    el('i', { className: 'fas fa-clock' }), ' ',
                                    atts.lastBookingCount > 0 ? 'Booked ' + atts.lastBookingCount + ' times' : 'Last booking',
                                    ' ', el('strong', null, atts.lastBookingName), ' from ', atts.lastBookingCountry,
                                    ' - ', el('span', { className: 'ktv-time-ago' }, atts.lastBookingTime || 'Just now')
                                ) : null,
                                atts.promoCode ? el('div', {
                                    className: 'ktv-promo-code',
                                    style: {
                                        margin: '8px 0', padding: '8px 12px',
                                        background: 'linear-gradient(135deg,#fff3e0,#ffe0b2)',
                                        borderRadius: '8px', border: '1px dashed #ff5722',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        flexWrap: 'wrap', gap: '5px'
                                    }
                                },
                                    el('span', { style: { fontSize: '12px', color: '#e65100' } },
                                        el('i', { className: 'fas fa-ticket-alt', style: { marginRight: '6px' } }),
                                        'Promo: ', el('strong', { style: { textTransform: 'uppercase' } }, atts.promoCode)
                                    ),
                                    atts.promoDiscount > 0 ? el('span', { style: { fontSize: '11px', color: '#ff5722', fontWeight: '600' } }, '-' + atts.promoDiscount + '% OFF') : null,
                                    atts.promoCodeValidUntil ? el('span', { style: { fontSize: '10px', color: '#999' } }, 'Valid until ' + new Date(atts.promoCodeValidUntil).toLocaleDateString()) : null
                                ) : null,
                                atts.cancellationPolicy || atts.cancellationText ? el('div', {
                                    className: 'ktv-cancellation-policy',
                                    style: {
                                        margin: '8px 0', padding: '6px 12px',
                                        background: '#f8f9fa', borderRadius: '6px',
                                        fontSize: '11px', color: '#666',
                                        borderLeft: '3px solid ' + (atts.cancellationPolicy === 'fully_refundable' ? '#28a745' : (atts.cancellationPolicy === 'partial_refundable' ? '#ffc107' : '#dc3545'))
                                    }
                                },
                                    el('i', { className: 'fas fa-info-circle', style: { marginRight: '6px' } }),
                                    ' ', atts.cancellationText || (atts.cancellationPolicy === 'fully_refundable' ? 'Fully Refundable' : atts.cancellationPolicy === 'partial_refundable' ? 'Partial Refundable' : 'Non-Refundable')
                                ) : null,
                                el('div', { className: 'ktv-tour-price', style: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' } },
                                    hasDiscount ? el('span', { className: 'ktv-old-price', style: { textDecoration: 'line-through', color: '#999', fontSize: '14px' } }, cs + atts.price) : null,
                                    el('span', { className: 'ktv-new-price', style: { fontSize: atts.priceFontSize, color: atts.priceColor, fontFamily: atts.priceFontFamily, fontWeight: atts.priceFontWeight } }, cs + (displayPrice || 0)),
                                    priceUnitLabel ? el('span', { className: 'ktv-price-unit', style: { fontSize: '12px', color: '#888' } }, priceUnitLabel) : null,
                                    atts.showGst ? el('span', { className: 'ktv-gst-badge', style: { display: 'inline-block', background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' } },
                                        el('i', { className: 'fas fa-receipt' }), ' ', atts.gstLabel || 'GST', ' ', atts.gstPercent || '5', '%'
                                    ) : null
                                ),
                                atts.buttonUrl && atts.buttonUrl !== '#' ?
                                    el('a', {
                                        href: atts.buttonUrl,
                                        className: 'ktv-tour-book-btn',
                                        title: (atts.buttonText || 'Book Now') + ' — ' + (atts.title || ''),
                                        style: {
                                            width: '100%', padding: atts.buttonPadding,
                                            background: atts.buttonColor, color: atts.buttonTextColor,
                                            border: 'none', borderRadius: atts.buttonBorderRadius,
                                            cursor: 'pointer', fontWeight: atts.buttonFontWeight,
                                            fontSize: atts.buttonFontSize, textDecoration: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', textAlign: 'center'
                                        },
                                        'data-tour-id': atts.tourId || 0,
                                        'data-tour-name': atts.title || '',
                                        'data-tour-price': displayPrice || 0,
                                        'data-tour-location': atts.location || '',
                                        'data-block-type': 'card',
                                        'data-tour-adults': atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                        'data-tour-children': atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                        'data-show-per-day': atts.showPerDayPrice !== false ? '1' : '0',
                                        'data-show-complete': atts.showCompletePrice === true ? '1' : '0',
                                        'data-price-basis': atts.showCompletePrice === true ? 'total' : 'per_day'
                                    },
                                        el('i', { className: 'fas fa-calendar-check' }), ' ', atts.buttonText
                                    ) :
                                    el('button', {
                                        className: 'ktv-tour-book-btn',
                                        title: (atts.buttonText || 'Book Now') + ' — ' + (atts.title || ''),
                                        style: {
                                            width: '100%', padding: atts.buttonPadding,
                                            background: atts.buttonColor, color: atts.buttonTextColor,
                                            border: 'none', borderRadius: atts.buttonBorderRadius,
                                            cursor: 'pointer', fontWeight: atts.buttonFontWeight,
                                            fontSize: atts.buttonFontSize, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        },
                                        'data-tour-id': atts.tourId || 0,
                                        'data-tour-name': atts.title || '',
                                        'data-tour-price': displayPrice || 0,
                                        'data-tour-location': atts.location || '',
                                        'data-block-type': 'card',
                                        'data-tour-adults': atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                        'data-tour-children': atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                        'data-show-per-day': atts.showPerDayPrice !== false ? '1' : '0',
                                        'data-show-complete': atts.showCompletePrice === true ? '1' : '0',
                                        'data-price-basis': atts.showCompletePrice === true ? 'total' : 'per_day'
                                    },
                                        el('i', { className: 'fas fa-calendar-check' }), ' ', atts.buttonText
                                    )
                            )
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           10. BLOCK — KTV TOUR GRID
           ============================================================ */

        wp.blocks.registerBlockType('ktv/tour-grid', {
            title: 'KTV Tour Grid',
            description: 'Display multiple tour cards with sort, filter, search, pax columns, activity icons. Load from DB, add custom tours, save all back.',
            icon: 'grid-view',
            category: 'ktv-travel',
            keywords: ['tours', 'grid', 'packages', 'sort', 'filter', 'search'],
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                limit: { type: 'number', default: 6 },
                columns: { type: 'number', default: 3 },
                showWishlist: { type: 'boolean', default: true },
                titleFontSize: { type: 'string', default: '18px' },
                titleColor: { type: 'string', default: '#333333' },
                priceFontSize: { type: 'string', default: '24px' },
                priceColor: { type: 'string', default: '#28a745' },
                sortBy: { type: 'string', default: 'newest' },
                headingType: { type: 'string', default: 'h4' },
                showReviews: { type: 'boolean', default: true },
                reviewStarColor: { type: 'string', default: '#FFD700' },
                reviewStarSize: { type: 'string', default: '14px' },
                locationIcon: { type: 'string', default: 'fa-map-marker-alt' },
                locationIconSize: { type: 'string', default: '12px' },
                locationIconColor: { type: 'string', default: '#075e54' },
                locationTextSize: { type: 'string', default: '13px' },
                locationTextColor: { type: 'string', default: '#666666' },
                iconSize: { type: 'string', default: '14px' },
                iconColor: { type: 'string', default: '#075e54' },
                showPaxColumns: { type: 'boolean', default: true },
                visiblePaxColumns: { type: 'string', default: 'pax1' },
                showActivityIcons: { type: 'boolean', default: true },
                gridTitle: { type: 'string', default: 'Our Popular Tours' },
                gridTitleHeading: { type: 'string', default: 'h2' },
                buttonText: { type: 'string', default: 'Book Now' },
                buttonUrl: { type: 'string', default: '#' },
                buttonColor: { type: 'string', default: '#ff5722' },
                buttonTextColor: { type: 'string', default: '#ffffff' },
                badgeBgColor: { type: 'string', default: '#ff5722' },
                badgeTextColor: { type: 'string', default: '#ffffff' },
                showPerDayPrice: { type: 'boolean', default: true },
                showCompletePrice: { type: 'boolean', default: false },
                defaultAdults: { type: 'number', default: 2 },
                defaultChildren: { type: 'number', default: 0 },
                pax1Label: { type: 'string', default: '1 Pax' },
                pax1Icon: { type: 'string', default: 'fa-user' },
                pax1Price: { type: 'number', default: 0 },
                pax2Label: { type: 'string', default: '2 Pax' },
                pax2Icon: { type: 'string', default: 'fa-user-friends' },
                pax2Price: { type: 'number', default: 0 },
                pax3Label: { type: 'string', default: '3 Pax' },
                pax3Icon: { type: 'string', default: 'fa-users' },
                pax3Price: { type: 'number', default: 0 },
                groupLabel: { type: 'string', default: 'Group' },
                groupIcon: { type: 'string', default: 'fa-users' },
                groupPrice: { type: 'number', default: 0 },
                groupMaxPersons: { type: 'number', default: 0 },
                familyLabel: { type: 'string', default: 'Family' },
                familyIcon: { type: 'string', default: 'fa-users' },
                familyPrice: { type: 'number', default: 0 },
                familyMaxPersons: { type: 'number', default: 0 },
                hotelsLabel: { type: 'string', default: 'Hotels' },
                hotelsIcon: { type: 'string', default: 'fa-hotel' },
                mealsLabel: { type: 'string', default: 'Meals' },
                mealsIcon: { type: 'string', default: 'fa-utensils' },
                transportLabel: { type: 'string', default: 'Transport' },
                transportIcon: { type: 'string', default: 'fa-car' },
                sightseeingLabel: { type: 'string', default: 'Sightseeing' },
                sightseeingIcon: { type: 'string', default: 'fa-eye' },
                flightLabel: { type: 'string', default: 'Flight' },
                flightIcon: { type: 'string', default: 'fa-plane' },
                boatLabel: { type: 'string', default: 'Boat' },
                boatIcon: { type: 'string', default: 'fa-ship' },
                horseRidingLabel: { type: 'string', default: 'Horse Riding' },
                horseRidingIcon: { type: 'string', default: 'fa-horse' },
                trekkingLabel: { type: 'string', default: 'Trekking' },
                trekkingIcon: { type: 'string', default: 'fa-hiking' },
                hikingLabel: { type: 'string', default: 'Hiking' },
                hikingIcon: { type: 'string', default: 'fa-mountain' },
                filterLocation: { type: 'string', default: '' },
                customTours: { type: 'array', default: [] },
                showLastBooking: { type: 'boolean', default: true },
                lastBookingName: { type: 'string', default: '' },
                lastBookingCountry: { type: 'string', default: 'India' },
                lastBookingTime: { type: 'string', default: '' },
                lastBookingCount: { type: 'number', default: 0 },
                promoCode: { type: 'string', default: '' },
                promoDiscount: { type: 'number', default: 0 },
                promoCodeValidUntil: { type: 'string', default: '' },
                gstPercent: { type: 'string', default: '5' },
                gstLabel: { type: 'string', default: 'GST' },
                showGst: { type: 'boolean', default: true },
                cancellationPolicy: { type: 'string', default: 'non_refundable' },
                cancellationText: { type: 'string', default: '' },
                enableIcon: { type: 'boolean', default: true },
                enableIconInDropdown: { type: 'boolean', default: true },
                enableIpPricing: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-map-marker-alt' },
                iconTitleSize: { type: 'string', default: '20px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                imageDisplaySize: { type: 'string', default: 'medium' },
                nightIcon: { type: 'string', default: 'fa-moon' },
                nightIconSize: { type: 'string', default: '14px' },
                nightIconColor: { type: 'string', default: '#FFD700' },
                dayIcon: { type: 'string', default: 'fa-sun' },
                dayIconSize: { type: 'string', default: '14px' },
                dayIconColor: { type: 'string', default: '#FFA500' },
                showNightDayIcons: { type: 'boolean', default: true },
                showBadge: { type: 'boolean', default: true },
                showIcons: { type: 'boolean', default: true },
                showPax: { type: 'boolean', default: true },
                enableSortFilter: { type: 'boolean', default: true },
                sortFilterStyle: { type: 'string', default: 'classic' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-tour-grid' });
                var cs = getCurrencySymbol((typeof ktv_editor_data !== 'undefined' && ktv_editor_data.currency_code) ? ktv_editor_data.currency_code : 'USD');
                var heading_tag = atts.headingType || 'h4';
                var customTours = atts.customTours || [];
                var dynamicTours = getDynamicTours();
                var visiblePax = parseVisiblePaxToArray(atts.visiblePaxColumns);
                var locationOpts = buildLocationOptions();

                function newCustomTourFromDb(tour) {
                    return buildCustomTourFromDb(tour);
                }

                function loadToursFromDatabase() {
                    loadAllToursFromDatabase('all')
                        .then(function (tours) {
                            var mapped = tours
                                .filter(function (t) { return t.is_hardcoded != 1 && t.is_ghost != 1; })
                                .map(function (t) { return newCustomTourFromDb(t); })
                                .filter(function (t) { return t !== null; });
                            setAtts({ customTours: mapped });
                            window.alert('Loaded ' + mapped.length + ' tours from database.');
                        })
                        .catch(function (err) {
                            window.alert('Error loading tours: ' + err.message);
                        });
                }

                function addCustomTourFromDatabase(tourId) {
                    var tour = getTourById(parseInt(tourId));
                    if (!tour || tour.is_hardcoded == 1) return;
                    var built = newCustomTourFromDb(tour);
                    if (!built) return;
                    var newTours = customTours.concat([built]);
                    setAtts({ customTours: newTours });
                }

                function addCustomTour() {
                    var newTours = customTours.concat([{
                        id: Date.now(),
                        title: 'New Tour',
                        price: 0, offerPrice: 0,
                        imageId: 0, imageLink: '', imageDisplaySize: 'medium',
                        location: '', briefText: '',
                        badgeText: '', badgeColor: '#ff5722', badgePosition: 'top-left',
                        rating: 0, reviews: 0,
                        durationNights: 0, durationDays: 0,
                        afterTitleText: '',
                        iconTitle: 'fa-map-marker-alt',
                        lastBookingName: '', lastBookingCountry: 'India',
                        lastBookingTime: '', lastBookingCount: 0,
                        promoCode: '', promoDiscount: 0, promoCodeValidUntil: '',
                        cancellationPolicy: 'non_refundable', cancellationText: '',
                        buttonUrl: '#',
                        nightIcon: 'fa-moon', dayIcon: 'fa-sun',
                        nightIconSize: '14px', dayIconSize: '14px',
                        nightIconColor: '#FFD700', dayIconColor: '#FFA500',
                        showNightDayIcons: true,
                        tour_block_type: 'grid',
                        visiblePaxColumns: 'pax1',
                        wishlistCount: 0,
                        showWishlist: true,
                        showPerDayPrice: 1,
                        showCompletePrice: 0,
                        defaultAdults: 2,
                        defaultChildren: 0,
                        pax1Label: '1 Pax', pax1Icon: 'fa-user', pax1Price: 0,
                        pax2Label: '2 Pax', pax2Icon: 'fa-user-friends', pax2Price: 0,
                        pax3Label: '3 Pax', pax3Icon: 'fa-users', pax3Price: 0,
                        groupLabel: 'Group', groupIcon: 'fa-users', groupPrice: 0, groupMaxPersons: 0,
                        familyLabel: 'Family', familyIcon: 'fa-users', familyPrice: 0, familyMaxPersons: 0,
                        extraAdultPrice: 0, extraChildPrice: 0,
                        hotelsLabel: 'Hotels', hotelsIcon: 'fa-hotel',
                        mealsLabel: 'Meals', mealsIcon: 'fa-utensils',
                        transportLabel: 'Transport', transportIcon: 'fa-car',
                        sightseeingLabel: 'Sightseeing', sightseeingIcon: 'fa-eye',
                        flightLabel: 'Flight', flightIcon: 'fa-plane',
                        boatLabel: 'Boat', boatIcon: 'fa-ship',
                        horseRidingLabel: 'Horse Riding', horseRidingIcon: 'fa-horse',
                        trekkingLabel: 'Trekking', trekkingIcon: 'fa-hiking',
                        hikingLabel: 'Hiking', hikingIcon: 'fa-mountain',
                        is_hardcoded: 0
                    }]);
                    setAtts({ customTours: newTours });
                }

                function updateCustomTour(index, key, value) {
                    var updated = (customTours || []).slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ customTours: updated });
                }

                function deleteCustomTour(index) {
                    var updated = (customTours || []).slice();
                    updated.splice(index, 1);
                    setAtts({ customTours: updated });
                }

                function saveAllToursToDatabase() {
                    if (!customTours.length) {
                        window.alert('No tours to save.');
                        return;
                    }
                    var pending = customTours.filter(function (t) { return t.is_hardcoded != 1; });
                    var total = pending.length;
                    var done = 0, savedCount = 0, failed = 0;

                    pending.forEach(function (tour, index) {
                        var tourData = buildTourDataFromAtts(tour, tour.tour_block_type || 'grid');
                        tourData.id = (tour.id && String(tour.id).length < 10) ? tour.id : 0;
                        tourData.tour_name = tour.title || 'Tour ' + (index + 1);
                        tourData.tour_brief_text = tour.briefText || '';
                        tourData.tour_after_title_text = tour.afterTitleText || '';
                        tourData.visible_pax_columns = normalizeVisiblePaxColumns(tour.visiblePaxColumns);
                        tourData.gst_percent = atts.gstPercent || '5';
                        tourData.gst_label = atts.gstLabel || 'GST';
                        tourData.cancellation_policy = tour.cancellationPolicy || 'non_refundable';
                        tourData.cancellation_text = tour.cancellationText || '';
                        tourData.night_icon = tour.nightIcon || 'fa-moon';
                        tourData.night_icon_color = tour.nightIconColor || '#FFD700';
                        tourData.night_icon_size = tour.nightIconSize || '14px';
                        tourData.day_icon = tour.dayIcon || 'fa-sun';
                        tourData.day_icon_color = tour.dayIconColor || '#FFA500';
                        tourData.day_icon_size = tour.dayIconSize || '14px';
                        tourData.show_night_day_icons = tour.showNightDayIcons !== undefined ? (tour.showNightDayIcons ? 1 : 0) : 1;

                        saveTourToDatabase(tourData)
                            .then(function (result) {
                                if (result && result.id) {
                                    updateCustomTour(index, 'id', result.id);
                                }
                                savedCount++;
                            })
                            .catch(function (err) {
                                console.error('Error saving tour:', err);
                                failed++;
                            })
                            .then(function () {
                                done++;
                                if (done === total) {
                                    window.alert('Saved ' + savedCount + ' tours.' + (failed ? ' ' + failed + ' failed.' : ''));
                                }
                            });
                    });
                }

                var tourOptions = [{ label: 'Select a Tour from Database', value: '' }];
                dynamicTours.forEach(function (tour) {
                    if (tour.is_hardcoded == 1) return;
                    tourOptions.push({ label: tour.tour_name + ' (' + tour.block_type + ')', value: String(tour.id) });
                });

                var paxPreviewItems = [];
                paxColumnOptions.forEach(function (col) {
                    if (visiblePax.indexOf(col.key) === -1) return;
                    var priceKey = col.key + 'Price';
                    var labelKey = col.key + 'Label';
                    var iconKey = col.key + 'Icon';
                    var maxKey = col.key + 'MaxPersons';
                    var labelText = atts[labelKey] || col.label;
                    if ((col.key === 'group' || col.key === 'family') && atts[maxKey] > 0) {
                        labelText += ' (up to ' + atts[maxKey] + ')';
                    }
                    paxPreviewItems.push({
                        label: labelText,
                        price: atts[priceKey] || 0,
                        icon: atts[iconKey] || col.icon
                    });
                });

                var gridClasses = 'ktv-editor-preview-tour-grid';
                if (atts.darkMode === true) gridClasses += ' ktv-dark-mode';

                var sortFilterMock = null;
                if (atts.enableSortFilter !== false) {
                    sortFilterMock = el('div', {
                        className: 'ktv-grid-controls ktv-grid-controls-editor-mock',
                        style: {
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            flexWrap: 'wrap', gap: '10px', marginBottom: '15px',
                            padding: '12px 16px', background: atts.darkMode ? '#222244' : '#f8f9fa',
                            borderRadius: '12px'
                        }
                    },
                        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: atts.darkMode ? '#e0e0e0' : '#666' } },
                            el('i', { className: 'fas fa-sort-amount-down' }),
                            el('span', null, 'Sort:'),
                            el('select', {
                                disabled: true,
                                value: atts.sortBy || 'newest',
                                onChange: function () {},
                                style: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '12px', cursor: 'not-allowed' }
                            },
                                sortOptions.map(function (o) {
                                    return el('option', { key: o.value, value: o.value, selected: atts.sortBy === o.value }, o.label);
                                })
                            )
                        ),
                        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: atts.darkMode ? '#e0e0e0' : '#666' } },
                            el('i', { className: 'fas fa-filter' }),
                            el('span', null, 'Filter by Location:'),
                            el('select', {
                                disabled: true,
                                value: atts.filterLocation || '',
                                onChange: function () {},
                                style: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '12px', cursor: 'not-allowed' }
                            },
                                locationOpts.map(function (o) {
                                    return el('option', { key: o.value, value: o.value, selected: atts.filterLocation === o.value }, o.label);
                                })
                            )
                        ),
                        el('div', {
                            className: 'ktv-grid-search',
                            style: {
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: atts.darkMode ? '#1a1a2e' : '#fff', padding: '4px 10px',
                                borderRadius: '6px', border: '1px solid #ddd'
                            }
                        },
                            el('i', { className: 'fas fa-search', style: { color: '#999', fontSize: '12px' } }),
                            el('input', {
                                type: 'text',
                                placeholder: 'Search tours...',
                                disabled: true,
                                style: { border: 'none', padding: '6px 4px', fontSize: '12px', background: 'transparent', outline: 'none', minWidth: '140px', cursor: 'not-allowed' }
                            })
                        )
                    );
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        CurrencyIpPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🎯 Grid Icon (Booking Form dropdown)', initialOpen: false },
                            el(SelectControl, {
                                label: 'Icon',
                                value: atts.iconTitle || 'fa-map-marker-alt',
                                options: iconOptions,
                                onChange: function (v) { setAtts({ iconTitle: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Enable icon in Booking Form dropdown',
                                checked: atts.enableIconInDropdown !== false,
                                onChange: function (v) { setAtts({ enableIconInDropdown: v }); }
                            })
                        ),
                        el(PanelBody, { title: '💵 Price Display Mode', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Per Day Price (/ day)',
                                checked: atts.showPerDayPrice !== false,
                                onChange: function (v) { setAtts({ showPerDayPrice: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Show Complete Tour Price (/ total)',
                                checked: atts.showCompletePrice === true,
                                onChange: function (v) { setAtts({ showCompletePrice: v }); }
                            })
                        ),
                        el(PanelBody, { title: '👥 Default Adults / Kids', initialOpen: false },
                            el(TextControl, {
                                label: 'Default Adults',
                                type: 'number',
                                value: atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                onChange: function (v) { setAtts({ defaultAdults: Math.max(1, parseInt(v) || 1) }); }
                            }),
                            el(TextControl, {
                                label: 'Default Kids',
                                type: 'number',
                                value: atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                onChange: function (v) { setAtts({ defaultChildren: Math.max(0, parseInt(v) || 0) }); }
                            })
                        ),
                        el(PanelBody, { title: '🔄 Sort & Filter', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Enable Sort & Filter Bar',
                                checked: atts.enableSortFilter !== false,
                                onChange: function (v) { setAtts({ enableSortFilter: v }); }
                            }),
                            atts.enableSortFilter !== false ? el(SelectControl, {
                                label: 'Sort Filter Style',
                                value: atts.sortFilterStyle || 'classic',
                                options: sortFilterStyleOptions,
                                onChange: function (v) { setAtts({ sortFilterStyle: v }); }
                            }) : null,
                            atts.enableSortFilter !== false ? el(SelectControl, {
                                label: 'Default Sort By',
                                value: atts.sortBy || 'newest',
                                options: sortOptions,
                                onChange: function (v) { setAtts({ sortBy: v }); }
                            }) : null,
                            atts.enableSortFilter !== false ? el(SelectControl, {
                                label: 'Default Location Filter',
                                value: atts.filterLocation || '',
                                options: locationOpts,
                                onChange: function (v) { setAtts({ filterLocation: v }); }
                            }) : null
                        ),
                        el(PanelBody, { title: '📐 Grid Layout', initialOpen: false },
                            el(RangeControl, {
                                label: 'Columns',
                                value: atts.columns !== undefined ? atts.columns : 3,
                                onChange: function (v) { setAtts({ columns: parseInt(v) || 3 }); },
                                min: 1, max: 6, step: 1
                            }),
                            el(RangeControl, {
                                label: 'Number of Tours (Limit)',
                                value: atts.limit !== undefined ? atts.limit : 6,
                                onChange: function (v) { setAtts({ limit: parseInt(v) || 6 }); },
                                min: 1, max: 50, step: 1
                            })
                        ),
                        el(PanelBody, { title: '🌙 Night/Day Icons', initialOpen: false },
                            NightDayIconControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '🖼️ Image Settings', initialOpen: false },
                            el(SelectControl, {
                                label: 'Default Image Display Size',
                                value: atts.imageDisplaySize || 'medium',
                                options: imageDisplaySizeOptions,
                                onChange: function (v) { setAtts({ imageDisplaySize: v }); }
                            })
                        ),
                        PromoCodeControl({ attributes: atts, setAttributes: setAtts }),
                        CancellationPolicyControl({ attributes: atts, setAttributes: setAtts }),
                        ButtonLinkControl({ attributes: atts, setAttributes: setAtts, label: 'Grid Button URL' }),
                        el(PanelBody, { title: '📋 Grid Title', initialOpen: false },
                            el(TextControl, { label: 'Section Title', value: atts.gridTitle, onChange: function (v) { setAtts({ gridTitle: v }); } }),
                            el(SelectControl, { label: 'Title Heading', value: atts.gridTitleHeading, options: headingTypes, onChange: function (v) { setAtts({ gridTitleHeading: v }); } })
                        ),
                        LastBookingControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '👥 Pax Columns (Editable)', initialOpen: false },
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax1', label: '1 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax2', label: '2 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax3', label: '3 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'group', label: 'Group' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'family', label: 'Family' })
                        ),
                        PaxColumnsToggleControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🔄 Activity Icons', initialOpen: false },
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'hotelsIcon', labelKey: 'hotelsLabel', label: 'Hotels' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'mealsIcon', labelKey: 'mealsLabel', label: 'Meals' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'transportIcon', labelKey: 'transportLabel', label: 'Transport' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'sightseeingIcon', labelKey: 'sightseeingLabel', label: 'Sightseeing' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'flightIcon', labelKey: 'flightLabel', label: 'Flight' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'boatIcon', labelKey: 'boatLabel', label: 'Boat' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'horseRidingIcon', labelKey: 'horseRidingLabel', label: 'Horse Riding' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'trekkingIcon', labelKey: 'trekkingLabel', label: 'Trekking' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'hikingIcon', labelKey: 'hikingLabel', label: 'Hiking' })
                        ),
                        el(PanelBody, { title: '🎨 Colors & Badges', initialOpen: false },
                            el(SelectControl, { label: 'Card Heading Type', value: atts.headingType, options: headingTypes, onChange: function (v) { setAtts({ headingType: v }); } }),
                            el(SelectControl, { label: 'Title Size', value: atts.titleFontSize, options: fontSizes, onChange: function (v) { setAtts({ titleFontSize: v }); } }),
                            ColorControl('Title Color', atts.titleColor, function (v) { setAtts({ titleColor: v }); }),
                            el(SelectControl, { label: 'Price Size', value: atts.priceFontSize, options: fontSizes, onChange: function (v) { setAtts({ priceFontSize: v }); } }),
                            ColorControl('Price Color', atts.priceColor, function (v) { setAtts({ priceColor: v }); }),
                            ColorControl('Button Background', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                            ColorControl('Button Text Color', atts.buttonTextColor, function (v) { setAtts({ buttonTextColor: v }); }),
                            ColorControl('Badge Background', atts.badgeBgColor || '#ff5722', function (v) { setAtts({ badgeBgColor: v }); }),
                            ColorControl('Badge Text Color', atts.badgeTextColor || '#ffffff', function (v) { setAtts({ badgeTextColor: v }); })
                        ),
                        el(PanelBody, { title: '📍 Location Settings', initialOpen: false },
                            IconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'locationIcon', sizeKey: 'locationIconSize', colorKey: 'locationIconColor', label: 'Location Icon' }),
                            el(SelectControl, { label: 'Location Text Size', value: atts.locationTextSize, options: fontSizes, onChange: function (v) { setAtts({ locationTextSize: v }); } }),
                            ColorControl('Location Text Color', atts.locationTextColor, function (v) { setAtts({ locationTextColor: v }); })
                        ),
                        el(PanelBody, { title: '⭐ Google-Style Reviews', initialOpen: false },
                            el(ToggleControl, { label: 'Show Reviews', checked: atts.showReviews, onChange: function (v) { setAtts({ showReviews: v }); } }),
                            atts.showReviews ? el(Fragment, {},
                                ColorControl('Star Color', atts.reviewStarColor, function (v) { setAtts({ reviewStarColor: v }); }),
                                el(SelectControl, { label: 'Star Size', value: atts.reviewStarSize, options: iconSizes, onChange: function (v) { setAtts({ reviewStarSize: v }); } })
                            ) : null
                        ),
                        el(PanelBody, { title: '✏️ Manage Tours in Grid', initialOpen: false },
                            el('div', { style: { marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                                el(Button, { onClick: addCustomTour, variant: 'primary', style: { flex: 1, textAlign: 'center' } }, '+ Add New Tour'),
                                el(Button, { onClick: loadToursFromDatabase, variant: 'secondary', style: { flex: 1, textAlign: 'center' } }, '📥 Load All Tours')
                            ),
                            el(SelectControl, {
                                label: 'Quick Add from Database',
                                value: '',
                                options: tourOptions,
                                onChange: function (v) { if (v) addCustomTourFromDatabase(v); }
                            }),
                            el(Button, {
                                onClick: saveAllToursToDatabase,
                                variant: 'primary',
                                style: { width: '100%', marginTop: '10px' }
                            }, '💾 Save All Tours to Database'),
                            customTours.length === 0 ? el('div', {
                                style: { padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#666', marginTop: '10px' }
                            }, 'No tours added yet.') : null,
                            customTours.map(function (tour, idx) {
                                if (tour.is_hardcoded == 1) return null;
                                var tourImgUrl = getImageUrl(tour.imageId, tour.imageDisplaySize || atts.imageDisplaySize || 'medium');
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('div', null,
                                            el('strong', null, 'Tour #' + (idx + 1)),
                                            el('span', { style: { marginLeft: '10px', fontSize: '11px', color: '#666' } }, '(ID: ' + (tour.id || 0) + ')')
                                        ),
                                        el(Button, { onClick: function () { deleteCustomTour(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el(TextControl, { label: 'Tour Title', value: tour.title, onChange: function (v) { updateCustomTour(idx, 'title', v); } }),
                                    el(TextControl, { label: 'Location', value: tour.location, onChange: function (v) { updateCustomTour(idx, 'location', v); } }),
                                    el(TextControl, { label: 'Brief Text', value: tour.briefText, onChange: function (v) { updateCustomTour(idx, 'briefText', v); } }),
                                    el(TextControl, { label: 'Price (' + cs + ')', type: 'number', value: tour.price, onChange: function (v) { updateCustomTour(idx, 'price', parseFloat(v) || 0); } }),
                                    el(TextControl, { label: 'Offer Price (' + cs + ')', type: 'number', value: tour.offerPrice, onChange: function (v) { updateCustomTour(idx, 'offerPrice', parseFloat(v) || 0); } }),
                                    el(TextControl, { label: 'Badge Text', value: tour.badgeText, onChange: function (v) { updateCustomTour(idx, 'badgeText', v); } }),
                                    el(SelectControl, { label: 'Badge Position', value: tour.badgePosition || 'top-left', options: badgePositionOptions, onChange: function (v) { updateCustomTour(idx, 'badgePosition', v); } }),
                                    el(TextControl, { label: 'Promo Code', value: tour.promoCode, onChange: function (v) { updateCustomTour(idx, 'promoCode', v); } }),
                                    el(TextControl, { label: 'Promo Discount %', type: 'number', value: tour.promoDiscount, onChange: function (v) { updateCustomTour(idx, 'promoDiscount', parseInt(v) || 0); } }),
                                    el('div', { style: { display: 'flex', gap: '10px' } },
                                        el(TextControl, { label: 'Nights', type: 'number', value: tour.durationNights || 0, onChange: function (v) { updateCustomTour(idx, 'durationNights', parseInt(v) || 0); } }),
                                        el(TextControl, { label: 'Days', type: 'number', value: tour.durationDays || 0, onChange: function (v) { updateCustomTour(idx, 'durationDays', parseInt(v) || 0); } })
                                    ),
                                    el(ToggleControl, {
                                        label: 'Show Per Day Price (/ day)',
                                        checked: tour.showPerDayPrice === undefined ? true : (parseInt(tour.showPerDayPrice) === 1 || tour.showPerDayPrice === true),
                                        onChange: function (v) { updateCustomTour(idx, 'showPerDayPrice', v ? 1 : 0); }
                                    }),
                                    el(ToggleControl, {
                                        label: 'Show Complete Tour Price (/ total)',
                                        checked: (parseInt(tour.showCompletePrice) === 1 || tour.showCompletePrice === true),
                                        onChange: function (v) { updateCustomTour(idx, 'showCompletePrice', v ? 1 : 0); }
                                    }),
                                    el('div', { style: { display: 'flex', gap: '10px' } },
                                        el(TextControl, { label: 'Default Adults', type: 'number', value: tour.defaultAdults || 2, onChange: function (v) { updateCustomTour(idx, 'defaultAdults', Math.max(1, parseInt(v) || 1)); } }),
                                        el(TextControl, { label: 'Default Kids', type: 'number', value: tour.defaultChildren || 0, onChange: function (v) { updateCustomTour(idx, 'defaultChildren', Math.max(0, parseInt(v) || 0)); } })
                                    ),
                                    el(SelectControl, { label: '🎯 Tour Icon (Booking Form dropdown)', value: tour.iconTitle || 'fa-map-marker-alt', options: iconOptions, onChange: function (v) { updateCustomTour(idx, 'iconTitle', v); } }),
                                    el(SelectControl, { label: 'Night Icon', value: tour.nightIcon || 'fa-moon', options: nightDayIconOptions, onChange: function (v) { updateCustomTour(idx, 'nightIcon', v); } }),
                                    el(SelectControl, { label: 'Night Icon Size', value: tour.nightIconSize || '14px', options: iconSizes, onChange: function (v) { updateCustomTour(idx, 'nightIconSize', v); } }),
                                    ColorControl('Night Icon Color', tour.nightIconColor || '#FFD700', function (v) { updateCustomTour(idx, 'nightIconColor', v); }),
                                    el(SelectControl, { label: 'Day Icon', value: tour.dayIcon || 'fa-sun', options: nightDayIconOptions, onChange: function (v) { updateCustomTour(idx, 'dayIcon', v); } }),
                                    el(SelectControl, { label: 'Day Icon Size', value: tour.dayIconSize || '14px', options: iconSizes, onChange: function (v) { updateCustomTour(idx, 'dayIconSize', v); } }),
                                    ColorControl('Day Icon Color', tour.dayIconColor || '#FFA500', function (v) { updateCustomTour(idx, 'dayIconColor', v); }),
                                    el(ToggleControl, { label: 'Show Night/Day Icons', checked: tour.showNightDayIcons !== undefined ? tour.showNightDayIcons : true, onChange: function (v) { updateCustomTour(idx, 'showNightDayIcons', v); } }),
                                    el('div', { style: { padding: '10px', background: '#fff', borderRadius: '8px', marginTop: '8px' } },
                                        el('strong', { style: { fontSize: '12px', color: '#075e54', display: 'block', marginBottom: '6px' } }, 'Wishlist:'),
                                        el(ToggleControl, {
                                            label: 'Show Wishlist Button',
                                            checked: tour.showWishlist !== false,
                                            onChange: function (v) { updateCustomTour(idx, 'showWishlist', v); }
                                        }),
                                        el(TextControl, {
                                            label: 'Wishlist Preview Count',
                                            type: 'number',
                                            value: tour.wishlistCount || 0,
                                            onChange: function (v) { updateCustomTour(idx, 'wishlistCount', normalizeWishlistCount(v)); }
                                        })
                                    ),
                                    el('div', { style: { padding: '10px', background: '#fff', borderRadius: '8px', marginTop: '8px' } },
                                        el('strong', { style: { fontSize: '12px', color: '#075e54', display: 'block', marginBottom: '6px' } }, 'Visible Pax Columns:'),
                                        el('div', { className: 'ktv-pax-columns-toggle' },
                                            paxColumnOptions.map(function (opt) {
                                                var currentVisible = parseVisiblePaxToArray(tour.visiblePaxColumns);
                                                var checked = currentVisible.indexOf(opt.key) !== -1;
                                                return el('label', { key: opt.key },
                                                    el('input', {
                                                        type: 'checkbox',
                                                        checked: checked,
                                                        onChange: function (e) {
                                                            var cur = parseVisiblePaxToArray(tour.visiblePaxColumns);
                                                            var i = cur.indexOf(opt.key);
                                                            if (e.target.checked && i === -1) cur.push(opt.key);
                                                            else if (!e.target.checked && i !== -1) cur.splice(i, 1);
                                                            if (cur.length === 0) cur = ['pax1'];
                                                            updateCustomTour(idx, 'visiblePaxColumns', cur.join(','));
                                                        }
                                                    }),
                                                    el('i', { className: 'fas ' + opt.icon, style: { marginRight: '4px' } }),
                                                    el('span', null, opt.label)
                                                );
                                            })
                                        )
                                    ),
                                    MediaUploadControl(
                                        tour.imageId,
                                        function (id) { updateCustomTour(idx, 'imageId', id); },
                                        'Tour Image',
                                        tour.imageLink,
                                        function (v) { updateCustomTour(idx, 'imageLink', v); },
                                        tour.imageDisplaySize || atts.imageDisplaySize || 'medium',
                                        function (v) { updateCustomTour(idx, 'imageDisplaySize', v); }
                                    ),
                                    el(TextControl, { label: 'Button URL', value: tour.buttonUrl || '#', onChange: function (v) { updateCustomTour(idx, 'buttonUrl', v); } }),
                                    tourImgUrl ? el('img', { src: tourImgUrl, width: 400, height: 100, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' } }) : null
                                );
                            })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { className: gridClasses },
                            el('div', { style: { padding: '20px', background: atts.darkMode ? '#1a1a2e' : '#f0f4f8', borderRadius: '12px' } },
                                atts.gridTitle ? el(atts.gridTitleHeading, { style: { fontSize: '28px', marginBottom: '15px', color: atts.darkMode ? '#e0e0e0' : '#075e54' } }, atts.gridTitle) : null,
                                sortFilterMock,
                                el('div', {
                                    className: 'ktv-tour-grid ktv-grid-' + Math.min(atts.columns, 4),
                                    style: { display: 'grid', gridTemplateColumns: 'repeat(' + Math.min(atts.columns, 4) + ', 1fr)', gap: '20px' }
                                },
                                    customTours.map(function (tour, idx) {
                                        if (tour.is_hardcoded == 1) return null;
                                        var tourImgUrl = getImageUrl(tour.imageId, tour.imageDisplaySize || atts.imageDisplaySize || 'medium');
                                        var displayPrice = tour.offerPrice && tour.offerPrice < tour.price ? tour.offerPrice : (tour.price || 0);
                                        var hasDiscount = tour.offerPrice && tour.offerPrice < tour.price;
                                        var discountPercent = hasDiscount ? Math.round((tour.price - tour.offerPrice) / tour.price * 100) : 0;
                                        var buttonUrl = tour.buttonUrl || '#';
                                        var showNightDay = tour.showNightDayIcons !== undefined ? tour.showNightDayIcons : true;
                                        var currencySym = getCurrencySymbol((typeof ktv_editor_data !== 'undefined' && ktv_editor_data.currency_code) ? ktv_editor_data.currency_code : 'USD');
                                        var tourShowComplete = (parseInt(tour.showCompletePrice) === 1 || tour.showCompletePrice === true);
                                        var tourShowPerDay = tour.showPerDayPrice === undefined ? true : (parseInt(tour.showPerDayPrice) === 1 || tour.showPerDayPrice === true);
                                        var tourPriceUnit = '';
                                        if (tourShowComplete) tourPriceUnit = '/ total';
                                        else if (tourShowPerDay) tourPriceUnit = '/ day';
                                        var badgePosStyles = {
                                            'top-left': { top: '10px', left: '10px', right: 'auto', bottom: 'auto' },
                                            'top-right': { top: '10px', right: '10px', left: 'auto', bottom: 'auto' },
                                            'bottom-left': { bottom: '10px', left: '10px', top: 'auto', right: 'auto' },
                                            'bottom-right': { bottom: '10px', right: '10px', top: 'auto', left: 'auto' }
                                        };
                                        var bPos = badgePosStyles[tour.badgePosition || 'top-left'] || badgePosStyles['top-left'];
                                        var tourVisiblePax = parseVisiblePaxToArray(tour.visiblePaxColumns || atts.visiblePaxColumns);
                                        var tourPaxItems = [];
                                        paxColumnOptions.forEach(function (col) {
                                            if (tourVisiblePax.indexOf(col.key) === -1) return;
                                            var priceKey = col.key + 'Price';
                                            var labelKey = col.key + 'Label';
                                            var iconKey = col.key + 'Icon';
                                            var maxKey = col.key + 'MaxPersons';
                                            var labelText = tour[labelKey] || col.label;
                                            if ((col.key === 'group' || col.key === 'family') && tour[maxKey] > 0) {
                                                labelText += ' (up to ' + tour[maxKey] + ')';
                                            }
                                            tourPaxItems.push({
                                                label: labelText,
                                                price: tour[priceKey] || 0,
                                                icon: tour[iconKey] || col.icon
                                            });
                                        });

                                        var wishlistHtml = null;
                                        if (atts.showWishlist !== false && tour.showWishlist !== false) {
                                            wishlistHtml = el('div', {
                                                className: 'ktv-editor-wishlist-preview',
                                                style: {
                                                    position: 'absolute', top: '10px', right: '10px',
                                                    background: 'rgba(255,255,255,0.9)', minWidth: '36px',
                                                    height: '36px', borderRadius: '25px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    gap: '5px', padding: '0 12px', zIndex: '20',
                                                    color: '#ff4757', pointerEvents: 'none'
                                                },
                                                title: 'Wishlist count comes from the database on the frontend.'
                                            },
                                                el('i', { className: 'far fa-heart' }),
                                                el('span', { className: 'ktv-wishlist-count', style: { fontSize: '11px', fontWeight: '700', color: '#ff4757', background: 'rgba(255,71,87,0.1)', padding: '2px 6px', borderRadius: '10px' } }, normalizeWishlistCount(tour.wishlistCount || 0))
                                            );
                                        }

                                        var tourDefaultAdults = (tour.defaultAdults !== undefined ? parseInt(tour.defaultAdults) : (atts.defaultAdults !== undefined ? parseInt(atts.defaultAdults) : 2));
                                        var tourDefaultChildren = (tour.defaultChildren !== undefined ? parseInt(tour.defaultChildren) : (atts.defaultChildren !== undefined ? parseInt(atts.defaultChildren) : 0));

                                        var includedPaxInline = null;
                                        if (atts.showPax !== false && tour.showPax !== false && (tourDefaultAdults > 0 || tourDefaultChildren > 0)) {
                                            var paxParts = [];
                                            if (tourDefaultAdults > 0) paxParts.push(tourDefaultAdults + ' Adult' + (tourDefaultAdults === 1 ? '' : 's'));
                                            if (tourDefaultChildren > 0) paxParts.push(tourDefaultChildren + ' Kid' + (tourDefaultChildren === 1 ? '' : 's'));
                                            includedPaxInline = el('div', {
                                                style: {
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    marginTop: '4px',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    background: '#e8f5e9',
                                                    fontSize: '10px',
                                                    color: '#075e54',
                                                    fontWeight: '600'
                                                }
                                            },
                                                tourDefaultAdults > 0 ? el('i', { className: 'fas fa-user', style: { fontSize: atts.iconSize || '14px', color: atts.iconColor || '#075e54' } }) : null,
                                                tourDefaultChildren > 0 ? el('i', { className: 'fas fa-child', style: { fontSize: atts.iconSize || '14px', color: atts.iconColor || '#075e54' } }) : null,
                                                el('span', null, paxParts.join(' · '))
                                            );
                                        }

                                        return el('div', {
                                            key: 'custom-' + idx,
                                            className: 'ktv-tour-card',
                                            'data-tour-id': tour.id || 0,
                                            'data-tour-price': displayPrice,
                                            'data-tour-name': tour.title,
                                            'data-tour-location': tour.location,
                                            'data-tour-icon': tour.iconTitle || 'fa-map-marker-alt',
                                            'data-enable-icon-dropdown': atts.enableIconInDropdown !== false ? '1' : '0',
                                            'data-block-type': tour.tour_block_type || 'grid',
                                            'data-tour-adults': tourDefaultAdults,
                                            'data-tour-children': tourDefaultChildren,
                                            'data-show-per-day': tourShowPerDay ? '1' : '0',
                                            'data-show-complete': tourShowComplete ? '1' : '0',
                                            'data-price-basis': tourShowComplete ? 'total' : 'per_day',
                                            style: { background: atts.darkMode ? '#222244' : '#fff', borderRadius: '12px', overflow: 'hidden', border: atts.darkMode ? '1px solid #2a2a3e' : '1px solid #e0e0e0' }
                                        },
                                            el('div', {
                                                className: 'ktv-tour-image-wrapper',
                                                style: { height: '180px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }
                                            },
                                                tourImgUrl ? (
                                                    tour.imageLink && tour.imageLink !== '#' ?
                                                        el('a', { href: tour.imageLink, target: '_blank', style: { width: '100%', height: '100%', display: 'block' } },
                                                            el('img', { src: tourImgUrl, width: 400, height: 180, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                                        ) :
                                                        el('img', { src: tourImgUrl, width: 400, height: 180, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                                ) : el(Fragment, {}, '📷', el('br', null), tour.title || 'No Image'),
                                                (tour.badgeText && atts.showBadge !== false) ? el('div', {
                                                    className: 'ktv-tour-badge',
                                                    style: Object.assign({
                                                        position: 'absolute', background: tour.badgeColor || '#ff5722',
                                                        color: '#fff', padding: '4px 12px', borderRadius: '20px',
                                                        fontSize: '11px', zIndex: '10'
                                                    }, bPos)
                                                }, tour.badgeText) : null,
                                                hasDiscount && discountPercent > 0 ? el('div', {
                                                    className: 'ktv-tour-badge ktv-badge-deal',
                                                    style: { position: 'absolute', bottom: '10px', right: '10px', top: 'auto', background: '#ff5722', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', zIndex: '10' }
                                                }, '-' + discountPercent + '% OFF') : null,
                                                wishlistHtml,
                                                showNightDay ? el('div', {
                                                    className: 'ktv-night-day-icon',
                                                    style: { position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '15px', zIndex: '10' }
                                                },
                                                    el('i', { className: 'fas ' + (tour.nightIcon || 'fa-moon'), style: { fontSize: tour.nightIconSize || '14px', color: tour.nightIconColor || '#FFD700' } }),
                                                    el('span', { style: { fontSize: '11px', color: '#fff', fontWeight: '600' } }, tour.durationNights || 0, 'N'),
                                                    el('i', { className: 'fas ' + (tour.dayIcon || 'fa-sun'), style: { fontSize: tour.dayIconSize || '14px', color: tour.dayIconColor || '#FFA500' } }),
                                                    el('span', { style: { fontSize: '11px', color: '#fff', fontWeight: '600' } }, tour.durationDays || 0, 'D')
                                                ) : el('div', {
                                                    className: 'ktv-tour-duration-badge',
                                                    style: { position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', display: 'flex', gap: '8px' }
                                                },
                                                    el(Fragment, {},
                                                        el('i', { className: 'fas fa-moon' }), ' ', tour.durationNights || 0, 'N ',
                                                        el('i', { className: 'fas fa-sun' }), ' ', tour.durationDays || 0, 'D'
                                                    )
                                                )
                                            ),
                                            el('div', { className: 'ktv-tour-details', style: { padding: '15px' } },
                                                tour.afterTitleText ? el('div', { className: 'ktv-tour-after-title', style: { fontSize: '11px', color: '#075e54', textTransform: 'uppercase', marginBottom: '4px' } }, tour.afterTitleText) : null,
                                                el(heading_tag, { className: 'ktv-tour-title', style: { margin: 0, fontSize: atts.titleFontSize, color: atts.darkMode ? '#e0e0e0' : atts.titleColor } }, tour.title || 'Tour'),
                                                includedPaxInline,
                                                tour.briefText ? el('p', { className: 'ktv-tour-brief', style: { fontSize: '13px', color: atts.darkMode ? '#999' : '#666', marginBottom: '8px' } }, tour.briefText) : null,
                                                tour.location ? el('div', { className: 'ktv-tour-location', style: { fontSize: atts.locationTextSize, color: atts.darkMode ? '#999' : atts.locationTextColor, marginBottom: '8px' } },
                                                    el('i', { className: 'fas ' + atts.locationIcon, style: { fontSize: atts.locationIconSize, color: atts.locationIconColor } }),
                                                    ' ', tour.location
                                                ) : null,
                                                atts.showActivityIcons ? el('div', { className: 'ktv-tour-icons', style: { display: 'flex', gap: '10px', marginBottom: '10px', fontSize: atts.iconSize, color: atts.iconColor, flexWrap: 'wrap' } },
                                                    atts.hotelsLabel ? el('span', { className: 'ktv-tour-icon-item', style: { display: 'flex', alignItems: 'center', gap: '4px' } }, el('i', { className: 'fas ' + atts.hotelsIcon }), ' ', atts.hotelsLabel) : null,
                                                    atts.mealsLabel ? el('span', { className: 'ktv-tour-icon-item', style: { display: 'flex', alignItems: 'center', gap: '4px' } }, el('i', { className: 'fas ' + atts.mealsIcon }), ' ', atts.mealsLabel) : null,
                                                    atts.transportLabel ? el('span', { className: 'ktv-tour-icon-item', style: { display: 'flex', alignItems: 'center', gap: '4px' } }, el('i', { className: 'fas ' + atts.transportIcon }), ' ', atts.transportLabel) : null,
                                                    atts.sightseeingLabel ? el('span', { className: 'ktv-tour-icon-item', style: { display: 'flex', alignItems: 'center', gap: '4px' } }, el('i', { className: 'fas ' + atts.sightseeingIcon }), ' ', atts.sightseeingLabel) : null
                                                ) : null,
                                                (atts.showPaxColumns && tourPaxItems.length > 0) ? el('div', {
                                                    className: 'ktv-tour-pax-grid',
                                                    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '8px', marginBottom: '10px', fontSize: '11px', textAlign: 'center', background: atts.darkMode ? '#2a2a3e' : '#f8f9fa', padding: '8px', borderRadius: '8px' }
                                                },
                                                    tourPaxItems.map(function (p, i) {
                                                        return el('div', { className: 'ktv-pax-item', key: i },
                                                            el('i', { className: 'fas ' + (p.icon || 'fa-user'), style: { fontSize: atts.iconSize, color: atts.iconColor, display: 'block', marginBottom: '4px' } }),
                                                            p.label,
                                                            el('strong', { style: { display: 'block', color: '#28a745' } }, currencySym + (p.price || 0))
                                                        );
                                                    })
                                                ) : null,
                                                atts.showReviews ? el('div', { className: 'ktv-tour-reviews-mini', style: { marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } },
                                                    tour.reviews > 0 ? el(Fragment, {},
                                                        el('span', { style: { fontWeight: '700', fontSize: '16px', color: atts.darkMode ? '#e0e0e0' : '#333' } }, parseFloat(tour.rating || 0).toFixed(1)),
                                                        el('span', { style: { color: atts.reviewStarColor, fontSize: atts.reviewStarSize } },
                                                            (function () {
                                                                var stars = '';
                                                                var r = tour.rating || 0;
                                                                var fullStars = Math.floor(r);
                                                                var hasHalf = (r - fullStars) >= 0.5;
                                                                for (var i = 1; i <= 5; i++) {
                                                                    if (i <= fullStars) stars += '★';
                                                                    else if (i === fullStars + 1 && hasHalf) stars += '★';
                                                                    else stars += '☆';
                                                                }
                                                                return stars;
                                                            })()
                                                        ),
                                                        el('span', { style: { fontSize: '11px', marginLeft: '5px', color: '#999' } }, '(' + (tour.reviews || 0) + ')')
                                                    ) : el('span', { className: 'ktv-zero-reviews-link', style: { fontSize: '11px', color: atts.darkMode ? '#999' : '#666', cursor: 'pointer' } }, '0 Reviews')
                                                ) : null,
                                                tour.lastBookingName ? el('div', {
                                                    className: 'ktv-last-booking',
                                                    style: { display: 'flex', alignItems: 'center', gap: '6px', background: atts.darkMode ? '#2a2a3e' : '#e8f5e9', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', marginBottom: '8px' }
                                                },
                                                    el('i', { className: 'fas fa-clock', style: { color: '#28a745', marginRight: '4px' } }),
                                                    (tour.lastBookingCount || 0) > 0 ? 'Booked ' + (tour.lastBookingCount || 0) + ' times' : 'Last booking',
                                                    ' ', el('strong', null, tour.lastBookingName), ' from ', tour.lastBookingCountry || 'India',
                                                    ' - ', el('span', { className: 'ktv-time-ago' }, tour.lastBookingTime || 'Just now')
                                                ) : null,
                                                tour.promoCode ? el('div', {
                                                    className: 'ktv-promo-code',
                                                    style: { margin: '8px 0', padding: '6px 12px', background: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', borderRadius: '6px', border: '1px dashed #ff5722', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '5px', fontSize: '11px' }
                                                },
                                                    el('span', { style: { color: '#e65100' } }, el('i', { className: 'fas fa-ticket-alt', style: { marginRight: '4px' } }), 'Promo: ', el('strong', { style: { textTransform: 'uppercase' } }, tour.promoCode)),
                                                    tour.promoDiscount > 0 ? el('span', { style: { color: '#ff5722', fontWeight: '600' } }, '-' + tour.promoDiscount + '% OFF') : null
                                                ) : null,
                                                el('div', {
                                                    className: 'ktv-tour-price',
                                                    style: { fontSize: atts.priceFontSize, color: atts.priceColor, fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }
                                                },
                                                    hasDiscount ? el('span', { style: { textDecoration: 'line-through', color: '#999', fontSize: '14px', marginRight: '6px' } }, currencySym + (tour.price || 0)) : null,
                                                    currencySym + (displayPrice || 0),
                                                    tourPriceUnit ? el('span', { className: 'ktv-price-unit', style: { fontSize: '12px', color: '#888' } }, tourPriceUnit) : null,
                                                    atts.showGst ? el('span', { className: 'ktv-gst-badge', style: { display: 'inline-block', background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' } }, el('i', { className: 'fas fa-receipt' }), ' ', atts.gstLabel || 'GST', ' ', atts.gstPercent || '5', '%') : null
                                                ),
                                                buttonUrl && buttonUrl !== '#' ?
                                                    el('a', {
                                                        href: buttonUrl,
                                                        className: 'ktv-tour-book-btn',
                                                        title: (atts.buttonText || 'Book Now') + ' — ' + (tour.title || ''),
                                                        style: { background: atts.buttonColor, color: atts.buttonTextColor, width: '100%', padding: '10px', border: 'none', borderRadius: '25px', cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'center' },
                                                        'data-tour-id': tour.id || 0,
                                                        'data-tour-name': tour.title || '',
                                                        'data-tour-price': displayPrice || 0,
                                                        'data-tour-location': tour.location || '',
                                                        'data-block-type': tour.tour_block_type || 'grid',
                                                        'data-tour-adults': tourDefaultAdults,
                                                        'data-tour-children': tourDefaultChildren,
                                                        'data-show-per-day': tourShowPerDay ? '1' : '0',
                                                        'data-show-complete': tourShowComplete ? '1' : '0',
                                                        'data-price-basis': tourShowComplete ? 'total' : 'per_day'
                                                    }, atts.buttonText) :
                                                    el('button', {
                                                        className: 'ktv-tour-book-btn',
                                                        title: (atts.buttonText || 'Book Now') + ' — ' + (tour.title || ''),
                                                        style: { background: atts.buttonColor, color: atts.buttonTextColor, width: '100%', padding: '10px', border: 'none', borderRadius: '25px', cursor: 'pointer' },
                                                        'data-tour-id': tour.id || 0,
                                                        'data-tour-name': tour.title || '',
                                                        'data-tour-price': displayPrice || 0,
                                                        'data-tour-location': tour.location || '',
                                                        'data-block-type': tour.tour_block_type || 'grid',
                                                        'data-tour-adults': tourDefaultAdults,
                                                        'data-tour-children': tourDefaultChildren,
                                                        'data-show-per-day': tourShowPerDay ? '1' : '0',
                                                        'data-show-complete': tourShowComplete ? '1' : '0',
                                                        'data-price-basis': tourShowComplete ? 'total' : 'per_day'
                                                    }, atts.buttonText)
                                            )
                                        );
                                    }),
                                    customTours.length === 0 ? el('div', {
                                        style: { gridColumn: '1/-1', padding: '40px', textAlign: 'center', background: atts.darkMode ? '#222244' : '#f8f9fa', borderRadius: '12px', color: atts.darkMode ? '#999' : '#999' }
                                    },
                                        el('i', { className: 'fas fa-info-circle', style: { fontSize: '32px', display: 'block', marginBottom: '10px' } }),
                                        'No tours added to this grid. Use the inspector panel to add tours.'
                                    ) : null
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; }
        });
                /* ============================================================
           11. BLOCK — KTV TOUR PACKAGE
           ============================================================ */

        wp.blocks.registerBlockType('ktv/tour-package', {
            title: 'KTV Tour Package',
            description: 'Package-style tour card with image, badge, editable deal badge (-X% OFF), pricing, activity icons, reviews, last booking.',
            icon: 'products',
            category: 'ktv-travel',
            keywords: ['package', 'tour', 'deal', 'price', 'travel'],
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                title: { type: 'string', default: 'Kashmir Delight Package' },
                location: { type: 'string', default: '' },
                briefText: { type: 'string', default: '' },
                afterTitleText: { type: 'string', default: '' },
                nights: { type: 'number', default: 2 },
                days: { type: 'number', default: 3 },
                price: { type: 'number', default: 0 },
                offerPrice: { type: 'number', default: 0 },
                imageId: { type: 'number', default: 0 },
                imageLink: { type: 'string', default: '' },
                imageDisplaySize: { type: 'string', default: 'medium' },
                galleryImages: { type: 'string', default: '' },
                galleryAutoSlide: { type: 'boolean', default: false },
                gallerySlideInterval: { type: 'number', default: 3000 },
                badgeText: { type: 'string', default: 'Popular' },
                badgeColor: { type: 'string', default: '#ff5722' },
                badgePosition: { type: 'string', default: 'top-left' },
                showBadge: { type: 'boolean', default: true },
                dealBadgeColor: { type: 'string', default: '#ff5722' },
                dealBadgeTextColor: { type: 'string', default: '#ffffff' },
                dealBadgePosition: { type: 'string', default: 'bottom-right' },
                buttonText: { type: 'string', default: 'Book Package' },
                buttonUrl: { type: 'string', default: '#' },
                buttonColor: { type: 'string', default: '#075e54' },
                buttonTextColor: { type: 'string', default: '#ffffff' },
                badgeBgColor: { type: 'string', default: '#ff5722' },
                badgeTextColor: { type: 'string', default: '#ffffff' },
                titleColor: { type: 'string', default: '#333333' },
                priceColor: { type: 'string', default: '#28a745' },
                iconColor: { type: 'string', default: '#075e54' },
                iconSize: { type: 'string', default: '22px' },
                headingType: { type: 'string', default: 'h4' },
                showReviews: { type: 'boolean', default: true },
                reviewStarColor: { type: 'string', default: '#FFD700' },
                avgRating: { type: 'number', default: 0 },
                totalReviews: { type: 'number', default: 0 },
                tourId: { type: 'number', default: 0 },
                showLastBooking: { type: 'boolean', default: true },
                lastBookingName: { type: 'string', default: '' },
                lastBookingCountry: { type: 'string', default: 'India' },
                lastBookingTime: { type: 'string', default: '' },
                lastBookingCount: { type: 'number', default: 0 },
                promoCode: { type: 'string', default: '' },
                promoDiscount: { type: 'number', default: 0 },
                promoCodeValidUntil: { type: 'string', default: '' },
                hotelsIcon: { type: 'string', default: 'fa-hotel' },
                hotelsLabel: { type: 'string', default: 'Hotels' },
                mealsIcon: { type: 'string', default: 'fa-utensils' },
                mealsLabel: { type: 'string', default: 'Meals' },
                transportIcon: { type: 'string', default: 'fa-car' },
                transportLabel: { type: 'string', default: 'Transport' },
                sightseeingIcon: { type: 'string', default: 'fa-eye' },
                sightseeingLabel: { type: 'string', default: 'Sightseeing' },
                flightIcon: { type: 'string', default: 'fa-plane' },
                flightLabel: { type: 'string', default: 'Flight' },
                boatIcon: { type: 'string', default: 'fa-ship' },
                boatLabel: { type: 'string', default: 'Boat' },
                horseRidingIcon: { type: 'string', default: 'fa-horse' },
                horseRidingLabel: { type: 'string', default: 'Horse Riding' },
                trekkingIcon: { type: 'string', default: 'fa-hiking' },
                trekkingLabel: { type: 'string', default: 'Trekking' },
                hikingIcon: { type: 'string', default: 'fa-mountain' },
                hikingLabel: { type: 'string', default: 'Hiking' },
                gstPercent: { type: 'string', default: '5' },
                gstLabel: { type: 'string', default: 'GST' },
                showGst: { type: 'boolean', default: true },
                cancellationPolicy: { type: 'string', default: 'non_refundable' },
                cancellationText: { type: 'string', default: '' },
                enableIcon: { type: 'boolean', default: true },
                enableIconInDropdown: { type: 'boolean', default: true },
                enableIpPricing: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-map-marker-alt' },
                iconTitleSize: { type: 'string', default: '20px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                nightIcon: { type: 'string', default: 'fa-moon' },
                nightIconSize: { type: 'string', default: '14px' },
                nightIconColor: { type: 'string', default: '#FFD700' },
                dayIcon: { type: 'string', default: 'fa-sun' },
                dayIconSize: { type: 'string', default: '14px' },
                dayIconColor: { type: 'string', default: '#FFA500' },
                showNightDayIcons: { type: 'boolean', default: true },
                showWishlist: { type: 'boolean', default: true },
                wishlistCount: { type: 'number', default: 0 },
                showIcons: { type: 'boolean', default: true },
                showPax: { type: 'boolean', default: true },
                visiblePaxColumns: { type: 'string', default: 'pax1' },
                showPerDayPrice: { type: 'boolean', default: true },
                showCompletePrice: { type: 'boolean', default: false },
                defaultAdults: { type: 'number', default: 2 },
                defaultChildren: { type: 'number', default: 0 },
                pax1Label: { type: 'string', default: '1 Pax' },
                pax1Icon: { type: 'string', default: 'fa-user' },
                pax1Price: { type: 'number', default: 0 },
                pax2Label: { type: 'string', default: '2 Pax' },
                pax2Icon: { type: 'string', default: 'fa-user-friends' },
                pax2Price: { type: 'number', default: 0 },
                pax3Label: { type: 'string', default: '3 Pax' },
                pax3Icon: { type: 'string', default: 'fa-users' },
                pax3Price: { type: 'number', default: 0 },
                groupLabel: { type: 'string', default: 'Group' },
                groupIcon: { type: 'string', default: 'fa-users' },
                groupPrice: { type: 'number', default: 0 },
                groupMaxPersons: { type: 'number', default: 0 },
                familyLabel: { type: 'string', default: 'Family' },
                familyIcon: { type: 'string', default: 'fa-users' },
                familyPrice: { type: 'number', default: 0 },
                familyMaxPersons: { type: 'number', default: 0 },
                extraAdultPrice: { type: 'number', default: 0 },
                extraChildPrice: { type: 'number', default: 0 }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-tour-package' });
                var cs = getCurrencySymbol((typeof ktv_editor_data !== 'undefined' && ktv_editor_data.currency_code) ? ktv_editor_data.currency_code : 'USD');
                var heading_tag = atts.headingType || 'h4';
                var hasDiscount = atts.offerPrice && atts.offerPrice < atts.price;
                var displayPrice = hasDiscount ? atts.offerPrice : atts.price;
                var calculatedPercent = hasDiscount ? Math.round((atts.price - atts.offerPrice) / atts.price * 100) : 0;
                var imgUrl = getImageUrl(atts.imageId, atts.imageDisplaySize);
                var visiblePax = parseVisiblePaxToArray(atts.visiblePaxColumns);

                var dynamicTours = getDynamicTours();
                var tourOptions = [{ label: 'Select a Tour from Database', value: '' }];
                dynamicTours.forEach(function (tour) {
                    if (tour.is_hardcoded == 1) return;
                    tourOptions.push({ label: tour.tour_name + ' (' + tour.block_type + ')', value: String(tour.id) });
                });

                var badgePosStyles = {
                    'top-left': { top: '12px', left: '12px', right: 'auto', bottom: 'auto' },
                    'top-right': { top: '12px', right: '12px', left: 'auto', bottom: 'auto' },
                    'bottom-left': { bottom: '12px', left: '12px', top: 'auto', right: 'auto' },
                    'bottom-right': { bottom: '12px', right: '12px', top: 'auto', left: 'auto' }
                };
                var bPos = badgePosStyles[atts.badgePosition || 'top-left'] || badgePosStyles['top-left'];
                var dPos = badgePosStyles[atts.dealBadgePosition || 'bottom-right'] || badgePosStyles['bottom-right'];

                function loadTourFromDatabase(tourId) {
                    var tour = getTourById(parseInt(tourId));
                    if (!tour || tour.is_hardcoded == 1) return;
                    var nightsVal = (tour.durationNights !== undefined && tour.durationNights !== null) ? tour.durationNights : (tour.nights || 0);
                    var daysVal = (tour.durationDays !== undefined && tour.durationDays !== null) ? tour.durationDays : (tour.days || 0);
                    setAtts({
                        title: tour.tour_name || '',
                        location: tour.location || '',
                        briefText: tour.tour_brief_text || '',
                        afterTitleText: tour.tour_after_title_text || '',
                        nights: nightsVal,
                        days: daysVal,
                        price: tour.tour_price || 0,
                        offerPrice: tour.tour_offer_price || 0,
                        imageId: tour.tour_image_id || 0,
                        imageLink: tour.image_link_url || '',
                        imageDisplaySize: tour.image_display_size || 'medium',
                        galleryImages: tour.tour_gallery || '',
                        galleryAutoSlide: tour.gallery_auto_slide || false,
                        gallerySlideInterval: tour.gallery_slide_interval || 3000,
                        badgeText: tour.badge_text || 'Popular',
                        badgeColor: tour.badge_color || '#ff5722',
                        badgePosition: tour.badge_position || 'top-left',
                        dealBadgeColor: tour.deal_badge_color || '#ff5722',
                        dealBadgeTextColor: tour.deal_badge_text_color || '#ffffff',
                        dealBadgePosition: tour.deal_badge_position || 'bottom-right',
                        buttonText: tour.button_text || 'Book Package',
                        buttonUrl: tour.button_url || '#',
                        titleColor: tour.title_color || '#333333',
                        priceColor: tour.price_color || '#28a745',
                        iconColor: tour.icon_color || '#075e54',
                        iconSize: tour.icon_size || '22px',
                        headingType: tour.heading_type || 'h4',
                        avgRating: tour.tour_rating || 0,
                        totalReviews: tour.total_reviews || 0,
                        wishlistCount: normalizeWishlistCount(tour.wishlist_count || 0),
                        showWishlist: tour.show_wishlist !== undefined ? !!tour.show_wishlist : true,
                        lastBookingName: tour.last_booking_name || '',
                        lastBookingCountry: tour.last_booking_country || 'India',
                        lastBookingTime: tour.last_booking_time || '',
                        lastBookingCount: tour.last_booking_count || 0,
                        promoCode: tour.promo_code || '',
                        promoDiscount: tour.promo_discount || 0,
                        promoCodeValidUntil: tour.promo_code_valid_until || '',
                        hotelsLabel: tour.hotels_label || 'Hotels',
                        hotelsIcon: tour.hotels_icon || 'fa-hotel',
                        mealsLabel: tour.meals_label || 'Meals',
                        mealsIcon: tour.meals_icon || 'fa-utensils',
                        transportLabel: tour.transport_label || 'Transport',
                        transportIcon: tour.transport_icon || 'fa-car',
                        sightseeingLabel: tour.sightseeing_label || 'Sightseeing',
                        sightseeingIcon: tour.sightseeing_icon || 'fa-eye',
                        flightLabel: tour.flight_label || 'Flight',
                        flightIcon: tour.flight_icon || 'fa-plane',
                        boatLabel: tour.boat_label || 'Boat',
                        boatIcon: tour.boat_icon || 'fa-ship',
                        horseRidingLabel: tour.horse_riding_label || 'Horse Riding',
                        horseRidingIcon: tour.horse_riding_icon || 'fa-horse',
                        trekkingLabel: tour.trekking_label || 'Trekking',
                        trekkingIcon: tour.trekking_icon || 'fa-hiking',
                        hikingLabel: tour.hiking_label || 'Hiking',
                        hikingIcon: tour.hiking_icon || 'fa-mountain',
                        gstPercent: tour.gst_percent || '5',
                        gstLabel: tour.gst_label || 'GST',
                        cancellationPolicy: tour.cancellation_policy || 'non_refundable',
                        cancellationText: tour.cancellation_text || '',
                        enableIconInDropdown: tour.enable_icon_dropdown !== undefined ? !!parseInt(tour.enable_icon_dropdown) : true,
                        darkMode: tour.enable_dark_mode !== undefined ? !!parseInt(tour.enable_dark_mode) : false,
                        iconTitle: tour.icon_title || 'fa-map-marker-alt',
                        iconTitleSize: tour.icon_title_size || '20px',
                        iconTitleColor: tour.icon_title_color || '#075e54',
                        nightIcon: tour.night_icon || 'fa-moon',
                        nightIconSize: tour.night_icon_size || '14px',
                        nightIconColor: tour.night_icon_color || '#FFD700',
                        dayIcon: tour.day_icon || 'fa-sun',
                        dayIconSize: tour.day_icon_size || '14px',
                        dayIconColor: tour.day_icon_color || '#FFA500',
                        showNightDayIcons: tour.show_night_day_icons !== undefined ? !!tour.show_night_day_icons : true,
                        tourId: tour.id || 0,
                        visiblePaxColumns: normalizeVisiblePaxColumns(tour.visible_pax_columns),
                        showPerDayPrice: tour.show_per_day_price !== undefined ? parseInt(tour.show_per_day_price) === 1 : true,
                        showCompletePrice: tour.show_complete_price !== undefined ? parseInt(tour.show_complete_price) === 1 : false,
                        defaultAdults: tour.tour_default_adults !== undefined ? Math.max(1, parseInt(tour.tour_default_adults)) : 2,
                        defaultChildren: tour.tour_default_children !== undefined ? Math.max(0, parseInt(tour.tour_default_children)) : 0,
                        pax1Label: tour.pax_1_label || '1 Pax',
                        pax1Icon: tour.pax_1_icon || 'fa-user',
                        pax1Price: tour.pax_1_price || 0,
                        pax2Label: tour.pax_2_label || '2 Pax',
                        pax2Icon: tour.pax_2_icon || 'fa-user-friends',
                        pax2Price: tour.pax_2_price || 0,
                        pax3Label: tour.pax_3_label || '3 Pax',
                        pax3Icon: tour.pax_3_icon || 'fa-users',
                        pax3Price: tour.pax_3_price || 0,
                        groupLabel: tour.group_label || 'Group',
                        groupIcon: tour.group_icon || 'fa-users',
                        groupPrice: tour.group_price || 0,
                        groupMaxPersons: tour.group_max_persons || 0,
                        familyLabel: tour.family_label || 'Family',
                        familyIcon: tour.family_icon || 'fa-users',
                        familyPrice: tour.family_price || 0,
                        familyMaxPersons: tour.family_max_persons || 0,
                        extraAdultPrice: tour.extra_adult_price || 0,
                        extraChildPrice: tour.extra_child_price || 0
                    });
                }

                function saveThisTour() {
                    var tourData = buildTourDataFromAtts(atts, 'package');
                    saveTourToDatabase(tourData).then(function (result) {
                        if (result.id) {
                            setAtts({ tourId: result.id });
                            window.alert('Tour Package saved to database. ID: ' + result.id);
                        }
                    }).catch(function (err) {
                        window.alert('Error saving tour package: ' + err.message);
                    });
                }

                var packageIcons = [
                    { label: atts.hotelsLabel, icon: atts.hotelsIcon },
                    { label: atts.mealsLabel, icon: atts.mealsIcon },
                    { label: atts.transportLabel, icon: atts.transportIcon },
                    { label: atts.sightseeingLabel, icon: atts.sightseeingIcon },
                    { label: atts.flightLabel, icon: atts.flightIcon },
                    { label: atts.boatLabel, icon: atts.boatIcon },
                    { label: atts.horseRidingLabel, icon: atts.horseRidingIcon },
                    { label: atts.trekkingLabel, icon: atts.trekkingIcon },
                    { label: atts.hikingLabel, icon: atts.hikingIcon }
                ];

                var paxPreviewItems = [];
                paxColumnOptions.forEach(function (col) {
                    if (visiblePax.indexOf(col.key) === -1) return;
                    var priceKey = col.key + 'Price';
                    var labelKey = col.key + 'Label';
                    var iconKey = col.key + 'Icon';
                    var maxKey = col.key + 'MaxPersons';
                    var labelText = atts[labelKey] || col.label;
                    if ((col.key === 'group' || col.key === 'family') && atts[maxKey] > 0) {
                        labelText += ' (up to ' + atts[maxKey] + ')';
                    }
                    paxPreviewItems.push({
                        label: labelText,
                        price: atts[priceKey] || 0,
                        icon: atts[iconKey] || col.icon
                    });
                });

                var cardClasses = 'ktv-editor-preview-tour-package';
                if (atts.darkMode === true) cardClasses += ' ktv-dark-mode';

                var priceUnitLabel = '';
                if (atts.showCompletePrice === true) {
                    priceUnitLabel = '/ total';
                } else if (atts.showPerDayPrice !== false) {
                    priceUnitLabel = '/ day';
                }

                var wishlistPreviewHtml = null;
                if (atts.showWishlist !== false) {
                    wishlistPreviewHtml = el('div', {
                        className: 'ktv-editor-wishlist-preview',
                        style: {
                            position: 'absolute', top: '12px', right: '12px',
                            background: 'rgba(255,255,255,0.9)', minWidth: '36px',
                            height: '36px', borderRadius: '25px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '5px', padding: '0 12px', zIndex: '20',
                            color: '#ff4757', pointerEvents: 'none'
                        },
                        title: 'Wishlist count comes from the database on the frontend.'
                    },
                        el('i', { className: 'far fa-heart' }),
                        el('span', { className: 'ktv-wishlist-count', style: { fontSize: '11px', fontWeight: '700', color: '#ff4757', background: 'rgba(255,71,87,0.1)', padding: '2px 6px', borderRadius: '10px' } }, normalizeWishlistCount(atts.wishlistCount || 0))
                    );
                }

                var defaultAdultsPreview = atts.defaultAdults !== undefined ? Math.max(1, parseInt(atts.defaultAdults)) : 2;
                var defaultChildrenPreview = atts.defaultChildren !== undefined ? Math.max(0, parseInt(atts.defaultChildren)) : 0;
                var includedPaxHtml = null;
                if (atts.showPax !== false && (defaultAdultsPreview > 0 || defaultChildrenPreview > 0)) {
                    var paxLabelParts = [];
                    if (defaultAdultsPreview > 0) paxLabelParts.push(defaultAdultsPreview + ' Adult' + (defaultAdultsPreview === 1 ? '' : 's'));
                    if (defaultChildrenPreview > 0) paxLabelParts.push(defaultChildrenPreview + ' Kid' + (defaultChildrenPreview === 1 ? '' : 's'));
                    includedPaxHtml = el('div', {
                        className: 'ktv-editor-included-pax',
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '6px',
                            padding: '3px 10px',
                            borderRadius: '15px',
                            background: '#e8f5e9',
                            fontSize: '11px',
                            color: '#075e54',
                            fontWeight: '600'
                        }
                    },
                        defaultAdultsPreview > 0 ? el('i', { className: 'fas fa-user', style: { fontSize: atts.iconSize || '14px', color: atts.iconColor || '#075e54' } }) : null,
                        defaultChildrenPreview > 0 ? el('i', { className: 'fas fa-child', style: { fontSize: atts.iconSize || '14px', color: atts.iconColor || '#075e54' } }) : null,
                        el('span', null, paxLabelParts.join(' · '))
                    );
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        CurrencyIpPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📝 Content', initialOpen: true },
                            el(SelectControl, {
                                label: 'Load Tour from Database',
                                value: atts.tourId ? String(atts.tourId) : '',
                                options: tourOptions,
                                onChange: function (v) { if (v) loadTourFromDatabase(v); }
                            }),
                            el('div', { style: { background: '#f0f4f8', padding: '8px 12px', borderRadius: '4px', marginBottom: '10px' } },
                                el('strong', null, 'Tour ID: '),
                                el('span', { style: { color: '#075e54', fontWeight: '600' } }, atts.tourId || 'Not saved yet')
                            ),
                            el(TextControl, { label: 'Package Title', value: atts.title, onChange: function (v) { setAtts({ title: v }); } }),
                            el(TextControl, { label: 'After Title Text', value: atts.afterTitleText || '', onChange: function (v) { setAtts({ afterTitleText: v }); } }),
                            el(TextControl, { label: 'Brief Text', value: atts.briefText || '', onChange: function (v) { setAtts({ briefText: v }); } }),
                            el(TextControl, { label: 'Location', value: atts.location, onChange: function (v) { setAtts({ location: v }); } }),
                            el('div', { style: { display: 'flex', gap: '10px' } },
                                el(TextControl, { label: 'Nights', type: 'number', value: atts.nights, onChange: function (v) { setAtts({ nights: parseInt(v) || 0 }); } }),
                                el(TextControl, { label: 'Days', type: 'number', value: atts.days, onChange: function (v) { setAtts({ days: parseInt(v) || 0 }); } })
                            ),
                            el(Button, {
                                onClick: saveThisTour,
                                variant: 'primary',
                                style: { width: '100%', marginTop: '10px' }
                            }, '💾 Save Tour Package to Database')
                        ),
                        el(PanelBody, { title: '🖼️ Image & Gallery', initialOpen: false },
                            MediaUploadControl(
                                atts.imageId,
                                function (id) { setAtts({ imageId: id }); },
                                'Package Image',
                                atts.imageLink,
                                function (v) { setAtts({ imageLink: v }); },
                                atts.imageDisplaySize,
                                function (v) { setAtts({ imageDisplaySize: v }); }
                            ),
                            GalleryControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '💵 Price Display Mode', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Per Day Price (/ day)',
                                checked: atts.showPerDayPrice !== false,
                                onChange: function (v) { setAtts({ showPerDayPrice: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Show Complete Tour Price (/ total)',
                                checked: atts.showCompletePrice === true,
                                onChange: function (v) { setAtts({ showCompletePrice: v }); }
                            })
                        ),
                        el(PanelBody, { title: '👥 Default Adults / Kids', initialOpen: false },
                            el(TextControl, {
                                label: 'Default Adults',
                                type: 'number',
                                value: atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                onChange: function (v) { setAtts({ defaultAdults: Math.max(1, parseInt(v) || 1) }); }
                            }),
                            el(TextControl, {
                                label: 'Default Kids',
                                type: 'number',
                                value: atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                onChange: function (v) { setAtts({ defaultChildren: Math.max(0, parseInt(v) || 0) }); }
                            })
                        ),
                        el(PanelBody, { title: '💰 Pricing', initialOpen: false },
                            el(TextControl, { label: 'Original Price', type: 'number', value: atts.price, onChange: function (v) { setAtts({ price: parseFloat(v) || 0 }); } }),
                            el(TextControl, { label: 'Offer Price', type: 'number', value: atts.offerPrice, onChange: function (v) { setAtts({ offerPrice: parseFloat(v) || 0 }); } }),
                            calculatedPercent > 0 ? el('p', { style: { color: '#28a745', fontSize: '12px', fontWeight: 'bold' } }, calculatedPercent + '% OFF') : null,
                            ColorControl('Price Color', atts.priceColor, function (v) { setAtts({ priceColor: v }); }),
                            GSTControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '🏷️ Badge', initialOpen: false },
                            el(ToggleControl, { label: 'Show Badge', checked: atts.showBadge !== false, onChange: function (v) { setAtts({ showBadge: v }); } }),
                            el(TextControl, { label: 'Badge Text', value: atts.badgeText, onChange: function (v) { setAtts({ badgeText: v }); } }),
                            ColorControl('Badge Color', atts.badgeColor, function (v) { setAtts({ badgeColor: v }); }),
                            el(SelectControl, { label: 'Badge Position', value: atts.badgePosition || 'top-left', options: badgePositionOptions, onChange: function (v) { setAtts({ badgePosition: v }); } })
                        ),
                        el(PanelBody, { title: '🏷️ Deal Badge (-X% OFF)', initialOpen: false },
                            ColorControl('Deal Badge Color', atts.dealBadgeColor || '#ff5722', function (v) { setAtts({ dealBadgeColor: v }); }),
                            ColorControl('Deal Badge Text Color', atts.dealBadgeTextColor || '#ffffff', function (v) { setAtts({ dealBadgeTextColor: v }); }),
                            el(SelectControl, { label: 'Deal Badge Position', value: atts.dealBadgePosition || 'bottom-right', options: badgePositionOptions, onChange: function (v) { setAtts({ dealBadgePosition: v }); } })
                        ),
                        el(PanelBody, { title: '❤️ Wishlist', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Wishlist Button',
                                checked: atts.showWishlist !== false,
                                onChange: function (v) { setAtts({ showWishlist: v }); }
                            }),
                            atts.showWishlist !== false ? el(TextControl, {
                                label: 'Wishlist Preview Count',
                                type: 'number',
                                value: atts.wishlistCount || 0,
                                onChange: function (v) { setAtts({ wishlistCount: normalizeWishlistCount(v) }); }
                            }) : null
                        ),
                        TitleIconControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🌙 Night/Day Icons', initialOpen: false },
                            NightDayIconControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '🔄 Activity Icons', initialOpen: false },
                            el(ToggleControl, { label: 'Show Activity Icons', checked: atts.showIcons !== false, onChange: function (v) { setAtts({ showIcons: v }); } }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'hotelsIcon', labelKey: 'hotelsLabel', label: 'Hotels' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'mealsIcon', labelKey: 'mealsLabel', label: 'Meals' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'transportIcon', labelKey: 'transportLabel', label: 'Transport' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'sightseeingIcon', labelKey: 'sightseeingLabel', label: 'Sightseeing' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'flightIcon', labelKey: 'flightLabel', label: 'Flight' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'boatIcon', labelKey: 'boatLabel', label: 'Boat' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'horseRidingIcon', labelKey: 'horseRidingLabel', label: 'Horse Riding' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'trekkingIcon', labelKey: 'trekkingLabel', label: 'Trekking' }),
                            ActivityIconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'hikingIcon', labelKey: 'hikingLabel', label: 'Hiking' })
                        ),
                        el(PanelBody, { title: '👥 Pax Columns', initialOpen: false },
                            el(ToggleControl, { label: 'Show Pax Columns', checked: atts.showPax !== false, onChange: function (v) { setAtts({ showPax: v }); } }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax1', label: '1 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax2', label: '2 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'pax3', label: '3 Pax' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'group', label: 'Group' }),
                            PaxControl({ attributes: atts, setAttributes: setAtts, paxKey: 'family', label: 'Family' }),
                            el(TextControl, { label: 'Extra Adult Price', type: 'number', value: atts.extraAdultPrice || 0, onChange: function (v) { setAtts({ extraAdultPrice: parseFloat(v) || 0 }); } }),
                            el(TextControl, { label: 'Extra Child Price', type: 'number', value: atts.extraChildPrice || 0, onChange: function (v) { setAtts({ extraChildPrice: parseFloat(v) || 0 }); } })
                        ),
                        PaxColumnsToggleControl({ attributes: atts, setAttributes: setAtts }),
                        PromoCodeControl({ attributes: atts, setAttributes: setAtts }),
                        CancellationPolicyControl({ attributes: atts, setAttributes: setAtts }),
                        ButtonLinkControl({ attributes: atts, setAttributes: setAtts, label: 'Button URL' }),
                        el(PanelBody, { title: '🔘 Button Styling', initialOpen: false },
                            el(TextControl, { label: 'Button Text', value: atts.buttonText, onChange: function (v) { setAtts({ buttonText: v }); } }),
                            ColorControl('Button Background', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                            ColorControl('Button Text Color', atts.buttonTextColor, function (v) { setAtts({ buttonTextColor: v }); })
                        ),
                        el(PanelBody, { title: '🎨 Card Styling', initialOpen: false },
                            ColorControl('Title Color', atts.titleColor, function (v) { setAtts({ titleColor: v }); }),
                            ColorControl('Icon Color', atts.iconColor, function (v) { setAtts({ iconColor: v }); }),
                            el(SelectControl, { label: 'Icon Size', value: atts.iconSize, options: iconSizes, onChange: function (v) { setAtts({ iconSize: v }); } }),
                            el(SelectControl, { label: 'Heading Type', value: atts.headingType, options: headingTypes, onChange: function (v) { setAtts({ headingType: v }); } }),
                            ColorControl('Badge Background', atts.badgeBgColor || '#ff5722', function (v) { setAtts({ badgeBgColor: v }); }),
                            ColorControl('Badge Text Color', atts.badgeTextColor || '#ffffff', function (v) { setAtts({ badgeTextColor: v }); })
                        ),
                        LastBookingControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '⭐ Reviews', initialOpen: false },
                            el(ToggleControl, { label: 'Show Reviews', checked: atts.showReviews, onChange: function (v) { setAtts({ showReviews: v }); } }),
                            atts.showReviews ? el(Fragment, {},
                                ColorControl('Star Color', atts.reviewStarColor, function (v) { setAtts({ reviewStarColor: v }); }),
                                el(TextControl, { label: 'Avg Rating', value: atts.avgRating, type: 'number', step: '0.1', onChange: function (v) { setAtts({ avgRating: parseFloat(v) || 0 }); } }),
                                el(TextControl, { label: 'Total Reviews', value: atts.totalReviews, type: 'number', onChange: function (v) { setAtts({ totalReviews: parseInt(v) || 0 }); } })
                            ) : null
                        )
                    ),
                    el('div', blockProps,
                        el('div', { className: cardClasses, style: atts.darkMode ? { background: '#1a1a2e', borderColor: '#2a2a3e', color: '#e0e0e0' } : {} },
                            el('div', { className: 'ktv-tour-package-image-wrapper', style: { position: 'relative', height: '200px', background: '#f0f0f0', overflow: 'hidden' } },
                                imgUrl ? (
                                    atts.imageLink && atts.imageLink !== '#' ?
                                        el('a', { href: atts.imageLink, className: 'ktv-tour-package-image-link', target: '_blank', style: { display: 'block', width: '100%', height: '100%' } },
                                            el('img', { src: imgUrl, alt: atts.title, width: 400, height: 200, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                        ) :
                                        el('img', { src: imgUrl, alt: atts.title, width: 400, height: 200, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                                ) :
                                    el('div', { className: 'ktv-tour-package-image-placeholder', style: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#999' } },
                                        '📷', el('span', null, 'Click to upload image')
                                    ),
                                (atts.badgeText && atts.showBadge !== false) ? el('div', {
                                    className: 'ktv-tour-package-badge',
                                    style: Object.assign({
                                        position: 'absolute',
                                        background: atts.badgeColor,
                                        color: '#fff',
                                        padding: '6px 16px',
                                        borderRadius: '25px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        zIndex: '10'
                                    }, bPos)
                                }, atts.badgeText) : null,
                                calculatedPercent > 0 ? el('div', {
                                    className: 'ktv-tour-package-deal-badge',
                                    style: Object.assign({
                                        position: 'absolute',
                                        background: atts.dealBadgeColor || '#ff5722',
                                        color: atts.dealBadgeTextColor || '#ffffff',
                                        padding: '6px 14px',
                                        borderRadius: '25px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        zIndex: '10'
                                    }, dPos)
                                }, '-' + calculatedPercent + '% OFF') : null,
                                wishlistPreviewHtml,
                                atts.showNightDayIcons !== false ? el('div', {
                                    className: 'ktv-night-day-icon',
                                    style: { position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '15px', zIndex: '10' }
                                },
                                    el('i', { className: 'fas ' + (atts.nightIcon || 'fa-moon'), style: { fontSize: atts.nightIconSize || '14px', color: atts.nightIconColor || '#FFD700' } }),
                                    el('span', { style: { fontSize: '11px', color: '#fff', fontWeight: '600' } }, atts.nights || 0, 'N'),
                                    el('i', { className: 'fas ' + (atts.dayIcon || 'fa-sun'), style: { fontSize: atts.dayIconSize || '14px', color: atts.dayIconColor || '#FFA500' } }),
                                    el('span', { style: { fontSize: '11px', color: '#fff', fontWeight: '600' } }, atts.days || 0, 'D')
                                ) : null
                            ),
                            el('div', { className: 'ktv-tour-package-content', style: { padding: '18px' } },
                                atts.afterTitleText ? el('div', { className: 'ktv-tour-package-after-title', style: { fontSize: '12px', color: '#075e54', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' } }, atts.afterTitleText) : null,
                                el(heading_tag, { className: 'ktv-tour-package-title', style: { fontSize: '18px', fontWeight: '700', margin: '0 0 5px', color: atts.titleColor, lineHeight: '1.3' } },
                                    atts.title || 'Kashmir Delight Package'
                                ),
                                includedPaxHtml,
                                atts.briefText ? el('p', { className: 'ktv-tour-package-brief', style: { fontSize: '13px', color: atts.darkMode ? '#999' : '#555', marginBottom: '10px' } }, atts.briefText) : null,
                                atts.location ? el('div', { className: 'ktv-tour-package-location', style: { fontSize: '13px', color: atts.darkMode ? '#999' : '#666', marginBottom: '12px' } },
                                    el('i', { className: 'fas fa-map-marker-alt', style: { color: atts.iconColor } }),
                                    ' ', atts.location
                                ) : null,
                                atts.showIcons !== false ? el('div', {
                                    className: 'ktv-tour-package-icons',
                                    style: { display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '15px', gap: '5px', flexWrap: 'wrap' }
                                },
                                    packageIcons.map(function (ico, i) {
                                        if (!ico.label || !ico.icon) return null;
                                        return el('div', {
                                            key: i,
                                            className: 'ktv-tour-package-icon-item',
                                            style: { textAlign: 'center', fontSize: '11px', color: atts.iconColor, flex: 1, minWidth: '50px' }
                                        },
                                            el('span', { className: 'ktv-icon', style: { display: 'block', fontSize: atts.iconSize, marginBottom: '4px' } },
                                                el('i', { className: 'fas ' + ico.icon, style: { color: atts.iconColor } })
                                            ),
                                            el('span', { className: 'ktv-tour-package-icon-label', style: { fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: atts.iconColor } }, ico.label)
                                        );
                                    })
                                ) : null,
                                (atts.showPax !== false && paxPreviewItems.length > 0) ? el('div', {
                                    className: 'ktv-tour-pax-grid',
                                    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', marginBottom: '12px', background: atts.darkMode ? '#2a2a3e' : '#f8f9fa', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '12px' }
                                },
                                    paxPreviewItems.map(function (p, i) {
                                        return el('div', { className: 'ktv-pax-item', key: i },
                                            el('i', { className: 'fas ' + (p.icon || 'fa-user'), style: { fontSize: atts.iconSize, color: atts.iconColor, display: 'block', marginBottom: '4px' } }),
                                            el('span', { style: { display: 'block', color: '#666', marginBottom: '2px' } }, p.label),
                                            el('strong', { style: { color: '#28a745' } }, cs + (p.price || 0))
                                        );
                                    })
                                ) : null,
                                atts.showReviews ? el('div', { className: 'ktv-tour-package-reviews-mini ktv-review-clickable', style: { display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 8px', cursor: 'pointer' } },
                                    atts.totalReviews > 0 ? el(Fragment, {},
                                        el('span', { style: { fontWeight: '700', fontSize: '16px', color: atts.darkMode ? '#e0e0e0' : '#333' } }, parseFloat(atts.avgRating || 0).toFixed(1)),
                                        el('span', { style: { color: atts.reviewStarColor, fontSize: '14px' } },
                                            (function () {
                                                var stars = '';
                                                var r = atts.avgRating || 0;
                                                var fullStars = Math.floor(r);
                                                var hasHalf = (r - fullStars) >= 0.5;
                                                for (var i = 1; i <= 5; i++) {
                                                    if (i <= fullStars) stars += '★';
                                                    else if (i === fullStars + 1 && hasHalf) stars += '★';
                                                    else stars += '☆';
                                                }
                                                return stars;
                                            })()
                                        ),
                                        el('span', { style: { fontSize: '12px', color: '#666' } }, '(' + atts.totalReviews + ' reviews)')
                                    ) : el('span', { className: 'ktv-zero-reviews-link', style: { fontSize: '12px', color: atts.darkMode ? '#999' : '#666' } }, '0 Reviews')
                                ) : null,
                                atts.lastBookingName ? el('div', {
                                    className: 'ktv-last-booking',
                                    style: { display: 'flex', alignItems: 'center', gap: '6px', background: atts.darkMode ? '#2a2a3e' : '#e8f5e9', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' }
                                },
                                    el('i', { className: 'fas fa-clock' }),
                                    atts.lastBookingCount > 0 ? 'Booked ' + atts.lastBookingCount + ' times' : 'Last booking',
                                    ' ', el('strong', null, atts.lastBookingName), ' from ', atts.lastBookingCountry,
                                    ' - ', el('span', { className: 'ktv-time-ago' }, atts.lastBookingTime || 'Just now')
                                ) : null,
                                atts.promoCode ? el('div', {
                                    className: 'ktv-promo-code',
                                    style: { margin: '8px 0', padding: '8px 12px', background: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', borderRadius: '8px', border: '1px dashed #ff5722', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '5px' }
                                },
                                    el('span', { style: { fontSize: '12px', color: '#e65100' } }, el('i', { className: 'fas fa-ticket-alt', style: { marginRight: '6px' } }), 'Promo: ', el('strong', { style: { textTransform: 'uppercase' } }, atts.promoCode)),
                                    atts.promoDiscount > 0 ? el('span', { style: { fontSize: '11px', color: '#ff5722', fontWeight: '600' } }, '-' + atts.promoDiscount + '% OFF') : null
                                ) : null,
                                (atts.cancellationPolicy || atts.cancellationText) ? el('div', {
                                    className: 'ktv-cancellation-policy',
                                    style: {
                                        margin: '8px 0', padding: '6px 12px', background: atts.darkMode ? '#2a2a3e' : '#f8f9fa',
                                        borderRadius: '6px', fontSize: '11px', color: atts.darkMode ? '#999' : '#666',
                                        borderLeft: '3px solid ' + (atts.cancellationPolicy === 'fully_refundable' ? '#28a745' : (atts.cancellationPolicy === 'partial_refundable' ? '#ffc107' : '#dc3545'))
                                    }
                                },
                                    el('i', { className: 'fas fa-info-circle', style: { marginRight: '6px' } }),
                                    ' ', atts.cancellationText || (atts.cancellationPolicy === 'fully_refundable' ? 'Fully Refundable' : atts.cancellationPolicy === 'partial_refundable' ? 'Partial Refundable' : 'Non-Refundable')
                                ) : null,
                                el('div', {
                                    className: 'ktv-tour-package-price',
                                    style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '5px' }
                                },
                                    el('div', null,
                                        hasDiscount ? el('span', { className: 'ktv-tour-package-old-price', style: { textDecoration: 'line-through', color: '#999', fontSize: '13px', marginRight: '8px' } }, cs + (atts.price || 0)) : null,
                                        el('span', { className: 'ktv-tour-package-new-price', style: { fontSize: '24px', fontWeight: '700', color: atts.priceColor } }, cs + (displayPrice || 0)),
                                        priceUnitLabel ? el('span', { className: 'ktv-tour-package-price-unit', style: { fontSize: '11px', color: '#888' } }, priceUnitLabel) : null,
                                        atts.showGst ? el('span', { className: 'ktv-gst-badge', style: { display: 'inline-block', background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', marginLeft: '5px' } }, el('i', { className: 'fas fa-receipt' }), ' ', atts.gstLabel || 'GST', ' ', atts.gstPercent || '5', '%') : null
                                    )
                                ),
                                atts.buttonUrl && atts.buttonUrl !== '#' ?
                                    el('a', {
                                        href: atts.buttonUrl,
                                        className: 'ktv-tour-package-btn',
                                        title: (atts.buttonText || 'Book Package') + ' — ' + (atts.title || ''),
                                        style: { width: '100%', padding: '12px', background: atts.buttonColor, color: atts.buttonTextColor, border: 'none', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' },
                                        'data-tour-id': atts.tourId || 0,
                                        'data-tour-name': atts.title || '',
                                        'data-tour-price': displayPrice || 0,
                                        'data-tour-location': atts.location || '',
                                        'data-block-type': 'package',
                                        'data-tour-adults': atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                        'data-tour-children': atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                        'data-show-per-day': atts.showPerDayPrice !== false ? '1' : '0',
                                        'data-show-complete': atts.showCompletePrice === true ? '1' : '0',
                                        'data-price-basis': atts.showCompletePrice === true ? 'total' : 'per_day'
                                    },
                                        el('i', { className: 'fas fa-calendar-check' }), ' ', atts.buttonText
                                    ) :
                                    el('button', {
                                        className: 'ktv-tour-package-btn',
                                        title: (atts.buttonText || 'Book Package') + ' — ' + (atts.title || ''),
                                        style: { width: '100%', padding: '12px', background: atts.buttonColor, color: atts.buttonTextColor, border: 'none', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
                                        'data-tour-id': atts.tourId || 0,
                                        'data-tour-name': atts.title || '',
                                        'data-tour-price': displayPrice || 0,
                                        'data-tour-location': atts.location || '',
                                        'data-block-type': 'package',
                                        'data-tour-adults': atts.defaultAdults !== undefined ? atts.defaultAdults : 2,
                                        'data-tour-children': atts.defaultChildren !== undefined ? atts.defaultChildren : 0,
                                        'data-show-per-day': atts.showPerDayPrice !== false ? '1' : '0',
                                        'data-show-complete': atts.showCompletePrice === true ? '1' : '0',
                                        'data-price-basis': atts.showCompletePrice === true ? 'total' : 'per_day'
                                    },
                                        el('i', { className: 'fas fa-calendar-check' }), ' ', atts.buttonText
                                    )
                            )
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           12. BLOCK — KTV TOUR ICONS
           ============================================================ */

        wp.blocks.registerBlockType('ktv/tour-icons', {
            title: 'KTV Tour Icons',
            description: 'Icon row with text (Hotels, Meals, Transport, Flight, Horseriding, Trekking). Editable icons, shapes, colors, and cross-out option for excluded items.',
            icon: 'screenoptions',
            category: 'ktv-travel',
            keywords: ['icons', 'activities', 'amenities', 'included', 'excluded'],
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                icons: {
                    type: 'array',
                    default: [
                        { icon: 'fa-hotel', text: 'Hotels', excluded: false, fontSize: '14px', color: '#075e54', fontWeight: '600' },
                        { icon: 'fa-utensils', text: 'Meals', excluded: false, fontSize: '14px', color: '#075e54', fontWeight: '600' },
                        { icon: 'fa-car', text: 'Transport', excluded: false, fontSize: '14px', color: '#075e54', fontWeight: '600' },
                        { icon: 'fa-plane', text: 'Flight', excluded: false, fontSize: '14px', color: '#075e54', fontWeight: '600' },
                        { icon: 'fa-horse', text: 'Horseriding', excluded: false, fontSize: '14px', color: '#075e54', fontWeight: '600' },
                        { icon: 'fa-hiking', text: 'Trekking', excluded: false, fontSize: '14px', color: '#075e54', fontWeight: '600' }
                    ]
                },
                layout: { type: 'string', default: 'horizontal' },
                gap: { type: 'string', default: '16px' },
                shape: { type: 'string', default: 'plain' },
                showText: { type: 'boolean', default: true },
                borderColor: { type: 'string', default: '#075e54' },
                borderWidth: { type: 'string', default: '1px' },
                bgColor: { type: 'string', default: '#e8f5e9' },
                textColor: { type: 'string', default: '#075e54' },
                excludedColor: { type: 'string', default: '#dc3545' },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-tour-icons' });
                var icons = atts.icons || [];
                var shape = atts.shape || 'plain';

                function addIcon() {
                    var updated = icons.concat([{
                        icon: 'fa-star',
                        text: 'New Item',
                        excluded: false,
                        fontSize: '14px',
                        color: atts.textColor || '#075e54',
                        fontWeight: '600'
                    }]);
                    setAtts({ icons: updated });
                }

                function updateIcon(index, key, value) {
                    var updated = icons.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ icons: updated });
                }

                function deleteIcon(index) {
                    var updated = icons.slice();
                    updated.splice(index, 1);
                    setAtts({ icons: updated });
                }

                var layoutOptions = [
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Vertical', value: 'vertical' }
                ];

                var shapeClassMap = {
                    'plain': 'ktv-shape-plain',
                    'pill': 'ktv-shape-pill',
                    'square': 'ktv-shape-square',
                    'oval': 'ktv-shape-oval',
                    'round': 'ktv-shape-round'
                };

                var shapeStyleMap = {
                    'plain': '',
                    'pill': 'border-radius:999px;padding:6px 14px;',
                    'square': 'border-radius:4px;padding:6px 12px;',
                    'oval': 'border-radius:50%/40%;padding:8px 18px;',
                    'round': 'border-radius:50%;padding:10px;width:52px;height:52px;justify-content:center;'
                };

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '⚙️ Layout Settings', initialOpen: true },
                            el(SelectControl, {
                                label: 'Layout',
                                value: atts.layout || 'horizontal',
                                options: layoutOptions,
                                onChange: function (v) { setAtts({ layout: v }); }
                            }),
                            el(SelectControl, {
                                label: 'Shape',
                                value: shape,
                                options: tourIconsShapeOptions,
                                onChange: function (v) { setAtts({ shape: v }); }
                            }),
                            el(TextControl, {
                                label: 'Gap Between Icons',
                                value: atts.gap || '16px',
                                onChange: function (v) { setAtts({ gap: v }); },
                                placeholder: '16px'
                            }),
                            el(ToggleControl, {
                                label: 'Show Text Inside Button',
                                checked: atts.showText !== false,
                                onChange: function (v) { setAtts({ showText: v }); }
                            })
                        ),
                        shape !== 'plain' ? el(PanelBody, { title: '🎨 Shape Colors', initialOpen: true },
                            ColorControl('Background Color', atts.bgColor || '#e8f5e9', function (v) { setAtts({ bgColor: v }); }),
                            ColorControl('Border Color', atts.borderColor || '#075e54', function (v) { setAtts({ borderColor: v }); }),
                            el(SelectControl, {
                                label: 'Border Width',
                                value: atts.borderWidth || '1px',
                                options: borderWidthOptions,
                                onChange: function (v) { setAtts({ borderWidth: v }); }
                            }),
                            ColorControl('Text Color', atts.textColor || '#075e54', function (v) { setAtts({ textColor: v }); })
                        ) : null,
                        el(PanelBody, { title: '❌ Excluded Cross Color', initialOpen: false },
                            el('p', { style: { fontSize: '11px', color: '#666' } }, 'Applies to items marked "Excluded (cross-out)" below.'),
                            ColorControl('Excluded Cross-Out Color', atts.excludedColor || '#dc3545', function (v) { setAtts({ excludedColor: v }); })
                        ),
                        el(PanelBody, { title: '🎯 Manage Icons', initialOpen: true },
                            el(Button, {
                                onClick: addIcon,
                                variant: 'primary',
                                style: { width: '100%', marginBottom: '15px' }
                            }, '+ Add New Icon'),
                            icons.length === 0 ? el('p', { style: { textAlign: 'center', color: '#666', padding: '20px' } }, 'No icons yet. Click "+ Add New Icon" to start.') : null,
                            icons.map(function (ico, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Icon #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteIcon(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#fff', borderRadius: '6px', marginBottom: '10px' } },
                                        el('span', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#f0f4f8', borderRadius: '6px' } },
                                            el('i', { className: 'fas ' + (ico.icon || 'fa-star'), style: { fontSize: ico.fontSize || '14px', color: ico.color || '#075e54' } })
                                        ),
                                        el('span', { style: { fontSize: '14px', color: ico.color || '#075e54', fontWeight: ico.fontWeight || '600', textDecoration: ico.excluded ? 'line-through' : 'none', opacity: ico.excluded ? '0.5' : '1' } }, ico.text || 'Text')
                                    ),
                                    el(SelectControl, {
                                        label: 'Icon',
                                        value: ico.icon || 'fa-star',
                                        options: iconOptions,
                                        onChange: function (v) { updateIcon(idx, 'icon', v); }
                                    }),
                                    el(TextControl, {
                                        label: 'Text',
                                        value: ico.text || '',
                                        onChange: function (v) { updateIcon(idx, 'text', v); }
                                    }),
                                    el(SelectControl, {
                                        label: 'Font Size',
                                        value: ico.fontSize || '14px',
                                        options: fontSizes,
                                        onChange: function (v) { updateIcon(idx, 'fontSize', v); }
                                    }),
                                    el(SelectControl, {
                                        label: 'Font Weight',
                                        value: ico.fontWeight || '600',
                                        options: fontWeightOptions,
                                        onChange: function (v) { updateIcon(idx, 'fontWeight', v); }
                                    }),
                                    ColorControl('Color', ico.color || atts.textColor || '#075e54', function (v) { updateIcon(idx, 'color', v); }),
                                    el(ToggleControl, {
                                        label: 'Excluded (cross-out)',
                                        checked: ico.excluded === true,
                                        onChange: function (v) { updateIcon(idx, 'excluded', v); }
                                    })
                                );
                            })
                        )
                    ),
                    el('div', blockProps,
                        el('div', {
                            className: 'ktv-tour-icons-row ktv-tour-icons-' + (atts.layout || 'horizontal') + (atts.darkMode ? ' ktv-dark-mode' : ''),
                            style: {
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: atts.layout === 'vertical' ? 'column' : 'row',
                                alignItems: atts.layout === 'vertical' ? 'flex-start' : 'center',
                                gap: atts.gap || '16px',
                                padding: '15px 0'
                            }
                        },
                            icons.length === 0 ? el('p', { style: { color: '#999', fontStyle: 'italic' } }, 'Add icons in the inspector panel →') : null,
                            icons.map(function (ico, idx) {
                                var cellStyle = {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: ico.fontSize || '14px',
                                    color: ico.color || atts.textColor || '#075e54',
                                    fontWeight: ico.fontWeight || '600'
                                };
                                if (shape !== 'plain') {
                                    var extraStyle = shapeStyleMap[shape] || '';
                                    var stylePairs = extraStyle.split(';').filter(function (s) { return s.indexOf(':') !== -1; });
                                    stylePairs.forEach(function (pair) {
                                        var parts = pair.split(':');
                                        var key = parts[0].trim();
                                        var val = parts.slice(1).join(':').trim();
                                        if (key) {
                                            var camelKey = key.replace(/-([a-z])/g, function (m, letter) { return letter.toUpperCase(); });
                                            cellStyle[camelKey] = val;
                                        }
                                    });
                                    cellStyle.background = atts.bgColor || '#e8f5e9';
                                    cellStyle.border = (atts.borderWidth || '1px') + ' solid ' + (atts.borderColor || '#075e54');
                                }
                                if (ico.excluded) {
                                    cellStyle.textDecoration = 'line-through';
                                    cellStyle.textDecorationColor = atts.excludedColor || '#dc3545';
                                    cellStyle.opacity = '0.65';
                                    cellStyle.color = atts.excludedColor || '#dc3545';
                                }

                                return el('div', {
                                    key: idx,
                                    className: 'ktv-tour-icon-cell ' + (shapeClassMap[shape] || 'ktv-shape-plain') + (ico.excluded ? ' excluded' : ''),
                                    style: cellStyle
                                },
                                    el('i', {
                                        className: 'fas ' + (ico.icon || 'fa-star'),
                                        style: {
                                            fontSize: ico.fontSize || '14px',
                                            color: ico.excluded ? (atts.excludedColor || '#dc3545') : (ico.color || atts.textColor || '#075e54')
                                        }
                                    }),
                                    (atts.showText !== false && ico.text) ? el('span', null, ico.text) : null
                                );
                            })
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           13. BLOCK — KTV PIXEL CAROUSEL
           ============================================================ */

        wp.blocks.registerBlockType('ktv/pixel-carousel', {
            title: 'KTV Pixel Carousel',
            description: 'Image carousel with titles, badges, buttons, and image upload per slide. 9 slide effects: slide, fade, zoom, cube, flip, coverflow, parallax, rotate3d, blur.',
            icon: 'slides',
            category: 'ktv-travel',
            keywords: ['carousel', 'slider', 'images', 'gallery'],
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                autoplay: { type: 'boolean', default: true },
                autoplayDelay: { type: 'number', default: 5000 },
                carouselWidth: { type: 'string', default: 'wide' },
                slideEffects: { type: 'string', default: 'slide' },
                showNavigation: { type: 'boolean', default: true },
                navPrev: { type: 'boolean', default: true },
                navNext: { type: 'boolean', default: true },
                arrowSize: { type: 'string', default: '45px' },
                arrowColor: { type: 'string', default: 'rgba(0,0,0,0.6)' },
                dotSize: { type: 'string', default: '12px' },
                dotColor: { type: 'string', default: 'rgba(255,255,255,0.5)' },
                dotActiveColor: { type: 'string', default: '#28a745' },
                showTitle: { type: 'boolean', default: true },
                showText: { type: 'boolean', default: true },
                showBadge: { type: 'boolean', default: true },
                showButton: { type: 'boolean', default: true },
                titleFontSize: { type: 'string', default: '42px' },
                titleColor: { type: 'string', default: '#ffffff' },
                textFontSize: { type: 'string', default: '18px' },
                textColor: { type: 'string', default: '#ffffff' },
                badgeColor: { type: 'string', default: '#ff5722' },
                badgeIcon: { type: 'string', default: 'fa-tag' },
                buttonText: { type: 'string', default: 'Explore Now' },
                buttonColor: { type: 'string', default: '#28a745' },
                overlayOpacity: { type: 'number', default: 0.60 },
                mobileSlides: { type: 'number', default: 1 },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-image' },
                iconTitleSize: { type: 'string', default: '16px' },
                iconTitleColor: { type: 'string', default: '#ffffff' },
                iconSize: { type: 'string', default: '16px' },
                iconColor: { type: 'string', default: '#ff5722' },
                slides: { type: 'array', default: [] }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-pixel-carousel' });
                var slides = atts.slides || [];

                function addSlide() {
                    var newSlides = slides.concat([{
                        id: Date.now(),
                        title: '',
                        text: '',
                        badge: '',
                        buttonText: atts.buttonText || 'Explore Now',
                        buttonUrl: '#',
                        imageId: 0,
                        imageDisplaySize: 'large',
                        badgeColor: atts.badgeColor || '#ff5722',
                        badgeIcon: atts.badgeIcon || 'fa-tag'
                    }]);
                    setAtts({ slides: newSlides });
                }

                function updateSlide(index, key, value) {
                    var updated = slides.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ slides: updated });
                }

                function deleteSlide(index) {
                    var updated = slides.slice();
                    updated.splice(index, 1);
                    setAtts({ slides: updated });
                }

                var effectLabels = {
                    slide: '⬅️ Slide', fade: '🌫️ Fade', zoom: '🔍 Zoom',
                    cube: '🎲 Cube', flip: '🔄 Flip', coverflow: '📚 Coverflow',
                    parallax: '🌊 Parallax', rotate3d: '🌀 Rotate3D', blur: '💨 Blur'
                };

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🎨 Carousel Settings', initialOpen: true },
                            el(ToggleControl, { label: 'Autoplay', checked: atts.autoplay, onChange: function (v) { setAtts({ autoplay: v }); } }),
                            atts.autoplay ? el(RangeControl, { label: 'Delay (ms)', value: atts.autoplayDelay, onChange: function (v) { setAtts({ autoplayDelay: v }); }, min: 1000, max: 10000 }) : null,
                            el(SelectControl, { label: 'Carousel Width', value: atts.carouselWidth, options: carouselWidthOptions, onChange: function (v) { setAtts({ carouselWidth: v }); } }),
                            el(SelectControl, { label: 'Slide Effect', value: atts.slideEffects || 'slide', options: carouselEffectOptions, onChange: function (v) { setAtts({ slideEffects: v }); } }),
                            el('p', { style: { fontSize: '11px', color: '#666', fontStyle: 'italic', marginTop: '-8px' } }, 'Current: ' + (effectLabels[atts.slideEffects] || 'Slide')),
                            el(RangeControl, { label: 'Overlay Opacity', value: atts.overlayOpacity, onChange: function (v) { setAtts({ overlayOpacity: v }); }, min: 0, max: 1, step: 0.05 }),
                            el(RangeControl, { label: 'Mobile Slides (Visible per view)', value: atts.mobileSlides, onChange: function (v) { setAtts({ mobileSlides: v }); }, min: 1, max: 7, step: 1 })
                        ),
                        el(PanelBody, { title: '➡️ Navigation', initialOpen: false },
                            el(ToggleControl, { label: 'Show Navigation Arrows', checked: atts.showNavigation, onChange: function (v) { setAtts({ showNavigation: v }); } }),
                            atts.showNavigation ? el(Fragment, {},
                                el(ToggleControl, { label: 'Show Previous Arrow', checked: atts.navPrev !== false, onChange: function (v) { setAtts({ navPrev: v }); } }),
                                el(ToggleControl, { label: 'Show Next Arrow', checked: atts.navNext !== false, onChange: function (v) { setAtts({ navNext: v }); } }),
                                el(SelectControl, { label: 'Arrow Size', value: atts.arrowSize || '45px', options: iconSizes, onChange: function (v) { setAtts({ arrowSize: v }); } }),
                                ColorControl('Arrow Background Color', atts.arrowColor || 'rgba(0,0,0,0.6)', function (v) { setAtts({ arrowColor: v }); })
                            ) : null
                        ),
                        el(PanelBody, { title: '🔵 Dots', initialOpen: false },
                            el(SelectControl, { label: 'Dot Size', value: atts.dotSize || '12px', options: iconSizes, onChange: function (v) { setAtts({ dotSize: v }); } }),
                            ColorControl('Dot Color', atts.dotColor || 'rgba(255,255,255,0.5)', function (v) { setAtts({ dotColor: v }); }),
                            ColorControl('Dot Active Color', atts.dotActiveColor || '#28a745', function (v) { setAtts({ dotActiveColor: v }); })
                        ),
                        el(PanelBody, { title: '👁️ Show/Hide Elements', initialOpen: false },
                            el(ToggleControl, { label: 'Show Title', checked: atts.showTitle !== false, onChange: function (v) { setAtts({ showTitle: v }); } }),
                            el(ToggleControl, { label: 'Show Text', checked: atts.showText !== false, onChange: function (v) { setAtts({ showText: v }); } }),
                            el(ToggleControl, { label: 'Show Badge', checked: atts.showBadge !== false, onChange: function (v) { setAtts({ showBadge: v }); } }),
                            el(ToggleControl, { label: 'Show Button', checked: atts.showButton !== false, onChange: function (v) { setAtts({ showButton: v }); } })
                        ),
                        el(PanelBody, { title: '🔤 Typography', initialOpen: false },
                            el(SelectControl, { label: 'Title Size', value: atts.titleFontSize, options: fontSizes, onChange: function (v) { setAtts({ titleFontSize: v }); } }),
                            ColorControl('Title Color', atts.titleColor, function (v) { setAtts({ titleColor: v }); }),
                            el(SelectControl, { label: 'Text Size', value: atts.textFontSize, options: fontSizes, onChange: function (v) { setAtts({ textFontSize: v }); } }),
                            ColorControl('Text Color', atts.textColor, function (v) { setAtts({ textColor: v }); })
                        ),
                        el(PanelBody, { title: '🏷️ Badge & Button', initialOpen: false },
                            ColorControl('Badge Color', atts.badgeColor, function (v) { setAtts({ badgeColor: v }); }),
                            el(SelectControl, { label: 'Badge Icon', value: atts.badgeIcon || 'fa-tag', options: iconOptions, onChange: function (v) { setAtts({ badgeIcon: v }); } }),
                            el(TextControl, { label: 'Default Button Text', value: atts.buttonText || 'Explore Now', onChange: function (v) { setAtts({ buttonText: v }); } }),
                            ColorControl('Button Color', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); })
                        ),
                        el(PanelBody, { title: '📸 Manage Slides (with Image Upload)', initialOpen: false },
                            el('div', { style: { marginBottom: '10px' } },
                                el(Button, { onClick: addSlide, variant: 'primary', style: { width: '100%', textAlign: 'center' } }, '+ Add New Slide')
                            ),
                            slides.length === 0 ? el('div', { style: { padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#666' } }, 'No slides added.') : null,
                            slides.map(function (slide, idx) {
                                var slideImgUrl = getImageUrl(slide.imageId, slide.imageDisplaySize || 'large');
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Slide #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteSlide(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    MediaUploadControl(
                                        slide.imageId,
                                        function (id) { updateSlide(idx, 'imageId', id); },
                                        'Slide Image',
                                        null, null,
                                        slide.imageDisplaySize || 'large',
                                        function (v) { updateSlide(idx, 'imageDisplaySize', v); }
                                    ),
                                    slideImgUrl ? el('img', { src: slideImgUrl, width: 400, height: 120, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' } }) : null,
                                    el(TextControl, { label: 'Slide Title', value: slide.title, onChange: function (v) { updateSlide(idx, 'title', v); } }),
                                    el(TextareaControl, { label: 'Slide Text', value: slide.text, rows: 2, onChange: function (v) { updateSlide(idx, 'text', v); } }),
                                    el(TextControl, { label: 'Badge Text', value: slide.badge, onChange: function (v) { updateSlide(idx, 'badge', v); } }),
                                    el(TextControl, { label: 'Button Text', value: slide.buttonText || atts.buttonText || 'Explore Now', onChange: function (v) { updateSlide(idx, 'buttonText', v); } }),
                                    el(TextControl, { label: 'Button URL', value: slide.buttonUrl || '#', onChange: function (v) { updateSlide(idx, 'buttonUrl', v); } }),
                                    ColorControl('Badge Color (per slide)', slide.badgeColor || atts.badgeColor || '#ff5722', function (v) { updateSlide(idx, 'badgeColor', v); }),
                                    el(SelectControl, { label: 'Badge Icon (per slide)', value: slide.badgeIcon || atts.badgeIcon || 'fa-tag', options: iconOptions, onChange: function (v) { updateSlide(idx, 'badgeIcon', v); } })
                                );
                            })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { style: { padding: '20px', background: atts.darkMode ? '#0f0f1e' : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '12px', color: '#fff', textAlign: 'center' } },
                            el('h3', null, '📸 Pixel Carousel - ' + slides.length + ' Slides'),
                            el('p', { style: { fontSize: '12px' } }, 'Autoplay: ' + (atts.autoplay ? 'ON' : 'OFF') + ' | Width: ' + atts.carouselWidth + ' | Effect: ' + (effectLabels[atts.slideEffects] || 'Slide') + ' | Mobile Slides: ' + atts.mobileSlides),
                            slides.length > 0 ? el('div', { style: { marginTop: '10px', display: 'flex', gap: '10px', overflow: 'auto', padding: '10px', width: '100%', position: 'relative' } },
                                el('div', { style: { display: 'flex', width: '100%' } },
                                    slides.map(function (slide, idx) {
                                        var imgUrl = getImageUrl(slide.imageId, slide.imageDisplaySize || 'large');
                                        return el('div', { key: idx, style: { flex: '0 0 100%', minWidth: '100%', maxWidth: '100%', padding: '5px', boxSizing: 'border-box', flexShrink: 0 } },
                                            el('div', { style: { background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', height: '100%', minHeight: '120px' } },
                                                imgUrl ? el('img', { src: imgUrl, width: 400, height: 100, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' } }) : el('div', { style: { height: '100px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '📷'),
                                                el('strong', null, slide.title || 'Slide ' + (idx + 1))
                                            )
                                        );
                                    })
                                )
                            ) : el('div', { style: { marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' } }, 'Click "+ Add New Slide"')
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           14. BLOCK — KTV BOOKING FORM
           ============================================================ */

        wp.blocks.registerBlockType('ktv/booking-form', {
            title: 'KTV Booking Form',
            description: 'Multi-step booking form with GPay, credit card toggle, bank, flight details, modal popup settings, custom sections, mandatory fields toggle, honeypot + spam protection, 39 editable field icons, and button / badge / step-button colours.',
            icon: 'calendar-alt',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                formTitle: { type: 'string', default: 'Book Your Trip' },
                formSubtitle: { type: 'string', default: 'Fill the form to reserve your spot' },
                buttonColor: { type: 'string', default: '#075e54' },
                buttonTextColor: { type: 'string', default: '#ffffff' },
                buttonBgColor: { type: 'string', default: '#28a745' },
                buttonBgTextColor: { type: 'string', default: '#ffffff' },
                badgeBgColor: { type: 'string', default: '#ff5722' },
                badgeTextColor: { type: 'string', default: '#ffffff' },
                stepNextBgColor: { type: 'string', default: '#28a745' },
                stepNextTextColor: { type: 'string', default: '#ffffff' },
                stepPrevBgColor: { type: 'string', default: '#6c757d' },
                stepPrevTextColor: { type: 'string', default: '#ffffff' },
                buttonText: { type: 'string', default: 'Confirm Booking' },
                borderColor: { type: 'string', default: '#e0e0e0' },
                borderSize: { type: 'string', default: '1px' },
                borderRadius: { type: 'string', default: '12px' },
                multiStep: { type: 'boolean', default: true },
                formWidth: { type: 'string', default: 'full' },
                adultsLabel: { type: 'string', default: 'Adults' },
                childrenLabel: { type: 'string', default: 'Kids' },
                arrivalLabel: { type: 'string', default: 'Arrival Date' },
                departureLabel: { type: 'string', default: 'Departure Date' },
                tourLabel: { type: 'string', default: 'Select Tour Type' },
                showTourIconInDropdown: { type: 'boolean', default: true },
                showTourType: { type: 'boolean', default: true },
                nameLabel: { type: 'string', default: 'Full Name' },
                emailLabel: { type: 'string', default: 'Email Address' },
                phoneLabel: { type: 'string', default: 'Phone Number' },
                countryLabel: { type: 'string', default: 'Country' },
                travelLocationLabel: { type: 'string', default: 'Travel Location' },
                cardNameLabel: { type: 'string', default: 'Cardholder Name' },
                cardNumberLabel: { type: 'string', default: 'Card Number' },
                cardExpiryLabel: { type: 'string', default: 'MM/YY' },
                cardCvvLabel: { type: 'string', default: 'CVV' },
                cardPinLabel: { type: 'string', default: 'PIN' },
                passportLabel: { type: 'string', default: 'Passport No' },
                visaLabel: { type: 'string', default: 'Visa No' },
                showPassportVisa: { type: 'boolean', default: true },
                noBorder: { type: 'boolean', default: true },
                upiId: { type: 'string', default: '7006838859@okbizaxis' },
                showTravelLocation: { type: 'boolean', default: true },
                showBrowseLocation: { type: 'boolean', default: true },
                showUpi: { type: 'boolean', default: true },
                showCreditCard: { type: 'boolean', default: true },
                locationIcon: { type: 'string', default: 'fa-map-marker-alt' },
                locationIconSize: { type: 'string', default: '16px' },
                locationIconColor: { type: 'string', default: '#075e54' },
                formBgColor: { type: 'string', default: '#ffffff' },
                formTextColor: { type: 'string', default: '#333333' },
                formHeadingSize: { type: 'string', default: '24px' },
                formHeadingColor: { type: 'string', default: '#333333' },
                formHeadingFontFamily: { type: 'string', default: 'inherit' },
                gstPercent: { type: 'string', default: '5' },
                gstLabel: { type: 'string', default: 'GST' },
                showGst: { type: 'boolean', default: true },
                defaultArrivalDate: { type: 'string', default: '' },
                defaultDepartureDate: { type: 'string', default: '' },
                travelDateFontWeight: { type: 'string', default: '700' },
                travelDateFontSize: { type: 'string', default: '16px' },
                travelDateColor: { type: 'string', default: '#333333' },
                travelDateBgColor: { type: 'string', default: '#f8f9fa' },
                adultsFontSize: { type: 'string', default: '16px' },
                adultsFontWeight: { type: 'string', default: '600' },
                adultsColor: { type: 'string', default: '#333333' },
                kidsFontSize: { type: 'string', default: '16px' },
                kidsFontWeight: { type: 'string', default: '600' },
                kidsColor: { type: 'string', default: '#333333' },
                placeholderColor: { type: 'string', default: '#999999' },
                placeholderFontSize: { type: 'string', default: '14px' },
                placeholderFontWeight: { type: 'string', default: '400' },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-calendar-alt' },
                iconTitleSize: { type: 'string', default: '24px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                tourTypePriceGap: { type: 'number', default: 15 },
                flightAirlineLabel: { type: 'string', default: 'Airline' },
                flightNumberLabel: { type: 'string', default: 'Flight Number' },
                flightDepartureLabel: { type: 'string', default: 'Departure City' },
                flightArrivalLabel: { type: 'string', default: 'Arrival City' },
                flightTimeLabel: { type: 'string', default: 'Flight Time' },
                showFlightDetails: { type: 'boolean', default: true },
                customSections: { type: 'array', default: [] },
                enableModal: { type: 'boolean', default: false },
                modalTitle: { type: 'string', default: 'Book Your Trip' },
                modalSubtitle: { type: 'string', default: 'Fill the form to reserve your spot' },
                modalWidth: { type: 'string', default: 'large' },
                modalAnimation: { type: 'string', default: 'slide-down' },
                modalCloseText: { type: 'string', default: 'Close' },
                extraAdultPercent: { type: 'number', default: 50 },
                extraChildPercent: { type: 'number', default: 40 },
                enableHoneypot: { type: 'boolean', default: true },
                enableSpamFilter: { type: 'boolean', default: true },
                enableRateLimit: { type: 'boolean', default: true },
                honeypotFieldName: { type: 'string', default: 'ktv_hp_website' },
                mandatoryFields: {
                    type: 'object',
                    default: {
                        name: true,
                        email: true,
                        phone: true,
                        arrival_date: true,
                        departure_date: true,
                        tour_type: true,
                        adults: true,
                        country: false,
                        special_requests: false,
                        id_document: false
                    }
                },
                travelLocationIcon: { type: 'string', default: 'fa-map-marker-alt' },
                travelLocationIconSize: { type: 'string', default: '16px' },
                travelLocationIconColor: { type: 'string', default: '#075e54' },
                arrivalDateIcon: { type: 'string', default: 'fa-calendar-alt' },
                arrivalDateIconSize: { type: 'string', default: '16px' },
                arrivalDateIconColor: { type: 'string', default: '#075e54' },
                departureDateIcon: { type: 'string', default: 'fa-calendar-check' },
                departureDateIconSize: { type: 'string', default: '16px' },
                departureDateIconColor: { type: 'string', default: '#075e54' },
                adultsIcon: { type: 'string', default: 'fa-user' },
                adultsIconSize: { type: 'string', default: '16px' },
                adultsIconColor: { type: 'string', default: '#075e54' },
                kidsIcon: { type: 'string', default: 'fa-child' },
                kidsIconSize: { type: 'string', default: '16px' },
                kidsIconColor: { type: 'string', default: '#075e54' },
                tourTypeIcon: { type: 'string', default: 'fa-map-marked-alt' },
                tourTypeIconSize: { type: 'string', default: '16px' },
                tourTypeIconColor: { type: 'string', default: '#075e54' },
                priceBoxIcon: { type: 'string', default: 'fa-tag' },
                priceBoxIconSize: { type: 'string', default: '18px' },
                priceBoxIconColor: { type: 'string', default: '#28a745' },
                nameIcon: { type: 'string', default: 'fa-user' },
                nameIconSize: { type: 'string', default: '16px' },
                nameIconColor: { type: 'string', default: '#075e54' },
                emailIcon: { type: 'string', default: 'fa-envelope' },
                emailIconSize: { type: 'string', default: '16px' },
                emailIconColor: { type: 'string', default: '#075e54' },
                phoneIcon: { type: 'string', default: 'fa-phone-alt' },
                phoneIconSize: { type: 'string', default: '16px' },
                phoneIconColor: { type: 'string', default: '#075e54' },
                countryIcon: { type: 'string', default: 'fa-globe' },
                countryIconSize: { type: 'string', default: '16px' },
                countryIconColor: { type: 'string', default: '#075e54' },
                flagIcon: { type: 'string', default: 'fa-flag' },
                flagIconSize: { type: 'string', default: '14px' },
                flagIconColor: { type: 'string', default: '#075e54' },
                flightAirlineIcon: { type: 'string', default: 'fa-plane' },
                flightAirlineIconSize: { type: 'string', default: '16px' },
                flightAirlineIconColor: { type: 'string', default: '#075e54' },
                flightNumberIcon: { type: 'string', default: 'fa-ticket-alt' },
                flightNumberIconSize: { type: 'string', default: '16px' },
                flightNumberIconColor: { type: 'string', default: '#075e54' },
                flightDepartureIcon: { type: 'string', default: 'fa-map-marker-alt' },
                flightDepartureIconSize: { type: 'string', default: '16px' },
                flightDepartureIconColor: { type: 'string', default: '#075e54' },
                flightArrivalIcon: { type: 'string', default: 'fa-flag-checkered' },
                flightArrivalIconSize: { type: 'string', default: '16px' },
                flightArrivalIconColor: { type: 'string', default: '#075e54' },
                flightTimeIcon: { type: 'string', default: 'fa-clock' },
                flightTimeIconSize: { type: 'string', default: '16px' },
                flightTimeIconColor: { type: 'string', default: '#075e54' },
                passportIcon: { type: 'string', default: 'fa-passport' },
                passportIconSize: { type: 'string', default: '16px' },
                passportIconColor: { type: 'string', default: '#075e54' },
                visaIcon: { type: 'string', default: 'fa-id-card' },
                visaIconSize: { type: 'string', default: '16px' },
                visaIconColor: { type: 'string', default: '#075e54' },
                specialRequestsIcon: { type: 'string', default: 'fa-comment' },
                specialRequestsIconSize: { type: 'string', default: '16px' },
                specialRequestsIconColor: { type: 'string', default: '#075e54' },
                travelStepIcon: { type: 'string', default: 'fa-map-marker-alt' },
                travelStepIconSize: { type: 'string', default: '20px' },
                travelStepIconColor: { type: 'string', default: '#075e54' },
                personalStepIcon: { type: 'string', default: 'fa-user-circle' },
                personalStepIconSize: { type: 'string', default: '20px' },
                personalStepIconColor: { type: 'string', default: '#075e54' },
                paymentStepIcon: { type: 'string', default: 'fa-credit-card' },
                paymentStepIconSize: { type: 'string', default: '20px' },
                paymentStepIconColor: { type: 'string', default: '#075e54' },
                summaryIcon: { type: 'string', default: 'fa-receipt' },
                summaryIconSize: { type: 'string', default: '20px' },
                summaryIconColor: { type: 'string', default: '#075e54' },
                payOnArrivalIcon: { type: 'string', default: 'fa-hotel' },
                payOnArrivalIconSize: { type: 'string', default: '16px' },
                payOnArrivalIconColor: { type: 'string', default: '#075e54' },
                gpayIcon: { type: 'string', default: 'fa-google-pay' },
                gpayIconSize: { type: 'string', default: '16px' },
                gpayIconColor: { type: 'string', default: '#4285F4' },
                creditCardIcon: { type: 'string', default: 'fa-credit-card' },
                creditCardIconSize: { type: 'string', default: '16px' },
                creditCardIconColor: { type: 'string', default: '#075e54' },
                bankTransferIcon: { type: 'string', default: 'fa-university' },
                bankTransferIconSize: { type: 'string', default: '16px' },
                bankTransferIconColor: { type: 'string', default: '#075e54' },
                cardDetailsIcon: { type: 'string', default: 'fa-credit-card' },
                cardDetailsIconSize: { type: 'string', default: '20px' },
                cardDetailsIconColor: { type: 'string', default: '#075e54' },
                cardNameIcon: { type: 'string', default: 'fa-user' },
                cardNameIconSize: { type: 'string', default: '16px' },
                cardNameIconColor: { type: 'string', default: '#075e54' },
                cardNumberIcon: { type: 'string', default: 'fa-credit-card' },
                cardNumberIconSize: { type: 'string', default: '16px' },
                cardNumberIconColor: { type: 'string', default: '#075e54' },
                cardExpiryIcon: { type: 'string', default: 'fa-calendar' },
                cardExpiryIconSize: { type: 'string', default: '16px' },
                cardExpiryIconColor: { type: 'string', default: '#075e54' },
                cardCvvIcon: { type: 'string', default: 'fa-lock' },
                cardCvvIconSize: { type: 'string', default: '16px' },
                cardCvvIconColor: { type: 'string', default: '#075e54' },
                cardPinIcon: { type: 'string', default: 'fa-key' },
                cardPinIconSize: { type: 'string', default: '16px' },
                cardPinIconColor: { type: 'string', default: '#075e54' },
                upiHeadingIcon: { type: 'string', default: 'fa-google-pay' },
                upiHeadingIconSize: { type: 'string', default: '20px' },
                upiHeadingIconColor: { type: 'string', default: '#4285F4' },
                bankDetailsIcon: { type: 'string', default: 'fa-university' },
                bankDetailsIconSize: { type: 'string', default: '20px' },
                bankDetailsIconColor: { type: 'string', default: '#075e54' },
                idDocumentIcon: { type: 'string', default: 'fa-id-card' },
                idDocumentIconSize: { type: 'string', default: '20px' },
                idDocumentIconColor: { type: 'string', default: '#075e54' },
                idNumberIcon: { type: 'string', default: 'fa-id-card' },
                idNumberIconSize: { type: 'string', default: '16px' },
                idNumberIconColor: { type: 'string', default: '#075e54' },
                idUploadIcon: { type: 'string', default: 'fa-upload' },
                idUploadIconSize: { type: 'string', default: '16px' },
                idUploadIconColor: { type: 'string', default: '#075e54' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-booking-form' });
                var borderStyle = atts.noBorder ? { border: 'none', boxShadow: 'none', background: 'transparent' } : {};
                var upiId = atts.upiId || '7006838859@okbizaxis';
                var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=' + encodeURIComponent(upiId) + '&pn=KTV%20Travel&cu=INR';
                var dynamicTours = getDynamicTours();
                var customSections = atts.customSections || [];
                var mandatory = atts.mandatoryFields || {};

                var widthClass = '';
                if (atts.formWidth === 'compact') widthClass = 'ktv-form-compact';
                else if (atts.formWidth === 'wide') widthClass = 'ktv-form-wide';
                else widthClass = 'ktv-form-full';

                var globalHoneypot = isEditorHoneypotEnabled();
                var globalSpam = isEditorSpamFilterEnabled();
                var globalRateLimit = isEditorRateLimitEnabled();
                var editorHoneypotField = getEditorHoneypotFieldName();

                var honeypotActive = atts.enableHoneypot !== false && globalHoneypot;
                var spamActive = atts.enableSpamFilter !== false && globalSpam;
                var rateLimitActive = atts.enableRateLimit !== false && globalRateLimit;

                function updateMandatory(key, value) {
                    var updated = Object.assign({}, mandatory);
                    updated[key] = value;
                    setAtts({ mandatoryFields: updated });
                }

                function addCustomSection() {
                    var updated = customSections.concat([{
                        key: 'field_' + Date.now(),
                        label: 'New Field',
                        icon: 'fa-star',
                        iconColor: '#075e54',
                        iconSize: '16px',
                        placeholder: '',
                        required: false,
                        fieldType: 'text',
                        enabled: true
                    }]);
                    setAtts({ customSections: updated });
                }

                function updateCustomSection(index, key, value) {
                    var updated = customSections.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ customSections: updated });
                }

                function deleteCustomSection(index) {
                    var updated = customSections.slice();
                    updated.splice(index, 1);
                    setAtts({ customSections: updated });
                }

                var travelStepIcons = [
                    { fieldKey: 'travelLocationIcon', fieldLabel: 'Travel Location', defaultIcon: 'fa-map-marker-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'arrivalDateIcon', fieldLabel: 'Arrival Date', defaultIcon: 'fa-calendar-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'departureDateIcon', fieldLabel: 'Departure Date', defaultIcon: 'fa-calendar-check', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'adultsIcon', fieldLabel: 'Adults', defaultIcon: 'fa-user', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'kidsIcon', fieldLabel: 'Kids', defaultIcon: 'fa-child', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'tourTypeIcon', fieldLabel: 'Tour Type', defaultIcon: 'fa-map-marked-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'priceBoxIcon', fieldLabel: 'Price Box', defaultIcon: 'fa-tag', defaultSize: '18px', defaultColor: '#28a745' }
                ];

                var personalStepIcons = [
                    { fieldKey: 'nameIcon', fieldLabel: 'Full Name', defaultIcon: 'fa-user', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'emailIcon', fieldLabel: 'Email', defaultIcon: 'fa-envelope', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'phoneIcon', fieldLabel: 'Phone', defaultIcon: 'fa-phone-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'countryIcon', fieldLabel: 'Country', defaultIcon: 'fa-globe', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'flagIcon', fieldLabel: 'Flag', defaultIcon: 'fa-flag', defaultSize: '14px', defaultColor: '#075e54' },
                    { fieldKey: 'flightAirlineIcon', fieldLabel: 'Flight Airline', defaultIcon: 'fa-plane', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'flightNumberIcon', fieldLabel: 'Flight Number', defaultIcon: 'fa-ticket-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'flightDepartureIcon', fieldLabel: 'Flight Departure', defaultIcon: 'fa-map-marker-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'flightArrivalIcon', fieldLabel: 'Flight Arrival', defaultIcon: 'fa-flag-checkered', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'flightTimeIcon', fieldLabel: 'Flight Time', defaultIcon: 'fa-clock', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'passportIcon', fieldLabel: 'Passport', defaultIcon: 'fa-passport', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'visaIcon', fieldLabel: 'Visa', defaultIcon: 'fa-id-card', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'specialRequestsIcon', fieldLabel: 'Special Requests', defaultIcon: 'fa-comment', defaultSize: '16px', defaultColor: '#075e54' }
                ];

                var paymentStepIcons = [
                    { fieldKey: 'paymentStepIcon', fieldLabel: 'Payment Step Title', defaultIcon: 'fa-credit-card', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'personalStepIcon', fieldLabel: 'Personal Step Title', defaultIcon: 'fa-user-circle', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'travelStepIcon', fieldLabel: 'Travel Step Title', defaultIcon: 'fa-map-marker-alt', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'summaryIcon', fieldLabel: 'Summary Heading', defaultIcon: 'fa-receipt', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'payOnArrivalIcon', fieldLabel: 'Pay on Arrival', defaultIcon: 'fa-hotel', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'gpayIcon', fieldLabel: 'GPay', defaultIcon: 'fa-google-pay', defaultSize: '16px', defaultColor: '#4285F4' },
                    { fieldKey: 'creditCardIcon', fieldLabel: 'Credit Card', defaultIcon: 'fa-credit-card', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'bankTransferIcon', fieldLabel: 'Bank Transfer', defaultIcon: 'fa-university', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'cardDetailsIcon', fieldLabel: 'Card Details Heading', defaultIcon: 'fa-credit-card', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'cardNameIcon', fieldLabel: 'Card Name', defaultIcon: 'fa-user', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'cardNumberIcon', fieldLabel: 'Card Number', defaultIcon: 'fa-credit-card', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'cardExpiryIcon', fieldLabel: 'Card Expiry', defaultIcon: 'fa-calendar', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'cardCvvIcon', fieldLabel: 'Card CVV', defaultIcon: 'fa-lock', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'cardPinIcon', fieldLabel: 'Card PIN', defaultIcon: 'fa-key', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'upiHeadingIcon', fieldLabel: 'UPI Heading', defaultIcon: 'fa-google-pay', defaultSize: '20px', defaultColor: '#4285F4' },
                    { fieldKey: 'bankDetailsIcon', fieldLabel: 'Bank Heading', defaultIcon: 'fa-university', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'idDocumentIcon', fieldLabel: 'ID Doc Heading', defaultIcon: 'fa-id-card', defaultSize: '20px', defaultColor: '#075e54' },
                    { fieldKey: 'idNumberIcon', fieldLabel: 'ID Number', defaultIcon: 'fa-id-card', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'idUploadIcon', fieldLabel: 'ID Upload', defaultIcon: 'fa-upload', defaultSize: '16px', defaultColor: '#075e54' }
                ];

                var editorHoneypotPreview = null;
                if (honeypotActive) {
                    editorHoneypotPreview = el('div', {
                        className: 'ktv-editor-honeypot-preview',
                        style: {
                            margin: '12px 0',
                            padding: '10px 14px',
                            background: '#fff8e1',
                            border: '2px dashed #ffc107',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '12px',
                            color: '#856404'
                        }
                    },
                        el('i', { className: 'fas fa-shield-alt', style: { fontSize: '16px', color: '#856404' } }),
                        el('div', null,
                            el('strong', { style: { display: 'block', marginBottom: '2px' } }, '🍯 Honeypot Field (hidden on frontend)'),
                            el('span', { style: { fontFamily: 'monospace', fontSize: '11px' } },
                                '<input name="' + editorHoneypotField + '" />'
                            )
                        )
                    );
                }

                var protectionBadge = null;
                if (honeypotActive || spamActive || rateLimitActive) {
                    var badges = [];
                    if (honeypotActive) badges.push('🍯 Honeypot');
                    if (spamActive) badges.push('🛡️ Spam');
                    if (rateLimitActive) badges.push('⏱️ Rate Limit');
                    protectionBadge = el('div', {
                        className: 'ktv-editor-protection-badge',
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            background: '#e8f5e9',
                            color: '#075e54',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            marginBottom: '10px'
                        }
                    },
                        el('i', { className: 'fas fa-shield-alt' }),
                        badges.join(' • ')
                    );
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📝 Form Settings', initialOpen: true },
                            el(TextControl, { label: 'Form Title', value: atts.formTitle, onChange: function (v) { setAtts({ formTitle: v }); } }),
                            el(TextControl, { label: 'Subtitle', value: atts.formSubtitle, onChange: function (v) { setAtts({ formSubtitle: v }); } }),
                            el(TextControl, { label: 'Button Text', value: atts.buttonText, onChange: function (v) { setAtts({ buttonText: v }); } }),
                            el(ToggleControl, { label: 'Multi-Step Form', checked: atts.multiStep, onChange: function (v) { setAtts({ multiStep: v }); } }),
                            el(SelectControl, { label: 'Form Width', value: atts.formWidth, options: formWidthOptions, onChange: function (v) { setAtts({ formWidth: v }); } }),
                            el(ToggleControl, { label: 'Remove Borders', checked: atts.noBorder, onChange: function (v) { setAtts({ noBorder: v }); } }),
                            el(ToggleControl, { label: 'Show Travel Location', checked: atts.showTravelLocation, onChange: function (v) { setAtts({ showTravelLocation: v }); } }),
                            el(ToggleControl, { label: 'Show Browse Tours By Location', checked: atts.showBrowseLocation !== undefined ? atts.showBrowseLocation : true, onChange: function (v) { setAtts({ showBrowseLocation: v }); } }),
                            el(ToggleControl, { label: 'Show Select Tour Type Field', checked: atts.showTourType !== undefined ? atts.showTourType : true, onChange: function (v) { setAtts({ showTourType: v }); } }),
                            el(ToggleControl, { label: 'Show Tour Icon in Dropdown', checked: atts.showTourIconInDropdown !== undefined ? atts.showTourIconInDropdown : true, onChange: function (v) { setAtts({ showTourIconInDropdown: v }); } }),
                            el(ToggleControl, { label: 'Show GPay Payment', checked: atts.showUpi !== undefined ? atts.showUpi : true, onChange: function (v) { setAtts({ showUpi: v }); } }),
                            el(ToggleControl, { label: 'Show Credit Card Payment', checked: atts.showCreditCard !== undefined ? atts.showCreditCard : true, onChange: function (v) { setAtts({ showCreditCard: v }); } }),
                            el(ToggleControl, { label: 'Show Passport/Visa', checked: atts.showPassportVisa !== undefined ? atts.showPassportVisa : true, onChange: function (v) { setAtts({ showPassportVisa: v }); } }),
                            el(ToggleControl, { label: 'Show Flight Details', checked: atts.showFlightDetails !== undefined ? atts.showFlightDetails : true, onChange: function (v) { setAtts({ showFlightDetails: v }); } }),
                            GSTControl({ attributes: atts, setAttributes: setAtts })
                        ),
                        el(PanelBody, { title: '🎨 Buttons & Badge Colors', initialOpen: false },
                            el('p', { style: { fontSize: '11px', color: '#666', marginBottom: '10px' } },
                                'These colours apply to this Booking Form block only. They are independent from the Tour Card, Grid, and Package blocks.'
                            ),
                            el('h4', { style: { margin: '12px 0 6px', fontSize: '12px', color: '#075e54', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Submit Button'),
                            ColorControl('Submit Button Background', atts.buttonBgColor || '#28a745', function (v) { setAtts({ buttonBgColor: v }); }),
                            ColorControl('Submit Button Text Color', atts.buttonBgTextColor || '#ffffff', function (v) { setAtts({ buttonBgTextColor: v }); }),
                            el('h4', { style: { margin: '12px 0 6px', fontSize: '12px', color: '#075e54', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Badge'),
                            ColorControl('Badge Background', atts.badgeBgColor || '#ff5722', function (v) { setAtts({ badgeBgColor: v }); }),
                            ColorControl('Badge Text Color', atts.badgeTextColor || '#ffffff', function (v) { setAtts({ badgeTextColor: v }); }),
                            el('h4', { style: { margin: '12px 0 6px', fontSize: '12px', color: '#075e54', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Step Buttons (Next / Prev)'),
                            ColorControl('Next Button Background', atts.stepNextBgColor || '#28a745', function (v) { setAtts({ stepNextBgColor: v }); }),
                            ColorControl('Next Button Text Color', atts.stepNextTextColor || '#ffffff', function (v) { setAtts({ stepNextTextColor: v }); }),
                            ColorControl('Prev Button Background', atts.stepPrevBgColor || '#6c757d', function (v) { setAtts({ stepPrevBgColor: v }); }),
                            ColorControl('Prev Button Text Color', atts.stepPrevTextColor || '#ffffff', function (v) { setAtts({ stepPrevTextColor: v }); })
                        ),
                        el(PanelBody, { title: '🛡️ Honeypot & Spam Protection', initialOpen: false },
                            el('p', { style: { fontSize: '11px', color: '#666', marginBottom: '10px' } },
                                'Global: Honeypot ' + (globalHoneypot ? 'ON' : 'OFF') + ' • Spam Filter ' + (globalSpam ? 'ON' : 'OFF') + ' • Rate Limit ' + (globalRateLimit ? 'ON' : 'OFF') + '. Manage globally at KTV Travel → Honeypot & Spam.'
                            ),
                            el(ToggleControl, {
                                label: 'Enable Honeypot Field on this form',
                                checked: atts.enableHoneypot !== false,
                                onChange: function (v) { setAtts({ enableHoneypot: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Enable Spam Keyword Filter',
                                checked: atts.enableSpamFilter !== false,
                                onChange: function (v) { setAtts({ enableSpamFilter: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Enable Rate Limiting (5 submissions / 15 min per IP)',
                                checked: atts.enableRateLimit !== false,
                                onChange: function (v) { setAtts({ enableRateLimit: v }); }
                            }),
                            atts.enableHoneypot !== false ? el(TextControl, {
                                label: 'Honeypot Field Name',
                                value: atts.honeypotFieldName || 'ktv_hp_website',
                                onChange: function (v) { setAtts({ honeypotFieldName: v.replace(/[^a-z0-9_]/gi, '_') }); }
                            }) : null
                        ),
                        el(PanelBody, { title: '📏 Tour Type → Price Gap', initialOpen: false },
                            el(RangeControl, {
                                label: 'Gap (pixels)',
                                value: atts.tourTypePriceGap !== undefined ? atts.tourTypePriceGap : 15,
                                onChange: function (v) { setAtts({ tourTypePriceGap: v }); },
                                min: 0,
                                max: 100,
                                step: 1
                            })
                        ),
                        el(PanelBody, { title: '✅ Mandatory Fields (*)', initialOpen: false },
                            el(ToggleControl, { label: 'Full Name', checked: mandatory.name !== false, onChange: function (v) { updateMandatory('name', v); } }),
                            el(ToggleControl, { label: 'Email', checked: mandatory.email !== false, onChange: function (v) { updateMandatory('email', v); } }),
                            el(ToggleControl, { label: 'Phone', checked: mandatory.phone !== false, onChange: function (v) { updateMandatory('phone', v); } }),
                            el(ToggleControl, { label: 'Arrival Date', checked: mandatory.arrival_date !== false, onChange: function (v) { updateMandatory('arrival_date', v); } }),
                            el(ToggleControl, { label: 'Departure Date', checked: mandatory.departure_date !== false, onChange: function (v) { updateMandatory('departure_date', v); } }),
                            el(ToggleControl, { label: 'Tour Type', checked: mandatory.tour_type !== false, onChange: function (v) { updateMandatory('tour_type', v); } }),
                            el(ToggleControl, { label: 'Adults', checked: mandatory.adults !== false, onChange: function (v) { updateMandatory('adults', v); } }),
                            el(ToggleControl, { label: 'Country', checked: mandatory.country === true, onChange: function (v) { updateMandatory('country', v); } }),
                            el(ToggleControl, { label: 'Special Requests', checked: mandatory.special_requests === true, onChange: function (v) { updateMandatory('special_requests', v); } }),
                            el(ToggleControl, { label: 'ID Document', checked: mandatory.id_document === true, onChange: function (v) { updateMandatory('id_document', v); } })
                        ),
                        FieldIconGroup({ attributes: atts, setAttributes: setAtts, title: '🎯 Field Icons — Travel Step (7)', initialOpen: false, fields: travelStepIcons }),
                        FieldIconGroup({ attributes: atts, setAttributes: setAtts, title: '🎯 Field Icons — Personal Step (13)', initialOpen: false, fields: personalStepIcons }),
                        FieldIconGroup({ attributes: atts, setAttributes: setAtts, title: '🎯 Field Icons — Payment Step (19)', initialOpen: false, fields: paymentStepIcons }),
                        el(PanelBody, { title: '🪟 Booking Modal Popup', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Enable Booking Modal on frontend',
                                checked: atts.enableModal === true,
                                onChange: function (v) { setAtts({ enableModal: v }); }
                            }),
                            atts.enableModal ? el(Fragment, {},
                                el(TextControl, { label: 'Modal Title', value: atts.modalTitle, onChange: function (v) { setAtts({ modalTitle: v }); } }),
                                el(TextControl, { label: 'Modal Subtitle', value: atts.modalSubtitle, onChange: function (v) { setAtts({ modalSubtitle: v }); } }),
                                el(SelectControl, { label: 'Modal Width', value: atts.modalWidth, options: modalWidthOptions, onChange: function (v) { setAtts({ modalWidth: v }); } }),
                                el(SelectControl, { label: 'Modal Animation', value: atts.modalAnimation, options: modalAnimationOptions, onChange: function (v) { setAtts({ modalAnimation: v }); } }),
                                el(TextControl, { label: 'Close Button Text', value: atts.modalCloseText, onChange: function (v) { setAtts({ modalCloseText: v }); } })
                            ) : null
                        ),
                        el(PanelBody, { title: '📅 Pre-added Travel Dates', initialOpen: false },
                            el(TextControl, {
                                label: 'Default Arrival Date (YYYY-MM-DD)',
                                value: atts.defaultArrivalDate || '',
                                onChange: function (v) { setAtts({ defaultArrivalDate: v }); }
                            }),
                            el(TextControl, {
                                label: 'Default Departure Date (YYYY-MM-DD)',
                                value: atts.defaultDepartureDate || '',
                                onChange: function (v) { setAtts({ defaultDepartureDate: v }); }
                            }),
                            el(SelectControl, { label: 'Travel Date Font Weight', value: atts.travelDateFontWeight || '700', options: fontWeightOptions, onChange: function (v) { setAtts({ travelDateFontWeight: v }); } }),
                            el(SelectControl, { label: 'Travel Date Font Size', value: atts.travelDateFontSize || '16px', options: fontSizes, onChange: function (v) { setAtts({ travelDateFontSize: v }); } }),
                            ColorControl('Travel Date Text Color', atts.travelDateColor || '#333333', function (v) { setAtts({ travelDateColor: v }); }),
                            ColorControl('Travel Date Background Color', atts.travelDateBgColor || '#f8f9fa', function (v) { setAtts({ travelDateBgColor: v }); })
                        ),
                        el(PanelBody, { title: '👥 Adults/Kids Field Controls', initialOpen: false },
                            el(RangeControl, { label: 'Extra Adult Percentage', value: atts.extraAdultPercent, onChange: function (v) { setAtts({ extraAdultPercent: v }); }, min: 0, max: 200, step: 5 }),
                            el(RangeControl, { label: 'Extra Child Percentage', value: atts.extraChildPercent, onChange: function (v) { setAtts({ extraChildPercent: v }); }, min: 0, max: 200, step: 5 }),
                            el(SelectControl, { label: 'Adults Font Size', value: atts.adultsFontSize || '16px', options: fontSizes, onChange: function (v) { setAtts({ adultsFontSize: v }); } }),
                            el(SelectControl, { label: 'Adults Font Weight', value: atts.adultsFontWeight || '600', options: fontWeightOptions, onChange: function (v) { setAtts({ adultsFontWeight: v }); } }),
                            ColorControl('Adults Text Color', atts.adultsColor || '#333333', function (v) { setAtts({ adultsColor: v }); }),
                            el(SelectControl, { label: 'Kids Font Size', value: atts.kidsFontSize || '16px', options: fontSizes, onChange: function (v) { setAtts({ kidsFontSize: v }); } }),
                            el(SelectControl, { label: 'Kids Font Weight', value: atts.kidsFontWeight || '600', options: fontWeightOptions, onChange: function (v) { setAtts({ kidsFontWeight: v }); } }),
                            ColorControl('Kids Text Color', atts.kidsColor || '#333333', function (v) { setAtts({ kidsColor: v }); })
                        ),
                        PlaceholderControl({ attributes: atts, setAttributes: setAtts }),
                        TitleIconControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '✈️ Flight Details Labels', initialOpen: false },
                            el(TextControl, { label: 'Airline Label', value: atts.flightAirlineLabel || 'Airline', onChange: function (v) { setAtts({ flightAirlineLabel: v }); } }),
                            el(TextControl, { label: 'Flight Number Label', value: atts.flightNumberLabel || 'Flight Number', onChange: function (v) { setAtts({ flightNumberLabel: v }); } }),
                            el(TextControl, { label: 'Departure City Label', value: atts.flightDepartureLabel || 'Departure City', onChange: function (v) { setAtts({ flightDepartureLabel: v }); } }),
                            el(TextControl, { label: 'Arrival City Label', value: atts.flightArrivalLabel || 'Arrival City', onChange: function (v) { setAtts({ flightArrivalLabel: v }); } }),
                            el(TextControl, { label: 'Flight Time Label', value: atts.flightTimeLabel || 'Flight Time', onChange: function (v) { setAtts({ flightTimeLabel: v }); } })
                        ),
                        el(PanelBody, { title: '🎨 Form Styling', initialOpen: false },
                            ColorControl('Form Background', atts.formBgColor, function (v) { setAtts({ formBgColor: v }); }),
                            ColorControl('Form Text Color', atts.formTextColor, function (v) { setAtts({ formTextColor: v }); }),
                            el(SelectControl, { label: 'Heading Size', value: atts.formHeadingSize, options: fontSizes, onChange: function (v) { setAtts({ formHeadingSize: v }); } }),
                            ColorControl('Heading Color', atts.formHeadingColor, function (v) { setAtts({ formHeadingColor: v }); }),
                            el(SelectControl, { label: 'Heading Font Family', value: atts.formHeadingFontFamily || 'inherit', options: fontFamilyOptions, onChange: function (v) { setAtts({ formHeadingFontFamily: v }); } }),
                            ColorControl('Button Color', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                            ColorControl('Button Text Color', atts.buttonTextColor, function (v) { setAtts({ buttonTextColor: v }); }),
                            ColorControl('Border Color', atts.borderColor, function (v) { setAtts({ borderColor: v }); }),
                            el(SelectControl, { label: 'Border Size', value: atts.borderSize, options: borderWidthOptions, onChange: function (v) { setAtts({ borderSize: v }); } }),
                            el(SelectControl, { label: 'Border Radius', value: atts.borderRadius, options: borderRadiusOptions, onChange: function (v) { setAtts({ borderRadius: v }); } })
                        ),
                        el(PanelBody, { title: '📝 Field Labels', initialOpen: false },
                            el(TextControl, { label: 'Adults Label', value: atts.adultsLabel, onChange: function (v) { setAtts({ adultsLabel: v }); } }),
                            el(TextControl, { label: 'Kids Label', value: atts.childrenLabel, onChange: function (v) { setAtts({ childrenLabel: v }); } }),
                            el(TextControl, { label: 'Arrival Label', value: atts.arrivalLabel, onChange: function (v) { setAtts({ arrivalLabel: v }); } }),
                            el(TextControl, { label: 'Departure Label', value: atts.departureLabel, onChange: function (v) { setAtts({ departureLabel: v }); } }),
                            el(TextControl, { label: 'Tour Label', value: atts.tourLabel, onChange: function (v) { setAtts({ tourLabel: v }); } }),
                            el(TextControl, { label: 'Travel Location Label', value: atts.travelLocationLabel, onChange: function (v) { setAtts({ travelLocationLabel: v }); } }),
                            el(TextControl, { label: 'Name Label', value: atts.nameLabel, onChange: function (v) { setAtts({ nameLabel: v }); } }),
                            el(TextControl, { label: 'Email Label', value: atts.emailLabel, onChange: function (v) { setAtts({ emailLabel: v }); } }),
                            el(TextControl, { label: 'Phone Label', value: atts.phoneLabel, onChange: function (v) { setAtts({ phoneLabel: v }); } }),
                            el(TextControl, { label: 'Country Label', value: atts.countryLabel, onChange: function (v) { setAtts({ countryLabel: v }); } }),
                            el(TextControl, { label: 'Cardholder Name Label', value: atts.cardNameLabel, onChange: function (v) { setAtts({ cardNameLabel: v }); } }),
                            el(TextControl, { label: 'Card Number Label', value: atts.cardNumberLabel, onChange: function (v) { setAtts({ cardNumberLabel: v }); } }),
                            el(TextControl, { label: 'Expiry Label', value: atts.cardExpiryLabel, onChange: function (v) { setAtts({ cardExpiryLabel: v }); } }),
                            el(TextControl, { label: 'CVV Label', value: atts.cardCvvLabel, onChange: function (v) { setAtts({ cardCvvLabel: v }); } }),
                            el(TextControl, { label: 'PIN Label', value: atts.cardPinLabel, onChange: function (v) { setAtts({ cardPinLabel: v }); } }),
                            el(TextControl, { label: 'Passport Label', value: atts.passportLabel, onChange: function (v) { setAtts({ passportLabel: v }); } }),
                            el(TextControl, { label: 'Visa Label', value: atts.visaLabel, onChange: function (v) { setAtts({ visaLabel: v }); } })
                        ),
                        el(PanelBody, { title: '➕ Custom Sections', initialOpen: false },
                            el(Button, { onClick: addCustomSection, variant: 'primary', style: { width: '100%', marginBottom: '15px' } }, '+ Add Custom Section'),
                            customSections.map(function (section, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Section #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteCustomSection(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el(ToggleControl, { label: 'Enabled', checked: section.enabled !== false, onChange: function (v) { updateCustomSection(idx, 'enabled', v); } }),
                                    el(TextControl, { label: 'Field Key', value: section.key, onChange: function (v) { updateCustomSection(idx, 'key', v.replace(/[^a-z0-9_]/gi, '_')); } }),
                                    el(TextControl, { label: 'Field Label', value: section.label, onChange: function (v) { updateCustomSection(idx, 'label', v); } }),
                                    el(SelectControl, {
                                        label: 'Field Type',
                                        value: section.fieldType || 'text',
                                        options: [
                                            { label: 'Text', value: 'text' },
                                            { label: 'Email', value: 'email' },
                                            { label: 'Phone', value: 'tel' },
                                            { label: 'Number', value: 'number' },
                                            { label: 'Textarea', value: 'textarea' }
                                        ],
                                        onChange: function (v) { updateCustomSection(idx, 'fieldType', v); }
                                    }),
                                    el(TextControl, { label: 'Placeholder', value: section.placeholder || '', onChange: function (v) { updateCustomSection(idx, 'placeholder', v); } }),
                                    el(SelectControl, { label: 'Icon', value: section.icon || 'fa-star', options: iconOptions, onChange: function (v) { updateCustomSection(idx, 'icon', v); } }),
                                    el(SelectControl, { label: 'Icon Size', value: section.iconSize || '16px', options: iconSizes, onChange: function (v) { updateCustomSection(idx, 'iconSize', v); } }),
                                    ColorControl('Icon Color', section.iconColor || '#075e54', function (v) { updateCustomSection(idx, 'iconColor', v); }),
                                    el(ToggleControl, { label: 'Required Field', checked: section.required === true, onChange: function (v) { updateCustomSection(idx, 'required', v); } })
                                );
                            })
                        ),
                        el(PanelBody, { title: '📱 UPI / GPay Settings', initialOpen: false },
                            el(TextControl, { label: 'UPI ID', value: upiId, onChange: function (v) { setAtts({ upiId: v }); } }),
                            el('div', { style: { textAlign: 'center', marginTop: '10px' } },
                                el('img', { src: qrUrl, width: 120, height: 120, loading: 'lazy', decoding: 'async', style: { width: '120px', height: '120px', border: '1px solid #ddd', borderRadius: '8px', padding: '5px', background: '#fff' } })
                            )
                        )
                    ),
                    el('div', blockProps,
                        el('div', {
                            className: widthClass + (atts.darkMode ? ' ktv-dark-mode' : ''),
                            style: Object.assign({
                                padding: '30px',
                                background: atts.formBgColor,
                                borderRadius: atts.borderRadius,
                                border: atts.borderSize !== '0px' && !atts.noBorder ? atts.borderSize + ' solid ' + atts.borderColor : 'none'
                            }, borderStyle)
                        },
                            protectionBadge,
                            el('h3', { style: { textAlign: 'center', marginBottom: '10px', fontSize: atts.formHeadingSize, color: atts.formHeadingColor, fontFamily: atts.formHeadingFontFamily } },
                                atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.iconTitle, style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '10px' } }) : null,
                                ' ' + atts.formTitle
                            ),
                            el('p', { style: { textAlign: 'center', color: atts.formTextColor, marginBottom: '20px' } }, atts.formSubtitle),
                            el('div', {
                                style: { padding: '15px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#666', marginBottom: '15px' }
                            },
                                el('strong', null, '⚙️ Booking Form Preview'),
                                el('p', { style: { margin: '8px 0 0', fontSize: '12px' } }, 'Renders on the front end with 3 steps + GPay only + custom sections + mandatory fields + honeypot + spam filter + 39 editable field icons.'),
                                atts.enableModal ? el('p', { style: { margin: '4px 0 0', fontSize: '11px', color: '#075e54' } }, '🪟 Modal popup is ENABLED for this block.') : null,
                                el('p', { style: { margin: '4px 0 0', fontSize: '11px', color: '#17a2b8' } }, '📏 Tour Type → Price gap: ' + (atts.tourTypePriceGap !== undefined ? atts.tourTypePriceGap : 15) + 'px')
                            ),
                            el('div', { style: { padding: '10px 15px', background: '#e8f5e9', borderRadius: '8px', fontSize: '12px', color: '#075e54', marginBottom: '15px' } },
                                el('strong', null, 'Tours in dropdown: '),
                                el('span', null, dynamicTours.length + ' from database'),
                                customSections.length > 0 ? el('span', null, ' + ' + customSections.length + ' custom sections') : null
                            ),
                            el('div', { style: { padding: '10px 15px', background: '#fff3cd', borderRadius: '8px', fontSize: '12px', color: '#856404', marginBottom: '15px' } },
                                el('strong', null, '✅ Mandatory fields: '),
                                ['name', 'email', 'phone', 'arrival_date', 'departure_date', 'tour_type', 'adults', 'country', 'special_requests', 'id_document']
                                    .filter(function (k) { return mandatory[k]; })
                                    .map(function (k) { return k.replace('_', ' '); })
                                    .join(', ') || 'None'
                            ),
                            editorHoneypotPreview,
                            el('button', {
                                style: { background: atts.buttonBgColor || atts.buttonColor, color: atts.buttonBgTextColor || atts.buttonTextColor, width: '100%', padding: '14px', border: 'none', borderRadius: atts.borderRadius, fontSize: '16px', fontWeight: '600', cursor: 'pointer' }
                            }, atts.buttonText)
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           15. BLOCK — KTV BOOKING BUTTON
           ============================================================ */

        wp.blocks.registerBlockType('ktv/booking-button', {
            title: 'KTV Booking Button',
            description: 'CTA button with editable URL, icon, colors, padding, border radius.',
            icon: 'button',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                buttonText: { type: 'string', default: 'Book Now' },
                buttonUrl: { type: 'string', default: '#' },
                buttonIcon: { type: 'string', default: 'fa-calendar-check' },
                buttonColor: { type: 'string', default: '#ff5722' },
                buttonTextColor: { type: 'string', default: '#ffffff' },
                buttonSize: { type: 'string', default: 'medium' },
                fullWidth: { type: 'boolean', default: false },
                buttonBorderRadius: { type: 'string', default: '30px' },
                tourId: { type: 'number', default: 0 },
                tourName: { type: 'string', default: '' },
                tourPrice: { type: 'number', default: 0 },
                tourLocation: { type: 'string', default: '' },
                blockType: { type: 'string', default: 'grid' },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-calendar-check' },
                iconTitleSize: { type: 'string', default: '16px' },
                iconTitleColor: { type: 'string', default: '#ffffff' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-booking-button' });
                var sizes = { small: '8px 20px', medium: '12px 30px', large: '16px 40px', xlarge: '20px 50px' };
                var dynamicTours = getDynamicTours();
                var tourOptions = [{ label: 'Select a Tour', value: '' }];
                dynamicTours.forEach(function (tour) {
                    if (tour.tour_name && tour.is_hardcoded != 1) {
                        tourOptions.push({ label: tour.tour_name, value: String(tour.id) });
                    }
                });

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🔘 Button Settings', initialOpen: true },
                            el(TextControl, { label: 'Button Text', value: atts.buttonText, onChange: function (v) { setAtts({ buttonText: v }); } }),
                            el(TextControl, { label: 'Button URL', value: atts.buttonUrl, onChange: function (v) { setAtts({ buttonUrl: v }); } }),
                            el(SelectControl, { label: 'Icon', value: atts.buttonIcon, options: iconOptions, onChange: function (v) { setAtts({ buttonIcon: v, iconTitle: v }); } }),
                            el(SelectControl, { label: 'Size', value: atts.buttonSize, options: buttonSizeOptions, onChange: function (v) { setAtts({ buttonSize: v }); } }),
                            el(ToggleControl, { label: 'Full Width', checked: atts.fullWidth, onChange: function (v) { setAtts({ fullWidth: v }); } }),
                            el(SelectControl, { label: 'Border Radius', value: atts.buttonBorderRadius, options: borderRadiusOptions, onChange: function (v) { setAtts({ buttonBorderRadius: v }); } }),
                            el(SelectControl, {
                                label: 'Select Tour',
                                value: atts.tourId ? String(atts.tourId) : '',
                                options: tourOptions,
                                onChange: function (v) {
                                    if (v) {
                                        var tour = getTourById(parseInt(v));
                                        if (tour && tour.is_hardcoded != 1) {
                                            setAtts({
                                                tourId: tour.id,
                                                tourName: tour.tour_name,
                                                tourPrice: tour.tour_price || 0,
                                                tourLocation: tour.location || '',
                                                blockType: tour.block_type || 'grid'
                                            });
                                        }
                                    }
                                }
                            }),
                            el(TextControl, { label: 'Tour Name', value: atts.tourName, onChange: function (v) { setAtts({ tourName: v }); } }),
                            el(TextControl, { label: 'Tour Price', value: atts.tourPrice, type: 'number', onChange: function (v) { setAtts({ tourPrice: parseFloat(v) || 0 }); } }),
                            el(TextControl, { label: 'Tour Location', value: atts.tourLocation, onChange: function (v) { setAtts({ tourLocation: v }); } }),
                            IconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'iconTitle', sizeKey: 'iconTitleSize', colorKey: 'iconTitleColor', label: 'Button Icon' })
                        ),
                        el(PanelBody, { title: '🎨 Colors', initialOpen: false },
                            ColorControl('Background', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                            ColorControl('Text Color', atts.buttonTextColor, function (v) { setAtts({ buttonTextColor: v }); })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { style: { padding: '30px', textAlign: 'center', background: atts.darkMode ? '#1a1a2e' : '#f0f4f8', borderRadius: '12px' } },
                            atts.buttonUrl && atts.buttonUrl !== '#' ?
                                el('a', {
                                    href: atts.buttonUrl,
                                    className: 'ktv-booking-button-block',
                                    title: atts.buttonText || 'Book Now',
                                    'data-tour-id': atts.tourId || 0,
                                    'data-tour-name': atts.tourName || '',
                                    'data-tour-price': atts.tourPrice || 0,
                                    'data-tour-location': atts.tourLocation || '',
                                    'data-block-type': atts.blockType || 'grid',
                                    style: {
                                        background: atts.buttonColor, color: atts.buttonTextColor,
                                        padding: sizes[atts.buttonSize] || sizes.medium,
                                        borderRadius: atts.buttonBorderRadius, border: 'none',
                                        cursor: 'pointer', width: atts.fullWidth ? '100%' : 'auto',
                                        fontSize: '14px', fontWeight: '600',
                                        textDecoration: 'none', display: 'inline-block', textAlign: 'center'
                                    }
                                },
                                    atts.enableIcon !== false ? el('i', { className: 'fas ' + (atts.iconTitle || atts.buttonIcon), style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '8px' } }) : null,
                                    ' ' + atts.buttonText
                                ) :
                                el('button', {
                                    className: 'ktv-booking-button-block',
                                    title: atts.buttonText || 'Book Now',
                                    'data-tour-id': atts.tourId || 0,
                                    'data-tour-name': atts.tourName || '',
                                    'data-tour-price': atts.tourPrice || 0,
                                    'data-tour-location': atts.tourLocation || '',
                                    'data-block-type': atts.blockType || 'grid',
                                    style: {
                                        background: atts.buttonColor, color: atts.buttonTextColor,
                                        padding: sizes[atts.buttonSize] || sizes.medium,
                                        borderRadius: atts.buttonBorderRadius, border: 'none',
                                        cursor: 'pointer', width: atts.fullWidth ? '100%' : 'auto',
                                        fontSize: '14px', fontWeight: '600'
                                    }
                                },
                                    atts.enableIcon !== false ? el('i', { className: 'fas ' + (atts.iconTitle || atts.buttonIcon), style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '8px' } }) : null,
                                    ' ' + atts.buttonText
                                )
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           16. BLOCK — KTV REVIEW FORM
           ============================================================ */

        wp.blocks.registerBlockType('ktv/review-form', {
            title: 'KTV Review Form',
            description: 'Progressive star rating form with reviewer profile pic, background color/image, modal popup title/icon, custom sections, title/logo toggles.',
            icon: 'star-filled',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                formTitle: { type: 'string', default: 'Write a Review' },
                starColor: { type: 'string', default: '#FFD700' },
                buttonColor: { type: 'string', default: '#28a745' },
                headingType: { type: 'string', default: 'h3' },
                headingFontSize: { type: 'string', default: '22px' },
                headingColor: { type: 'string', default: '#333333' },
                headingFontFamily: { type: 'string', default: 'inherit' },
                headingFontWeight: { type: 'string', default: '700' },
                borderColor: { type: 'string', default: 'transparent' },
                borderSize: { type: 'string', default: '0px' },
                nameLabel: { type: 'string', default: 'Your Name' },
                emailLabel: { type: 'string', default: 'Your Email' },
                reviewLabel: { type: 'string', default: 'Share your experience' },
                reviewTitleLabel: { type: 'string', default: 'Review Title' },
                submitLabel: { type: 'string', default: 'Submit Review' },
                tourId: { type: 'number', default: 0 },
                pageId: { type: 'number', default: 0 },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-star' },
                iconTitleSize: { type: 'string', default: '20px' },
                iconTitleColor: { type: 'string', default: '#FFD700' },
                reviewBackgroundColor: { type: 'string', default: '' },
                reviewBackgroundImage: { type: 'string', default: '' },
                reviewFormBgColor: { type: 'string', default: '' },
                reviewFormBorderColor: { type: 'string', default: '' },
                showReviewerProfilePic: { type: 'boolean', default: true },
                reviewModalTitle: { type: 'string', default: 'Write a Review' },
                reviewModalIcon: { type: 'string', default: 'fa-star' },
                reviewModalLogo: { type: 'string', default: '' },
                reviewModalBgColor: { type: 'string', default: '' },
                reviewModalBgImage: { type: 'string', default: '' },
                reviewModalTitleBgColor: { type: 'string', default: '' },
                reviewModalTitleBgImage: { type: 'string', default: '' },
                reviewModalTitleTextColor: { type: 'string', default: '#ffffff' },
                reviewModalTitleIconColor: { type: 'string', default: '#FFD700' },
                placeholderColor: { type: 'string', default: '#999999' },
                placeholderFontSize: { type: 'string', default: '14px' },
                placeholderFontWeight: { type: 'string', default: '400' },
                showTitle: { type: 'boolean', default: true },
                titleColor: { type: 'string', default: '' },
                showLogo: { type: 'boolean', default: false },
                logoUrl: { type: 'string', default: '' },
                customSections: { type: 'array', default: [] }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-review-form' });
                var heading_tag = atts.headingType || 'h3';

                var effectiveBg = atts.reviewFormBgColor || atts.reviewBackgroundColor || '';
                var effectiveBorder = atts.reviewFormBorderColor || atts.borderColor || 'transparent';
                var effectiveTitleColor = atts.titleColor || atts.headingColor || '#333333';
                var effectiveLogoUrl = atts.logoUrl || atts.reviewModalLogo || '';

                var borderStyle = (atts.borderSize === '0px' || atts.borderSize === '0') ? { border: 'none', boxShadow: 'none' } : {};
                var backgroundStyle = {};
                if (effectiveBg) backgroundStyle.background = effectiveBg;
                if (atts.reviewBackgroundImage) {
                    backgroundStyle.backgroundImage = 'url(' + atts.reviewBackgroundImage + ')';
                    backgroundStyle.backgroundSize = 'cover';
                    backgroundStyle.backgroundPosition = 'center';
                }
                var customSections = atts.customSections || [];

                function addCustomSection() {
                    var updated = customSections.concat([{
                        key: 'field_' + Date.now(),
                        label: 'New Section',
                        icon: 'fa-star',
                        iconColor: '#075e54',
                        iconSize: '16px',
                        enabled: true
                    }]);
                    setAtts({ customSections: updated });
                }

                function updateCustomSection(index, key, value) {
                    var updated = customSections.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ customSections: updated });
                }

                function deleteCustomSection(index) {
                    var updated = customSections.slice();
                    updated.splice(index, 1);
                    setAtts({ customSections: updated });
                }

                var titleHeaderStyle = {
                    padding: '14px 20px',
                    borderRadius: '10px 10px 0 0',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '700',
                    fontSize: '16px'
                };
                if (atts.reviewModalTitleBgColor) {
                    titleHeaderStyle.background = atts.reviewModalTitleBgColor;
                } else if (atts.reviewModalTitleBgImage) {
                    titleHeaderStyle.backgroundImage = 'url(' + atts.reviewModalTitleBgImage + ')';
                    titleHeaderStyle.backgroundSize = 'cover';
                    titleHeaderStyle.backgroundPosition = 'center';
                } else {
                    titleHeaderStyle.background = '#075e54';
                }
                titleHeaderStyle.color = atts.reviewModalTitleTextColor || '#ffffff';

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📝 Content', initialOpen: true },
                            el(ToggleControl, { label: 'Show Title', checked: atts.showTitle !== false, onChange: function (v) { setAtts({ showTitle: v }); } }),
                            el(TextControl, { label: 'Form Title', value: atts.formTitle, onChange: function (v) { setAtts({ formTitle: v }); } }),
                            el(TextControl, { label: 'Name Label', value: atts.nameLabel, onChange: function (v) { setAtts({ nameLabel: v }); } }),
                            el(TextControl, { label: 'Email Label', value: atts.emailLabel, onChange: function (v) { setAtts({ emailLabel: v }); } }),
                            el(TextControl, { label: 'Review Title Label', value: atts.reviewTitleLabel || 'Review Title', onChange: function (v) { setAtts({ reviewTitleLabel: v }); } }),
                            el(TextControl, { label: 'Review Placeholder', value: atts.reviewLabel, onChange: function (v) { setAtts({ reviewLabel: v }); } }),
                            el(TextControl, { label: 'Submit Button Text', value: atts.submitLabel, onChange: function (v) { setAtts({ submitLabel: v }); } }),
                            el(TextControl, { label: 'Tour ID', value: atts.tourId, type: 'number', onChange: function (v) { setAtts({ tourId: parseInt(v) || 0 }); } }),
                            el(TextControl, { label: 'Page ID', value: atts.pageId, type: 'number', onChange: function (v) { setAtts({ pageId: parseInt(v) || 0 }); } })
                        ),
                        el(PanelBody, { title: '🖼️ Logo', initialOpen: false },
                            el(ToggleControl, { label: 'Show Logo at Top', checked: atts.showLogo === true, onChange: function (v) { setAtts({ showLogo: v }); } }),
                            el(TextControl, {
                                label: 'Logo URL',
                                value: effectiveLogoUrl,
                                onChange: function (v) { setAtts({ logoUrl: v }); }
                            })
                        ),
                        TitleIconControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🔤 Title Typography', initialOpen: false },
                            el(SelectControl, { label: 'Heading Type', value: atts.headingType, options: headingTypes, onChange: function (v) { setAtts({ headingType: v }); } }),
                            el(SelectControl, { label: 'Heading Font Size', value: atts.headingFontSize, options: fontSizes, onChange: function (v) { setAtts({ headingFontSize: v }); } }),
                            ColorControl('Heading Color', effectiveTitleColor, function (v) { setAtts({ titleColor: v, headingColor: v }); }),
                            el(SelectControl, { label: 'Heading Font Family', value: atts.headingFontFamily || 'inherit', options: fontFamilyOptions, onChange: function (v) { setAtts({ headingFontFamily: v }); } }),
                            el(SelectControl, { label: 'Heading Font Weight', value: atts.headingFontWeight || '700', options: fontWeightOptions, onChange: function (v) { setAtts({ headingFontWeight: v }); } })
                        ),
                        PlaceholderControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🪟 Review Modal Popup', initialOpen: false },
                            el(TextControl, { label: 'Modal Title', value: atts.reviewModalTitle, onChange: function (v) { setAtts({ reviewModalTitle: v }); } }),
                            el(SelectControl, { label: 'Modal Icon', value: atts.reviewModalIcon || 'fa-star', options: iconOptions, onChange: function (v) { setAtts({ reviewModalIcon: v }); } }),
                            el(TextControl, { label: 'Modal Logo URL (fallback)', value: atts.reviewModalLogo || '', onChange: function (v) { setAtts({ reviewModalLogo: v }); } }),
                            el(TextControl, {
                                label: 'Modal Body Background Image URL',
                                value: atts.reviewModalBgImage || '',
                                onChange: function (v) { setAtts({ reviewModalBgImage: v }); }
                            }),
                            ColorControl('Modal Body Background Color', atts.reviewModalBgColor || '', function (v) { setAtts({ reviewModalBgColor: v }); })
                        ),
                        el(PanelBody, { title: '🎨 Review Modal Title Header', initialOpen: false },
                            ColorControl('Title Header Background Color', atts.reviewModalTitleBgColor || '', function (v) { setAtts({ reviewModalTitleBgColor: v }); }),
                            el(TextControl, {
                                label: 'Title Header Background Image URL',
                                value: atts.reviewModalTitleBgImage || '',
                                onChange: function (v) { setAtts({ reviewModalTitleBgImage: v }); }
                            }),
                            ColorControl('Title Header Text Color', atts.reviewModalTitleTextColor || '#ffffff', function (v) { setAtts({ reviewModalTitleTextColor: v }); }),
                            ColorControl('Title Header Icon Color', atts.reviewModalTitleIconColor || '#FFD700', function (v) { setAtts({ reviewModalTitleIconColor: v }); }),
                            el('div', {
                                style: {
                                    marginTop: '12px',
                                    padding: '6px',
                                    background: '#f0f4f8',
                                    borderRadius: '8px'
                                }
                            },
                                el('p', { style: { fontSize: '10px', color: '#666', margin: '0 0 6px', textAlign: 'center' } }, 'Live Preview:'),
                                el('div', { style: titleHeaderStyle },
                                    el('i', { className: 'fas ' + (atts.reviewModalIcon || 'fa-star'), style: { color: atts.reviewModalTitleIconColor || '#FFD700', fontSize: '16px' } }),
                                    el('span', null, atts.reviewModalTitle || 'Write a Review')
                                )
                            )
                        ),
                        el(PanelBody, { title: '🖼️ Background & Border', initialOpen: false },
                            ColorControl('Form Background Color', atts.reviewFormBgColor || '', function (v) { setAtts({ reviewFormBgColor: v }); }),
                            ColorControl('Form Border Color', atts.reviewFormBorderColor || '', function (v) { setAtts({ reviewFormBorderColor: v }); }),
                            el(TextControl, {
                                label: 'Background Image URL',
                                value: atts.reviewBackgroundImage || '',
                                onChange: function (v) { setAtts({ reviewBackgroundImage: v }); }
                            }),
                            el(SelectControl, { label: 'Border Size', value: atts.borderSize, options: borderWidthOptions, onChange: function (v) { setAtts({ borderSize: v }); } })
                        ),
                        el(PanelBody, { title: '👤 Reviewer Profile Pic', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Profile Pic Upload Field',
                                checked: atts.showReviewerProfilePic !== false,
                                onChange: function (v) { setAtts({ showReviewerProfilePic: v }); }
                            })
                        ),
                        el(PanelBody, { title: '➕ Custom Sections (with Icons)', initialOpen: false },
                            el(Button, { onClick: addCustomSection, variant: 'primary', style: { width: '100%', marginBottom: '15px' } }, '+ Add Custom Section'),
                            customSections.map(function (section, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Section #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteCustomSection(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el(ToggleControl, { label: 'Enabled', checked: section.enabled !== false, onChange: function (v) { updateCustomSection(idx, 'enabled', v); } }),
                                    el(TextControl, { label: 'Field Key', value: section.key, onChange: function (v) { updateCustomSection(idx, 'key', v.replace(/[^a-z0-9_]/gi, '_')); } }),
                                    el(TextControl, { label: 'Label', value: section.label, onChange: function (v) { updateCustomSection(idx, 'label', v); } }),
                                    el(SelectControl, { label: 'Icon', value: section.icon || 'fa-star', options: iconOptions, onChange: function (v) { updateCustomSection(idx, 'icon', v); } }),
                                    el(SelectControl, { label: 'Icon Size', value: section.iconSize || '16px', options: iconSizes, onChange: function (v) { updateCustomSection(idx, 'iconSize', v); } }),
                                    ColorControl('Icon Color', section.iconColor || '#075e54', function (v) { updateCustomSection(idx, 'iconColor', v); })
                                );
                            })
                        ),
                        el(PanelBody, { title: '🎨 Colors & Borders', initialOpen: false },
                            ColorControl('Star Color', atts.starColor, function (v) { setAtts({ starColor: v }); }),
                            ColorControl('Button Color', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); })
                        )
                    ),
                    el('div', blockProps,
                        el('div', {
                            className: atts.darkMode ? 'ktv-dark-mode' : '',
                            style: Object.assign({
                                padding: '30px',
                                background: effectiveBg || '#fff',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: (atts.borderSize !== '0px' && atts.borderSize !== '0') ? atts.borderSize + ' solid ' + effectiveBorder : 'none'
                            }, borderStyle, backgroundStyle)
                        },
                            (atts.showLogo === true && effectiveLogoUrl) ? el('div', { className: 'ktv-review-logo-wrapper', style: { textAlign: 'center', marginBottom: '15px' } },
                                el('img', { src: effectiveLogoUrl, alt: '', width: 180, height: 70, loading: 'lazy', decoding: 'async', style: { display: 'inline-block', maxWidth: '180px', maxHeight: '70px', width: 'auto', height: 'auto', objectFit: 'contain' } })
                            ) : null,
                            (atts.showTitle !== false) ? el('div', { style: { textAlign: 'center', marginBottom: '15px' } },
                                el(heading_tag, { className: 'ktv-review-form-title', style: { fontSize: atts.headingFontSize, color: effectiveTitleColor, fontFamily: atts.headingFontFamily, fontWeight: atts.headingFontWeight, margin: 0 } },
                                    atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.iconTitle, style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '10px' } }) : null,
                                    atts.formTitle
                                ),
                                el('p', { style: { fontSize: '14px', color: '#666', margin: '5px 0 0' } }, 'Share Your Experience!')
                            ) : null,
                            el('div', { style: { fontSize: '40px', color: atts.starColor, margin: '15px 0' } }, '★★★★★'),
                            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' } },
                                el('div', { style: { padding: '10px', background: '#f8f9fa', borderRadius: '8px' } }, '👤 ', atts.nameLabel),
                                el('div', { style: { padding: '10px', background: '#f8f9fa', borderRadius: '8px' } }, '📧 ', atts.emailLabel)
                            ),
                            el('div', { style: { padding: '10px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '10px' } }, '📝 ', atts.reviewTitleLabel || 'Review Title'),
                            atts.showReviewerProfilePic !== false ? el('div', { style: { padding: '10px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '10px' } }, '👤 Profile Pic Upload') : null,
                            customSections.filter(function (s) { return s.enabled !== false; }).map(function (section, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { padding: '10px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '10px', textAlign: 'left' }
                                },
                                    el('i', { className: 'fas ' + (section.icon || 'fa-star'), style: { color: section.iconColor || '#075e54', marginRight: '8px' } }),
                                    section.label || 'Custom Section'
                                );
                            }),
                            el('div', { style: { padding: '10px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '15px' } }, '💬 ', atts.reviewLabel),
                            el('button', {
                                style: { background: atts.buttonColor, color: '#fff', padding: '12px 30px', border: 'none', borderRadius: '30px', cursor: 'pointer' }
                            }, atts.submitLabel)
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           17. BLOCK — KTV REVIEWS DISPLAY
           ============================================================ */

        wp.blocks.registerBlockType('ktv/reviews-display', {
            title: 'KTV Reviews Display',
            description: 'Display customer reviews with star ratings, sort, filter, help support, review modal title/icon.',
            icon: 'star-half',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                limit: { type: 'number', default: 10 },
                starColor: { type: 'string', default: '#FFD700' },
                starSize: { type: 'string', default: '16px' },
                headingType: { type: 'string', default: 'h3' },
                headingFontSize: { type: 'string', default: '20px' },
                headingColor: { type: 'string', default: '#333333' },
                headingFontFamily: { type: 'string', default: 'inherit' },
                headingFontWeight: { type: 'string', default: '700' },
                tourId: { type: 'number', default: 0 },
                pageId: { type: 'number', default: 0 },
                sortReviews: { type: 'string', default: 'newest' },
                languageFilter: { type: 'string', default: '' },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-star' },
                iconTitleSize: { type: 'string', default: '24px' },
                iconTitleColor: { type: 'string', default: '#FFD700' },
                reviewTitleIconEnabled: { type: 'boolean', default: true },
                reviewTitleIconSize: { type: 'string', default: '24px' },
                reviewTitleIconColor: { type: 'string', default: '#FFD700' },
                reviewFormTitleSize: { type: 'string', default: '20px' },
                reviewFormTitleColor: { type: 'string', default: '#333333' },
                reviewFormTitleFontWeight: { type: 'string', default: '700' },
                reviewFormTitleFontFamily: { type: 'string', default: 'inherit' },
                displayTitleColor: { type: 'string', default: '' },
                showTitle: { type: 'boolean', default: true },
                titleText: { type: 'string', default: 'Customer Reviews' },
                reviewModalTitle: { type: 'string', default: 'Write a Review' },
                reviewModalIcon: { type: 'string', default: 'fa-star' },
                avgRating: { type: 'number', default: 0 },
                totalReviews: { type: 'number', default: 0 }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-reviews-display' });
                var heading_tag = atts.headingType || 'h3';

                function renderGoogleStars(rating, starColor, starSize) {
                    var starsHtml = '';
                    var fullStars = Math.floor(rating);
                    var hasHalfStar = (rating - fullStars) >= 0.5;
                    for (var i = 1; i <= 5; i++) {
                        if (i <= fullStars) {
                            starsHtml += '<i class="fas fa-star" style="color:' + starColor + ';font-size:' + starSize + ';"></i>';
                        } else if (i === fullStars + 1 && hasHalfStar) {
                            starsHtml += '<i class="fas fa-star-half-alt" style="color:' + starColor + ';font-size:' + starSize + ';"></i>';
                        } else {
                            starsHtml += '<i class="far fa-star" style="color:' + starColor + ';font-size:' + starSize + ';"></i>';
                        }
                    }
                    return starsHtml;
                }

                var avgRatingVal = parseFloat(atts.avgRating || 0);
                var totalReviewsVal = parseInt(atts.totalReviews || 0);

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📋 Title Settings', initialOpen: true },
                            el(ToggleControl, { label: 'Show Title', checked: atts.showTitle !== false, onChange: function (v) { setAtts({ showTitle: v }); } }),
                            el(TextControl, { label: 'Title Text', value: atts.titleText, onChange: function (v) { setAtts({ titleText: v }); } }),
                            el(ToggleControl, {
                                label: 'Show Title Icon',
                                checked: atts.reviewTitleIconEnabled !== false,
                                onChange: function (v) { setAtts({ reviewTitleIconEnabled: v }); }
                            }),
                            el(SelectControl, { label: 'Title Icon', value: atts.iconTitle || 'fa-star', options: iconOptions, onChange: function (v) { setAtts({ iconTitle: v }); } }),
                            el(SelectControl, { label: 'Title Icon Size', value: atts.reviewTitleIconSize || '24px', options: iconSizes, onChange: function (v) { setAtts({ reviewTitleIconSize: v }); } }),
                            ColorControl('Title Icon Color', atts.reviewTitleIconColor || '#FFD700', function (v) { setAtts({ reviewTitleIconColor: v }); })
                        ),
                        el(PanelBody, { title: '🔤 Title Typography', initialOpen: false },
                            el(SelectControl, { label: 'Heading Type', value: atts.headingType, options: headingTypes, onChange: function (v) { setAtts({ headingType: v }); } }),
                            el(SelectControl, { label: 'Title Font Size', value: atts.reviewFormTitleSize || '20px', options: fontSizes, onChange: function (v) { setAtts({ reviewFormTitleSize: v }); } }),
                            ColorControl('Title Font Color', atts.reviewFormTitleColor || '#333333', function (v) { setAtts({ reviewFormTitleColor: v }); }),
                            ColorControl('Display Review Title Color', atts.displayTitleColor || atts.reviewFormTitleColor || '#333333', function (v) { setAtts({ displayTitleColor: v }); }),
                            el(SelectControl, { label: 'Title Font Family', value: atts.reviewFormTitleFontFamily || 'inherit', options: fontFamilyOptions, onChange: function (v) { setAtts({ reviewFormTitleFontFamily: v }); } }),
                            el(SelectControl, { label: 'Title Font Weight', value: atts.reviewFormTitleFontWeight || '700', options: fontWeightOptions, onChange: function (v) { setAtts({ reviewFormTitleFontWeight: v }); } })
                        ),
                        el(PanelBody, { title: '🪟 Review Modal Popup', initialOpen: false },
                            el(TextControl, { label: 'Modal Title', value: atts.reviewModalTitle, onChange: function (v) { setAtts({ reviewModalTitle: v }); } }),
                            el(SelectControl, { label: 'Modal Icon', value: atts.reviewModalIcon || 'fa-star', options: iconOptions, onChange: function (v) { setAtts({ reviewModalIcon: v }); } })
                        ),
                        el(PanelBody, { title: '⚙️ Settings', initialOpen: true },
                            el(RangeControl, { label: 'Number of Reviews', value: atts.limit, onChange: function (v) { setAtts({ limit: v }); }, min: 1, max: 50 }),
                            el(TextControl, { label: 'Tour ID', value: atts.tourId, type: 'number', onChange: function (v) { setAtts({ tourId: parseInt(v) || 0 }); } }),
                            el(TextControl, { label: 'Page ID', value: atts.pageId, type: 'number', onChange: function (v) { setAtts({ pageId: parseInt(v) || 0 }); } }),
                            el(SelectControl, { label: 'Sort Reviews', value: atts.sortReviews, options: reviewSortOptions, onChange: function (v) { setAtts({ sortReviews: v }); } }),
                            el(SelectControl, { label: 'Language Filter', value: atts.languageFilter, options: languageOptions, onChange: function (v) { setAtts({ languageFilter: v }); } })
                        ),
                        el(PanelBody, { title: '📊 Preview Data', initialOpen: false },
                            el(TextControl, { label: 'Preview Average Rating', type: 'number', step: '0.1', value: atts.avgRating || 0, onChange: function (v) { setAtts({ avgRating: parseFloat(v) || 0 }); } }),
                            el(TextControl, { label: 'Preview Total Reviews', type: 'number', value: atts.totalReviews || 0, onChange: function (v) { setAtts({ totalReviews: parseInt(v) || 0 }); } })
                        ),
                        el(PanelBody, { title: '⭐ Colors', initialOpen: false },
                            ColorControl('Star Color', atts.starColor, function (v) { setAtts({ starColor: v }); }),
                            el(SelectControl, { label: 'Star Size', value: atts.starSize, options: iconSizes, onChange: function (v) { setAtts({ starSize: v }); } })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { className: atts.darkMode ? 'ktv-dark-mode' : '', style: { padding: '20px', background: atts.darkMode ? '#1a1a2e' : '#fff', borderRadius: '12px', textAlign: 'center' } },
                            atts.showTitle !== false ? el(heading_tag, { style: { fontSize: atts.reviewFormTitleSize || atts.headingFontSize, color: atts.darkMode ? '#e0e0e0' : (atts.displayTitleColor || atts.reviewFormTitleColor || atts.headingColor), fontFamily: atts.reviewFormTitleFontFamily || atts.headingFontFamily, fontWeight: atts.reviewFormTitleFontWeight || atts.headingFontWeight } },
                                (atts.enableIcon !== false && atts.reviewTitleIconEnabled !== false) ? el('i', { className: 'fas ' + atts.iconTitle, style: { fontSize: atts.reviewTitleIconSize || atts.iconTitleSize, color: atts.reviewTitleIconColor || atts.iconTitleColor, marginRight: '10px' } }) : null,
                                ' ' + atts.titleText
                            ) : null,
                            el('div', {
                                className: 'ktv-reviews-header',
                                style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }
                            },
                                el('div', { style: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' } },
                                    el('span', { className: 'ktv-rating-number', style: { fontSize: '36px', fontWeight: '700', color: atts.darkMode ? '#e0e0e0' : '#333' } }, avgRatingVal.toFixed(1)),
                                    el('div', null,
                                        el('div', {
                                            className: 'ktv-stars',
                                            style: { color: atts.starColor, fontSize: atts.starSize },
                                            dangerouslySetInnerHTML: { __html: renderGoogleStars(avgRatingVal, atts.starColor || '#FFD700', atts.starSize || '16px') }
                                        }),
                                        el('span', { className: 'ktv-review-count', style: { fontSize: '12px', color: atts.darkMode ? '#999' : '#666' } }, totalReviewsVal + ' reviews')
                                    )
                                )
                            )
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           18. BLOCK — KTV ACCORDION
           ============================================================ */

        wp.blocks.registerBlockType('ktv/accordion', {
            title: 'KTV Accordion',
            description: 'Itinerary accordion with DOCX/TXT download, Print, and share. Editable title, title icon, per-item icons + after-title text, all-closed toggle.',
            icon: 'list-view',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                sectionTitle: { type: 'string', default: 'Tour Itinerary' },
                titleText: { type: 'string', default: 'Tour Itinerary' },
                titleColor: { type: 'string', default: '#333333' },
                titleFontSize: { type: 'string', default: '20px' },
                titleFontFamily: { type: 'string', default: 'inherit' },
                titleFontWeight: { type: 'string', default: '700' },
                sectionHeadingType: { type: 'string', default: 'h3' },
                sectionBriefText: { type: 'string', default: '' },
                sectionBriefSize: { type: 'string', default: '14px' },
                sectionBriefColor: { type: 'string', default: '#666666' },
                iconColor: { type: 'string', default: '#075e54' },
                showShare: { type: 'boolean', default: true },
                showDownload: { type: 'boolean', default: true },
                downloadLabel: { type: 'string', default: 'Download Itinerary' },
                shareDownloadSameLine: { type: 'boolean', default: true },
                itemCount: { type: 'number', default: 0 },
                pageId: { type: 'number', default: 0 },
                tourId: { type: 'number', default: 0 },
                firstOpen: { type: 'boolean', default: false },
                allClosed: { type: 'boolean', default: false },
                customAccordionItems: { type: 'array', default: [] },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-calendar-alt' },
                iconTitleSize: { type: 'string', default: '20px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                showTitle: { type: 'boolean', default: true },
                shareButtonSize: { type: 'string', default: '40px' },
                shareButtonBgColor: { type: 'string', default: 'transparent' },
                shareButtonIconColor: { type: 'string', default: '#666666' },
                shareButtonIconSize: { type: 'string', default: '14px' },
                downloadButtonBgColor: { type: 'string', default: '#075e54' },
                downloadButtonTextColor: { type: 'string', default: '#ffffff' },
                downloadButtonFontSize: { type: 'string', default: '14px' },
                downloadButtonFontWeight: { type: 'string', default: '600' },
                showDocx: { type: 'boolean', default: true },
                showTxt: { type: 'boolean', default: true },
                showViewDocx: { type: 'boolean', default: false },
                showViewTxt: { type: 'boolean', default: false },
                showPrintButton: { type: 'boolean', default: true },
                printButtonLabel: { type: 'string', default: 'Print Itinerary' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-accordion' });
                var customItems = atts.customAccordionItems || [];

                function addAccordionItem() {
                    var newItems = customItems.concat([{
                        id: Date.now(),
                        title: '',
                        after_title_text: '',
                        content: '<p>Add your itinerary details here.</p>',
                        icon: 'fa-map-pin',
                        icon_size: '16px',
                        icon_color: atts.iconColor || '#075e54',
                        icon_font_family: 'inherit',
                        title_size: '16px',
                        title_color: '#333333',
                        title_weight: '600',
                        title_font_family: 'inherit',
                        after_title_font_size: '12px',
                        after_title_color: '#666666',
                        icon_position: 'left',
                        first_open: false
                    }]);
                    setAtts({ customAccordionItems: newItems, itemCount: newItems.length });
                }

                function updateAccordionItem(index, key, value) {
                    var updated = customItems.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ customAccordionItems: updated });
                }

                function deleteAccordionItem(index) {
                    var updated = customItems.slice();
                    updated.splice(index, 1);
                    setAtts({ customAccordionItems: updated, itemCount: updated.length });
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📋 Accordion Settings', initialOpen: true },
                            el(ToggleControl, { label: 'Show Title', checked: atts.showTitle !== false, onChange: function (v) { setAtts({ showTitle: v }); } }),
                            el(TextControl, { label: 'Section Title', value: atts.sectionTitle || atts.titleText, onChange: function (v) { setAtts({ sectionTitle: v, titleText: v }); } }),
                            el(SelectControl, {
                                label: 'Section Heading Type',
                                value: atts.sectionHeadingType || 'h3',
                                options: sectionHeadingTypes,
                                onChange: function (v) { setAtts({ sectionHeadingType: v }); }
                            }),
                            el(TextareaControl, {
                                label: 'Brief Text After Section Title',
                                value: atts.sectionBriefText || '',
                                rows: 2,
                                onChange: function (v) { setAtts({ sectionBriefText: v }); }
                            }),
                            el(SelectControl, { label: 'Brief Font Size', value: atts.sectionBriefSize || '14px', options: fontSizes, onChange: function (v) { setAtts({ sectionBriefSize: v }); } }),
                            ColorControl('Brief Text Color', atts.sectionBriefColor || '#666666', function (v) { setAtts({ sectionBriefColor: v }); }),
                            ColorControl('Title Color', atts.titleColor, function (v) { setAtts({ titleColor: v }); }),
                            ColorControl('Item Icon Color (default)', atts.iconColor, function (v) { setAtts({ iconColor: v }); }),
                            el(ToggleControl, { label: 'Show Share Button', checked: atts.showShare, onChange: function (v) { setAtts({ showShare: v }); } }),
                            el(ToggleControl, { label: 'Show Download Button', checked: atts.showDownload, onChange: function (v) { setAtts({ showDownload: v }); } }),
                            atts.showDownload ? el(TextControl, { label: 'Download Label', value: atts.downloadLabel, onChange: function (v) { setAtts({ downloadLabel: v }); } }) : null,
                            el(ToggleControl, { label: 'Share & Download Buttons on Same Line', checked: atts.shareDownloadSameLine !== false, onChange: function (v) { setAtts({ shareDownloadSameLine: v }); } }),
                            el(ToggleControl, { label: 'First Item Open by Default', checked: atts.firstOpen, onChange: function (v) { setAtts({ firstOpen: v }); } }),
                            el(ToggleControl, {
                                label: 'All Items Closed by Default (overrides "First Open")',
                                checked: atts.allClosed === true,
                                onChange: function (v) { setAtts({ allClosed: v }); }
                            })
                        ),
                        TitleIconControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🔤 Title Typography', initialOpen: false },
                            el(SelectControl, { label: 'Title Font Size', value: atts.titleFontSize || '20px', options: fontSizes, onChange: function (v) { setAtts({ titleFontSize: v }); } }),
                            el(SelectControl, { label: 'Title Font Family', value: atts.titleFontFamily || 'inherit', options: fontFamilyOptions, onChange: function (v) { setAtts({ titleFontFamily: v }); } }),
                            el(SelectControl, { label: 'Title Font Weight', value: atts.titleFontWeight || '700', options: fontWeightOptions, onChange: function (v) { setAtts({ titleFontWeight: v }); } })
                        ),
                        el(PanelBody, { title: '📤 Share Button Style', initialOpen: false },
                            el(SelectControl, { label: 'Share Button Size', value: atts.shareButtonSize || '40px', options: iconSizes, onChange: function (v) { setAtts({ shareButtonSize: v }); } }),
                            ColorControl('Share Button Background', atts.shareButtonBgColor || 'transparent', function (v) { setAtts({ shareButtonBgColor: v }); }),
                            ColorControl('Share Icon Color', atts.shareButtonIconColor || '#666666', function (v) { setAtts({ shareButtonIconColor: v }); }),
                            el(SelectControl, { label: 'Share Icon Size', value: atts.shareButtonIconSize || '14px', options: iconSizes, onChange: function (v) { setAtts({ shareButtonIconSize: v }); } })
                        ),
                        el(PanelBody, { title: '📥 Download Button Style', initialOpen: false },
                            ColorControl('Download Button Background', atts.downloadButtonBgColor || '#075e54', function (v) { setAtts({ downloadButtonBgColor: v }); }),
                            ColorControl('Download Button Text Color', atts.downloadButtonTextColor || '#ffffff', function (v) { setAtts({ downloadButtonTextColor: v }); }),
                            el(SelectControl, { label: 'Download Button Font Size', value: atts.downloadButtonFontSize || '14px', options: fontSizes, onChange: function (v) { setAtts({ downloadButtonFontSize: v }); } }),
                            el(SelectControl, { label: 'Download Button Font Weight', value: atts.downloadButtonFontWeight || '600', options: fontWeightOptions, onChange: function (v) { setAtts({ downloadButtonFontWeight: v }); } })
                        ),
                        el(PanelBody, { title: '📄 Download Formats', initialOpen: false },
                            el(ToggleControl, { label: 'Show "Download as DOCX"', checked: atts.showDocx !== false, onChange: function (v) { setAtts({ showDocx: v }); } }),
                            el(ToggleControl, { label: 'Show "Download as TXT"', checked: atts.showTxt !== false, onChange: function (v) { setAtts({ showTxt: v }); } }),
                            el('hr', { style: { margin: '10px 0' } }),
                            el(ToggleControl, { label: 'Show "View as DOCX"', checked: atts.showViewDocx !== false, onChange: function (v) { setAtts({ showViewDocx: v }); } }),
                            el(ToggleControl, { label: 'Show "View as TXT"', checked: atts.showViewTxt !== false, onChange: function (v) { setAtts({ showViewTxt: v }); } }),
                            el('hr', { style: { margin: '10px 0' } }),
                            el(ToggleControl, {
                                label: 'Show "Print Itinerary" button',
                                checked: atts.showPrintButton !== false,
                                onChange: function (v) { setAtts({ showPrintButton: v }); }
                            }),
                            atts.showPrintButton !== false ? el(TextControl, {
                                label: 'Print Button Label',
                                value: atts.printButtonLabel || 'Print Itinerary',
                                onChange: function (v) { setAtts({ printButtonLabel: v }); }
                            }) : null
                        ),
                        el(PanelBody, { title: '📝 Manage Accordion Items', initialOpen: false },
                            el('div', { style: { marginBottom: '10px' } },
                                el(Button, { onClick: addAccordionItem, variant: 'primary', style: { width: '100%', textAlign: 'center' } }, '+ Add New Item')
                            ),
                            customItems.length === 0 ? el('div', { style: { padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#666' } }, 'No items yet.') : null,
                            customItems.map(function (item, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Item #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteAccordionItem(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el(TextControl, { label: 'Title', value: item.title, onChange: function (v) { updateAccordionItem(idx, 'title', v); } }),
                                    el(TextControl, { label: 'After Title Text (shows below title)', value: item.after_title_text || '', onChange: function (v) { updateAccordionItem(idx, 'after_title_text', v); } }),
                                    el(SelectControl, { label: 'Icon', value: item.icon || 'fa-map-pin', options: iconOptions, onChange: function (v) { updateAccordionItem(idx, 'icon', v); } }),
                                    el(SelectControl, { label: 'Icon Size', value: item.icon_size || '16px', options: iconSizes, onChange: function (v) { updateAccordionItem(idx, 'icon_size', v); } }),
                                    ColorControl('Icon Color', item.icon_color || atts.iconColor || '#075e54', function (v) { updateAccordionItem(idx, 'icon_color', v); }),
                                    el(SelectControl, { label: 'Icon Font Family', value: item.icon_font_family || 'inherit', options: fontFamilyOptions, onChange: function (v) { updateAccordionItem(idx, 'icon_font_family', v); } }),
                                    el(SelectControl, { label: 'Icon Position', value: item.icon_position || 'left', options: iconPositionOptions, onChange: function (v) { updateAccordionItem(idx, 'icon_position', v); } }),
                                    el(SelectControl, { label: 'Title Size', value: item.title_size || '16px', options: fontSizes, onChange: function (v) { updateAccordionItem(idx, 'title_size', v); } }),
                                    ColorControl('Title Color', item.title_color || '#333333', function (v) { updateAccordionItem(idx, 'title_color', v); }),
                                    el(SelectControl, { label: 'Title Font Weight', value: item.title_weight || '600', options: fontWeightOptions, onChange: function (v) { updateAccordionItem(idx, 'title_weight', v); } }),
                                    el(SelectControl, { label: 'Title Font Family', value: item.title_font_family || 'inherit', options: fontFamilyOptions, onChange: function (v) { updateAccordionItem(idx, 'title_font_family', v); } }),
                                    el(SelectControl, { label: 'After Title Font Size', value: item.after_title_font_size || '12px', options: fontSizes, onChange: function (v) { updateAccordionItem(idx, 'after_title_font_size', v); } }),
                                    ColorControl('After Title Color', item.after_title_color || '#666666', function (v) { updateAccordionItem(idx, 'after_title_color', v); }),
                                    el(TextareaControl, { label: 'Content (HTML allowed)', value: item.content, rows: 4, onChange: function (v) { updateAccordionItem(idx, 'content', v); } }),
                                    el(ToggleControl, { label: 'Open by Default', checked: item.first_open === true, onChange: function (v) { updateAccordionItem(idx, 'first_open', v); } })
                                );
                            })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { className: atts.darkMode ? 'ktv-dark-mode' : '', style: { background: atts.darkMode ? '#1a1a2e' : '#fff', borderRadius: '12px', padding: '20px', border: atts.darkMode ? '1px solid #2a2a3e' : '1px solid #e0e0e0' } },
                            atts.showTitle !== false ? el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: atts.shareDownloadSameLine !== false ? 'nowrap' : 'wrap', gap: '10px' } },
                                el('div', { style: { flex: 1, minWidth: 0 } },
                                    el(atts.sectionHeadingType || 'h3', { className: 'ktv-accordion-section-title', style: { color: atts.darkMode ? '#e0e0e0' : atts.titleColor, fontSize: atts.titleFontSize, fontFamily: atts.titleFontFamily, fontWeight: atts.titleFontWeight, margin: 0 } },
                                        atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.iconTitle, style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '10px' } }) : null,
                                        ' ' + (atts.sectionTitle || atts.titleText || 'Tour Itinerary')
                                    ),
                                    atts.sectionBriefText ? el('p', { className: 'ktv-accordion-section-brief', style: { fontSize: atts.sectionBriefSize || '14px', color: atts.sectionBriefColor || '#666666', margin: '6px 0 0', lineHeight: 1.5 } }, atts.sectionBriefText) : null
                                ),
                                el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                                    atts.showShare ? el('button', { style: { marginRight: '8px', padding: '8px 16px', fontSize: '14px', background: atts.shareButtonBgColor || '#f0f0f0', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' } }, '📤 Share') : null,
                                    atts.showDownload ? el('button', { style: { padding: '10px 20px', fontSize: atts.downloadButtonFontSize || '14px', background: atts.downloadButtonBgColor || '#075e54', color: atts.downloadButtonTextColor || '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: atts.downloadButtonFontWeight || '600' } }, '📥 ', atts.downloadLabel) : null
                                )
                            ) : null,
                            customItems.length === 0 ? el('div', { style: { padding: '40px', textAlign: 'center', color: '#999' } },
                                el('i', { className: 'fas fa-info-circle', style: { fontSize: '32px', display: 'block', marginBottom: '10px' } }),
                                'No accordion items. Add items in the inspector panel.'
                            ) : null,
                            customItems.map(function (item, idx) {
                                var isOpen = item.first_open === true || (atts.firstOpen && idx === 0 && !atts.allClosed);
                                var itemIconSize = item.icon_size || '16px';
                                var itemIconColor = item.icon_color || atts.iconColor || '#075e54';
                                var itemIconPosition = item.icon_position || 'left';
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '8px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }
                                },
                                    el('div', {
                                        className: 'ktv-accordion-head',
                                        style: { padding: '12px 15px', background: atts.darkMode ? '#2a2a3e' : '#f8f9fa', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }
                                    },
                                        el('span', { className: 'ktv-accordion-head-left', style: { display: 'flex', alignItems: 'center', gap: '8px', flexDirection: itemIconPosition === 'right' ? 'row-reverse' : 'row', flex: 1 } },
                                            el('i', { className: 'fas ' + (item.icon || 'fa-map-pin'), style: { color: itemIconColor, fontSize: itemIconSize } }),
                                            el('span', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
                                                el('span', { style: { color: atts.darkMode ? '#e0e0e0' : (item.title_color || '#333'), fontSize: item.title_size || '16px', fontWeight: item.title_weight || '600', fontFamily: item.title_font_family || 'inherit' } }, item.title || 'Item ' + (idx + 1)),
                                                item.after_title_text ? el('span', { className: 'ktv-accordion-after-title', style: { color: item.after_title_color || '#666', fontSize: item.after_title_font_size || '12px', fontWeight: 400 } }, item.after_title_text) : null
                                            )
                                        ),
                                        el('span', { className: 'ktv-accordion-icon', style: { color: atts.darkMode ? '#e0e0e0' : '#333' } }, isOpen ? '−' : '+')
                                    ),
                                    isOpen ? el('div', { className: 'ktv-accordion-body', style: { padding: '15px', borderTop: '1px solid #e0e0e0', background: atts.darkMode ? '#1a1a2e' : '#fff' } },
                                        el('div', { className: 'ktv-accordion-content', dangerouslySetInnerHTML: { __html: item.content || '<p>Add content here</p>' } })
                                    ) : null
                                );
                            })
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           19. BLOCK — KTV TABS
           ============================================================ */

        wp.blocks.registerBlockType('ktv/tabs', {
            title: 'KTV Tabs',
            description: 'Dynamic tabbed content with icons, colors, horizontal/vertical style, auto-scroll, title, title icon, after-title text per tab, section heading type, brief text, per-tab download.',
            icon: 'table-row-before',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                tabActiveColor: { type: 'string', default: '#075e54' },
                tabBgColor: { type: 'string', default: '#f0f4f8' },
                tabTextColor: { type: 'string', default: '#333333' },
                tabActiveTextColor: { type: 'string', default: '#ffffff' },
                tabContentBgColor: { type: 'string', default: '#ffffff' },
                tabBorderRadius: { type: 'string', default: '8px' },
                tabStyle: { type: 'string', default: 'horizontal' },
                enableActiveTabColor: { type: 'boolean', default: true },
                tabCount: { type: 'number', default: 0 },
                firstOpen: { type: 'boolean', default: true },
                customTabs: { type: 'array', default: [] },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-table' },
                iconTitleSize: { type: 'string', default: '20px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                autoScroll: { type: 'boolean', default: true },
                showTitle: { type: 'boolean', default: false },
                titleText: { type: 'string', default: 'Tour Information' },
                titleColor: { type: 'string', default: '#333333' },
                titleFontSize: { type: 'string', default: '24px' },
                titleFontFamily: { type: 'string', default: 'inherit' },
                titleFontWeight: { type: 'string', default: '700' },
                tabsSectionHeadingType: { type: 'string', default: 'h2' },
                tabsSectionBriefText: { type: 'string', default: '' },
                tabsSectionBriefSize: { type: 'string', default: '14px' },
                tabsSectionBriefColor: { type: 'string', default: '#666666' },
                showDownloadTab: { type: 'boolean', default: true },
                showDocxTab: { type: 'boolean', default: true },
                showTxtTab: { type: 'boolean', default: true },
                showPrintTab: { type: 'boolean', default: true },
                showViewDocxTab: { type: 'boolean', default: false },
                showViewTxtTab: { type: 'boolean', default: false },
                downloadTabLabel: { type: 'string', default: 'Download Tabs' },
                printTabLabel: { type: 'string', default: 'Print' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-tabs' });
                var customTabs = atts.customTabs || [];
                var effectiveStyle = atts.tabStyle || 'horizontal';

                function addTab() {
                    var newTabs = customTabs.concat([{
                        id: Date.now(),
                        title: '',
                        after_title_text: '',
                        content: '<p>Add your content here.</p>',
                        icon: 'fa-info-circle',
                        icon_size: '16px',
                        icon_color: atts.iconTitleColor || '#075e54',
                        icon_font_family: 'inherit',
                        icon_position: 'left',
                        title_size: '14px',
                        title_color: '#333333',
                        title_weight: '600',
                        title_font_family: 'inherit',
                        after_title_font_size: '11px',
                        after_title_color: '#666666',
                        first_open: false
                    }]);
                    setAtts({ customTabs: newTabs, tabCount: newTabs.length });
                }

                function updateTab(index, key, value) {
                    var updated = customTabs.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ customTabs: updated });
                }

                function deleteTab(index) {
                    var updated = customTabs.slice();
                    updated.splice(index, 1);
                    setAtts({ customTabs: updated, tabCount: updated.length });
                }

                var activeTabIndex = 0;
                customTabs.forEach(function (tab, i) {
                    if (tab.first_open === true) activeTabIndex = i;
                });
                if (atts.firstOpen === false && customTabs.length > 0) {
                    var anyFirstOpen = false;
                    customTabs.forEach(function (tab) {
                        if (tab.first_open === true) anyFirstOpen = true;
                    });
                    if (!anyFirstOpen) activeTabIndex = -1;
                }
                if (activeTabIndex === -1 && customTabs.length > 0) {
                    activeTabIndex = 0;
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📋 Tabs Settings', initialOpen: true },
                            el(ToggleControl, { label: 'Show Section Title', checked: atts.showTitle, onChange: function (v) { setAtts({ showTitle: v }); } }),
                            el(TextControl, { label: 'Section Title', value: atts.titleText, onChange: function (v) { setAtts({ titleText: v }); } }),
                            el(SelectControl, {
                                label: 'Section Heading Type',
                                value: atts.tabsSectionHeadingType || 'h2',
                                options: sectionHeadingTypes,
                                onChange: function (v) { setAtts({ tabsSectionHeadingType: v }); }
                            }),
                            el(TextareaControl, {
                                label: 'Brief Text After Section Title',
                                value: atts.tabsSectionBriefText || '',
                                rows: 2,
                                onChange: function (v) { setAtts({ tabsSectionBriefText: v }); }
                            }),
                            el(SelectControl, { label: 'Brief Font Size', value: atts.tabsSectionBriefSize || '14px', options: fontSizes, onChange: function (v) { setAtts({ tabsSectionBriefSize: v }); } }),
                            ColorControl('Brief Text Color', atts.tabsSectionBriefColor || '#666666', function (v) { setAtts({ tabsSectionBriefColor: v }); }),
                            ColorControl('Section Title Color', atts.titleColor, function (v) { setAtts({ titleColor: v }); }),
                            el(SelectControl, {
                                label: 'Style (Horizontal / Vertical)',
                                value: effectiveStyle,
                                options: tabStyleOptions,
                                onChange: function (v) { setAtts({ tabStyle: v }); }
                            }),
                            el(ToggleControl, { label: 'Auto Scroll Tab Into View', checked: atts.autoScroll !== false, onChange: function (v) { setAtts({ autoScroll: v }); } }),
                            el(ToggleControl, { label: 'First Tab Open by Default', checked: atts.firstOpen, onChange: function (v) { setAtts({ firstOpen: v }); } }),
                            el(ToggleControl, {
                                label: 'Enable Active Tab Color',
                                checked: atts.enableActiveTabColor !== false,
                                onChange: function (v) { setAtts({ enableActiveTabColor: v }); }
                            }),
                            atts.enableActiveTabColor !== false ? el(Fragment, {},
                                ColorControl('Active Tab Color', atts.tabActiveColor, function (v) { setAtts({ tabActiveColor: v }); }),
                                ColorControl('Active Tab Text Color', atts.tabActiveTextColor, function (v) { setAtts({ tabActiveTextColor: v }); })
                            ) : null,
                            ColorControl('Tab Background Color', atts.tabBgColor, function (v) { setAtts({ tabBgColor: v }); }),
                            ColorControl('Tab Text Color', atts.tabTextColor, function (v) { setAtts({ tabTextColor: v }); }),
                            ColorControl('Tab Content Background', atts.tabContentBgColor, function (v) { setAtts({ tabContentBgColor: v }); }),
                            el(SelectControl, { label: 'Tab Border Radius', value: atts.tabBorderRadius || '8px', options: borderRadiusOptions, onChange: function (v) { setAtts({ tabBorderRadius: v }); } })
                        ),
                        TitleIconControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🔤 Title Typography', initialOpen: false },
                            el(SelectControl, { label: 'Title Font Size', value: atts.titleFontSize || '24px', options: fontSizes, onChange: function (v) { setAtts({ titleFontSize: v }); } }),
                            el(SelectControl, { label: 'Title Font Family', value: atts.titleFontFamily || 'inherit', options: fontFamilyOptions, onChange: function (v) { setAtts({ titleFontFamily: v }); } }),
                            el(SelectControl, { label: 'Title Font Weight', value: atts.titleFontWeight || '700', options: fontWeightOptions, onChange: function (v) { setAtts({ titleFontWeight: v }); } })
                        ),
                        el(PanelBody, { title: '📥 Per-Tab Download Buttons', initialOpen: false },
                            el(ToggleControl, {
                                label: 'Show Download Bar in Each Tab',
                                checked: atts.showDownloadTab !== false,
                                onChange: function (v) { setAtts({ showDownloadTab: v }); }
                            }),
                            atts.showDownloadTab !== false ? el(Fragment, {},
                                el(ToggleControl, { label: 'Show "Download as DOCX"', checked: atts.showDocxTab !== false, onChange: function (v) { setAtts({ showDocxTab: v }); } }),
                                el(ToggleControl, { label: 'Show "Download as TXT"', checked: atts.showTxtTab !== false, onChange: function (v) { setAtts({ showTxtTab: v }); } }),
                                el(ToggleControl, { label: 'Show "Print" button', checked: atts.showPrintTab !== false, onChange: function (v) { setAtts({ showPrintTab: v }); } }),
                                atts.showPrintTab !== false ? el(TextControl, {
                                    label: 'Print Button Label',
                                    value: atts.printTabLabel || 'Print',
                                    onChange: function (v) { setAtts({ printTabLabel: v }); }
                                }) : null
                            ) : null
                        ),
                        el(PanelBody, { title: '📝 Manage Tabs', initialOpen: false },
                            el('div', { style: { marginBottom: '10px' } },
                                el(Button, { onClick: addTab, variant: 'primary', style: { width: '100%', textAlign: 'center' } }, '+ Add New Tab')
                            ),
                            customTabs.length === 0 ? el('div', { style: { padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#666' } }, 'No tabs yet.') : null,
                            customTabs.map(function (tab, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Tab #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteTab(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el(TextControl, { label: 'Tab Title', value: tab.title, onChange: function (v) { updateTab(idx, 'title', v); } }),
                                    el(TextControl, { label: 'After Title Text (shows below tab title)', value: tab.after_title_text || '', onChange: function (v) { updateTab(idx, 'after_title_text', v); } }),
                                    el(SelectControl, { label: 'Tab Icon', value: tab.icon || 'fa-info-circle', options: iconOptions, onChange: function (v) { updateTab(idx, 'icon', v); } }),
                                    el(SelectControl, { label: 'Tab Icon Size', value: tab.icon_size || '16px', options: iconSizes, onChange: function (v) { updateTab(idx, 'icon_size', v); } }),
                                    ColorControl('Tab Icon Color', tab.icon_color || atts.iconTitleColor || '#075e54', function (v) { updateTab(idx, 'icon_color', v); }),
                                    el(SelectControl, { label: 'Icon Font Family', value: tab.icon_font_family || 'inherit', options: fontFamilyOptions, onChange: function (v) { updateTab(idx, 'icon_font_family', v); } }),
                                    el(SelectControl, { label: 'Icon Position', value: tab.icon_position || 'left', options: iconPositionOptions, onChange: function (v) { updateTab(idx, 'icon_position', v); } }),
                                    el(SelectControl, { label: 'Title Size', value: tab.title_size || '14px', options: fontSizes, onChange: function (v) { updateTab(idx, 'title_size', v); } }),
                                    ColorControl('Title Color', tab.title_color || '#333333', function (v) { updateTab(idx, 'title_color', v); }),
                                    el(SelectControl, { label: 'Title Font Weight', value: tab.title_weight || '600', options: fontWeightOptions, onChange: function (v) { updateTab(idx, 'title_weight', v); } }),
                                    el(SelectControl, { label: 'Title Font Family', value: tab.title_font_family || 'inherit', options: fontFamilyOptions, onChange: function (v) { updateTab(idx, 'title_font_family', v); } }),
                                    el(SelectControl, { label: 'After Title Font Size', value: tab.after_title_font_size || '11px', options: fontSizes, onChange: function (v) { updateTab(idx, 'after_title_font_size', v); } }),
                                    ColorControl('After Title Color', tab.after_title_color || '#666666', function (v) { updateTab(idx, 'after_title_color', v); }),
                                    el(TextareaControl, { label: 'Tab Content (HTML allowed)', value: tab.content, rows: 6, onChange: function (v) { updateTab(idx, 'content', v); } }),
                                    el(ToggleControl, { label: 'Open by Default', checked: tab.first_open === true, onChange: function (v) { updateTab(idx, 'first_open', v); } })
                                );
                            })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { className: atts.darkMode ? 'ktv-dark-mode' : '', style: { background: atts.darkMode ? '#1a1a2e' : '#fff', borderRadius: '12px', padding: '20px', border: atts.darkMode ? '1px solid #2a2a3e' : '1px solid #e0e0e0' } },
                            atts.showTitle ? el('div', { className: 'ktv-tabs-section-header', style: { textAlign: 'center', marginBottom: '20px' } },
                                el(atts.tabsSectionHeadingType || 'h2', { className: 'ktv-tabs-section-title', style: { fontSize: atts.titleFontSize, color: atts.darkMode ? '#e0e0e0' : atts.titleColor, fontFamily: atts.titleFontFamily, fontWeight: atts.titleFontWeight, margin: 0 } },
                                    atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.iconTitle, style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '10px' } }) : null,
                                    atts.titleText
                                ),
                                atts.tabsSectionBriefText ? el('p', { className: 'ktv-tabs-section-brief', style: { fontSize: atts.tabsSectionBriefSize || '14px', color: atts.tabsSectionBriefColor || '#666666', margin: '8px 0 0', lineHeight: 1.5 } }, atts.tabsSectionBriefText) : null
                            ) : null,
                            el('div', { className: 'ktv-tabs-nav', style: { display: 'flex', gap: '5px', flexWrap: 'nowrap', overflowX: 'auto', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                                customTabs.map(function (tab, i) {
                                    var isActive = i === activeTabIndex;
                                    var iconPos = tab.icon_position || 'left';
                                    var activeColorEnabled = atts.enableActiveTabColor !== false;
                                    var bgColor = isActive ? (activeColorEnabled ? atts.tabActiveColor : atts.tabBgColor) : atts.tabBgColor;
                                    var textColor = isActive ? (activeColorEnabled ? atts.tabActiveTextColor : (tab.title_color || atts.tabTextColor)) : (tab.title_color || atts.tabTextColor);
                                    return el('button', {
                                        key: i,
                                        className: isActive ? 'ktv-tab-btn active' : 'ktv-tab-btn',
                                        style: {
                                            padding: '10px 20px',
                                            background: bgColor,
                                            color: textColor,
                                            border: 'none', borderRadius: (atts.tabBorderRadius || '8px') + ' ' + (atts.tabBorderRadius || '8px') + ' 0 0',
                                            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                                            fontSize: tab.title_size || '14px',
                                            fontWeight: tab.title_weight || '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            flexDirection: iconPos === 'right' ? 'row-reverse' : 'row'
                                        }
                                    },
                                        el('i', { className: 'fas ' + (tab.icon || 'fa-info-circle'), style: { fontSize: tab.icon_size || '16px', color: tab.icon_color || atts.iconTitleColor } }),
                                        el('span', { style: { display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' } },
                                            el('span', null, tab.title || 'Tab ' + (i + 1)),
                                            tab.after_title_text ? el('span', { className: 'ktv-tab-after-title', style: { fontSize: tab.after_title_font_size || '11px', color: tab.after_title_color || '#666', fontWeight: 400 } }, tab.after_title_text) : null
                                        )
                                    );
                                })
                            ),
                            el('div', { style: { padding: '15px', background: atts.tabContentBgColor || (atts.darkMode ? '#222244' : '#f8f9fa'), borderRadius: atts.tabBorderRadius || '8px' } },
                                customTabs.length === 0 ? el('div', { style: { padding: '30px', textAlign: 'center', color: '#999' } }, 'Click "Add New Tab" in the inspector panel.') : null,
                                customTabs.map(function (tab, i) {
                                    if (i === activeTabIndex) {
                                        return el('div', { key: i, className: 'ktv-tab-pane active' },
                                            el('div', { dangerouslySetInnerHTML: { __html: tab.content || '<p>Add content here</p>' } }),
                                            atts.showDownloadTab !== false ? el('div', {
                                                className: 'ktv-tab-download-bar',
                                                style: { marginTop: '15px', paddingTop: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', flexWrap: 'wrap' }
                                            },
                                                atts.showDocxTab !== false ? el('button', { type: 'button', className: 'ktv-tab-download-btn ktv-tab-download-docx', style: { padding: '8px 14px', background: '#0073aa', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' } }, '📄 DOCX') : null,
                                                atts.showTxtTab !== false ? el('button', { type: 'button', className: 'ktv-tab-download-btn ktv-tab-download-txt', style: { padding: '8px 14px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' } }, '📄 TXT') : null,
                                                atts.showPrintTab !== false ? el('button', { type: 'button', className: 'ktv-tab-download-btn ktv-tab-print-btn', style: { padding: '8px 14px', background: '#075e54', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' } }, '🖨️ ' + (atts.printTabLabel || 'Print')) : null
                                            ) : null
                                        );
                                    }
                                    return null;
                                })
                            )
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           20. BLOCK — KTV CONTACT FORM
           ============================================================ */

        wp.blocks.registerBlockType('ktv/contact-form', {
            title: 'KTV Contact Form',
            description: 'Contact form with pre-added travel dates, custom sections with icons, width and styling, mandatory fields, honeypot + spam protection, and 9 editable field icons.',
            icon: 'email',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                formTitle: { type: 'string', default: 'Send us a Message' },
                formSubtitle: { type: 'string', default: 'We will reply within 24 hours' },
                btnText: { type: 'string', default: 'Send Message' },
                buttonColor: { type: 'string', default: '#075e54' },
                buttonTextColor: { type: 'string', default: '#ffffff' },
                borderColor: { type: 'string', default: '#e0e0e0' },
                borderSize: { type: 'string', default: '1px' },
                borderRadius: { type: 'string', default: '12px' },
                formWidth: { type: 'string', default: 'full' },
                arrivalLabel: { type: 'string', default: 'Arrival Date' },
                departureLabel: { type: 'string', default: 'Departure Date' },
                nameLabel: { type: 'string', default: 'Full Name' },
                emailLabel: { type: 'string', default: 'Email Address' },
                phoneLabel: { type: 'string', default: 'Phone Number' },
                countryLabel: { type: 'string', default: 'Country' },
                messageLabel: { type: 'string', default: 'Your Message' },
                formBgColor: { type: 'string', default: '#ffffff' },
                formTextColor: { type: 'string', default: '#333333' },
                formHeadingSize: { type: 'string', default: '24px' },
                formHeadingColor: { type: 'string', default: '#333333' },
                placeholderColor: { type: 'string', default: '#999999' },
                placeholderFontSize: { type: 'string', default: '14px' },
                placeholderFontWeight: { type: 'string', default: '400' },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                iconTitle: { type: 'string', default: 'fa-envelope-open-text' },
                iconTitleSize: { type: 'string', default: '24px' },
                iconTitleColor: { type: 'string', default: '#075e54' },
                defaultArrivalDate: { type: 'string', default: '' },
                defaultDepartureDate: { type: 'string', default: '' },
                travelDateColor: { type: 'string', default: '#333333' },
                travelDateFontSize: { type: 'string', default: '16px' },
                travelDateFontWeight: { type: 'string', default: '600' },
                travelDateBgColor: { type: 'string', default: '#f8f9fa' },
                customSections: { type: 'array', default: [] },
                enableHoneypot: { type: 'boolean', default: true },
                enableSpamFilter: { type: 'boolean', default: true },
                enableRateLimit: { type: 'boolean', default: true },
                honeypotFieldName: { type: 'string', default: 'ktv_hp_website' },
                mandatoryFields: {
                    type: 'object',
                    default: {
                        name: true,
                        email: true,
                        phone: true,
                        arrival_date: true,
                        departure_date: true,
                        message: true,
                        country: false
                    }
                },
                arrivalIcon: { type: 'string', default: 'fa-calendar-alt' },
                arrivalIconSize: { type: 'string', default: '16px' },
                arrivalIconColor: { type: 'string', default: '#075e54' },
                departureIcon: { type: 'string', default: 'fa-calendar-check' },
                departureIconSize: { type: 'string', default: '16px' },
                departureIconColor: { type: 'string', default: '#075e54' },
                nameIcon: { type: 'string', default: 'fa-user' },
                nameIconSize: { type: 'string', default: '16px' },
                nameIconColor: { type: 'string', default: '#075e54' },
                emailIcon: { type: 'string', default: 'fa-envelope' },
                emailIconSize: { type: 'string', default: '16px' },
                emailIconColor: { type: 'string', default: '#075e54' },
                phoneIcon: { type: 'string', default: 'fa-phone-alt' },
                phoneIconSize: { type: 'string', default: '16px' },
                phoneIconColor: { type: 'string', default: '#075e54' },
                flagIcon: { type: 'string', default: 'fa-flag' },
                flagIconSize: { type: 'string', default: '14px' },
                flagIconColor: { type: 'string', default: '#075e54' },
                countryIcon: { type: 'string', default: 'fa-globe' },
                countryIconSize: { type: 'string', default: '16px' },
                countryIconColor: { type: 'string', default: '#075e54' },
                messageIcon: { type: 'string', default: 'fa-comment-dots' },
                messageIconSize: { type: 'string', default: '16px' },
                messageIconColor: { type: 'string', default: '#075e54' },
                submitIcon: { type: 'string', default: 'fa-paper-plane' },
                submitIconSize: { type: 'string', default: '16px' },
                submitIconColor: { type: 'string', default: '#ffffff' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-contact-form' });
                var customSections = atts.customSections || [];
                var mandatory = atts.mandatoryFields || {};

                var widthClass = '';
                if (atts.formWidth === 'compact') widthClass = 'ktv-form-compact';
                else if (atts.formWidth === 'wide') widthClass = 'ktv-form-wide';
                else widthClass = 'ktv-form-full';

                var globalHoneypot = isEditorHoneypotEnabled();
                var globalSpam = isEditorSpamFilterEnabled();
                var globalRateLimit = isEditorRateLimitEnabled();
                var editorHoneypotField = getEditorHoneypotFieldName();

                var honeypotActive = atts.enableHoneypot !== false && globalHoneypot;
                var spamActive = atts.enableSpamFilter !== false && globalSpam;
                var rateLimitActive = atts.enableRateLimit !== false && globalRateLimit;

                function updateMandatory(key, value) {
                    var updated = Object.assign({}, mandatory);
                    updated[key] = value;
                    setAtts({ mandatoryFields: updated });
                }

                function addCustomSection() {
                    var updated = customSections.concat([{
                        key: 'field_' + Date.now(),
                        label: 'New Field',
                        icon: 'fa-star',
                        iconColor: '#075e54',
                        iconSize: '16px',
                        placeholder: '',
                        required: false,
                        fieldType: 'text',
                        enabled: true
                    }]);
                    setAtts({ customSections: updated });
                }

                function updateCustomSection(index, key, value) {
                    var updated = customSections.slice();
                    updated[index] = Object.assign({}, updated[index]);
                    updated[index][key] = value;
                    setAtts({ customSections: updated });
                }

                function deleteCustomSection(index) {
                    var updated = customSections.slice();
                    updated.splice(index, 1);
                    setAtts({ customSections: updated });
                }

                var contactFieldIcons = [
                    { fieldKey: 'arrivalIcon', fieldLabel: 'Arrival Date', defaultIcon: 'fa-calendar-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'departureIcon', fieldLabel: 'Departure Date', defaultIcon: 'fa-calendar-check', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'nameIcon', fieldLabel: 'Full Name', defaultIcon: 'fa-user', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'emailIcon', fieldLabel: 'Email', defaultIcon: 'fa-envelope', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'phoneIcon', fieldLabel: 'Phone', defaultIcon: 'fa-phone-alt', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'flagIcon', fieldLabel: 'Flag', defaultIcon: 'fa-flag', defaultSize: '14px', defaultColor: '#075e54' },
                    { fieldKey: 'countryIcon', fieldLabel: 'Country', defaultIcon: 'fa-globe', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'messageIcon', fieldLabel: 'Message', defaultIcon: 'fa-comment-dots', defaultSize: '16px', defaultColor: '#075e54' },
                    { fieldKey: 'submitIcon', fieldLabel: 'Submit Button', defaultIcon: 'fa-paper-plane', defaultSize: '16px', defaultColor: '#ffffff' }
                ];

                var editorHoneypotPreview = null;
                if (honeypotActive) {
                    editorHoneypotPreview = el('div', {
                        className: 'ktv-editor-honeypot-preview',
                        style: {
                            margin: '12px 0',
                            padding: '10px 14px',
                            background: '#fff8e1',
                            border: '2px dashed #ffc107',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '12px',
                            color: '#856404'
                        }
                    },
                        el('i', { className: 'fas fa-shield-alt', style: { fontSize: '16px', color: '#856404' } }),
                        el('div', null,
                            el('strong', { style: { display: 'block', marginBottom: '2px' } }, '🍯 Honeypot Field (hidden on frontend)'),
                            el('span', { style: { fontFamily: 'monospace', fontSize: '11px' } },
                                '<input name="' + editorHoneypotField + '" />'
                            )
                        )
                    );
                }

                var protectionBadge = null;
                if (honeypotActive || spamActive || rateLimitActive) {
                    var badges = [];
                    if (honeypotActive) badges.push('🍯 Honeypot');
                    if (spamActive) badges.push('🛡️ Spam');
                    if (rateLimitActive) badges.push('⏱️ Rate Limit');
                    protectionBadge = el('div', {
                        className: 'ktv-editor-protection-badge',
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            background: '#e8f5e9',
                            color: '#075e54',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            marginBottom: '10px'
                        }
                    },
                        el('i', { className: 'fas fa-shield-alt' }),
                        badges.join(' • ')
                    );
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '📝 Form Settings', initialOpen: true },
                            el(TextControl, { label: 'Form Title', value: atts.formTitle, onChange: function (v) { setAtts({ formTitle: v }); } }),
                            el(TextControl, { label: 'Subtitle', value: atts.formSubtitle, onChange: function (v) { setAtts({ formSubtitle: v }); } }),
                            el(TextControl, { label: 'Button Text', value: atts.btnText, onChange: function (v) { setAtts({ btnText: v }); } }),
                            el(SelectControl, { label: 'Form Width', value: atts.formWidth, options: formWidthOptions, onChange: function (v) { setAtts({ formWidth: v }); } }),
                            IconControl({ attributes: atts, setAttributes: setAtts, iconKey: 'iconTitle', sizeKey: 'iconTitleSize', colorKey: 'iconTitleColor', label: 'Title Icon' })
                        ),
                        el(PanelBody, { title: '🛡️ Honeypot & Spam Protection', initialOpen: false },
                            el('p', { style: { fontSize: '11px', color: '#666', marginBottom: '10px' } },
                                'Global: Honeypot ' + (globalHoneypot ? 'ON' : 'OFF') + ' • Spam Filter ' + (globalSpam ? 'ON' : 'OFF') + ' • Rate Limit ' + (globalRateLimit ? 'ON' : 'OFF') + '.'
                            ),
                            el(ToggleControl, {
                                label: 'Enable Honeypot Field on this form',
                                checked: atts.enableHoneypot !== false,
                                onChange: function (v) { setAtts({ enableHoneypot: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Enable Spam Keyword Filter',
                                checked: atts.enableSpamFilter !== false,
                                onChange: function (v) { setAtts({ enableSpamFilter: v }); }
                            }),
                            el(ToggleControl, {
                                label: 'Enable Rate Limiting (5 submissions / 15 min per IP)',
                                checked: atts.enableRateLimit !== false,
                                onChange: function (v) { setAtts({ enableRateLimit: v }); }
                            }),
                            atts.enableHoneypot !== false ? el(TextControl, {
                                label: 'Honeypot Field Name',
                                value: atts.honeypotFieldName || 'ktv_hp_website',
                                onChange: function (v) { setAtts({ honeypotFieldName: v.replace(/[^a-z0-9_]/gi, '_') }); }
                            }) : null
                        ),
                        el(PanelBody, { title: '✅ Mandatory Fields (*)', initialOpen: false },
                            el(ToggleControl, { label: 'Full Name', checked: mandatory.name !== false, onChange: function (v) { updateMandatory('name', v); } }),
                            el(ToggleControl, { label: 'Email', checked: mandatory.email !== false, onChange: function (v) { updateMandatory('email', v); } }),
                            el(ToggleControl, { label: 'Phone', checked: mandatory.phone !== false, onChange: function (v) { updateMandatory('phone', v); } }),
                            el(ToggleControl, { label: 'Arrival Date', checked: mandatory.arrival_date !== false, onChange: function (v) { updateMandatory('arrival_date', v); } }),
                            el(ToggleControl, { label: 'Departure Date', checked: mandatory.departure_date !== false, onChange: function (v) { updateMandatory('departure_date', v); } }),
                            el(ToggleControl, { label: 'Message', checked: mandatory.message !== false, onChange: function (v) { updateMandatory('message', v); } }),
                            el(ToggleControl, { label: 'Country', checked: mandatory.country === true, onChange: function (v) { updateMandatory('country', v); } })
                        ),
                        FieldIconGroup({ attributes: atts, setAttributes: setAtts, title: '🎯 Contact Form Field Icons (9)', initialOpen: false, fields: contactFieldIcons }),
                        el(PanelBody, { title: '📅 Pre-added Travel Dates', initialOpen: false },
                            el(TextControl, {
                                label: 'Default Arrival Date (YYYY-MM-DD)',
                                value: atts.defaultArrivalDate || '',
                                onChange: function (v) { setAtts({ defaultArrivalDate: v }); }
                            }),
                            el(TextControl, {
                                label: 'Default Departure Date (YYYY-MM-DD)',
                                value: atts.defaultDepartureDate || '',
                                onChange: function (v) { setAtts({ defaultDepartureDate: v }); }
                            }),
                            ColorControl('Travel Date Text Color', atts.travelDateColor || '#333333', function (v) { setAtts({ travelDateColor: v }); }),
                            el(SelectControl, { label: 'Travel Date Font Size', value: atts.travelDateFontSize || '16px', options: fontSizes, onChange: function (v) { setAtts({ travelDateFontSize: v }); } }),
                            el(SelectControl, { label: 'Travel Date Font Weight', value: atts.travelDateFontWeight || '600', options: fontWeightOptions, onChange: function (v) { setAtts({ travelDateFontWeight: v }); } }),
                            ColorControl('Travel Date Background', atts.travelDateBgColor || '#f8f9fa', function (v) { setAtts({ travelDateBgColor: v }); })
                        ),
                        el(PanelBody, { title: '📝 Field Labels', initialOpen: false },
                            el(TextControl, { label: 'Arrival Label', value: atts.arrivalLabel, onChange: function (v) { setAtts({ arrivalLabel: v }); } }),
                            el(TextControl, { label: 'Departure Label', value: atts.departureLabel, onChange: function (v) { setAtts({ departureLabel: v }); } }),
                            el(TextControl, { label: 'Name Label', value: atts.nameLabel, onChange: function (v) { setAtts({ nameLabel: v }); } }),
                            el(TextControl, { label: 'Email Label', value: atts.emailLabel, onChange: function (v) { setAtts({ emailLabel: v }); } }),
                            el(TextControl, { label: 'Phone Label', value: atts.phoneLabel, onChange: function (v) { setAtts({ phoneLabel: v }); } }),
                            el(TextControl, { label: 'Country Label', value: atts.countryLabel, onChange: function (v) { setAtts({ countryLabel: v }); } }),
                            el(TextControl, { label: 'Message Label', value: atts.messageLabel, onChange: function (v) { setAtts({ messageLabel: v }); } })
                        ),
                        PlaceholderControl({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '➕ Custom Sections', initialOpen: false },
                            el(Button, { onClick: addCustomSection, variant: 'primary', style: { width: '100%', marginBottom: '15px' } }, '+ Add Custom Section'),
                            customSections.map(function (section, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }
                                },
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                                        el('strong', null, 'Section #' + (idx + 1)),
                                        el(Button, { onClick: function () { deleteCustomSection(idx); }, variant: 'link', isDestructive: true }, 'Delete')
                                    ),
                                    el(ToggleControl, { label: 'Enabled', checked: section.enabled !== false, onChange: function (v) { updateCustomSection(idx, 'enabled', v); } }),
                                    el(TextControl, { label: 'Field Key', value: section.key, onChange: function (v) { updateCustomSection(idx, 'key', v.replace(/[^a-z0-9_]/gi, '_')); } }),
                                    el(TextControl, { label: 'Field Label', value: section.label, onChange: function (v) { updateCustomSection(idx, 'label', v); } }),
                                    el(SelectControl, {
                                        label: 'Field Type',
                                        value: section.fieldType || 'text',
                                        options: [
                                            { label: 'Text', value: 'text' },
                                            { label: 'Email', value: 'email' },
                                            { label: 'Phone', value: 'tel' },
                                            { label: 'Number', value: 'number' },
                                            { label: 'Textarea', value: 'textarea' }
                                        ],
                                        onChange: function (v) { updateCustomSection(idx, 'fieldType', v); }
                                    }),
                                    el(TextControl, { label: 'Placeholder', value: section.placeholder || '', onChange: function (v) { updateCustomSection(idx, 'placeholder', v); } }),
                                    el(SelectControl, { label: 'Icon', value: section.icon || 'fa-star', options: iconOptions, onChange: function (v) { updateCustomSection(idx, 'icon', v); } }),
                                    el(SelectControl, { label: 'Icon Size', value: section.iconSize || '16px', options: iconSizes, onChange: function (v) { updateCustomSection(idx, 'iconSize', v); } }),
                                    ColorControl('Icon Color', section.iconColor || '#075e54', function (v) { updateCustomSection(idx, 'iconColor', v); }),
                                    el(ToggleControl, { label: 'Required Field', checked: section.required === true, onChange: function (v) { updateCustomSection(idx, 'required', v); } })
                                );
                            })
                        ),
                        el(PanelBody, { title: '🎨 Form Styling', initialOpen: false },
                            ColorControl('Form Background', atts.formBgColor, function (v) { setAtts({ formBgColor: v }); }),
                            ColorControl('Form Text Color', atts.formTextColor, function (v) { setAtts({ formTextColor: v }); }),
                            el(SelectControl, { label: 'Heading Size', value: atts.formHeadingSize, options: fontSizes, onChange: function (v) { setAtts({ formHeadingSize: v }); } }),
                            ColorControl('Heading Color', atts.formHeadingColor, function (v) { setAtts({ formHeadingColor: v }); }),
                            ColorControl('Button Background', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                            ColorControl('Button Text Color', atts.buttonTextColor || '#ffffff', function (v) { setAtts({ buttonTextColor: v }); }),
                            ColorControl('Border Color', atts.borderColor, function (v) { setAtts({ borderColor: v }); }),
                            el(SelectControl, { label: 'Border Size', value: atts.borderSize, options: borderWidthOptions, onChange: function (v) { setAtts({ borderSize: v }); } }),
                            el(SelectControl, { label: 'Border Radius', value: atts.borderRadius, options: borderRadiusOptions, onChange: function (v) { setAtts({ borderRadius: v }); } })
                        )
                    ),
                    el('div', blockProps,
                        el('div', {
                            className: widthClass + (atts.darkMode ? ' ktv-dark-mode' : ''),
                            style: {
                                padding: '30px',
                                background: atts.formBgColor,
                                borderRadius: atts.borderRadius,
                                border: atts.borderSize !== '0px' ? atts.borderSize + ' solid ' + atts.borderColor : 'none'
                            }
                        },
                            protectionBadge,
                            el('h3', { style: { textAlign: 'center', marginBottom: '5px', fontSize: atts.formHeadingSize, color: atts.formHeadingColor } },
                                atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.iconTitle, style: { fontSize: atts.iconTitleSize, color: atts.iconTitleColor, marginRight: '10px' } }) : null,
                                ' ' + atts.formTitle
                            ),
                            el('p', { style: { textAlign: 'center', color: atts.formTextColor, marginBottom: '20px' } }, atts.formSubtitle),
                            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' } },
                                el('div', { style: { padding: '12px', background: atts.travelDateBgColor || '#f8f9fa', borderRadius: '8px', color: atts.travelDateColor || '#333', fontWeight: atts.travelDateFontWeight || '600', fontSize: atts.travelDateFontSize || '16px' } }, '📅 ', atts.arrivalLabel),
                                el('div', { style: { padding: '12px', background: atts.travelDateBgColor || '#f8f9fa', borderRadius: '8px', color: atts.travelDateColor || '#333', fontWeight: atts.travelDateFontWeight || '600', fontSize: atts.travelDateFontSize || '16px' } }, '📅 ', atts.departureLabel)
                            ),
                            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' } },
                                el('div', { style: { padding: '12px', background: '#f8f9fa', borderRadius: '8px', color: atts.formTextColor, fontWeight: '600' } }, '👤 ', atts.nameLabel),
                                el('div', { style: { padding: '12px', background: '#f8f9fa', borderRadius: '8px', color: atts.formTextColor, fontWeight: '600' } }, '📧 ', atts.emailLabel)
                            ),
                            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' } },
                                el('div', { style: { padding: '12px', background: '#f8f9fa', borderRadius: '8px', color: atts.formTextColor, fontWeight: '600' } }, '📞 ', atts.phoneLabel),
                                el('div', { style: { padding: '12px', background: '#f8f9fa', borderRadius: '8px', color: atts.formTextColor, fontWeight: '600' } }, '🌍 ', atts.countryLabel)
                            ),
                            customSections.filter(function (s) { return s.enabled !== false; }).map(function (section, idx) {
                                return el('div', {
                                    key: idx,
                                    style: { padding: '12px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '10px', color: atts.formTextColor, fontWeight: '600' }
                                },
                                    el('i', { className: 'fas ' + (section.icon || 'fa-star'), style: { color: section.iconColor || '#075e54', marginRight: '8px' } }),
                                    section.label || 'Custom Field'
                                );
                            }),
                            el('div', { style: { padding: '12px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', color: atts.formTextColor, fontWeight: '600' } }, '💬 ', atts.messageLabel),
                            editorHoneypotPreview,
                            el('button', {
                                style: { background: atts.buttonColor, color: atts.buttonTextColor || '#fff', width: '100%', padding: '14px', border: 'none', borderRadius: atts.borderRadius, fontSize: '16px', cursor: 'pointer' }
                            }, atts.btnText)
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           21. BLOCK — KTV IMAGE BADGE
           ============================================================ */

        wp.blocks.registerBlockType('ktv/image-badge', {
            title: 'KTV Image Badge',
            description: 'Image with badges, duration, position controls, wishlist, and CTA button with editable text, color, and position.',
            icon: 'format-image',
            category: 'ktv-travel',
            supports: { align: ['wide', 'full'], anchor: true, html: false },
            attributes: {
                imageId: { type: 'number', default: 0 },
                imageLink: { type: 'string', default: '' },
                imageDisplaySize: { type: 'string', default: 'medium' },
                leftBadge: { type: 'string', default: '' },
                leftBg: { type: 'string', default: '#075e54' },
                leftIcon: { type: 'string', default: 'fa-star' },
                rightBadge: { type: 'string', default: '' },
                rightBg: { type: 'string', default: '#ff5722' },
                rightIcon: { type: 'string', default: 'fa-clock' },
                badgeText: { type: 'string', default: '' },
                badgeColor: { type: 'string', default: '#ff5722' },
                badgeTextColor: { type: 'string', default: '#ffffff' },
                badgeStyle: { type: 'string', default: 'pill' },
                badgePosition: { type: 'string', default: 'top-left' },
                nights: { type: 'string', default: '' },
                days: { type: 'string', default: '' },
                nightsDaysIcon: { type: 'string', default: 'fa-moon' },
                nightsDaysIconColor: { type: 'string', default: '#FFD700' },
                nightsDaysIconSize: { type: 'string', default: '14px' },
                nightsDaysPosition: { type: 'string', default: 'bottom-left' },
                buttonText: { type: 'string', default: 'Book Now' },
                buttonUrl: { type: 'string', default: '#' },
                buttonColor: { type: 'string', default: '#ff5722' },
                bookNowTextColor: { type: 'string', default: '#ffffff' },
                enableBookNow: { type: 'boolean', default: true },
                bookNowPosition: { type: 'string', default: 'bottom-center' },
                showWishlist: { type: 'boolean', default: false },
                wishlistPosition: { type: 'string', default: 'top-right' },
                wishlistCount: { type: 'number', default: 0 },
                tourId: { type: 'number', default: 0 },
                tourName: { type: 'string', default: '' },
                enableIcon: { type: 'boolean', default: true },
                darkMode: { type: 'boolean', default: false },
                showBadge: { type: 'boolean', default: true },
                iconSize: { type: 'string', default: '14px' },
                iconColor: { type: 'string', default: '#075e54' }
            },
            edit: function (props) {
                var atts = props.attributes;
                var setAtts = props.setAttributes;
                var blockProps = useBlockProps({ className: 'ktv-editor-preview-image-badge' });
                var imgUrl = getImageUrl(atts.imageId, atts.imageDisplaySize);

                var wishlistPosStyles = {
                    'top-left': { top: '12px', left: '12px', right: 'auto', bottom: 'auto' },
                    'top-right': { top: '12px', right: '12px', left: 'auto', bottom: 'auto' },
                    'bottom-left': { bottom: '12px', left: '12px', top: 'auto', right: 'auto' },
                    'bottom-right': { bottom: '12px', right: '12px', top: 'auto', left: 'auto' }
                };
                var wPos = wishlistPosStyles[atts.wishlistPosition || 'top-right'] || wishlistPosStyles['top-right'];

                var wishlistPreviewHtml = null;
                if (atts.showWishlist === true) {
                    wishlistPreviewHtml = el('div', {
                        className: 'ktv-editor-wishlist-preview',
                        style: Object.assign({
                            position: 'absolute',
                            background: 'rgba(255,255,255,0.9)',
                            minWidth: '36px', height: '36px',
                            borderRadius: '25px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '5px', padding: '0 12px',
                            zIndex: '20', color: '#ff4757',
                            pointerEvents: 'none'
                        }, wPos),
                        title: 'Wishlist count comes from the database on the frontend.'
                    },
                        el('i', { className: 'far fa-heart' }),
                        el('span', { className: 'ktv-wishlist-count', style: { fontSize: '11px', fontWeight: '700', color: '#ff4757', background: 'rgba(255,71,87,0.1)', padding: '2px 6px', borderRadius: '10px' } }, normalizeWishlistCount(atts.wishlistCount || 0))
                    );
                }

                return el(Fragment, {},
                    el(InspectorControls, { key: 'inspector' },
                        BlockIconPanel({ attributes: atts, setAttributes: setAtts }),
                        el(PanelBody, { title: '🖼️ Image', initialOpen: true },
                            MediaUploadControl(
                                atts.imageId,
                                function (id) { setAtts({ imageId: id }); },
                                'Image',
                                atts.imageLink,
                                function (v) { setAtts({ imageLink: v }); },
                                atts.imageDisplaySize,
                                function (v) { setAtts({ imageDisplaySize: v }); }
                            )
                        ),
                        el(PanelBody, { title: '🏷️ Image Badges', initialOpen: false },
                            el(ToggleControl, { label: 'Show Badges', checked: atts.showBadge !== false, onChange: function (v) { setAtts({ showBadge: v }); } }),
                            el(TextControl, { label: 'Left Badge', value: atts.leftBadge, onChange: function (v) { setAtts({ leftBadge: v }); } }),
                            ColorControl('Left Badge Color', atts.leftBg, function (v) { setAtts({ leftBg: v }); }),
                            el(SelectControl, { label: 'Left Badge Icon', value: atts.leftIcon || 'fa-star', options: iconOptions, onChange: function (v) { setAtts({ leftIcon: v }); } }),
                            el(TextControl, { label: 'Right Badge', value: atts.rightBadge, onChange: function (v) { setAtts({ rightBadge: v }); } }),
                            ColorControl('Right Badge Color', atts.rightBg, function (v) { setAtts({ rightBg: v }); }),
                            el(SelectControl, { label: 'Right Badge Icon', value: atts.rightIcon || 'fa-clock', options: iconOptions, onChange: function (v) { setAtts({ rightIcon: v }); } })
                        ),
                        el(PanelBody, { title: '🎯 Main Badge (Editable)', initialOpen: false },
                            el(TextControl, { label: 'Badge Text', value: atts.badgeText || '', onChange: function (v) { setAtts({ badgeText: v }); } }),
                            ColorControl('Badge Background', atts.badgeColor || '#ff5722', function (v) { setAtts({ badgeColor: v }); }),
                            ColorControl('Badge Text Color', atts.badgeTextColor || '#ffffff', function (v) { setAtts({ badgeTextColor: v }); }),
                            el(SelectControl, { label: 'Badge Style', value: atts.badgeStyle || 'pill', options: badgeStyleOptions, onChange: function (v) { setAtts({ badgeStyle: v }); } }),
                            el(SelectControl, { label: 'Badge Position', value: atts.badgePosition || 'top-left', options: badgePositionOptions, onChange: function (v) { setAtts({ badgePosition: v }); } })
                        ),
                        el(PanelBody, { title: '📅 Nights / Days', initialOpen: false },
                            el(TextControl, { label: 'Nights', value: atts.nights, onChange: function (v) { setAtts({ nights: v }); } }),
                            el(TextControl, { label: 'Days', value: atts.days, onChange: function (v) { setAtts({ days: v }); } }),
                            el(SelectControl, { label: 'Nights/Days Icon', value: atts.nightsDaysIcon || 'fa-moon', options: nightDayIconOptions, onChange: function (v) { setAtts({ nightsDaysIcon: v }); } }),
                            ColorControl('Nights/Days Icon Color', atts.nightsDaysIconColor || '#FFD700', function (v) { setAtts({ nightsDaysIconColor: v }); }),
                            el(SelectControl, { label: 'Nights/Days Icon Size', value: atts.nightsDaysIconSize || '14px', options: iconSizes, onChange: function (v) { setAtts({ nightsDaysIconSize: v }); } }),
                            el(SelectControl, { label: 'Nights/Days Position', value: atts.nightsDaysPosition || 'bottom-left', options: nightsDaysPositionOptions, onChange: function (v) { setAtts({ nightsDaysPosition: v }); } })
                        ),
                        el(PanelBody, { title: '🔘 Book Now Button', initialOpen: false },
                            el(ToggleControl, { label: 'Enable Book Now Button', checked: atts.enableBookNow !== false, onChange: function (v) { setAtts({ enableBookNow: v }); } }),
                            atts.enableBookNow !== false ? el(Fragment, {},
                                el(TextControl, { label: 'Button Text', value: atts.buttonText, onChange: function (v) { setAtts({ buttonText: v }); } }),
                                el(TextControl, { label: 'Button URL', value: atts.buttonUrl, onChange: function (v) { setAtts({ buttonUrl: v }); } }),
                                ColorControl('Button Background', atts.buttonColor, function (v) { setAtts({ buttonColor: v }); }),
                                ColorControl('Button Text Color', atts.bookNowTextColor || '#ffffff', function (v) { setAtts({ bookNowTextColor: v }); }),
                                el(SelectControl, { label: 'Button Position', value: atts.bookNowPosition || 'bottom-center', options: bookNowPositionOptions, onChange: function (v) { setAtts({ bookNowPosition: v }); } })
                            ) : null
                        ),
                        el(PanelBody, { title: '❤️ Wishlist', initialOpen: false },
                            el(ToggleControl, { label: 'Show Wishlist Button', checked: atts.showWishlist === true, onChange: function (v) { setAtts({ showWishlist: v }); } }),
                            atts.showWishlist ? el(Fragment, {},
                                el(SelectControl, { label: 'Wishlist Position', value: atts.wishlistPosition || 'top-right', options: wishlistPositionOptions, onChange: function (v) { setAtts({ wishlistPosition: v }); } }),
                                el(TextControl, {
                                    label: 'Wishlist Preview Count',
                                    type: 'number',
                                    value: atts.wishlistCount || 0,
                                    onChange: function (v) { setAtts({ wishlistCount: normalizeWishlistCount(v) }); }
                                })
                            ) : null,
                            el(TextControl, { label: 'Tour ID (for wishlist)', value: atts.tourId, type: 'number', onChange: function (v) { setAtts({ tourId: parseInt(v) || 0 }); } }),
                            el(TextControl, { label: 'Tour Name (for wishlist)', value: atts.tourName, onChange: function (v) { setAtts({ tourName: v }); } })
                        )
                    ),
                    el('div', blockProps,
                        el('div', { className: atts.darkMode ? 'ktv-dark-mode' : '', style: { position: 'relative', minHeight: '250px', background: imgUrl ? '#e8f5e9' : '#f0f0f0', borderRadius: '12px', overflow: 'hidden' } },
                            imgUrl ? (
                                atts.imageLink && atts.imageLink !== '#' ?
                                    el('a', { href: atts.imageLink, target: '_blank', style: { display: 'block', width: '100%', height: '250px' } },
                                        el('img', { src: imgUrl, width: 400, height: 250, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '250px', objectFit: 'cover' } })
                                    ) :
                                    el('img', { src: imgUrl, width: 400, height: 250, loading: 'lazy', decoding: 'async', style: { width: '100%', height: '250px', objectFit: 'cover' } })
                            ) :
                                el('div', { style: { height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '📷 Select Image'),
                            (atts.showBadge !== false && atts.leftBadge) ? el('div', { className: 'ktv-tour-badge ktv-badge-left', style: { position: 'absolute', top: '15px', left: '15px', background: atts.leftBg, color: '#fff', padding: '6px 16px', borderRadius: '25px', fontSize: '12px' } },
                                atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.leftIcon }) : null,
                                ' ', atts.leftBadge
                            ) : null,
                            (atts.showBadge !== false && atts.rightBadge) ? el('div', { className: 'ktv-tour-badge ktv-badge-right', style: { position: 'absolute', top: '15px', right: '15px', background: atts.rightBg, color: '#fff', padding: '6px 16px', borderRadius: '25px', fontSize: '12px' } },
                                atts.enableIcon !== false ? el('i', { className: 'fas ' + atts.rightIcon }) : null,
                                ' ', atts.rightBadge
                            ) : null,
                            wishlistPreviewHtml,
                            (atts.nights || atts.days) ? el('div', { style: { position: 'absolute', bottom: '70px', left: '15px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' } },
                                el('i', { className: 'fas ' + (atts.nightsDaysIcon || 'fa-moon'), style: { color: atts.nightsDaysIconColor, fontSize: atts.nightsDaysIconSize, marginRight: '4px' } }),
                                ' ', atts.nights, 'N ☀️ ', atts.days, 'D'
                            ) : null,
                            (atts.enableBookNow !== false && atts.buttonText) ? (
                                atts.buttonUrl && atts.buttonUrl !== '#' ?
                                    el('a', {
                                        href: atts.buttonUrl,
                                        className: 'ktv-book-now-btn',
                                        title: atts.buttonText || 'Book Now',
                                        style: {
                                            position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)',
                                            background: atts.buttonColor, color: atts.bookNowTextColor || '#fff', padding: '10px 30px',
                                            borderRadius: '30px', fontSize: '14px', cursor: 'pointer',
                                            textDecoration: 'none', zIndex: '10'
                                        }
                                    }, atts.buttonText) :
                                    el('button', {
                                        className: 'ktv-book-now-btn',
                                        title: atts.buttonText || 'Book Now',
                                        style: {
                                            position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)',
                                            background: atts.buttonColor, color: atts.bookNowTextColor || '#fff', padding: '10px 30px',
                                            borderRadius: '30px', fontSize: '14px', cursor: 'pointer', zIndex: '10'
                                        }
                                    }, atts.buttonText)
                            ) : null
                        )
                    )
                );
            },
            save: function () { return null; }
        });

        /* ============================================================
           22. DARK MODE GLOBAL SYNC + BOOT LOG + VERSION GUARD
           ============================================================ */

        (function syncGlobalDarkMode() {
            if (typeof ktv_editor_data === 'undefined') return;
            var globalDark = ktv_editor_data.dark_mode_enabled === true;
            if (!globalDark) return;
            document.documentElement.setAttribute('data-ktv-editor-global-dark', '1');
        })();

        if (window.console && console.log) {
            console.log('KTV Blocks Editor v14.0.0 — 13 blocks registered. Synced with PHP 14.0.0, CSS 14.0.0, frontend JS 14.0.0. Per-block price display toggles, IP pricing toggle, button/badge color controls, sort filter UI.');
        }

        (function versionGuard() {
            var expected = '14.0.0';
            if (typeof ktv_editor_data !== 'undefined' && ktv_editor_data.version && ktv_editor_data.version !== expected) {
                if (window.console && console.warn) {
                    console.warn('KTV Blocks Editor: version mismatch. Editor expects ' + expected + ' but PHP localizes ' + ktv_editor_data.version + '. Please re-save theme files.');
                }
            }
        })();

    });

})();
/* ============================================================
   END OF FILE — assets/js/ktv-blocks-editor.js v14.0.0
   ============================================================ */