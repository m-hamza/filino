<?php
/**
 * پوسته‌ی کلی صفحات ووکامرس — فروشگاه، دسته‌ها، تگ‌ها و جستجوی محصول
 *
 * به‌جای کپی‌کردن هوک‌های ووکامرس، از woocommerce_content() با
 * شخصی‌سازی هوک‌ها در inc/woocommerce.php استفاده می‌کنیم تا
 * با هر آپدیت ووکامرس سازگار بمانیم.
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' );
?>

<div class="fl-shop-layout">
	<div class="fl-container fl-shop-layout__inner">

		<?php if ( is_shop() || is_product_taxonomy() ) : ?>
			<aside class="fl-shop-sidebar" id="fl-shop-sidebar">
				<?php
				/* فیلترها به‌صورت ابزارک — ماژولار و قابل مدیریت از پیشخوان */
				if ( is_active_sidebar( 'shop-sidebar' ) ) {
					dynamic_sidebar( 'shop-sidebar' );
				} else {
					the_widget( 'WC_Widget_Product_Categories', array( 'title' => __( 'دسته‌بندی‌ها', 'filino' ) ) );
					the_widget( 'WC_Widget_Price_Filter', array( 'title' => __( 'بازه‌ی قیمت', 'filino' ) ) );
				}
				?>
			</aside>
		<?php endif; ?>

		<div class="fl-shop-main">
			<?php
			/**
			 * خروجی استاندارد ووکامرس — ترتیب هوک‌ها:
			 * breadcrumb > archive header > loop > pagination
			 * شخصی‌سازی کارت محصول و بج تخفیف در inc/woocommerce.php انجام شده.
			 */
			woocommerce_content();
			?>
		</div>
	</div>
</div>

<?php get_footer( 'shop' ); ?>
