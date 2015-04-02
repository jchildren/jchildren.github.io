---
title: Work begins on a platformer
layout: posts
group: blog
---

I've been experimenting with SFML recently with a view to perhaps using it
to build a basic video game as part of a personal project. Previously I had
attempted to use it for a fancy implementation of Conway's Game of Life, but
I made things a little too complicated and so I have shelved that project for
the time being.

With the help of the friends I am now attempting to write a very basic game
engine for a platformer with SFML. I had some initial trouble at first with
compiz and openGL as I am using Linux Mint as a development platform, which
was causing a few issues with resizing the window or the contents not appearing
at all, but this was fixed through the latest SFML version much to my relief,
so I needed only pull the latest version and recompile it.

Previously I had attempted to do similar things in SDL, but I did not like the
lack of support for objects that could pass the various pointers between each
other. It would have been really nice to have been able to write code like:

{% highlight cpp %}

Graphics mainWindow;

mainWindow.init(window, renderer);

Background menuBackground;

menuBackground.loadImage(fullPath.c_str(), renderer, texture);

{% endhighlight %}

But unfortunately, while this will compile, it won't actually run as the
load image function won't receive the renderer pointer as it goes out of scope
and I could not find a way to prevent this.

SFML, on the other hand, is not only built around this style, but seems to
contain classes for almost anything I can think of at this early stage. It even
provides base classes that can be extended into your own custom entities! Since
fixing the compatibility issue I am generally very pleased with the library and
look forward to seeing what more I can do with it.
