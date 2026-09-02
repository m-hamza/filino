<?php
/**
 * ماژول لایسنس و تحویل خودکار فایل
 *
 * بعد از هر پرداخت موفق، برای هر محصول مجازی یک کلید لایسنس یکتا
 * ساخته و به سفارش گره می‌خورد. دانلودها محدود و لاگ می‌شوند.
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

/**
 * تولید لایسنس برای یک قلم سفارش
 */
function filino_generate_license( $order_id, $product_id, $user_id ) {
	$existing = get_post_meta( $order_id, '_filino_license_' . $product_id, true );
	if ( $existing ) {
		return $existing; // از تولید تکراری جلوگیری می‌شود
	}

	$key = 'FL-' . strtoupper( substr( md5( $order_id . '|' . $product_id . '|' . wp_generate_password( 12, false ) ), 0, 4 ) )
		. '-' . strtoupper( wp_generate_password( 4, false ) )
		. '-' . strtoupper( wp_generate_password( 4, false ) );

	update_post_meta( $order_id, '_filino_license_' . $product_id, $key );
	update_post_meta( $order_id, '_filino_license_max_downloads', 10 );

	if ( $user_id ) {
		$user_licenses   = get_user_meta( $user_id, '_filino_licenses', true );
		$user_licenses   = is_array( $user_licenses ) ? $user_licenses : array();
		$user_licenses[] = array(
			'key'        => $key,
			'order_id'   => $order_id,
			'product_id' => $product_id,
			'created'    => time(),
			'expires'    => strtotime( '+6 months' ),
		);
		update_user_meta( $user_id, '_filino_licenses', $user_licenses );
	}

	do_action( 'filino_license_created', $key, $order_id, $product_id, $user_id );

	return $key;
}

/**
 * اعتبارسنجی لایسنس
 */
function filino_validate_license( $key ) {
	$orders = wc_get_orders(
		array(
			'limit'       => 1,
			'meta_key'    => '_filino_license_key', // phpcs:ignore
			'meta_value'  => sanitize_text_field( $key ), // phpcs:ignore
			'status'      => array( 'wc-completed' ),
		)
	);
	return ! empty( $orders ) ? $orders[0] : false;
}

/**
 * ثبت و کنترل محدودیت دانلود
 */
function filino_track_download( $user_id, $product_id ) {
	$used = (int) get_user_meta( $user_id, '_filino_dl_' . $product_id, true );
	if ( $used >= 10 ) {
		return false;
	}
	update_user_meta( $user_id, '_filino_dl_' . $product_id, $used + 1 );
	return true;
}

/**
 * نمایش لایسنس‌های کاربر در تب حساب کاربری
 */
function filino_render_user_licenses( $user_id ) {
	$licenses = get_user_meta( $user_id, '_filino_licenses', true );

	if ( empty( $licenses ) ) {
		echo '<p class="fl-empty">' . esc_html__( 'هنوز لایسنسی خریداری نکرده‌اید.', 'filino' ) . '</p>';
		return;
	}

	echo '<ul class="fl-license-list">';
	foreach ( $licenses as $license ) {
		$product = wc_get_product( $license['product_id'] );
		if ( ! $product ) {
			continue;
		}
		$downloads_left = 10 - (int) get_user_meta( $user_id, '_filino_dl_' . $license['product_id'], true );
		?>
		<li class="fl-license-item">
			<?php echo $product->get_image( 'woocommerce_thumbnail' ); // phpcs:ignore ?>
			<div class="fl-license-item__info">
				<strong><?php echo esc_html( $product->get_name() ); ?></strong>
				<code dir="ltr"><?php echo esc_html( $license['key'] ); ?></code>
				<small>
					<?php
					printf(
						/* translators: 1: downloads left 2: expiry date */
						esc_html__( '%1$s دانلود باقی‌مانده • انقضا: %2$s', 'filino' ),
						esc_html( max( 0, $downloads_left ) ),
						esc_html( date_i18n( get_option( 'date_format' ), $license['expires'] ) )
					);
					?>
				</small>
			</div>
			<a class="fl-btn fl-btn--sm fl-cut" href="<?php echo esc_url( add_query_arg( 'filino_download', $license['product_id'], wc_get_account_endpoint_url( 'downloads' ) ) ); ?>">
				<?php esc_html_e( 'دانلود فایل', 'filino' ); ?>
			</a>
		</li>
		<?php
	}
	echo '</ul>';
}
