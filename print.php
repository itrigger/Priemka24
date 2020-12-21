<?php
/*
Template Name: Скачать каталог
*/
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
get_header(); ?>

<div class="in">

<div style="position: fixed; opacity: 0.0; pointer-events: none;">
<div  id="tabletext">

<?php

    $args = array(
	   'number'     => $number,
	   'orderby'   => 'title',
	   'order'     => 'ASC',
	   'hide_empty' => $hide_empty,
	   'include'   => $ids
	);

$product_categories = get_terms( 'product_cat', $args );

$count = count($product_categories);
 
echo "<table id='table' data-pdfmake='{&quot;widths&quot;:[&quot;auto&quot;,100,70]}'>";
echo "<tr class='heading'><td style='text-align: left; border: none !important; padding-bottom: 20px;' bordercolor='white'><span style='font-size:32px; font-weight:bold;'>СХЕМАТИКА</span><br/>Внимание! Цены действительны на: ".date('d-m-Y')." </td><td class='heading-right' colspan='2' bordercolor='white' style='text-align: right !important; border: none !important;' align='right'>".do_shortcode('[WP-Coder id="6"]')."<br/>".do_shortcode('[WP-Coder id="1"]')."<br/>".do_shortcode('[WP-Coder id="4"]')."</td></tr>";

if ( $count > 0 ){
   foreach ( $product_categories as $product_category ) {
	   if($product_category->name != "Uncategorized" ){
       echo '<tr><th colspan="3">' . $product_category->name . '</th></tr>';
       $args = array(
           'posts_per_page' => -1,
           'tax_query' => array(
               'relation' => 'AND',
               array(
                   'taxonomy' => 'product_cat',
                   'field' => 'slug',
                   'terms' => $product_category->slug
               )
           ),
            'post_type' => 'product',
           'orderby' => 'title,'
       );

       $products = new WP_Query( $args );
      // echo "<tr><td><table class='print--ul'>";
       while ( $products->have_posts() ) {
           $products->the_post();
           ?>
		   <tr class="print--ul">
		    <?php// echo get_the_post_thumbnail($id, 'thumbnail'); ?>
             <td width="100%">
                 <?php the_title(); ?>
			</td> 
			<td class="td--price">
				 <em class="hidden_params">
					<span class="item--gold"><?php the_field('gold'); ?></span>
					<span class="item--silver"><?php the_field('silver'); ?></span>
					<span class="item--platinum"><?php the_field('platinum'); ?></span>
					<span class="item--palladium"><?php the_field('palladium'); ?></span>
					<span class="item--fixprice"><?php the_field('fixprice'); ?></span>
					<span class="item--typeofcount"><?php the_field('typecount'); ?></span>
				</em>
				<span class="price"><b class="price_value"></b> руб.</span>
             </td>
			 <td class="td--typeof">за <span class="itemcount"></span></td>
		</tr>
        <?php
       }
      // echo "</table></td></tr>";
   }
   }
}
echo "</table>";
?>
</div>
</div>
<h1>Прайс-лист на <?php echo date('d.m.Y');?></h1>

<div class="hintbox">
	<div class="hintbox-text"><span class="ico-alert">!</span>Обращаем Ваше внимание, что цены, представленные на сайте не являются публичной офертой. Цены на драгоценные металлы обновляются ежедневно и будут применяться актуальные на день заключения сделки.</div>
</div>

<div class="alert--wrapper"></div>
<div id="printtable"><table></table></div>
<div class="price_btn_wrapper"><button class="savetojpg btn btn-secondary btn-big" id="btn-Convert-Html2Image" style="cursor:pointer;" onclick="ym(66624295,'reachGoal','price'); return true;">Скачать прайс</button><a href="#" onclick="ym(66624295,'reachGoal','print1'); return true;" class="btn btn-primary btn-big" id="print_all">Распечатать</a></div>

<div class="separator"></div>
</div>
<?php
  get_footer();




