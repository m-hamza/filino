<?php
/**
 * ماژول ووکامرس فایلینو
 * شخصی‌سازی فروشگاه با هوک‌های رسمی — بدون بازنویسی هسته‌ی ووکامرس
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

/* ------------------------------------------------------------------
   ۱) حلقه‌ی محصولات — ۴ ستون و کارت سفارشی
   ------------------------------------------------------------------ */
function filino_loop_columns() {
	return 4;
}
add_filter( 'loop_shop_columns', 'filino_loop_columns' );

function filino_products_per_page() {
	return 12;
}
add_filter( 'loop_shop_per_page', 'filino_products_per_page', 20 );

/* بج تخفیف درصدی به‌جای متن پیش‌فرض «حراج» */
function filino_sale_flash() {
	global $product;
	if ( ! $product->is_on_sale() || ! $product->get_regular_price() ) {
		return '';
	}
	$percent = round( 100 - ( (float) $product->get_price() / (float) $product->get_regular_price() * 100 ) );
	return '<span class="fl-badge fl-badge--sale">' . sprintf( esc_html__( '٪%s تخفیف', 'filino' ), esc_html( $percent ) ) . '</span>';
}
add_filter( 'woocommerce_sale_flash', 'filino_sale_flash' );

/* برچسب دسته روی کارت محصول */
function filino_card_category_badge() {
	global $product;
	$cats = wc_get_product_category_list( $product->get_id(), ', ' );
	if ( $cats ) {
		echo '<span class="fl-badge fl-badge--cat">' . wp_kses_post( $cats ) . '</span>'; // phpcs:ignore
	}
}
add_action( 'woocommerce_before_shop_loop_item', 'filino_card_category_badge', 12 );

/* دکمه‌ی خرید با متن متناسب با محصول مجازی */
function filino_add_to_cart_text( $text, $product ) {
	if ( $product && ( $product->is_virtual() || $product->is_downloadable() ) ) {
		return __( 'خرید و دانلود فوری', 'filino' );
	}
	return $text;
}
add_filter( 'woocommerce_product_add_to_cart_text', 'filino_add_to_cart_text', 10, 2 );
add_filter( 'woocommerce_product_single_add_to_cart_text', 'filino_add_to_cart_text', 10, 2 );

/* ------------------------------------------------------------------
   ۲) سبد خرید — شمارنده‌ی زنده و کشو
   ------------------------------------------------------------------ */
function filino_cart_fragments( $fragments ) {
	$count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;

	ob_start();
	?>
	<span class="fl-cart-count"><?php echo esc_html( $count ); ?></span>
	<?php
	$fragments['span.fl-cart-count'] = ob_get_clean();

	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'filino_cart_fragments' );

/* ------------------------------------------------------------------
   ۳) صفحه‌ی پرداخت — بومی‌سازی برای ایران
   ------------------------------------------------------------------ */
function filino_checkout_fields( $fields ) {
	if ( isset( $fields['billing']['billing_company'] ) ) {
		$fields['billing']['billing_company']['required'] = false;
	}
	if ( isset( $fields['billing']['billing_postcode'] ) ) {
		$fields['billing']['billing_postcode']['required'] = false; // محصول مجازی = بدون پست
	}
	return $fields;
}
add_filter( 'woocommerce_checkout_fields', 'filino_checkout_fields' );

/* چون محصول دیجیتال است، آدرس حمل‌ونقل کلاً حذف شود */
add_filter( 'woocommerce_cart_needs_shipping', '__return_false' );

/* ------------------------------------------------------------------
   ۴) بعد از پرداخت — تحویل خودکار
   ------------------------------------------------------------------ */
function filino_payment_complete( $order_id ) {
	$order = wc_get_order( $order_id );
	if ( ! $order ) {
		return;
	}

	$has_virtual = false;
	foreach ( $order->get_items() as $item ) {
		$product = $item->get_product();
		if ( $product && ( $product->is_virtual() || $product->is_downloadable() ) ) {
			$has_virtual = true;

			/* تولید لایسنس — ماژول inc/licenses.php */
			if ( function_exists( 'filino_generate_license' ) ) {
				filino_generate_license( $order_id, $product->get_id(), $order->get_user_id() );
			}
		}
	}

	/* سفارش‌های کاملاً مجازی، بلافاصله «تکمیل شده» شوند تا لینک دانلود آزاد شود */
	if ( $has_virtual && 'processing' === $order->get_status() ) {
		$order->update_status( 'completed', __( 'تکمیل خودکار — محصول مجازی', 'filino' ) );
	}
}
add_action( 'woocommerce_payment_complete', 'filino_payment_complete' );

/* ------------------------------------------------------------------
   ۵) حساب کاربری — تب «لایسنس‌های من»
   ------------------------------------------------------------------ */
function filino_account_endpoints() {
	add_rewrite_endpoint( 'filino-licenses', EP_ROOT | EP_PAGES );
}
add_action( 'init', 'filino_account_endpoints' );

function filino_account_menu_items( $items ) {
	$items['filino-licenses'] = __( 'لایسنس‌های من', 'filino' );
	return $items;
}
add_filter( 'woocommerce_account_menu_items', 'filino_account_menu_items', 40 );

function filino_account_licenses_content() {
	echo '<div class="fl-licenses">';
	if ( function_exists( 'filino_render_user_licenses' ) ) {
		filino_render_user_licenses( get_current_user_id() );
	}
	echo '</div>';
}
add_action( 'woocommerce_account_filino-licenses_endpoint', 'filino_account_licenses_content' );

/* ------------------------------------------------------------------
   ۶) سرعت — خروجی سبک‌تر ووکامرس
   ------------------------------------------------------------------ */
function filino_disable_wc_styles( $enqueue ) {
	/* استایل‌های عمومی ووکامرس را نگه می‌داریم اما فونت‌هایش را غیرفعال می‌کنیم */
	return $enqueue;
}
add_filter( 'woocommerce_enqueue_styles', 'filino_disable_wc_styles' );

/* حذف هوک‌های سنگین و غیرضروری در صفحه محصول */
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 ); // سایدبار خودمان در woocommerce.php
