# Grid and Responsive Layout

## The Screen Size Dilemma

Since the beginning of the web we have seen an explosion in the size and resolution of screens. Up until the appearance of smart phones and tablets the best practice was to support the most used screen size. Back in the 90s the size was 800x600 and for most of the 2000s it was 1024x768.

Nowadays people access the web via multiple screens: mobile devices, desktop computers, TVs… We can no longer assume that there is a most popular screen size. Sites must be built to display according to the user screen size.

The chart below shows a very comprehensive collection of the different screens sizes.

![](http://i.imgur.com/XT28eex.png)

## How Do We Approach this Complexity?

Despite the large number of different screens it is possible to create groups of screens and device types. In the following illustration you may see common sizes for current typical devices, starting from phones up to desktops:

![](http://i.imgur.com/hVbjf0M.png)

In the case of mobile devices there are additional considerations:

 * They can be rotated to operate in portrait and landscape orientation, effectively changing the screen size
 * They provide touch screens which requires interactive elements to be bigger than non-mobile devices
 * They usually have screen with higher pixel density, so a pixel is shown in the screen using 2 x 2 dots

We have created 5 screen sizes that we call `xs`, `sm`, `md`, `lg` and `xl`. The `xs` has a minimum width of 320px (logical pixels), and the other screen sizes are multiples of the `xs` size, so they have minimum widths of 640px, 960px, 1280px and 1600px as illustrated in the following chart:

![](http://i.imgur.com/Kh05EpX.png)

## Designing for Responsive Layouts: Think Columns

When designing responsives sites it is useful to think in terms of columns. The smallest devices have one column, while the larger ones have multiple columns. This aligns to our model where the xs screen has one column and the other sizes have 2, 3, 4 and 5 columns:

![](http://i.imgur.com/WRkJSSl.png)

In the xs screen we break down the one column into blocks. To meet the needs of your design, our grid allows to break into 4, 5 or 6 blocks:

![](http://i.imgur.com/CZigmqw.png)

The following image shows the total number of blocks that can fit in the various screen sizes, depending whether you select a 4-block, 5-block, or 6-block layout:

![](http://i.imgur.com/Vy59bDF.png)

![](http://i.imgur.com/mmWWrk2.png)

![](http://i.imgur.com/Bm5V0pI.png)

## Content and Spacing on the Grid

It is important to remember that a 2-block element allows for content that is more than double the width of a 1-block element. This is because when merging multiple blocks together, the content accesses the space that was previously used by padding, borders and margin.

The following image illustrates a 1-block element with a content width of 60px and 10px of spacing. A 3-block element has a content width of 220px (more than three times 60px):

![](http://i.imgur.com/VpZWloN.png)

## How Responsiveness Work?

A Javascript listener for window resize assigns the attribute `screen` to the body tag with the value of the current screen size (e.g. sm). This attribute is then used in CSS to adjust the rules based on the screen size. 

We decided in favor of Javascript instead of @media queries because we found ourseleves needing a listener anyway to trigger functions upon screen size change. 

The following images show how the various block sizes fit in different screen sizes. You can see the naming convention for class names, for example .blk1, .blk2, all the way to .blk30 set the size of the block. You can specify different block sizes for different screens, for example: .blk1-xs, .blk4-md, .blk2-xl

![](http://i.imgur.com/yI0Pf8H.png)

![](http://i.imgur.com/6FoPMqt.png)

![](http://i.imgur.com/WDVljnP.png)

## Fluid Layouts

Modern website design has seen the return of fluid layouts: structures that are sized proportionally and not in fixed pixels. This approach is ideal particularly in small screens where every pixels counts and designers want to take advantage of all the screen space available. The image below shows how a site designed for xs screen (320px) would look in a slightly larger screen 360px wide with and without fluid layout:

![](http://i.imgur.com/rG6xEQB.png)

On our framework you define what screen sizes are fluid by adding classes .blkfluid-xs, .blkfluid-sm, etc. to the body tag. These classes change the behavior of the .blkN classes to have proportional sizes and change the box-sizing property of the page to border-box.

![](http://i.imgur.com/WCD63Ej.png)

## Fractional and Percentage Block Sizing

Until now we have seen block sizes in terms of whole numbers: .blk1, .blk2, .blk3, but the framework provides additional fractional and percentage block sizes to meet the needs of your design.

__Fractional__: any fraction with numerator and denominator between 1 and 10 has been defined as a block size, for example: .blk3/4, .blk1/6, .blk7/8, etc. Keep in mind that only the irreducible fractions are defined, for example, 2/4 does not exist because it can be reduced to 1/2.

__Percentage__: all percentage sizes from 5% to 95% in increments of 5 have been defined, for example: .blk5%, .blk70%, .blk35%.

## Utility Classes

__.blkgroup__

Add .blkgroup on HTML elements that you want to use for defining structure and layout and not holding content directly. .blkgroup removes all padding, border and margin and extends the content size to the point where margin normally extends.

__.blkbleed-padding, .blkbleed-border, .blkbleed-margin__

Add .blkbleed-xxx to extend the content to cover what is normally occupied by padding, border or even margin. These classes are useful to "protrude" images and other elements outside of the normal boxes where content resides.

__.blkcenter__

Add .blkcenter to break the floating of .blkN elements and position the element centered.

__.blkN-push__

Add .blkN-push to "push" the element right by adding left margin equal to the size of N number of blocks.
