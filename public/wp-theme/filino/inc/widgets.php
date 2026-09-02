<?php
/**
 * ماژول ابزارک‌ها — نواحی سایدبار و فوتر
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

function filino_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'سایدبار فروشگاه', 'filino' ),
			'id'            => 'shop-sidebar',
			'description'   => __( 'فیلترها و ابزارک‌های سمت فروشگاه', 'filino' ),
			'before_widget' => '<div id="%1$s" class="fl-widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="fl-widget__title">',
			'after_title'   => '</h4>',
		)
	);

	foreach ( array( 1, 2, 3 ) as $i ) {
		register_sidebar(
			array(
				/* translators: footer column number */
				'name'          => sprintf( __( 'فوتر — ستون %s', 'filino' ), $i ),
				'id'            => 'footer-' . $i,
				'before_widget' => '<div id="%1$s" class="fl-widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h4 class="fl-widget__title">',
				'after_title'   => '</h4>',
			)
		);
	}
}
add_action( 'widgets_init', 'filino_widgets_init' );

/**
 * منوی پیش‌فرض وقتی منویی تنظیم نشده — تا سایت خالی نماند
 */
function filino_default_menu() {
	echo '<ul id="menu-default" class="fl-nav">';
	wp_list_pages( array( 'title_li' => '', 'depth' => 1 ) );
	echo '</ul>';
}
