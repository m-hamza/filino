<?php
/**
 * ماژول افتتاحیه‌ی صفحه اصلی — محصول ویژه + فید فروش زنده
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}

/* محصول ویژه؛ اگر نبود، جدیدترین محصول */
$filino_featured = wc_get_products( array( 'limit' => 1, 'featured' => true, 'status' => 'publish' ) );
if ( empty( $filino_featured ) ) {
	$filino_featured = wc_get_products( array( 'limit' => 1, 'orderby' => 'date', 'order' => 'DESC', 'status' => 'publish' ) );
}
$filino_hero_product = ! empty( $filino_featured ) ? $filino_featured[0] : null;

/* ۵ خرید اخیر برای فید زنده */
$filino_recent_orders = wc_get_orders(
	array(
		'limit'   => 5,
		'status'  => array( 'wc-completed' ),
		'orderby' => 'date',
		'order'   => 'DESC',
	)
);
?>

<section class="fl-hero">
	<div class="fl-hero__bg fl-hero__bg--grid" aria-hidden="true"></div>

	<div class="fl-container fl-hero__inner">

		<?php /* ستون متن */ ?>
		<div class="fl-hero__copy">
			<p class="fl-pill"><?php esc_html_e( 'مارکت‌پلیس تخصصی وردپرس فارسی', 'filino' ); ?></p>

			<h1 class="fl-hero__title">
				<?php esc_html_e( 'فروشگاه فایلِ خودت را', 'filino' ); ?>
				<br />
				<?php esc_html_e( 'با بهترین‌ها بساز', 'filino' ); ?>
			</h1>

			<p class="fl-hero__lead">
				<?php esc_html_e( 'قالب، افزونه و ابزار طراحیِ راست‌چین و اورجینال — با فارسی‌سازی واقعی، آپدیت دائمی و تحویل آنی. هر آنچه یک فروشگاه دیجیتال حرفه‌ای لازم دارد، یک‌جا.', 'filino' ); ?>
			</p>

			<div class="fl-hero__cta">
				<a class="fl-btn fl-cut" href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>">
					<?php esc_html_e( 'مشاهده فروشگاه', 'filino' ); ?>
					<span aria-hidden="true">←</span>
				</a>
				<a class="fl-btn fl-btn--ghost" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ); ?>">
					<?php esc_html_e( 'مقالات آموزشی', 'filino' ); ?>
				</a>
			</div>
		</div>

		<?php /* ستون کالای صحنه */ ?>
		<?php if ( $filino_hero_product ) : ?>
			<div class="fl-hero__stage">
				<a class="fl-product-spotlight fl-cut" href="<?php echo esc_url( $filino_hero_product->get_permalink() ); ?>">
					<?php echo $filino_hero_product->get_image( 'large' ); // phpcs:ignore ?>
					<div class="fl-product-spotlight__body">
						<h3><?php echo esc_html( $filino_hero_product->get_name() ); ?></h3>
						<div class="fl-product-spotlight__row">
							<span class="fl-price"><?php echo wp_kses_post( $filino_hero_product->get_price_html() ); ?></span>
							<span class="fl-btn fl-btn--sm fl-cut" data-add-to-cart="<?php echo esc_attr( $filino_hero_product->get_id() ); ?>">
								<?php esc_html_e( 'افزودن به سبد', 'filino' ); ?>
							</span>
						</div>
					</div>
				</a>
			</div>
		<?php endif; ?>
	</div>

	<?php /* فید فروش زنده */ ?>
	<?php if ( ! empty( $filino_recent_orders ) ) : ?>
		<div class="fl-container">
			<div class="fl-sales-ticker" data-ticker>
				<span class="fl-sales-ticker__dot" aria-hidden="true"></span>
				<div class="fl-sales-ticker__viewport">
					<?php foreach ( $filino_recent_orders as $filino_order ) : ?>
						<?php
						$filino_first_name = $filino_order->get_billing_first_name();
						$filino_city       = $filino_order->get_billing_city();
						$filino_names      = array();
						foreach ( $filino_order->get_items() as $filino_item ) {
							$filino_names[] = $filino_item->get_name();
						}
						?>
						<p class="fl-sales-ticker__item">
							<b><?php echo esc_html( $filino_first_name ? mb_substr( $filino_first_name, 0, 1 ) . '***' : __( 'یک خریدار', 'filino' ) ); ?></b>
							<?php esc_html_e( 'از', 'filino' ); ?> <?php echo esc_html( $filino_city ? $filino_city : __( 'ایران', 'filino' ) ); ?>
							<?php esc_html_e( 'همین حالا', 'filino' ); ?>
							<b class="fl-sales-ticker__product"><?php echo esc_html( implode( '، ', $filino_names ) ); ?></b>
							<?php esc_html_e( 'را خرید', 'filino' ); ?>
						</p>
					<?php endforeach; ?>
				</div>
				<span class="fl-pill fl-pill--mint"><?php esc_html_e( 'تحویل آنی', 'filino' ); ?></span>
			</div>
		</div>
	<?php endif; ?>
</section>
