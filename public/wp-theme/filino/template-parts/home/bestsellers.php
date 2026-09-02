<?php
/**
 * ماژول پرفروش‌ترین‌ها — با WC_Product_Query بر اساس محبوبیت
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}

$filino_bestsellers = wc_get_products(
	array(
		'limit'   => 4,
		'orderby' => 'popularity', // = متای total_sales
		'order'   => 'DESC',
		'status'  => 'publish',
	)
);

if ( empty( $filino_bestsellers ) ) {
	return;
}
?>

<section class="fl-section" id="fl-bestsellers">
	<div class="fl-container">

		<header class="fl-section__head">
			<div>
				<p class="fl-kicker"><?php esc_html_e( 'انتخاب خریداران', 'filino' ); ?></p>
				<h2 class="fl-section__title"><?php esc_html_e( 'پرفروش‌ترین محصولات', 'filino' ); ?></h2>
			</div>
			<a class="fl-link-btn" href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>">
				<?php esc_html_e( 'همه‌ی محصولات', 'filino' ); ?> <span aria-hidden="true">←</span>
			</a>
		</header>

		<div class="fl-products-grid">
			<?php foreach ( $filino_bestsellers as $filino_product ) : ?>
				<article class="fl-product-card fl-cut">
					<a class="fl-product-card__media" href="<?php echo esc_url( $filino_product->get_permalink() ); ?>">
						<?php echo $filino_product->get_image( 'woocommerce_thumbnail' ); // phpcs:ignore ?>
						<?php
						/* بج تخفیف درصدی — همان تابع ماژول ووکامرس */
						echo filino_sale_flash(); // phpcs:ignore
						?>
					</a>
					<div class="fl-product-card__body">
						<h3 class="fl-product-card__title">
							<a href="<?php echo esc_url( $filino_product->get_permalink() ); ?>">
								<?php echo esc_html( $filino_product->get_name() ); ?>
							</a>
						</h3>
						<div class="fl-product-card__meta">
							<?php
							/* امتیاز و تعداد فروش از متای خود ووکامرس */
							echo wc_get_rating_html( $filino_product->get_average_rating() ); // phpcs:ignore
							?>
							<span class="fl-product-card__sales">
								<?php
								printf(
									/* translators: sales count */
									esc_html__( '+%s فروش', 'filino' ),
									esc_html( get_post_meta( $filino_product->get_id(), 'total_sales', true ) )
								);
								?>
							</span>
						</div>
						<div class="fl-product-card__footer">
							<span class="fl-price"><?php echo wp_kses_post( $filino_product->get_price_html() ); ?></span>
							<button class="fl-btn fl-btn--sm fl-cut" data-add-to-cart="<?php echo esc_attr( $filino_product->get_id() ); ?>">
								<?php esc_html_e( 'خرید', 'filino' ); ?>
							</button>
						</div>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
