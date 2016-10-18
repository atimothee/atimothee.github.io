---
layout: post
title: "Why Appengine is a great option to host a Messenger/Telegram Bot"
date: 2016-09-18 21:53:31 +0300
comments: true
categories: 
published: false
---
appengine & bots: a match made in heaven?
If you're still looking for the best place to host your Messenger/Telegram bot, here are a couple of reasons why you should seriously consider it:
?compelling

1. HTTPS:

Most chat bot platforms require you to provide an https webhook, in order to integrate with them. Every appengine app is accessible via project-id.appspot.com url, which supports https, so no need to setup your own certificate.


2. Memcache:
If you're building a chatbot, chances are you want to save some contextual information about the user's conversation, and you want to do it really fast. You probably also want to access this information really fast.
Enter Memcache, a high availablity, fast key value store (confirm the description). One disadvantage of mecache is ephemerality of the data. This may not be so much of a disadvantage for certain applicaions, but can be remedied by using ndb datastore, and enabling mecache.


3. Automatic Scaling built in


4. Generous Free Quota:
A fgenerous free quota, more than enough to get your idea off the ground.


5. Cron Jobs & Background tasks:

Due to the conversational nature of bots, you dont want to delay replies because you're processing heavy stuff. Appengine provides a framework? to support bg tasks. And a handy way to run tasks @ particular times.


6. Cloud Logging & StackDriver?:

If you ever need to debug, issues with your bot, you will find these invaluable. StackDriver is a bonus.


