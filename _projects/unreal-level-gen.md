---
layout: project
title:  "LevelGen"
thumbnail: "level-gen.png"
alttext: "A screenshot"
description: "An UE4 level generator"
---

<center>

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Testing out the basic data structures for my map generator in UE4. Next step: walls on multiple sides. <a href="https://t.co/6Ikc55Z0fv">pic.twitter.com/6Ikc55Z0fv</a></p>&mdash; John Children (@john_children) <a href="https://twitter.com/john_children/status/665423787622576128">November 14, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Grid data structure is finally working the way I wanted, next step level generation! <a href="https://twitter.com/hashtag/UE4?src=hash">#UE4</a> <a href="https://t.co/Bq7y9uwAVZ">pic.twitter.com/Bq7y9uwAVZ</a></p>&mdash; John Children (@john_children) <a href="https://twitter.com/john_children/status/666726771685920768">November 17, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

</center>

It's still very early stages, though I have been through a few iterations trying to get it to work correctly.
There are some problems with memory leaks and the UPROPERTY of the components and the way they are
attached to the root components.   but here's a gist:

<script src="https://gist.github.com/jchildren/6ff0c21affea9e07d63d.js"></script>