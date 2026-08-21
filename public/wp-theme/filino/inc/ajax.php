<?php
/**
 * ماژول ایجکس — افزودن به سبد بدون رفرش و دانلود امن فایل
 *
 * همه‌ی هندلرها با نونس محافظت شده‌اند و دسترسی دانلود فقط
 * برای خریدارانی است که سفارش تکمیل‌شده دارند.
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

/* ------------------------------------------------------------------
   ۱) افزودن به سبد خرید بدون رفرش صفحه
   ------------------------------------------------------------------ */
function filino_ajax_add_to_cart() {
	check_ajax_referer( 'filino_nonce', 'nonce' );

	$product_id = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
	$qty        = isset( $_POST['qty'] ) ? max( 1, absint( $_POST['qty'] ) ) : 1;

	if ( ! $product_id ) {
		wp_send_json_error( array( 'message' => __( 'محصول نامعتبر است.', 'filino' ) ) );
	}

	$added = WC()->cart->add_to_cart( $product_id, $qty );

	if ( $added ) {
		wp_send_json_success(
			array(
				'message'    => __( 'به سبد خرید اضافه شد', 'filino' ),
				'cart_count' => WC()->cart->get_cart_contents_count(),
				'cart_url'   => wc_get_cart_url(),
			)
		);
	}

	wp_send_json_error( array( 'message' => __( 'افزودن به سبد ناموفق بود.', 'filino' ) ) );
}
add_action( 'wp_ajax_filino_add_to_cart', 'filino_ajax_add_to_cart' );
add_action( 'wp_ajax_nopriv_filino_add_to_cart', 'filino_ajax_add_to_cart' );

/* ------------------------------------------------------------------
   ۲) دانلود امن — فقط خریداران دارای سفارش تکمیل‌شده
   ------------------------------------------------------------------ */
function filino_secure_download() {
	if ( ! is_user_logged_in() || empty( $_GET['filino_download'] ) ) { // phpcs:ignore
		return;
	}

	$product_id = absint( $_GET['filino_download'] ); // phpcs:ignore
	$user_id    = get_current_user_id();

	/* آیا کاربر واقعاً این محصول را خریده است؟ */
	$orders = wc_get_orders(
		array(
			'customer_id' => $user_id,
			'status'      => array( 'wc-completed' ),
			'limit'       => -1,
		)
	);

	$purchased = false;
	foreach ( $orders as $order ) {
		foreach ( $order->get_items() as $item ) {
			if ( (int) $item->get_product_id() === $product_id ) {
				$purchased = true;
				break 2;
			}
		}
	}

	if ( ! $purchased ) {
		wp_die( esc_html__( 'شما این محصول را خریداری نکرده‌اید.', 'filino' ) );
	}

	/* کنترل سقف دانلود */
	if ( ! filino_track_download( $user_id, $product_id ) ) {
		wp_die( esc_html__( 'سقف ۱۰ دانلود این محصول به پایان رسیده است. لطفاً تیکت بزنید.', 'filino' ) );
	}

	/* ارسال فایل */
	$product = wc_get_product( $product_id );
	$files   = $product ? $product->get_downloads() : array();

	if ( empty( $files ) ) {
		wp_die( esc_html__( 'فایلی برای این محصول تعریف نشده است.', 'filino' ) );
	}

	$first = reset( $files );
	nocache_headers();
	wp_redirect( $first->get_file() ); // phpcs:ignore
	exit;
}
add_action( 'init', 'filino_secure_download' );

/* ------------------------------------------------------------------
   ۳) ثبت تیکت از فرانت‌اند (پنل کاربری)
   ------------------------------------------------------------------ */
function filino_ajax_submit_ticket() {
	check_ajax_referer( 'filino_nonce', 'nonce' );

	if ( ! is_user_logged_in() ) {
		wp_send_json_error( array( 'message' => __( 'ابتدا وارد حساب شوید.', 'filino' ) ) );
	}

	$subject = isset( $_POST['subject'] ) ? sanitize_text_field( wp_unslash( $_POST['subject'] ) ) : '';
	$body    = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	if ( mb_strlen( $subject ) < 8 || mb_strlen( $body ) < 20 ) {
		wp_send_json_error( array( 'message' => __( 'موضوع و شرح تیکت کوتاه است.', 'filino' ) ) );
	}

	$ticket_id = wp_insert_post(
		array(
			'post_type'    => 'filino_ticket',
			'post_title'   => $subject,
			'post_content' => $body,
			'post_status'  => 'fl-open',
			'post_author'  => get_current_user_id(),
		)
	);

	if ( is_wp_error( $ticket_id ) ) {
		wp_send_json_error( array( 'message' => __( 'ثبت تیکت ناموفق بود.', 'filino' ) ) );
	}

	wp_send_json_success(
		array(
			'message'   => __( 'تیکت شما ثبت شد؛ کد پیگیری:', 'filino' ),
			'ticket_id' => $ticket_id,
		)
	);
}
add_action( 'wp_ajax_filino_submit_ticket', 'filino_ajax_submit_ticket' );
