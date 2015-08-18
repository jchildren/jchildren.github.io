---
layout: post
title:  "Petri: now with dynamic allocation"
date:   2015-07-31 16:15:00
categories: programming
tags: programming c++ biology automata evolution
---

Recently I started writing a cellular automata program called "petri" that
attempts to simulate a population of cells doing "life-like" activities. It is
still extremely basic, but I found myself obsessively drawn to improving this
program and therefore my own c++ abilities, so spent the better part of the last
few days working on improving the program.

One of the issues with the first build of the program was that memory was
statically defined by the maximum population with the programming constructing
a number of objects equal to that amount, which was defined as a constant in
the program. Instead, the cell class had a Boolean parameter that told program
whether to consider the cell in processing and display. This meant that cell
variables had to be reassigned after each compute step in order to prevent
iteration over the whole population, which could potentially become very
resource demanding if the grid and population were to be scaled up.

After two days of wrapping my head around `new` and `delete`, I have finally
managed to replace this functionality with an array of pointers that will
dynamically create and destroy classes in the memory. This new approach should
hopefully mitigate the need for optimizations later when I want a larger population
and allow me to work on the more entertaining aspects of the program.

In that respect, I have also changed the energy threshold for reproduction to a
random parameter within a certain range such that some cells will divide faster
than others. Unfortunately for cells that do this, replicating too fast leaves
them vulnerable and low on energy so it seems that the cells that reproduce less
often will tend to survive better in the current conditions.

![alt text](https://jchildren.github.io/image/petri2.PNG "The current build")

This combined with food being randomly added to the grid each time step now
leads to a stable population at the maximum and a lot of dead cells that
reproduce too quickly (shown in the image by the `-` symbols).

For the next steps, I have started work on a structure that represents a cell's
senses which should hopefully prevent them from eating other cells related to
them and potentially avoid larger cells (currently it is far more advantageous
  to be big than to be fast).

Check out the repository [here][petri-repo].


[petri-repo]:   https://github.com/jchildren/petri
