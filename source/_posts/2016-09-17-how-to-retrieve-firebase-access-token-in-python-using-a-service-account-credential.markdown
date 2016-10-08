---
layout: post
title: "How to retrieve Firebase access token in python using a service account credential"
date: 2016-09-17 15:51:36 +0300
comments: true
categories: 
published: false
---

I recently run into some trouble when trying to use the Firebase REST API, from within a python web app. I needed an `access_token` to access data protected by [Firebase Realtime Database Rules](https://firebase.google.com/docs/database/security/securing-data.html), but couldn't figure out how to get one using my service account credentials file. [Firebase documentation](https://firebase.google.com/docs/server/setup) provides a guide on how to get the token when using Java & Nodejs, but makes no mention on how to achieve this using Python.

After digging around, I figured it is actually possible, using the [Google API Client Library for python](https://developers.google.com/api-client-library/python/start/installation).

##confirm if that is the actual lib

First, you need to install it using pip

{% highlight shell %}
$ pip install --upgrade google-api-python-client
{% endhighlight %}

Here's how to generate an access token, once you have the [ServiceAccountCredential file](https://firebase.google.com/docs/server/setup).


{% highlight python %}
from oauth2client.service_account import ServiceAccountCredentials
import httplib2

scopes = [
                'https://www.googleapis.com/auth/firebase',
                'https://www.googleapis.com/auth/userinfo.email',
                "https://www.googleapis.com/auth/cloud-platform"
            ]

 credentials = ServiceAccountCredentials.from_json_keyfile_name(
    '/pathto/json_file.json', scopes)

http = httplib2.Http()
credentials.refresh(http)
http = credentials.authorize(http)
access_token = credentials.access_token
# use access token
{% endhighlight %}

Hope this helps!