<?php
/**
 * سربرگ قالب فایلینو
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#filino-content"><?php esc_html_e( 'پرش به محتوا', 'filino' ); ?></a>

<div id="filino-page" class="fl-site">

	<?php /* ---------- نوار بالایی ---------- */ ?>
	<div class="fl-topbar">
		<div class="fl-container fl-topbar__inner">
			<span class="fl-topbar__support">
				<?php esc_html_e( 'پشتیبانی ۷ روز هفته — پاسخ زیر ۲ ساعت', 'filino' ); ?>
			</span>
			<span class="fl-topbar__meta">
				<?php esc_html_e( 'گارانتی ۷ روزه‌ی بازگشت وجه', 'filino' ); ?>
				<em><?php esc_html_e( 'کد تخفیف خوش‌آمدگویی: OFF20', 'filino' ); ?></em>
			</span>
		</div>
	</div>

	<?php /* ---------- هدر چسبان ---------- */ ?>
	<header id="filino-header" class="fl-header" data-sticky>
		<div class="fl-container fl-header__inner">

			<div class="fl-header__brand">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<a class="fl-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<span class="fl-logo__mark" aria-hidden="true"></span>
						<span class="fl-logo__text"><?php bloginfo( 'name' ); ?></span>
					</a>
				<?php endif; ?>
			</div>

			<nav class="fl-header__nav" aria-label="<?php esc_attr_e( 'منوی اصلی', 'filino' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'menu_class'     => 'fl-nav',
						'fallback_cb'    => 'filino_default_menu',
						'depth'          => 2,
					)
				);
				?>
			</nav>

			<div class="fl-header__actions">

				<?php /* جستجو */ ?>
				<button class="fl-icon-btn" data-toggle-search aria-label="<?php esc_attr_e( 'جستجو', 'filino' ); ?>">
					<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
				</button>

				<?php /* سبد خرید — با شمارنده‌ی زنده از Cart Fragments ووکامرس */ ?>
				<?php if ( class_exists( 'WooCommerce' ) ) : ?>
					<a class="fl-icon-btn fl-cart-toggle" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="<?php esc_attr_e( 'سبد خرید', 'filino' ); ?>">
						<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.6 11.4a1.5 1.5 0 0 0 1.5 1.1h7.9a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6"/></svg>
						<span class="fl-cart-count"><?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?></span>
					</a>
				<?php endif; ?>

				<?php /* حساب کاربری */ ?>
				<?php if ( is_user_logged_in() ) : ?>
					<a class="fl-btn fl-btn--sm" href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>">
						<?php esc_html_e( 'پنل کاربری', 'filino' ); ?>
					</a>
				<?php else : ?>
					<a class="fl-btn fl-btn--sm fl-cut" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>">
						<?php esc_html_e( 'ورود | ثبت‌نام', 'filino' ); ?>
					</a>
				<?php endif; ?>

				<button class="fl-icon-btn fl-burger" data-toggle-menu aria-label="<?php esc_attr_e( 'منو', 'filino' ); ?>" aria-expanded="false">
					<span></span><span></span><span></span>
				</button>
			</div>
		</div>

		<?php /* کشوی جستجو */ ?>
		<div class="fl-search-panel" hidden>
			<div class="fl-container">
				<?php echo get_search_form( array( 'echo' => false ) ); ?>
			</div>
		</div>
	</header>

	<?php /* منوی موبایل */ ?>
	<div class="fl-mobile-menu" id="filino-mobile-menu" hidden>
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'fl-nav fl-nav--mobile',
				'fallback_cb'    => 'filino_default_menu',
			)
		);
		?>
	</div>

	<main id="filino-content" class="fl-site__content">
