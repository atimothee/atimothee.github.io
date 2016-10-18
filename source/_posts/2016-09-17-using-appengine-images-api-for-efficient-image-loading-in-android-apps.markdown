---
layout: post
title: "Using Appengine Images API for efficient image loading in Android apps"
date: 2016-09-17 15:42:23 +0300
comments: true
categories: 
published: false
---

One of the best kept secrets of appengine is the Images API, included in the Java and python SDKs.


The Images API helps to transform images, resize???? crop, etc.

My favorite feature, is the get_serving_url method.

This enables you to crop or resize images #on-the-fly#

That is a very handy feature if your trying to load images on mobile screens with differing screen sizes, in a data-friendly manner & as fast, as possible.

this is especially true if you're targeting african market, due to prohibitive data costs & screeen size

One way to do it on Android, is to calculate the screen width, and request an image with just the dimesions of the longest edge, and appengine will do the rest.


Please note it may not be a good idea, to compute the width every single time an image is loaded. A better way to do this could be o save the dimensions the first time the app loads & save these to prefernces, because the device dimesnions will never cahnge.

{%highlight java%}
 DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        this.imageWidth = (int) (displayMetrics.widthPixels);
        this.isTablet = mContext.getResources().getBoolean(R.bool.isTablet);
        if (isTablet) {
            int spanCount = mContext.getResources().getInteger(R.integer.span_count);
            this.imageWidth = (int) ((displayMetrics.widthPixels) / spanCount);
        }
{% endhighlight %}


