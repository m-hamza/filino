<?php
/**
 * پانوشت قالب فایلینو
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;
?>
	</main><!-- #filino-content -->

	<footer class="fl-footer">
		<div class="fl-container fl-footer__grid">

			<?php /* ستون برند */ ?>
			<div class="fl-footer__brand">
				<a class="fl-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<span class="fl-logo__mark" aria-hidden="true"></span>
					<span class="fl-logo__text"><?php bloginfo( 'name' ); ?></span>
				</a>
				<p><?php esc_html_e( 'مارکت‌پلیس تخصصی محصولات دیجیتال وردپرس؛ قالب، افزونه و ابزار طراحی با فارسی‌سازی واقعی، آپدیت دائمی و پشتیبانی به زبان خودتان.', 'filino' ); ?></p>
				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<div class="fl-footer__social">
						<?php
						wp_nav_menu(
							array(
								'theme_location' => 'footer',
								'container'      => false,
								'menu_class'     => 'fl-social',
								'depth'          => 1,
							)
						);
						?>
					</div>
				<?php endif; ?>
			</div>

			<?php /* ستون‌های ابزارکی — ماژولار از پیشخوان > نمایش > ابزارک‌ها */ ?>
			<?php foreach ( array( 'footer-1', 'footer-2', 'footer-3' ) as $filino_sidebar ) : ?>
				<?php if ( is_active_sidebar( $filino_sidebar ) ) : ?>
					<div class="fl-footer__widget">
						<?php dynamic_sidebar( $filino_sidebar ); ?>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>

		<div class="fl-footer__bottom">
			<div class="fl-container fl-footer__bottom-inner">
				<p>
					<?php
					printf(
						/* translators: 1: year 2: site name */
						esc_html__( '© %1$s %2$s — تمامی حقوق محفوظ است.', 'filino' ),
						esc_html( date_i18n( 'Y' ) ),
						esc_html( get_bloginfo( 'name' ) )
					);
					?>
				</p>
				<p class="fl-footer__version">
					<?php esc_html_e( 'قالب ماژولار فایلینو', 'filino' ); ?>
					<code>v<?php echo esc_html( FILINO_VERSION ); ?></code>
				</p>
			</div>
		</div>
	</footer>
</div><!-- #filino-page -->

<?php /* کشوی سبد خرید — ماژول مستقل ووکامرس */ ?>
<?php if ( class_exists( 'WooCommerce' ) ) : ?>
	<div class="fl-cart-drawer" id="filino-cart-drawer" hidden>
		<div class="fl-cart-drawer__panel" role="dialog" aria-label="<?php esc_attr_e( 'سبد خرید', 'filino' ); ?>">
			<div class="fl-cart-drawer__head">
				<h3><?php esc_html_e( 'سبد خرید', 'filino' ); ?></h3>
				<button class="fl-icon-btn" data-close-drawer aria-label="<?php esc_attr_e( 'بستن', 'filino' ); ?>">×</button>
			</div>
			<div class="fl-cart-drawer__body widget_shopping_cart_content">
				<?php woocommerce_mini_cart(); ?>
			</div>
		</div>
	</div>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
