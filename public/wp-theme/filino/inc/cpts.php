<?php
/**
 * ماژول پست‌تایپ‌های اختصاصی فایلینو
 *
 * هر نوع محتوا، پست‌تایپ مستقل با فیلدها و REST API خودش را دارد
 * تا پنل کاربری و فرانت‌اند ماژولار بمانند.
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

function filino_register_post_types() {

	/* ---------- تیکت پشتیبانی ---------- */
	register_post_type(
		'filino_ticket',
		array(
			'labels'       => array(
				'name'          => __( 'تیکت‌ها', 'filino' ),
				'singular_name' => __( 'تیکت', 'filino' ),
				'add_new_item'  => __( 'پاسخ به تیکت', 'filino' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => 'filino-panel',
			'supports'     => array( 'title', 'editor', 'comments', 'custom-fields' ),
			'capability_type' => 'post',
		)
	);

	/* ---------- لایسنس‌ها (برای گزارش‌گیری و جستجوی سریع) ---------- */
	register_post_type(
		'filino_license',
		array(
			'labels'       => array(
				'name'          => __( 'لایسنس‌ها', 'filino' ),
				'singular_name' => __( 'لایسنس', 'filino' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => 'filino-panel',
			'supports'     => array( 'title', 'custom-fields' ),
		)
	);

	/* ---------- سوالات متداول با REST برای صفحه‌ی FAQ ---------- */
	register_post_type(
		'filino_faq',
		array(
			'labels'       => array(
				'name'          => __( 'سوالات متداول', 'filino' ),
				'singular_name' => __( 'سوال', 'filino' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => 'filino-panel',
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor' ),
		)
	);
}
add_action( 'init', 'filino_register_post_types' );

/* وضعیت‌های سفارشی تیکت */
function filino_ticket_statuses() {
	register_post_status( 'fl-open', array( 'label' => __( 'باز', 'filino' ), 'post_type' => 'filino_ticket' ) );
	register_post_status( 'fl-answered', array( 'label' => __( 'پاسخ داده شده', 'filino' ), 'post_type' => 'filino_ticket' ) );
	register_post_status( 'fl-closed', array( 'label' => __( 'بسته شده', 'filino' ), 'post_type' => 'filino_ticket' ) );
}
add_action( 'init', 'filino_ticket_statuses' );

/* ---------- منوی مدیریت «فایلینو» ---------- */
function filino_admin_menu() {
	add_menu_page(
		__( 'فایلینو', 'filino' ),
		__( 'فایلینو', 'filino' ),
		'manage_woocommerce',
		'filino-panel',
		'filino_render_dashboard_page',
		'dashicons-store',
		26
	);
}
add_action( 'admin_menu', 'filino_admin_menu' );

function filino_render_dashboard_page() {
	$sales = function_exists( 'wc_get_orders' ) ? count( wc_get_orders( array( 'limit' => -1, 'return' => 'ids' ) ) ) : 0;
	echo '<div class="wrap"><h1>' . esc_html__( 'پیشخوان فایلینو', 'filino' ) . '</h1>';
	echo '<p>' . sprintf( esc_html__( 'تعداد کل سفارش‌ها: %s', 'filino' ), '<strong>' . esc_html( $sales ) . '</strong>' ) . '</p>';
	echo '</div>';
}
