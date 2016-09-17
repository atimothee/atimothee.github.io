---
layout: post
title: "How to easily set up an offline weather API Server for your Sunshine app"
date: 2015-02-23 01:11:58 +0300
comments: true
categories: [devstudyjam, android, udacity, gdg, tutorial]
---
So you're eager to get on with Lesson 2 of the [Udacity Android fundamentals course](https://www.udacity.com/course/ud853) but if you're like most students in our [study jam](http://developerstudyjams.com/), you don't have good internet access & you've been using offline course materials. The course has probably been going great till you hit the internet roadblock in lesson 2 (Connecting Sunshine to the cloud). The app needs internet to fetch the weather data.
<!-- more -->
This tutorial shows you a simple work around. We'll bring the 'cloud' to your local machine. Well technically, just a tiny little bit of the cloud that you need to test your app. You don't need internet to fetch weather data. The only difference is that your data will be static and therefore not accurate but the data accuracy shouldn't be a big deal when trying to learn how to fetch weather data into the app.

>For those not familiar with the Android Fundamentals course, the cloud in this context simply refers to the [Open Weather Map API](http://openweathermap.org/api).

This tutorial assumes you have python installed and have properly set your environment variables on your development PC. If you dont have it, follow any of these; [windows tutorial](http://www.howtogeek.com/197947/how-to-install-python-on-windows/), [linux](http://www.cyberciti.biz/faq/install-python-linux/) or [mac](http://docs.python-guide.org/en/latest/starting/install/osx/).


If you're not sure, simply type out ```$ python --version``` in your terminal (for unix users) or command prompt for windows users.

If you have python installed, you should have received a message with the version of python installed.

Next, open the built URL, which you're using in your app in the browser http://api.openweathermap.org/data/2.5/forecast/daily?q=kampala&mode=json&units=metric&cnt=7 in my case. Note that the q param may change depending on your city. 

Copy and paste the returned JSON into an empty file and save it as city_name.json.

This what my .json file showing forecast data for Kampala for the next seven days looks like
{% highlight json %}

{"cod":"200","message":0.03,"city":{"id":232422,"name":"Kampala","coord":{"lon":32.582191,"lat":0.31628},"country":"UG","population":0,"sys":{"population":0}},"cnt":7,"list":[{"dt":1424685600,"temp":{"day":27.61,"min":25.94,"max":27.61,"night":25.94,"eve":27.52,"morn":27.61},"pressure":895.42,"humidity":85,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":2.57,"deg":225,"clouds":0},{"dt":1424772000,"temp":{"day":27.19,"min":25.45,"max":27.26,"night":25.91,"eve":26.88,"morn":25.45},"pressure":898.48,"humidity":88,"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"speed":0.76,"deg":192,"clouds":44},{"dt":1424858400,"temp":{"day":27.89,"min":25.83,"max":27.89,"night":25.83,"eve":27.24,"morn":26.06},"pressure":897.35,"humidity":83,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":5,"deg":149,"clouds":0},{"dt":1424944800,"temp":{"day":27.72,"min":25.75,"max":27.98,"night":25.75,"eve":27.68,"morn":26.26},"pressure":897.27,"humidity":84,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":5.32,"deg":153,"clouds":0},{"dt":1425031200,"temp":{"day":28.62,"min":24.01,"max":28.62,"night":24.01,"eve":25.85,"morn":25.76},"pressure":896.46,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":1.96,"deg":82,"clouds":6},{"dt":1425117600,"temp":{"day":28.42,"min":24.35,"max":28.42,"night":24.35,"eve":25.87,"morn":24.72},"pressure":896.7,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":0.91,"deg":300,"clouds":2},{"dt":1425204000,"temp":{"day":28.51,"min":24.47,"max":28.51,"night":24.47,"eve":25.89,"morn":25.62},"pressure":895.82,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":1.69,"deg":198,"clouds":4}]}

{% endhighlight %}

Once you have the JSON file, create a folder somewhere on your PC (call it whatever you want) and save it there. Then change directory to that directory in your terminal or command prompt(windows users), using the cd command.

Then when you're in that directory, type this out in your terminal

{% highlight shell %}
$ python -m SimpleHTTPServer
{% endhighlight %}

This command starts up a local server that serves the contents of the current directory.

If that went well, you should see something like this

{% highlight shell %}
Serving HTTP on 0.0.0.0 port 8000 ...
{% endhighlight %}
Now go to http://localhost:8000/city_name.json in your browser. 
If you get your json data returned, then high five. You have brought the cloud down to earth.

Now for the Android part
------------------------

This is the code that was fetching the data from the open weather map API, in the doInBackground method of the
FetchWeather AsyncTask.
{% highlight java linenos fetch from online %}
 final String FORECAST_BASE_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?";
 final String QUERY_PARAM = "q";
 final String FORMAT_PARAM = "mode";
 final String UNITS_PARAM = "units";
 final String DAYS_PARAM = "cnt";
 Uri builtUri = Uri.parse(FORECAST_BASE_URL).buildUpon()
                        .appendQueryParameter(QUERY_PARAM, params[0])
                        .appendQueryParameter(FORMAT_PARAM, format)
                        .appendQueryParameter(UNITS_PARAM, units)
                        .appendQueryParameter(DAYS_PARAM, Integer.toString(numDays))
                        .build();



                URL url = new URL(builtUri.toString());
{% endhighlight %}
In order to fetch from local host, we're going to modify it a little.
First of all, one limitation of our offline server is we cant support url params.
But that doesn't really matter, since we just want to fetch the weather data into the app.
We're not interested in the data's accuracy.

Something else to note, is that when using the Android Virtual Device (emulator), localhost becomes 10.0.2.2

When using Genymotion emulator, localhost is 192.168.56.1

If you're using a physical device, you'll need to be on the same network as your PC, in which case, you need replace localhost with your computer's current IP.

Add this line of code to the doInBackground method of the Fetch AsyncTask, just above the line that instantiaties the url. Remember to comment it out when you want to fetch from the internet.

{% highlight java linenos %}
/*in case using stock emulator*/
Uri builtUri = Uri.parse("http://10.0.2.2:8000/city_name.json").buildUpon().build();

/* in case using genymotion emulator*/
Uri builtUri = Uri.parse("http://192.168.56.1:8000/city_name.json").buildUpon().build();

/*in case of physical device*/
Uri builtUri = Uri.parse("http://ip_address:8000/city_name.json").buildUpon().build();
{% endhighlight %}
And voila, you've successfully connected sunshine to the local 'cloud'.
