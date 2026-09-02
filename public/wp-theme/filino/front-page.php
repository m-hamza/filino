<?php
/**
 * صفحه اصلی فایلینو — ترکیب ماژول‌های مستقل
 *
 * هر بخش یک Template Part جداگانه است؛ برای حذف یا جابه‌جایی هر بخش
 * کافی است یک خط را حذف کنید — بدون دست‌زدن به بقیه‌ی کدها.
 *
 * @package Filino
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<?php /* ماژول ۱: افتتاحیه با محصول ویژه + فید فروش زنده */ ?>
<?php get_template_part( 'template-parts/home/hero' ); ?>

<?php /* ماژول ۲: نوار متحرک نام محصولات */ ?>
<?php get_template_part( 'template-parts/home/marquee' ); ?>

<?php /* ماژول ۳: دسته‌بندی محصولات (آرایه‌های محصول ووکامرس) */ ?>
<?php get_template_part( 'template-parts/home/categories' ); ?>

<?php /* ماژول ۴: پرفروش‌ترین‌ها — WC_Product_Query با متای sales */ ?>
<?php get_template_part( 'template-parts/home/bestsellers' ); ?>

<?php /* ماژول ۵: پیشنهاد ویژه‌ی هفته با شمارش معکوس */ ?>
<?php get_template_part( 'template-parts/home/promo' ); ?>

<?php /* ماژول ۶: چرا فایلینو + آمار (شمارنده‌های اسکرولی) */ ?>
<?php get_template_part( 'template-parts/home/why-stats' ); ?>

<?php /* ماژول ۷: آخرین مقالات */ ?>
<section class="fl-section" id="fl-latest-posts">
	<div class="fl-container">
		<?php
		$filino_posts = new WP_Query(
			array(
				'posts_per_page' => 4,
				'no_found_rows'  => true, // سبک‌تر: چون صفحه‌بندی نمی‌خواهیم
			)
		);

		if ( $filino_posts->have_posts() ) :
			?>
			<header class="fl-section__head">
				<p class="fl-kicker"><?php esc_html_e( 'بلاگ فایلینو', 'filino' ); ?></p>
				<h2 class="fl-section__title"><?php esc_html_e( 'تازه‌ترین مقالات و آموزش‌ها', 'filino' ); ?></h2>
			</header>
			<div class="fl-posts-grid">
				<?php
				while ( $filino_posts->have_posts() ) :
					$filino_posts->the_post();
					get_template_part( 'template-parts/content', 'card' );
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php /* ماژول ۸: خبرنامه */ ?>
<?php get_template_part( 'template-parts/home/newsletter' ); ?>

<?php
get_footer();
