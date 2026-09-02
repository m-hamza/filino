<?php
/**
 * فایلینو — هسته‌ی قالب
 *
 * معماری ماژولار: این فایل فقط «بارگذار» است.
 * هر قابلیت در یک ماژول مستقل زیر inc/ توسعه یافته تا فقط کدِ لازم اجرا شود.
 *
 * @package Filino
 * @version 2.4.0
 */

defined( 'ABSPATH' ) || exit;

define( 'FILINO_VERSION', '2.4.0' );
define( 'FILINO_DIR', get_template_directory() );
define( 'FILINO_URI', get_template_directory_uri() );

/* ------------------------------------------------------------------
   ۱) راه‌اندازی قالب
   ------------------------------------------------------------------ */
function filino_setup() {
	load_theme_textdomain( 'filino', FILINO_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array( 'height' => 48, 'width' => 48, 'flex-width' => true ) );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );

	/* ووکامرس — پشتیبانی کامل + گالری محصول */
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	register_nav_menus(
		array(
			'primary' => __( 'منوی اصلی', 'filino' ),
			'footer'  => __( 'منوی فوتر', 'filino' ),
			'account' => __( 'منوی حساب کاربری', 'filino' ),
		)
	);
}
add_action( 'after_setup_theme', 'filino_setup' );

/* ------------------------------------------------------------------
   ۲) بارگذاری فایل‌ها و اسکریپت‌ها
   ------------------------------------------------------------------ */
function filino_assets() {
	/* فونت‌های فارسی: وزیرمتن (متن) + لاله‌زار (تیتر) */
	wp_enqueue_style( 'filino-fonts', 'https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@300;400;500;700;800;900&display=swap', array(), null );

	/* استایل اصلی قالب (بعد از style.css خود قالب) */
	wp_enqueue_style( 'filino-main', FILINO_URI . '/assets/theme.css', array(), FILINO_VERSION );
	wp_style_add_data( 'filino-main', 'rtl', 'replace' );

	/* اسکریپت تعاملی قالب — با تأخیر برای سرعت */
	wp_enqueue_script( 'filino-theme', FILINO_URI . '/assets/theme.js', array(), FILINO_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );

	/* داده‌های موردنیاز جاوااسکریپت (نونس‌ها و آدرس‌ها) */
	wp_localize_script(
		'filino-theme',
		'filinoData',
		array(
			'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
			'nonce'       => wp_create_nonce( 'filino_nonce' ),
			'cartUrl'     => wc_get_cart_url(),
			'isRtl'       => is_rtl(),
			'i18n'        => array(
				'addedToCart' => __( 'به سبد خرید اضافه شد', 'filino' ),
				'processing'  => __( 'در حال پردازش…', 'filino' ),
			),
		)
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'filino_assets' );

/* ------------------------------------------------------------------
   ۳) بارگذاری ماژول‌ها — هر فایل یک قابلیت مستقل
   ------------------------------------------------------------------ */
$filino_modules = array(
	'inc/woocommerce.php',  // هوک‌ها و شخصی‌سازی فروشگاه ووکامرس
	'inc/licenses.php',     // سیستم لایسنس و تحویل خودکار فایل
	'inc/cpts.php',         // پست‌تایپ‌های اختصاصی (تیکت، لایسنس، FAQ)
	'inc/ajax.php',         // هندلرهای ایجکس (سبد، دانلود)
	'inc/widgets.php',      // ابزارک‌ها و ناحیه‌های سایدبار
);

foreach ( $filino_modules as $filino_module ) {
	if ( file_exists( FILINO_DIR . '/' . $filino_module ) ) {
		require_once FILINO_DIR . '/' . $filino_module;
	}
}
unset( $filino_modules, $filino_module );

/* ------------------------------------------------------------------
   ۴) بهینه‌سازی سرعت — حذف موارد غیرضروری از <head>
   ------------------------------------------------------------------ */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );

/* بارگذاری شرطی اسکریپت ووکامرس فقط در صفحات فروشگاهی */
function filino_wc_script_optimization() {
	if ( ! is_woocommerce() && ! is_cart() && ! is_checkout() && ! is_account_page() ) {
		wp_dequeue_style( 'wc-blocks-style' );
	}
}
add_action( 'wp_enqueue_scripts', 'filino_wc_script_optimization', 99 );

/* ------------------------------------------------------------------
   ۵) موارد عمومی
   ------------------------------------------------------------------ */
function filino_excerpt_length() {
	return 26;
}
add_filter( 'excerpt_length', 'filino_excerpt_length' );

function filino_excerpt_more() {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'filino_excerpt_more' );

/* کلاس‌های بدنه برای استایل‌دهی شرطی ماژول‌ها */
function filino_body_classes( $classes ) {
	if ( class_exists( 'WooCommerce' ) ) {
		$classes[] = is_shop() ? 'filino-shop' : '';
		$classes[] = is_product() ? 'filino-single-product' : '';
	}
	return array_filter( $classes );
}
add_filter( 'body_class', 'filino_body_classes' );
